<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\OrderItem;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;

class InstructorDashboardController extends Controller
{
    function index()
    {
        $pendingCourses = Course::where('instructor_id', user()->id)->where('is_approved', 'pending')->count();
        $approvedCourses = Course::where('instructor_id', user()->id)->where('is_approved', 'approved')->count();
        $rejectedCourses = Course::where('instructor_id', user()->id)->where('is_approved', 'rejected')->count();

        $orderItems = OrderItem::with(['course', 'order.customer'])
            ->whereHas('course', function($query) {
                $query->where('instructor_id', user()->id);
            })->latest()->take(10)->get();

        return \Inertia\Inertia::render('Instructor/Dashboard/Index', [
            'pendingCourses' => $pendingCourses,
            'approvedCourses' => $approvedCourses,
            'rejectedCourses' => $rejectedCourses,
            'orderItems' => $orderItems,
        ]); 
    }
}
