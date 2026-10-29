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
        Schema::table('products', function (Blueprint $table) {
            $table->boolean('is_new_arrival')->default(false)->after('description');
            $table->boolean('is_hot_deal')->default(false)->after('is_new_arrival');
            $table->boolean('is_best_seller')->default(false)->after('is_hot_deal');
            $table->decimal('compare_price', 10, 2)->nullable()->after('price');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['is_new_arrival', 'is_hot_deal', 'is_best_seller', 'compare_price']);
        });
    }
};
