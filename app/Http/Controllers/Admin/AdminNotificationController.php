<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminNotification;
use Illuminate\Http\RedirectResponse;

class AdminNotificationController extends Controller
{
    /**
     * Mark a single notification as read.
     */
    public function markAsRead(int $id): RedirectResponse
    {
        $notification = AdminNotification::find($id);
        if ($notification) {
            $notification->is_read = true;
            $notification->save();
        }

        if ($notification && $notification->url) {
            return redirect()->to($notification->url);
        }

        return redirect()->back();
    }

    /**
     * Mark all notifications as read.
     */
    public function markAllAsRead(): RedirectResponse
    {
        AdminNotification::where('is_read', false)->update(['is_read' => true]);
        notyf()->success('Semua notifikasi telah ditandai dibaca.');
        return redirect()->back();
    }
}
