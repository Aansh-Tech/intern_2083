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
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();

            // Foreign key to users table
            $table->foreignId('user_id')
                ->constrained()
                ->onDelete('cascade');

            // Profile fields
            $table->text('bio')->nullable();
            $table->string('title')->nullable();
            $table->string('phone', 20)->nullable();
            $table->string('resume_path')->nullable();
            $table->string('profile_photo')->nullable();
            $table->string('address')->nullable();

            $table->timestamps();

            // Indexes
            $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }
};
