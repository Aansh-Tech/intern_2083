<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('imageables', function (Blueprint $table) {
            $table->id();

            $table->foreignId('image_id')
                ->constrained()
                ->onDelete('cascade');

            $table->string('imageable_type', 100);
            $table->unsignedBigInteger('imageable_id');

            $table->string('type', 100)->default('gallery');
            $table->integer('display_order')->default(0);
            $table->boolean('is_primary')->default(false);

            $table->timestamps();

            $table->index('image_id');
            $table->index(['imageable_type', 'imageable_id']);
            $table->index('display_order');

            $table->unique(['image_id', 'imageable_type', 'imageable_id', 'type'], 'imageables_unique_attachment');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('imageables');
    }
};
