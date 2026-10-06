<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->string('image')->nullable()->after('name');
            $table->decimal('original_price', 10, 2)->after('image');
            $table->decimal('selling_price', 10, 2)->after('original_price');
            $table->boolean('status')->default(true)->after('selling_price');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'image',
                'original_price',
                'selling_price',
                'status',
            ]);
        });
    }
};