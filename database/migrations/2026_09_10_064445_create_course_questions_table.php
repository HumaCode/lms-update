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
        Schema::create('course_questions', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('course_id')->constrained('courses')->onDelete('cascade');
            $table->foreignUlid('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignUlid('lesson_id')->nullable()->constrained('course_chapter_lessions')->onDelete('cascade');
            $table->string('title');
            $table->text('content');
            $table->integer('upvotes')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('course_questions');
    }
};
