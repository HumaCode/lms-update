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
        Schema::table('course_questions', function (Blueprint $table) {
            if (!Schema::hasColumn('course_questions', 'is_banned')) {
                $table->boolean('is_banned')->default(false)->after('upvotes');
            }
            if (!Schema::hasColumn('course_questions', 'is_reported')) {
                $table->boolean('is_reported')->default(false)->after('is_banned');
            }
        });

        Schema::table('course_question_replies', function (Blueprint $table) {
            if (!Schema::hasColumn('course_question_replies', 'is_banned')) {
                $table->boolean('is_banned')->default(false)->after('upvotes');
            }
            if (!Schema::hasColumn('course_question_replies', 'is_reported')) {
                $table->boolean('is_reported')->default(false)->after('is_banned');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('course_questions', function (Blueprint $table) {
            $table->dropColumn(['is_banned', 'is_reported']);
        });
        Schema::table('course_question_replies', function (Blueprint $table) {
            $table->dropColumn(['is_banned', 'is_reported']);
        });
    }
};
