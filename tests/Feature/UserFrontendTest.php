<?php

namespace Tests\Feature;

use App\Models\Blog;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Order;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class UserFrontendTest extends TestCase
{
    protected User $student;

    protected function setUp(): void
    {
        parent::setUp();
        $this->student = User::where('role', 'student')->first() ?? User::factory()->create(['role' => 'student', 'email_verified_at' => now()]);
    }

    public function test_home_page(): void
    {
        $response = $this->get('/');
        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('User/Home/Index')
        );
    }

    public function test_courses_catalog_page(): void
    {
        $response = $this->get('/courses');
        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('User/Course/Index')
            ->has('courses')
            ->has('categories')
            ->has('levels')
            ->has('languages')
        );
    }

    public function test_course_show_page(): void
    {
        $course = Course::where('is_approved', 'approved')->where('status', 'active')->first() ?? Course::first();
        if ($course) {
            $course->is_approved = 'approved';
            $course->status = 'active';
            $course->save();

            $response = $this->get("/courses/{$course->slug}");
            $response->assertStatus(200);
            $response->assertInertia(fn (Assert $page) => $page
                ->component('User/Course/Show')
                ->has('course')
            );
        }
    }

    public function test_cart_page(): void
    {
        $response = $this->actingAs($this->student, 'web')->get('/cart');
        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('User/Cart/Index')
            ->has('cart')
        );
    }

    public function test_checkout_page(): void
    {
        $response = $this->actingAs($this->student, 'web')->get('/checkout');
        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('User/Checkout/Index')
        );
    }

    public function test_about_page(): void
    {
        $response = $this->get('/about');
        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('User/About/Index')
        );
    }

    public function test_contact_page(): void
    {
        $response = $this->get('/contact');
        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('User/Contact/Index')
            ->has('contactCards')
            ->has('contactSetting')
        );
    }

    public function test_contact_send_mail(): void
    {
        \Illuminate\Support\Facades\Mail::fake();

        // Validation test
        $resInvalid = $this->withoutMiddleware()->postJson('/contact', []);
        $resInvalid->assertStatus(422);
        $resInvalid->assertJsonValidationErrors(['name', 'email', 'message']);

        // Success test
        $resValid = $this->withoutMiddleware()
            ->post('/contact', [
                'name' => 'John Doe',
                'email' => 'john@example.com',
                'subject' => 'Inquiry about Web Dev Course',
                'message' => 'Hello, I would like more information about your courses.',
            ]);

        $resValid->assertRedirect();
        \Illuminate\Support\Facades\Mail::assertSent(\App\Mail\ContactMail::class);
    }

    public function test_blog_index_page(): void
    {
        $response = $this->get('/blog');
        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('User/Blog/Index')
            ->has('blogs')
        );
    }

    public function test_blog_show_page(): void
    {
        $blog = Blog::where('status', 1)->first();
        if ($blog) {
            $response = $this->get("/blog/{$blog->slug}");
            $response->assertStatus(200);
            $response->assertInertia(fn (Assert $page) => $page
                ->component('User/Blog/Show')
                ->has('blog')
            );
        }
    }

    public function test_student_dashboard_page(): void
    {
        $response = $this->actingAs($this->student, 'web')->get('/student/dashboard');
        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Student/Dashboard/Index')
            ->has('userCourses')
            ->has('reviewCount')
            ->has('orderCount')
        );
    }

    public function test_student_profile_page(): void
    {
        $response = $this->actingAs($this->student, 'web')->get('/student/profile');
        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Student/Profile/Index')
        );
    }

    public function test_student_enrolled_courses_page(): void
    {
        $response = $this->actingAs($this->student, 'web')->get('/student/enrolled-courses');
        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Student/EnrolledCourse/Index')
            ->has('enrollments')
        );
    }

    public function test_student_orders_page(): void
    {
        $response = $this->actingAs($this->student, 'web')->get('/student/orders');
        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Student/Order/Index')
            ->has('orders')
        );
    }

    public function test_student_reviews_page(): void
    {
        $response = $this->actingAs($this->student, 'web')->get('/student/review');
        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Student/Review/Index')
            ->has('reviews')
        );
    }

    public function test_student_become_instructor_page(): void
    {
        $response = $this->actingAs($this->student, 'web')->get('/student/become-instructor');
        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Student/BecomeInstructor/Index')
        );
    }

    public function test_student_course_player_page(): void
    {
        $course = Course::first();
        if ($course) {
            Enrollment::firstOrCreate([
                'user_id' => $this->student->id,
                'course_id' => $course->id,
            ], [
                'instructor_id' => $course->instructor_id ?? 1,
                'have_access' => 1,
            ]);

            $response = $this->actingAs($this->student, 'web')->get("/student/course-player/{$course->slug}");
            $response->assertStatus(200);
            $response->assertInertia(fn (Assert $page) => $page
                ->component('Student/CoursePlayer/Index')
                ->has('course')
            );
        }
    }
}
