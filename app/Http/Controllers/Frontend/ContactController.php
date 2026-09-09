<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Http\Requests\Frontend\SendContactMessageRequest;
use App\Mail\ContactMail;
use App\Models\Contact;
use App\Models\ContactSetting;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    /**
     * Display the Contact Us page.
     */
    public function index(): Response
    {
        $contactCards = Contact::where('status', 1)->get();

        // Default contact cards if database is empty
        if ($contactCards->isEmpty()) {
            $contactCards = collect([
                (object) [
                    'id' => 1,
                    'icon' => '/frontend/assets/images/contact_icon_1.png',
                    'title' => 'Office Address',
                    'line_one' => '7232 Broadway Suite 3087',
                    'line_two' => 'Madison Heights, 57256',
                ],
                (object) [
                    'id' => 2,
                    'icon' => '/frontend/assets/images/contact_icon_2.png',
                    'title' => 'Send a Message',
                    'line_one' => 'lms@gmail.com',
                    'line_two' => 'lmscompany@gmail.com',
                ],
                (object) [
                    'id' => 3,
                    'icon' => '/frontend/assets/images/contact_icon_3.png',
                    'title' => "Let's Discuss",
                    'line_one' => 'Phone: 088 6578 654 87',
                    'line_two' => 'Fax: 088 6548 658 54',
                ],
                (object) [
                    'id' => 4,
                    'icon' => '/frontend/assets/images/contact_icon_4.png',
                    'title' => 'Team Up with Us',
                    'line_one' => 'Sed nec libero ante odio mauris',
                    'line_two' => 'pellentesque eget et neque.',
                ],
            ]);
        }

        $contactSetting = ContactSetting::first() ?? (object) [
            'image' => '/frontend/assets/images/instructor_2.jpg',
            'map_url' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58955.86762247907!2d88.3391639282542!3d22.551345723020553!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0277a2e8448a01%3A0xfc7031bafe756ae4!2sMillennium%20Park%2C%20Kolkata!5e0!3m2!1sen!2sbd!4v1710672733871!5m2!1sen!2sbd',
        ];

        return Inertia::render('User/Contact/Index', [
            'contactCards' => $contactCards,
            'contactSetting' => $contactSetting,
        ]);
    }

    /**
     * Handle sending contact message.
     */
    public function sendMail(SendContactMessageRequest $request): RedirectResponse
    {
        $receiverEmail = config('settings.receiver_email')
            ?? Setting::where('key', 'receiver_email')->value('value')
            ?? config('mail.from.address')
            ?? 'admin@example.com';

        $subject = $request->subject ?: 'New Contact Inquiry from ' . $request->name;

        $mailable = new ContactMail(
            $request->name,
            $request->email,
            $subject,
            $request->message
        );

        try {
            if (config('mail_queue.is_queue')) {
                Mail::to($receiverEmail)->queue($mailable);
            } else {
                Mail::to($receiverEmail)->send($mailable);
            }
        } catch (\Throwable $e) {
            Log::error('Contact form mail sending failed: ' . $e->getMessage());
        }

        notyf()->success('Message sent successfully! We will get back to you soon.');

        return redirect()->back();
    }
}
