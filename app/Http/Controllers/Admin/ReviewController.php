<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Exception;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $reviews = Review::with(['user', 'course.instructor'])->latest()->paginate(20);
        return \Inertia\Inertia::render('Admin/Review/Index', [
            'reviews' => $reviews,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Review $review)
    {
        $review->status = $request->status ? 1 : 0;
        $review->save();

        notyf()->success('Review status updated successfully!');
        return redirect()->back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Review $review)
    {
        try {
            $review->delete();
            notyf()->success('Review deleted successfully!');
            return to_route('admin.reviews.index');
        } catch (Exception $e) {
            logger("Course Rating Error >> " . $e);
            notyf()->error('Something went wrong!');
            return back();
        }
    }
}
