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
        Schema::table('features', function (Blueprint $table) {
            $columnsToDrop = [];
            if (Schema::hasColumn('features', 'image_one')) $columnsToDrop[] = 'image_one';
            if (Schema::hasColumn('features', 'image_two')) $columnsToDrop[] = 'image_two';
            if (Schema::hasColumn('features', 'image_three')) $columnsToDrop[] = 'image_three';

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
        Schema::table('features', function (Blueprint $table) {
            $table->string('image_one')->nullable();
            $table->string('image_two')->nullable();
            $table->string('image_three')->nullable();
        });
    }
};
