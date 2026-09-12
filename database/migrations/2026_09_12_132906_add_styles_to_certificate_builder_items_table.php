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
        Schema::table('certificate_builder_items', function (Blueprint $table) {
            $table->string('font_family')->nullable()->after('y_position');
            $table->string('font_size')->nullable()->after('font_family');
            $table->string('color')->nullable()->after('font_size');
            $table->boolean('is_bold')->default(false)->after('color');
            $table->boolean('is_italic')->default(false)->after('is_bold');
            $table->boolean('is_underline')->default(false)->after('is_italic');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('certificate_builder_items', function (Blueprint $table) {
            $table->dropColumn(['font_family', 'font_size', 'color', 'is_bold', 'is_italic', 'is_underline']);
        });
    }
};
