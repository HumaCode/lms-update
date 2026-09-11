<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PayoutGateway;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PayoutGatewayController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $gateways = PayoutGateway::all();

        if ($gateways->isEmpty()) {
            $defaultGateways = [
                ['name' => 'Bank Transfer', 'description' => "1. Nama Bank\n2. Nomor Rekening\n3. Nama Pemilik Rekening", 'status' => 1],
                ['name' => 'PayPal', 'description' => "1. PayPal Email Address\n2. Account Holder Name", 'status' => 1],
                ['name' => 'E-Wallet (DANA/OVO/GoPay)', 'description' => "1. Nama E-Wallet\n2. Nomor HP Terdaftar", 'status' => 1],
            ];
            foreach ($defaultGateways as $gw) {
                PayoutGateway::create($gw);
            }
            $gateways = PayoutGateway::all();
        }

        return Inertia::render('Admin/PayoutGateway/Index', [
            'gateways' => $gateways,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/PayoutGateway/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:2000',
            'status' => 'required|boolean',
        ]);

        $gateway = new PayoutGateway();
        $gateway->name = $request->name;
        $gateway->description = $request->description;
        $gateway->status = $request->status;
        $gateway->save();

        notyf()->success("Payout gateway created successfully!");

        return redirect()->route('admin.payout-gateway.index');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PayoutGateway $payout_gateway): Response
    {
        return Inertia::render('Admin/PayoutGateway/Edit', [
            'gateway' => $payout_gateway,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PayoutGateway $payout_gateway): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:2000',
            'status' => 'required|boolean',
        ]);

        $payout_gateway->name = $request->name;
        $payout_gateway->description = $request->description;
        $payout_gateway->status = $request->status;
        $payout_gateway->save();

        notyf()->success("Payout gateway updated successfully!");

        return redirect()->route('admin.payout-gateway.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PayoutGateway $payout_gateway): RedirectResponse
    {
        try {
            $payout_gateway->delete();
            notyf()->success('Payout gateway deleted successfully!');
            return redirect()->route('admin.payout-gateway.index');
        } catch (Exception $e) {
            logger("Payout Gateway Error >> " . $e);
            notyf()->error('Something went wrong!');
            return back();
        }
    }
}

