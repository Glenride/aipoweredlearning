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
        Schema::create('blueprints', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('chat_session_id')->constrained()->onDelete('cascade');
            $table->string('project_name');
            $table->string('tagline')->nullable();
            $table->text('target_audience')->nullable();
            $table->string('monetization_model')->nullable();
            $table->json('mvp_features')->nullable();
            $table->string('niche')->nullable();
            $table->text('problem_statement')->nullable();
            $table->text('solution_concept')->nullable();
            $table->json('roadmap_json')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blueprints');
    }
};
