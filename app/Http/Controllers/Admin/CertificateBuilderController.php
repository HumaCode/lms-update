<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CertificateBuilderUpdateRequest;
use App\Models\CertificateBuilder;
use App\Models\CertificateBuilderItem;
use App\Traits\FileUpload;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

use App\Models\Course;

class CertificateBuilderController extends Controller
{
    use FileUpload;

    function index(): InertiaResponse
    {
        $certificate = CertificateBuilder::first();
        $certificateItems = CertificateBuilderItem::all();
        $courses = Course::with(['instructor', 'category'])
            ->latest()
            ->get();

        return Inertia::render('Admin/CertificateBuilder/Index', [
            'certificate' => $certificate,
            'certificateItems' => $certificateItems,
            'courses' => $courses,
        ]);
    }

    function update(CertificateBuilderUpdateRequest $request): RedirectResponse
    {
        $data = ['title' => $request->title, 'sub_title' => $request->subtitle, 'description' => $request->description];

        if($request->hasFile('signature')) {
            $signature = $this->uploadFile($request->file('signature'));
            $data['signature'] = $signature;
        }

        if($request->hasFile('signature_2')) {
            $signature2 = $this->uploadFile($request->file('signature_2'));
            $data['signature_2'] = $signature2;
        }

        if($request->hasFile('background')) {
            $background = $this->uploadFile($request->file('background'));
            $data['background'] = $background;
        }

        CertificateBuilder::updateOrCreate(
            ['id' => 1],
            $data
        );

        notyf()->success('Updated Successfully');

        return redirect()->back();
    }

    function itemUpdate(Request $request) : Response
    {
        $request->validate([
            'element_id' => 'required|in:title,subtitle,student_name,cert_number,description,signature,signature_2',
        ]);

        $values = [];
        foreach (['x_position', 'y_position', 'font_family', 'font_size', 'color', 'is_bold', 'is_italic', 'is_underline', 'is_visible'] as $field) {
            if ($request->has($field)) {
                $values[$field] = $request->input($field);
            }
        }

        CertificateBuilderItem::updateOrCreate(
            ['element_id' => $request->element_id],
            $values
        );

        return response(['success' => true]);
    }

    function toggleCourseCertificate(Course $course): RedirectResponse
    {
        $course->update(['certificate' => !$course->certificate]);
        if (function_exists('notyf')) {
            notyf()->success('Status sertifikat kursus berhasil diperbarui!');
        }
        return redirect()->back();
    }
}
