<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('skills', function (Blueprint $table) {
            $table->id();

            $table->foreignId('profile_id')
                ->constrained()
                ->onDelete('cascade');

            $table->string('name');
            $table->string('category')->nullable();
            $table->integer('proficiency')->default(0);
            $table->string('icon')->nullable();
            $table->integer('display_order')->default(0);

            $table->timestamps();

            $table->index('profile_id');
            $table->index('display_order');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('skills');
    }
};
