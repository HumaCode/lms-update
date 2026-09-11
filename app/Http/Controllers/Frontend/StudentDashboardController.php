<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Review;
use App\Models\User;
use App\Traits\FileUpload;
use Exception;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;


class StudentDashboardController extends Controller
{
    use FileUpload;

    function index()
    {
        $userCourses = user()->enrollments()->count();
        $reviewCount = Review::where('user_id', user()->id)->count();
        $orderCount = Order::where('buyer_id', user()->id)->count();

        $orders = Order::where('buyer_id', user()->id)->latest()->take(10)->get();
        
        return \Inertia\Inertia::render('Student/Dashboard/Index', [
            'userCourses' => $userCourses,
            'reviewCount' => $reviewCount,
            'orderCount' => $orderCount,
            'orders' => $orders,
        ]);
    }

    function becomeInstructor()
    {
        if(auth()->user()->role == 'instructor') abort(403);

        return \Inertia\Inertia::render('Student/BecomeInstructor/Index'); 
    }

    function becomeInstructorUpdate(Request $request, User $user) : RedirectResponse {
        $request->validate(['document' => ['required', 'mimes:pdf,doc,docx,jpg,png', 'max:12000']]);

        $filePath = $this->uploadFile($request->file('document'));
        $user->update([
            'approve_status' => 'pending',
            'document' => $filePath
        ]);

        notyf()->success('Application submitted successfully!');
        return redirect()->route('student.dashboard');
    }

    function review()
    {
        $reviews = Review::with('course')->where('user_id', user()->id)->paginate(10);
        return \Inertia\Inertia::render('Student/Review/Index', [
            'reviews' => $reviews,
        ]);
    }

    function reviewDestroy(string $id) {
       try {
           $review = Review::where('id', $id)->where('user_id', user()->id)->firstOrFail();
           $review->delete();
           notyf()->success('Deleted Successfully!');
           return response(['message' => 'Deleted Successfully!'], 200);
       } catch (Exception $e) {
           logger("Review Error >> " . $e);
           return response(['message' => 'Something went wrong!'], 500);
       } 
    }
}
