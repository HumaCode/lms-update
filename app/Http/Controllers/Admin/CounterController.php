<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Counter;
use Illuminate\Http\Request;

class CounterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $counter = Counter::first();
        return inertia('Admin/Sections/Counter/Index', compact('counter'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'counter_one' => ['nullable', 'string', 'max:255'],
            'title_one' => ['nullable', 'string', 'max:255'],
            'counter_two' => ['nullable', 'string', 'max:255'],
            'title_two' => ['nullable', 'string', 'max:255'],
            'counter_three' => ['nullable', 'string', 'max:255'],
            'title_three' => ['nullable', 'string', 'max:255'],
            'counter_four' => ['nullable', 'string', 'max:255'],
            'title_four' => ['nullable', 'string', 'max:255'],
        ]);

        $counter = Counter::first();
        if ($counter) {
            $counter->update($validatedData);
        } else {
            Counter::create($validatedData);
        }

        notyf()->success('Update Successfully!');

        return redirect()->back();
    }
}
