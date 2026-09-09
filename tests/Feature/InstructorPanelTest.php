<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class InstructorPanelTest extends TestCase
{
    protected User $instructor;

    protected function setUp(): void
    {
        parent::setUp();
        $this->instructor = User::where('role', 'instructor')->first() ?? User::factory()->create(['role' => 'instructor', 'email_verified_at' => now()]);
    }

    public function test_instructor_dashboard_page(): void
    {
        $response = $this->actingAs($this->instructor, 'web')
            ->get('/instructor/dashboard');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Instructor/Dashboard/Index')
            ->has('pendingCourses')
            ->has('approvedCourses')
            ->has('rejectedCourses')
            ->has('orderItems')
        );
    }

    public function test_instructor_profile_page(): void
    {
        $response = $this->actingAs($this->instructor, 'web')
            ->get('/instructor/profile');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Instructor/Profile/Index')
            ->has('profile')
            ->has('gateways')
        );
    }

    public function test_instructor_orders_page(): void
    {
        $response = $this->actingAs($this->instructor, 'web')
            ->get('/instructor/orders');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Instructor/Order/Index')
            ->has('orderItems')
        );
    }

    public function test_instructor_withdrawals_page(): void
    {
        $response = $this->actingAs($this->instructor, 'web')
            ->get('/instructor/withdrawals');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Instructor/Withdraw/Index')
            ->has('currentBalance')
            ->has('pendingBalance')
            ->has('totalPayout')
            ->has('withdraws')
        );
    }

    public function test_instructor_request_payout_page(): void
    {
        $response = $this->actingAs($this->instructor, 'web')
            ->get('/instructor/withdrawals/request-payout');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Instructor/Withdraw/RequestPayout')
            ->has('currentBalance')
            ->has('pendingBalance')
            ->has('totalPayout')
            ->has('gatewayInfo')
        );
    }

    public function test_instructor_courses_page(): void
    {
        $response = $this->actingAs($this->instructor, 'web')
            ->get('/instructor/courses');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Instructor/Course/Index')
            ->has('courses')
        );
    }

    public function test_instructor_course_create_page(): void
    {
        $response = $this->actingAs($this->instructor, 'web')
            ->get('/instructor/courses/create');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Instructor/Course/Create')
        );
    }

    public function test_instructor_course_edit_page(): void
    {
        $course = Course::where('instructor_id', $this->instructor->id)->first();
        if (!$course) {
            $course = Course::first();
            if ($course) {
                $course->instructor_id = $this->instructor->id;
                $course->save();
            }
        }

        if ($course) {
            $response = $this->actingAs($this->instructor, 'web')
                ->get("/instructor/courses/{$course->id}/edit");

            $response->assertStatus(200);
            $response->assertInertia(fn (Assert $page) => $page
                ->component('Instructor/Course/Edit')
                ->has('course')
                ->has('languages')
                ->has('levels')
                ->has('categories')
                ->has('currentStep')
            );
        }
    }
}
