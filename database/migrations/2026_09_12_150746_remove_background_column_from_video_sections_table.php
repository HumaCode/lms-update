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
        Schema::table('video_sections', function (Blueprint $table) {
            if (Schema::hasColumn('video_sections', 'background')) {
                $table->dropColumn('background');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('video_sections', function (Blueprint $table) {
            $table->string('background')->nullable();
        });
    }
};
