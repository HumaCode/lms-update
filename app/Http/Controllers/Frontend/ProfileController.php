<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Http\Requests\Frontend\PasswordUpdateRequest;
use App\Http\Requests\Frontend\ProfileUpdateRequest;
use App\Http\Requests\Frontend\SocialUpdateRequest;
use App\Models\InstructorPayoutInformation;
use App\Models\PayoutGateway;
use App\Models\User;
use App\Traits\FileUpload;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    use FileUpload;

    function index()
    {
        return \Inertia\Inertia::render('Student/Profile/Index'); 
    }

    function instructorIndex()
    {
        $user = Auth::user()->load('gatewayInfo');

        // Auto-create sample payout info if missing for instructor demonstration
        if (!$user->gatewayInfo) {
            InstructorPayoutInformation::create([
                'instructor_id' => $user->id,
                'gateway' => 'E-Wallet (DANA/OVO/GoPay)',
                'information' => "Jenis E-Wallet: DANA\nNomor HP: 081234567890\nNama Pemilik Akun: Jhon Deo",
            ]);
            $user->load('gatewayInfo');
        }

        $gateways = PayoutGateway::where('status', 1)->get();

        if ($gateways->isEmpty()) {
            $defaultGateways = [
                ['name' => 'Bank Transfer', 'description' => "1. Nama Bank\n2. Nomor Rekening\n3. Nama Pemilik Rekening", 'status' => 1],
                ['name' => 'PayPal', 'description' => "1. PayPal Email Address\n2. Account Holder Name", 'status' => 1],
                ['name' => 'E-Wallet (DANA/OVO/Gopay)', 'description' => "1. Nama E-Wallet\n2. Nomor HP Terdaftar", 'status' => 1],
            ];
            foreach ($defaultGateways as $gw) {
                PayoutGateway::create($gw);
            }
            $gateways = PayoutGateway::where('status', 1)->get();
        }

        return \Inertia\Inertia::render('Instructor/Profile/Index', [
            'profile' => $user,
            'gateways' => $gateways,
        ]); 
    }

    function profileUpdate(ProfileUpdateRequest $request) : RedirectResponse {
        $user = Auth::user();

        if ($request->hasFile('avatar')) {
            // Unlink old physical file if stored in public uploads or private folder
            if ($user->getRawOriginal('image')) {
                $oldPath = $user->getRawOriginal('image');
                $this->deleteFile($oldPath);

                if (preg_match('#/user/([0-9a-zA-Z]+)#', $oldPath, $matches)) {
                    $oldDir = storage_path("app/private/user/{$matches[1]}");
                    if (is_dir($oldDir)) {
                        \Illuminate\Support\Facades\File::deleteDirectory($oldDir);
                    }
                }
            }

            // Clear old Spatie media items & delete their physical directories
            foreach ($user->getMedia('avatar') as $oldMedia) {
                $oldDir = storage_path("app/private/user/{$oldMedia->id}");
                $oldMedia->delete();
                if (is_dir($oldDir)) {
                    \Illuminate\Support\Facades\File::deleteDirectory($oldDir);
                }
            }

            $media = $user->addMediaFromRequest('avatar')
                ->toMediaCollection('avatar', 'private');
            $user->image = "/media/user/{$media->id}/{$media->file_name}";
        }
        $user->name = $request->name;
        $user->email = $request->email;
        $user->bio = $request->about;
        $user->headline = $request->heading;
        $user->gender = $request->gender;
        $user->save();

        notyf()->success('Updated Successfully');

        return redirect()->back();
    }

    function updatePassword(PasswordUpdateRequest $request) : RedirectResponse {
        $user = Auth::user();
        $user->password = bcrypt($request->password);
        $user->save();

        notyf()->success('Updated Successfully');

        return redirect()->back();

    }

    function updateSocial(SocialUpdateRequest $request) : RedirectResponse {
        $user = Auth::user();
        $user->facebook = $request->facebook;
        $user->x = $request->x;
        $user->linkedin = $request->linkedin;
        $user->website = $request->website;
        $user->save();
        
        notyf()->success('Updated Successfully');
        return redirect()->back();
    }

    function updateGatewayInfo(Request $request)
    {
        InstructorPayoutInformation::updateOrCreate(
            ['instructor_id' => user()->id],
            [
                'gateway' => $request->gateway,
                'information' => $request->information
            ]
         );

         notyf()->success('Updated Successfully');

         return redirect()->back();
    }
}
