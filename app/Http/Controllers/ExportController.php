<?php

namespace App\Http\Controllers;

use App\Models\Submission;
use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ExportController extends Controller
{
    public function xlsx(Request $request): StreamedResponse
    {
        abort_unless(
            $request->query('token') === config('questionnaire.export_token'),
            403
        );

        $submissions = Submission::orderBy('created_at')->get();

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Submissions');

        $nmpqItems = config('questionnaire.nmpq_items');
        $dassDepItems = config('questionnaire.dass_depression_items');
        $dassAnxItems = config('questionnaire.dass_anxiety_items');

        $headers = [
            'ID', 'Nama/Inisial', 'Usia', 'Jenis Kelamin', 'Angkatan',
            'Perangkat Lain', 'Aktivitas Ponsel', 'Durasi Harian',
            'Gambar Screentime',
        ];
        foreach ($nmpqItems as $i => $item) {
            $headers[] = 'NMPQ_' . ($i + 1);
        }
        $headers[] = 'Skor NMP-Q';
        $headers[] = 'Kategori Nomophobia';
        foreach ($dassDepItems as $i => $item) {
            $headers[] = 'DASS_Depresi_' . ($i + 1);
        }
        $headers[] = 'Skor DASS Depresi';
        $headers[] = 'Kategori DASS Depresi';
        foreach ($dassAnxItems as $i => $item) {
            $headers[] = 'DASS_Kecemasan_' . ($i + 1);
        }
        $headers[] = 'Skor DASS Kecemasan';
        $headers[] = 'Kategori DASS Kecemasan';
        $headers[] = 'Waktu Submit';

        $sheet->fromArray($headers, null, 'A1');

        $rowIndex = 2;
        foreach ($submissions as $submission) {
            $row = [
                $submission->id,
                $submission->name,
                $this->label('age_group', $submission->age_group),
                $this->label('gender', $submission->gender),
                $submission->cohort,
                $this->label('other_device', $submission->other_device),
                $this->label('phone_activity', $submission->phone_activity),
                $this->label('daily_usage', $submission->daily_usage),
                '', // Gambar Screentime — diisi sebagai thumbnail gambar, bukan teks (lihat di bawah)
            ];

            foreach ($submission->nmpq_answers as $answer) {
                $row[] = $answer;
            }
            $row[] = $submission->nmpq_score;
            $row[] = $this->categoryTitle('nomophobia_categories', $submission->nomophobia_category);

            foreach ($submission->dass_depression_answers as $answer) {
                $row[] = $answer;
            }
            $row[] = $submission->dass_depression_score;
            $row[] = $this->categoryTitle('dass_depression_categories', $submission->dass_depression_category);

            foreach ($submission->dass_anxiety_answers as $answer) {
                $row[] = $answer;
            }
            $row[] = $submission->dass_anxiety_score;
            $row[] = $this->categoryTitle('dass_anxiety_categories', $submission->dass_anxiety_category);

            $row[] = $submission->created_at?->format('Y-m-d H:i:s');

            $sheet->fromArray($row, null, 'A' . $rowIndex);

            if ($submission->screentime_image_path) {
                $imagePath = storage_path('app/public/' . $submission->screentime_image_path);

                if (is_file($imagePath)) {
                    $drawing = new Drawing();
                    $drawing->setPath($imagePath);
                    $drawing->setHeight(70);
                    $drawing->setCoordinates('I' . $rowIndex);
                    $drawing->setOffsetX(4);
                    $drawing->setOffsetY(4);
                    $drawing->setWorksheet($sheet);
                }
            }

            $sheet->getRowDimension($rowIndex)->setRowHeight(56);
            $rowIndex++;
        }

        $sheet->getColumnDimension('I')->setWidth(14);

        foreach (range('A', $sheet->getHighestColumn()) as $column) {
            if ($column === 'I') {
                continue;
            }
            $sheet->getColumnDimension($column)->setAutoSize(true);
        }

        $writer = new Xlsx($spreadsheet);

        return response()->streamDownload(function () use ($writer) {
            $writer->save('php://output');
        }, 'nomophobia-submissions-' . now()->format('Ymd-His') . '.xlsx', [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ]);
    }

    private function label(string $field, ?string $value): string
    {
        return config("questionnaire.field_labels.$field.$value", $value ?? '');
    }

    private function categoryTitle(string $configKey, ?string $categoryKey): string
    {
        $categories = config("questionnaire.$configKey", []);

        foreach ($categories as $category) {
            if ($category['key'] === $categoryKey) {
                return $category['title'];
            }
        }

        return $categoryKey ?? '';
    }
}
