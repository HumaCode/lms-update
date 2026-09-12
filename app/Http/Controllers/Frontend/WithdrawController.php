<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Withdraw;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class WithdrawController extends Controller
{
    function index()
    {
        $currentBalance = user()->wallet ?? 0;
        $pendingBalance = Withdraw::where('instructor_id', user()->id)->where('status', 'pending')->sum('amount');
        $totalPayout = Withdraw::where('instructor_id', user()->id)->where('status', 'approved')->sum('amount');
        $withdraws = Withdraw::where('instructor_id', user()->id)->latest()->paginate(15);

        return \Inertia\Inertia::render('Instructor/Withdraw/Index', [
            'currentBalance' => $currentBalance,
            'pendingBalance' => $pendingBalance,
            'totalPayout' => $totalPayout,
            'withdraws' => $withdraws,
        ]);    
    }

    function requestPayoutIndex() 
    {
        $currentBalance = user()->wallet ?? 0;
        $pendingBalance = Withdraw::where('instructor_id', user()->id)->where('status', 'pending')->sum('amount');
        $totalPayout = Withdraw::where('instructor_id', user()->id)->where('status', 'approved')->sum('amount');
        $gatewayInfo = user()->load('gatewayInfo')->gatewayInfo;

        return \Inertia\Inertia::render('Instructor/Withdraw/RequestPayout', [
            'currentBalance' => $currentBalance,
            'pendingBalance' => $pendingBalance,
            'totalPayout' => $totalPayout,
            'gatewayInfo' => $gatewayInfo,
        ]);     
    }

    function requestPayout(Request $request) : RedirectResponse {
        $request->validate([
            'amount' => 'required|numeric',
        ]);

        if(user()->wallet < $request->amount) {
            notyf()->error("Insufficient Balance!");
            return redirect()->back()->with('error', 'Insufficient Balance!');
        }

        if(Withdraw::where('instructor_id', user()->id)->where('status', 'pending')->exists()) {
            notyf()->error("Withdraw Request Already Pending!");
            return redirect()->back()->with('error', 'Withdraw Request Already Pending!');
        }

        \Illuminate\Support\Facades\DB::beginTransaction();
        try {
            $withdraw = new Withdraw();
            $withdraw->instructor_id = user()->id;
            $withdraw->amount = $request->amount;
            $withdraw->save();

            // Create Admin Notification
            \App\Models\AdminNotification::create([
                'title' => 'Pengajuan Penarikan Dana Baru',
                'message' => 'Instruktur ' . (user()->name ?? 'Instruktur') . ' mengajukan penarikan dana sebesar Rp ' . number_format($withdraw->amount, 0, ',', '.'),
                'url' => route('admin.withdraw-request.show', $withdraw->id),
                'is_read' => false,
            ]);

            \Illuminate\Support\Facades\DB::commit();

            notyf()->success("Withdraw Request Sent!");
            return redirect()->back()->with('success', 'Withdraw Request Sent!');
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\DB::rollBack();
            notyf()->error($e->getMessage() ?: "Gagal mengajukan penarikan dana.");
            return redirect()->back()->with('error', $e->getMessage() ?: "Gagal mengajukan penarikan dana.");
        }
    }
}
