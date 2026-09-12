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
        Schema::table('about_us_sections', function (Blueprint $table) {
            $columnsToDrop = [];
            if (Schema::hasColumn('about_us_sections', 'image')) $columnsToDrop[] = 'image';
            if (Schema::hasColumn('about_us_sections', 'lerner_image')) $columnsToDrop[] = 'lerner_image';
            if (Schema::hasColumn('about_us_sections', 'video_image')) $columnsToDrop[] = 'video_image';

            if (!empty($columnsToDrop)) {
                $table->dropColumn($columnsToDrop);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('about_us_sections', function (Blueprint $table) {
            $table->text('image')->nullable();
            $table->text('lerner_image')->nullable();
            $table->text('video_image')->nullable();
        });
    }
};
