<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Submission extends Model
{
    protected $fillable = [
        'name',
        'age_group',
        'gender',
        'cohort',
        'other_device',
        'phone_activity',
        'daily_usage',
        'screentime_image_path',
        'nmpq_answers',
        'nmpq_score',
        'nomophobia_category',
        'dass_depression_answers',
        'dass_depression_score',
        'dass_depression_category',
        'dass_anxiety_answers',
        'dass_anxiety_score',
        'dass_anxiety_category',
    ];

    protected $casts = [
        'nmpq_answers' => 'array',
        'dass_depression_answers' => 'array',
        'dass_anxiety_answers' => 'array',
    ];
}
