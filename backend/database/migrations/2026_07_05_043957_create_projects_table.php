<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();

            $table->foreignId('profile_id')
                ->constrained()
                ->onDelete('cascade');

            $table->string('title');
            $table->string('slug', 191)->unique();
            $table->string('subtitle')->nullable();
            $table->text('description')->nullable();
            $table->longText('content')->nullable();
            $table->string('github_link')->nullable();
            $table->string('live_link')->nullable();
            $table->string('technologies')->nullable();

            $table->boolean('is_featured')->default(false);
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->date('completed_at')->nullable();

            $table->timestamps();

            $table->index('profile_id');
            $table->index('slug');
            $table->index('status');
            $table->index('is_featured');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
