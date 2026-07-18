<?php

use App\Http\Controllers\ExportController;
use App\Http\Controllers\QuestionnaireController;
use Illuminate\Support\Facades\Route;

Route::get('/', [QuestionnaireController::class, 'index'])->name('questionnaire.index');
Route::post('/submit', [QuestionnaireController::class, 'store'])->name('questionnaire.store');

Route::get('/export/xlsx', [ExportController::class, 'xlsx'])->name('export.xlsx');
