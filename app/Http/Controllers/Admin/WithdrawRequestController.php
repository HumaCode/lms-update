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
        $withdraw->load('instructor');
        return Inertia::render('Admin/WithdrawRequest/Show', [
            'withdraw' => $withdraw,
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

        $withdraw->status = $request->status;
        if ($request->status === 'approved') {
            $withdraw->instructor->wallet = ($withdraw->instructor->wallet - $withdraw->amount);
            $withdraw->instructor->save();
        }
        $withdraw->save();

        notyf()->success("Withdrawal status updated successfully!");
        return redirect()->route('admin.withdraw-request.index');
    }
}

