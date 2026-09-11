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
        Schema::create('course_question_replies', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('question_id')->constrained('course_questions')->onDelete('cascade');
            $table->foreignUlid('user_id')->constrained('users')->onDelete('cascade');
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
        Schema::dropIfExists('course_question_replies');
    }
};
