<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('certificates', function (Blueprint $table) {
            $table->id();

            $table->foreignId('profile_id')
                ->constrained()
                ->onDelete('cascade');

            $table->string('title');
            $table->string('issuer');
            $table->date('issue_date')->nullable();
            $table->date('expiry_date')->nullable();
            $table->string('credential_url')->nullable();
            $table->string('image')->nullable();
            $table->text('description')->nullable();
            $table->integer('display_order')->default(0);

            $table->timestamps();

            $table->index('profile_id');
            $table->index('display_order');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('certificates');
    }
};
