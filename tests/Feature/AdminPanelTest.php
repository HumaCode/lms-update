<?php

namespace Tests\Feature;

use App\Models\Admin;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminPanelTest extends TestCase
{
    protected Admin $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = Admin::first() ?? Admin::create([
            'name' => 'Super Admin',
            'email' => 'admin@gmail.com',
            'password' => bcrypt('password'),
        ]);
    }

    public function test_admin_dashboard(): void
    {
        $response = $this->actingAs($this->admin, 'admin')->get('/admin/dashboard');
        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Dashboard/Index')
            ->has('metrics')
            ->has('charts')
        );
    }

    public function test_admin_course_categories(): void
    {
        $response = $this->actingAs($this->admin, 'admin')->get('/admin/course-categories');
        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/CourseCategory/Index')
            ->has('categories')
        );
    }

    public function test_admin_orders(): void
    {
        $response = $this->actingAs($this->admin, 'admin')->get('/admin/orders');
        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Order/Index')
            ->has('orders')
        );
    }

    public function test_admin_settings(): void
    {
        $response = $this->actingAs($this->admin, 'admin')->get('/admin/settings');
        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Setting/General')
        );
    }
}
