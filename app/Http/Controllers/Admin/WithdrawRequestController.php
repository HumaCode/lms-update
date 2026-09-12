<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Withdraw;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WithdrawRequestController extends Controller
{
    public function index(): Response
    {
        $withdraws = Withdraw::with('instructor')->latest()->paginate(25);
        return Inertia::render('Admin/WithdrawRequest/Index', [
            'withdraws' => $withdraws,
        ]);
    }

    public function show(Withdraw $withdraw): Response
    {
        $withdraw->load(['instructor.gatewayInfo']);
        return Inertia::render('Admin/WithdrawRequest/Show', [
            'withdraw' => $withdraw,
            'payoutMode' => config('gateway_settings.xendit_payout_mode', 'manual'),
        ]);
    }

    public function updateStatus(Request $request, Withdraw $withdraw): RedirectResponse
    {
        $request->validate([
            'status' => 'required|in:pending,approved,rejected'
        ]);

        if ($withdraw->status !== 'pending') {
            notyf()->error("Status cannot be changed once processed.");
            return redirect()->back();
        }

        $payoutMode = config('gateway_settings.xendit_payout_mode', 'manual');

        if ($request->status === 'approved') {
            if ($payoutMode === 'automatic') {
                try {
                    $secretKey = config('gateway_settings.xendit_secret_key');
                    if (empty($secretKey)) {
                        notyf()->error("Xendit Secret Key is missing in payment settings!");
                        return redirect()->back()->with('error', "Xendit Secret Key is missing in payment settings!");
                    }

                    \Xendit\Configuration::setXenditKey($secretKey);
                    $apiInstance = new \Xendit\Payout\PayoutApi();

                    $withdraw->load('instructor.gatewayInfo');
                    $gatewayInfo = $withdraw->instructor->gatewayInfo;

                    $referenceId = 'WD-' . $withdraw->id . '-' . time();
                    $channelCode = 'ID_BCA'; // Default channel code or parse from gatewayInfo

                    if ($gatewayInfo) {
                        $infoLower = strtolower($gatewayInfo->information ?? '');
                        if (str_contains($infoLower, 'bca')) $channelCode = 'ID_BCA';
                        elseif (str_contains($infoLower, 'mandiri')) $channelCode = 'ID_MANDIRI';
                        elseif (str_contains($infoLower, 'bni')) $channelCode = 'ID_BNI';
                        elseif (str_contains($infoLower, 'bri')) $channelCode = 'ID_BRI';
                        elseif (str_contains($infoLower, 'dana')) $channelCode = 'ID_DANA';
                        elseif (str_contains($infoLower, 'ovo')) $channelCode = 'ID_OVO';
                        elseif (str_contains($infoLower, 'gopay')) $channelCode = 'ID_GOPAY';
                    }

                    $rawAccountInfo = $withdraw->payout_account_info ?? ($gatewayInfo->information ?? '');
                    preg_match('/(?:Nomor HP|Nomor Rekening|Rekening|HP|No|Account)?\s*:?\s*([0-9]{8,16})/', $rawAccountInfo, $matches);
                    $accountNumber = isset($matches[1]) && !empty($matches[1]) ? $matches[1] : (preg_replace('/[^0-9]/', '', $rawAccountInfo) ?: '0000000000');

                    $channelProperties = new \Xendit\Payout\DigitalPayoutChannelProperties([
                        'account_number' => $accountNumber,
                        'account_holder_name' => $withdraw->instructor->name ?? 'Instructor',
                    ]);

                    $createPayoutRequest = new \Xendit\Payout\CreatePayoutRequest([
                        'reference_id' => $referenceId,
                        'channel_code' => $channelCode,
                        'channel_properties' => $channelProperties,
                        'amount' => (float)$withdraw->amount,
                        'currency' => 'IDR',
                    ]);

                    // Signature: createPayout($idempotency_key, $for_user_id = null, $create_payout_request = null)
                    $response = $apiInstance->createPayout($referenceId, null, $createPayoutRequest);

                    if (is_object($response) && method_exists($response, 'getId')) {
                        $withdraw->transaction_id = $response->getId();
                    } elseif (isset($response['id'])) {
                        $withdraw->transaction_id = $response['id'];
                    }
                } catch (\Throwable $e) {
                    // Log error and notify admin
                    \Illuminate\Support\Facades\Log::error('Xendit Payout Failed: ' . $e->getMessage());
                    notyf()->error("Xendit Payout Error: " . $e->getMessage());
                    return redirect()->back()->with('error', "Xendit Payout Error: " . $e->getMessage());
                }
            }
        }

        $withdraw->status = $request->status;
        $withdraw->save();

        notyf()->success("Withdrawal request updated successfully!");
        return redirect()->route('admin.withdraw-request.index')->with('success', 'Status pengajuan penarikan berhasil diperbarui!');
    }
}

