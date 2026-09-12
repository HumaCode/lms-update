<?php

namespace App\Observers;

use App\Models\Withdraw;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class WithdrawObserver
{
    /**
     * Handle the Withdraw "creating" event.
     * Potong saldo instruktur langsung saat pengajuan penarikan dana dibuat (Hold dana).
     */
    public function creating(Withdraw $withdraw): void
    {
        DB::transaction(function () use ($withdraw) {
            $instructor = User::lockForUpdate()->find($withdraw->instructor_id);

            if (!$instructor || $instructor->wallet < $withdraw->amount) {
                throw new \Exception("Saldo tidak mencukupi untuk melakukan penarikan!");
            }

            // Potong saldo dompet langsung saat status pending
            $instructor->wallet -= $withdraw->amount;
            $instructor->save();
        });
    }

    /**
     * Handle the Withdraw "updated" event.
     * Jika status diubah menjadi rejected, kembalikan saldo ke dompet instruktur (Refund).
     */
    public function updated(Withdraw $withdraw): void
    {
        // Jika status penarikan diubah menjadi 'rejected', kembalikan saldo
        if ($withdraw->isDirty('status') && $withdraw->status === 'rejected') {
            DB::transaction(function () use ($withdraw) {
                $instructor = User::lockForUpdate()->find($withdraw->instructor_id);
                if ($instructor) {
                    $instructor->wallet += $withdraw->amount;
                    $instructor->save();
                }
            });
        }
    }
}
