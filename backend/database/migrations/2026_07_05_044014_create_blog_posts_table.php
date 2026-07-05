<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('blog_posts', function (Blueprint $table) {
            $table->id();

            $table->foreignId('profile_id')
                ->constrained()
                ->onDelete('cascade');

            $table->string('title');
            $table->string('slug', 191)->unique();
            $table->string('excerpt', 300)->nullable();
            $table->longText('content');
            $table->string('featured_image')->nullable();
            $table->string('category')->nullable();
            $table->json('tags')->nullable();

            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->timestamp('published_at')->nullable();
            $table->boolean('allow_comments')->default(true);

            $table->timestamps();

            $table->index('profile_id');
            $table->index('slug');
            $table->index('status');
            $table->index('published_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('blog_posts');
    }
};
