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
        Schema::create('lipr_payments', function (Blueprint $table) {
            $table->id(); // This is your primary key (auto_increment)
            $table->string('reference_id', 255);
            $table->string('status', 255);
            $table->string('purpose', 100);
            $table->integer('amount'); //  Correct usage
            $table->integer('listing_id'); //  Correct usage
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lipr_payments');
    }
};
