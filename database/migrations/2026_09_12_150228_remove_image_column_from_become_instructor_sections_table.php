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
        Schema::table('become_instructor_sections', function (Blueprint $table) {
            if (Schema::hasColumn('become_instructor_sections', 'image')) {
                $table->dropColumn('image');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('become_instructor_sections', function (Blueprint $table) {
            $table->string('image')->nullable();
        });
    }
};
