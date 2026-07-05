<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('images', function (Blueprint $table) {
            $table->id();

            $table->string('image_path');
            $table->string('filename');
            $table->string('alt_text')->nullable();
            $table->string('caption')->nullable();
            $table->string('type')->default('image');
            $table->integer('size')->nullable();
            $table->string('mime_type')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('images');
    }
};
