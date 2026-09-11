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
            if ($withdraw->instructor->wallet < $withdraw->amount) {
                notyf()->error("Instructor has insufficient wallet balance!");
                return redirect()->back();
            }

            if ($payoutMode === 'automatic') {
                try {
                    $secretKey = config('xendit.secret_key');
                    if (empty($secretKey)) {
                        notyf()->error("Xendit Secret Key is missing in payment settings!");
                        return redirect()->back();
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

                    $createPayoutRequest = new \Xendit\Payout\CreatePayoutRequest([
                        'reference_id' => $referenceId,
                        'channel_code' => $channelCode,
                        'channel_properties' => [
                            'account_number' => $withdraw->payout_account_info ?? ($gatewayInfo->information ?? '0000000000'),
                            'account_holder_name' => $withdraw->instructor->name ?? 'Instructor',
                        ],
                        'amount' => (float)$withdraw->amount,
                        'currency' => 'IDR',
                    ]);

                    $response = $apiInstance->createPayout($createPayoutRequest);

                    if (isset($response['id'])) {
                        $withdraw->transaction_id = $response['id'];
                    }
                } catch (\Throwable $e) {
                    // Log error and notify admin
                    \Illuminate\Support\Facades\Log::error('Xendit Payout Failed: ' . $e->getMessage());
                    notyf()->error("Xendit Payout Error: " . $e->getMessage());
                    return redirect()->back();
                }
            }

            // Deduct wallet and approve
            $withdraw->instructor->wallet = ($withdraw->instructor->wallet - $withdraw->amount);
            $withdraw->instructor->save();
        }

        $withdraw->status = $request->status;
        $withdraw->save();

        notyf()->success("Withdrawal request updated successfully!");
        return redirect()->route('admin.withdraw-request.index');
    }
}

