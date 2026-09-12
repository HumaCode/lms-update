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
        Schema::table('featured_instructors', function (Blueprint $table) {
            if (Schema::hasColumn('featured_instructors', 'instructor_image')) {
                $table->dropColumn('instructor_image');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('featured_instructors', function (Blueprint $table) {
            $table->string('instructor_image')->nullable();
        });
    }
};
