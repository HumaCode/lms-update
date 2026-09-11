<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('latest_course_sections', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('category_one')->nullable();
            $table->foreignUlid('category_two')->nullable();
            $table->foreignUlid('category_three')->nullable();
            $table->foreignUlid('category_four')->nullable();
            $table->foreignUlid('category_five')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('latest_course_sections');
    }
};
