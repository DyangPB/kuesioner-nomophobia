<?php

namespace App\Http\Controllers;

use App\Models\Submission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class QuestionnaireController extends Controller
{
    public function index()
    {
        $config = config('questionnaire');

        return view('questionnaire', [
            'nmpqItems' => $config['nmpq_items'],
            'nmpqScale' => $config['nmpq_scale'],
            'dassScale' => $config['dass_scale'],
            'dassDepressionItems' => $config['dass_depression_items'],
            'dassAnxietyItems' => $config['dass_anxiety_items'],
            'nomophobiaCategories' => $config['nomophobia_categories'],
            'dassDepressionCategories' => $config['dass_depression_categories'],
            'dassAnxietyCategories' => $config['dass_anxiety_categories'],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $nmpqCount = count(config('questionnaire.nmpq_items'));
        $dassDepCount = count(config('questionnaire.dass_depression_items'));
        $dassAnxCount = count(config('questionnaire.dass_anxiety_items'));

        $validated = $request->validate([
            'name' => ['nullable', 'string', 'max:255'],
            'age_group' => ['required', Rule::in(['under18', '18plus'])],
            'gender' => ['required', Rule::in(['perempuan', 'laki-laki'])],
            'cohort' => ['required', Rule::in(['2023', '2024', '2025'])],
            'other_device' => ['required', Rule::in([
                'hanya_ponsel', 'tablet', 'laptop', 'konsol_gim', 'lainnya',
            ])],
            'phone_activity' => ['required', Rule::in([
                'akademik', 'belanja', 'komunikasi', 'hiburan',
            ])],
            'daily_usage' => ['required', Rule::in(['kurang_4', '4_6', 'lebih_6'])],
            'screentime_image' => ['nullable', 'file', 'mimes:jpg,jpeg,png', 'max:5120'],

            'nmpq_answers' => ['required', 'array', 'size:' . $nmpqCount],
            'nmpq_answers.*' => ['required', 'integer', 'between:1,7'],

            'dass_depression_answers' => ['required', 'array', 'size:' . $dassDepCount],
            'dass_depression_answers.*' => ['required', 'integer', 'between:1,4'],

            'dass_anxiety_answers' => ['required', 'array', 'size:' . $dassAnxCount],
            'dass_anxiety_answers.*' => ['required', 'integer', 'between:1,4'],
        ]);

        $nmpqScore = array_sum($validated['nmpq_answers']);
        $dassDepressionScore = array_sum($validated['dass_depression_answers']);
        $dassAnxietyScore = array_sum($validated['dass_anxiety_answers']);

        $nomophobiaCategory = $this->resolveCategory($nmpqScore, 'nomophobia_categories');
        $dassDepressionCategory = $this->resolveCategory($dassDepressionScore, 'dass_depression_categories');
        $dassAnxietyCategory = $this->resolveCategory($dassAnxietyScore, 'dass_anxiety_categories');

        $screentimePath = null;
        if ($request->hasFile('screentime_image')) {
            $screentimePath = $request->file('screentime_image')->store('screentime', 'public');
        }

        Submission::create([
            'name' => $validated['name'] ?? null,
            'age_group' => $validated['age_group'],
            'gender' => $validated['gender'],
            'cohort' => $validated['cohort'],
            'other_device' => $validated['other_device'],
            'phone_activity' => $validated['phone_activity'],
            'daily_usage' => $validated['daily_usage'],
            'screentime_image_path' => $screentimePath,
            'nmpq_answers' => $validated['nmpq_answers'],
            'nmpq_score' => $nmpqScore,
            'nomophobia_category' => $nomophobiaCategory['key'],
            'dass_depression_answers' => $validated['dass_depression_answers'],
            'dass_depression_score' => $dassDepressionScore,
            'dass_depression_category' => $dassDepressionCategory['key'],
            'dass_anxiety_answers' => $validated['dass_anxiety_answers'],
            'dass_anxiety_score' => $dassAnxietyScore,
            'dass_anxiety_category' => $dassAnxietyCategory['key'],
        ]);

        return response()->json([
            'nmpq_score' => $nmpqScore,
            'nomophobia_category' => $nomophobiaCategory['key'],
            'dass_depression_score' => $dassDepressionScore,
            'dass_depression_category' => $dassDepressionCategory['key'],
            'dass_anxiety_score' => $dassAnxietyScore,
            'dass_anxiety_category' => $dassAnxietyCategory['key'],
        ]);
    }

    private function resolveCategory(int $score, string $configKey): array
    {
        $categories = config('questionnaire.' . $configKey);

        foreach ($categories as $category) {
            if ($score >= $category['min'] && $score <= $category['max']) {
                return $category;
            }
        }

        // Skor di luar rentang yang diharapkan dianggap kategori paling berat.
        return end($categories);
    }
}
