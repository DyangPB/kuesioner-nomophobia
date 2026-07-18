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
        Schema::create('submissions', function (Blueprint $table) {
            $table->id();

            // Sosiodemografi
            $table->string('name')->nullable();
            $table->string('age_group');
            $table->string('gender');
            $table->string('cohort');
            $table->string('other_device');
            $table->string('phone_activity');
            $table->string('daily_usage');
            $table->string('screentime_image_path')->nullable();

            // NMP-Q (20 item, skala 1-7)
            $table->json('nmpq_answers');
            $table->unsignedSmallInteger('nmpq_score');
            $table->string('nomophobia_category');

            // DASS-21 Subskala Depresi (7 item, skala 1-4)
            $table->json('dass_depression_answers');
            $table->unsignedSmallInteger('dass_depression_score');

            // DASS-21 Subskala Kecemasan (7 item, skala 1-4)
            $table->json('dass_anxiety_answers');
            $table->unsignedSmallInteger('dass_anxiety_score');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('submissions');
    }
};
