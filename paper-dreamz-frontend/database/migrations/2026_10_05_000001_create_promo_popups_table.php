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
        Schema::create('promo_popups', function (Blueprint $table) {
            $table->id();
            $table->boolean('is_enabled')->default(true);
            $table->string('category')->default('new-arrivals');
            $table->string('eyebrow')->nullable();
            $table->string('title')->nullable();
            $table->text('message')->nullable();
            $table->string('button_label')->nullable();
            $table->string('image')->nullable();
            $table->unsignedSmallInteger('delay_seconds')->default(3);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('promo_popups');
    }
};
