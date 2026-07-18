<?php

return [

    // Token sederhana untuk melindungi endpoint export Excel.
    // Set QUESTIONNAIRE_EXPORT_TOKEN di .env, lalu akses:
    // /export/xlsx?token=<token>
    'export_token' => env('QUESTIONNAIRE_EXPORT_TOKEN'),

    // Label tampilan untuk tiap value yang disimpan di database, dipakai saat export Excel
    // supaya isinya sama persis dengan teks yang dilihat responden di web (bukan key internal).
    'field_labels' => [
        'age_group' => [
            'under18' => '< 18 tahun',
            '18plus' => '≥ 18 tahun',
        ],
        'gender' => [
            'perempuan' => 'Perempuan',
            'laki-laki' => 'Laki-laki',
        ],
        'other_device' => [
            'hanya_ponsel' => 'Hanya ponsel',
            'tablet' => 'Tablet/iPad/sejenis',
            'laptop' => 'Laptop/komputer/sejenis',
            'konsol_gim' => 'Konsol gim seperti Nintendo Switch/PlayStation/sejenis',
            'lainnya' => 'Lainnya',
        ],
        'phone_activity' => [
            'akademik' => 'Akademik (belajar/membaca literatur kedokteran (e-book, artikel jurnal, website kesehatan); mengerjakan tugas atau quiz/mengakses aplikasi kedokteran interaktif (complete anatomy, HeartSounds, dll); menonton video pembelajaran)',
            'belanja' => 'Belanja atau berbisnis di e-commerce atau platform sejenis',
            'komunikasi' => 'Komunikasi (chat, telepon, video-call)',
            'hiburan' => 'Hiburan (bermain gim, mengakses media sosial, streaming video pendek/film, menggambar, mendengarkan musik)',
        ],
        'daily_usage' => [
            'kurang_4' => '< 4 jam',
            '4_6' => '4-6 jam',
            'lebih_6' => '> 6 jam',
        ],
    ],

    // Nomophobia Questionnaire (NMP-Q) - 20 item, skala 1-7
    'nmpq_scale' => [
        1 => 'Sangat tidak setuju',
        2 => 'Tidak setuju',
        3 => 'Agak tidak setuju',
        4 => 'Netral',
        5 => 'Agak setuju',
        6 => 'Setuju',
        7 => 'Sangat setuju',
    ],

    'nmpq_items' => [
        'Saya merasa tidak nyaman tidak memiliki akses informasi melalui smartphone saya.',
        'Saya akan terganggu jika saya tidak dapat melihat informasi yang saya butuhkan di smartphone saya.',
        'Saya cemas ketika tidak bisa mendapatkan update berita (misalnya, suatu kejadian/peristiwa, cuaca, produk, barang/jasa dll.) di smartphone saya.',
        'Saya terganggu jika ada kendala/gangguan pada smartphone saya yang mengakibatkan saya tidak maksimal menggunakan smartphone saya.',
        'Saya cemas jika smartphone saya kehabisan baterai/daya.',
        'Saya panik jika smartphone saya kehabisan kuota/paket data.',
        'Jika smartphone saya tiba-tiba tidak memiliki kuota/paket data atau tidak dapat/gagal terhubung ke Wi-Fi, maka saya akan berusaha membeli kuota/paket data atau mencari jaringan Wi-Fi terdekat.',
        'Jika tidak memegang/membawa smartphone, saya khawatir tersesat atau tidak bisa menemukan tujuan saat berpergian.',
        'Jika saya tidak dapat memeriksa informasi yang ada di smartphone saya untuk sementara waktu, muncul keinginan yang besar untuk segera memeriksanya.',
        'Jika tidak memegang/membawa smartphone, saya merasa cemas karena saya tidak dapat langsung berkomunikasi dengan keluarga dan/atau teman-teman saya.',
        'Jika tidak memegang/membawa smartphone, saya khawatir keluarga dan/atau teman saya tidak dapat menghubungi saya.',
        'Jika tidak memegang/membawa smartphone, saya merasa gelisah karena saya tidak akan dapat menerima pesan teks (message) dan panggilan (call).',
        'Jika tidak memegang/membawa smartphone, saya merasa gelisah karena saya tidak bisa tetap terhubung dengan keluarga dan/atau teman saya.',
        'Jika tidak memegang/membawa smartphone, saya cemas karena saya tidak tahu siapa/orang yang menghubungi dan/atau mencari saya.',
        'Jika tidak memegang/membawa smartphone, saya merasa cemas karena urusan saya dengan keluarga dan/atau teman-teman saya akan berantakan.',
        'Jika tidak memegang/membawa smartphone, saya cemas karena tidak eksis secara online.',
        'Jika tidak memegang/membawa smartphone, saya merasa tidak nyaman karena saya tidak bisa update dengan media sosial dan jaringan online yang saya miliki.',
        'Jika tidak memegang/membawa smartphone, saya merasa tidak bersemangat karena saya tidak dapat memeriksa pemberitahuan (notifikasi) saya untuk pembaruan dari jaringan online saya (Sosial media, e-mail, lanjutan percakapan, dll).',
        'Jika tidak memegang/membawa smartphone, saya merasa cemas karena saya tidak dapat memeriksa e-mail saya.',
        'Jika tidak memegang/membawa smartphone, saya merasa aneh karena saya tidak tahu harus berbuat apa.',
    ],

    // DASS-21 - skala 1-4 (mengikuti desain: 1=Tidak sesuai ... 4=Sangat sesuai)
    'dass_scale' => [
        1 => 'Tidak sesuai dengan saya sama sekali atau tidak pernah',
        2 => 'Sedikit sesuai dengan saya pada saat tertentu',
        3 => 'Cukup sesuai dengan saya pada sebagian besar waktu',
        4 => 'Sangat sesuai dengan saya hampir setiap waktu',
    ],

    'dass_depression_items' => [
        'Saya tidak dapat merasakan perasaan yang positif.',
        'Saya sulit mendapatkan semangat untuk melakukan sesuatu.',
        'Saya merasa tidak memiliki masa depan.',
        'Saya merasa sedih dan murung.',
        'Saya tidak antusias terhadap sesuatu.',
        'Saya merasa saya tidak berharga.',
        'Saya merasa hidup ini tidak berarti.',
    ],

    'dass_anxiety_items' => [
        'Saya merasa rongga mulut saya kering.',
        'Saya mengalami kesulitan bernapas (misalnya seringkali terengah-engah atau tidak dapat bernapas padahal tidak melakukan aktivitas fisik sebelumnya).',
        'Saya merasa gemetar (misalnya pada tangan).',
        'Saya merasa khawatir dengan situasi dimana saya mungkin menjadi panik dan mempermalukan diri sendiri.',
        'Saya merasa hampir panik.',
        'Saya merasakan kerja jantung saya (berdebar-debar) saat tidak melakukan aktivitas fisik.',
        'Saya merasa ketakutan tanpa alasan yang jelas.',
    ],

    // Kategori hasil nomophobia, diurutkan dari yang paling ringan.
    // score = jumlah skor 20 item NMP-Q (rentang aktual 20-140).
    'nomophobia_categories' => [
        [
            'key' => 'none',
            'badge' => 1,
            'color' => 'green',
            'min' => 20,
            'max' => 20,
            'title' => 'Anda tidak memiliki kecenderungan nomophobia.',
            'body' => [
                'Hasil kuesioner menunjukkan bahwa Anda tidak menunjukkan kecenderungan nomophobia. Tetap pertahankan kebiasaan menggunakan ponsel secara seimbang agar Anda tetap merasa nyaman, baik saat bersama maupun tanpa ponsel.',
            ],
        ],
        [
            'key' => 'mild',
            'badge' => 2,
            'color' => 'yellow',
            'min' => 21,
            'max' => 59,
            'title' => 'Anda mengalami nomophobia ringan.',
            'body' => [
                'Hasil kuesioner menunjukkan bahwa Anda mulai menunjukkan kecenderungan nomophobia pada tingkat ringan. Rasa khawatir atau tidak nyaman saat tidak dapat mengakses ponsel mulai muncul, namun umumnya belum memberikan dampak yang berarti pada aktivitas sehari-hari.',
                'Membiasakan penggunaan ponsel secara bijak dan meluangkan waktu tanpa ponsel dapat membantu mencegah meningkatnya rasa cemas saat tidak dapat mengaksesnya.',
            ],
        ],
        [
            'key' => 'moderate',
            'badge' => 3,
            'color' => 'orange',
            'min' => 60,
            'max' => 99,
            'title' => 'Anda mengalami nomophobia sedang.',
            'body' => [
                'Hasil kuesioner menunjukkan bahwa Anda memiliki kecenderungan nomophobia pada tingkat sedang. Kondisi ini menunjukkan bahwa rasa takut atau tidak nyaman ketika tidak dapat mengakses ponsel mulai dirasakan dalam berbagai situasi dan berpotensi memengaruhi kenyamanan saat menjalani aktivitas sehari-hari.',
                'Membiasakan penggunaan ponsel secara bijak dan meluangkan waktu tanpa ponsel dapat membantu mencegah meningkatnya rasa cemas saat tidak dapat mengaksesnya.',
            ],
        ],
        [
            'key' => 'severe',
            'badge' => 4,
            'color' => 'red',
            'min' => 100,
            'max' => 140,
            'title' => 'Anda mengalami nomophobia berat.',
            'body' => [
                'Hasil kuesioner menunjukkan bahwa Anda memiliki kecenderungan nomophobia pada tingkat berat. Kondisi ini menunjukkan bahwa rasa takut, cemas, atau tidak nyaman ketika tidak dapat mengakses ponsel berpotensi memberikan dampak yang signifikan terhadap aktivitas sehari-hari, konsentrasi, maupun kesejahteraan psikologis.',
                'Jika rasa takut, cemas, atau tidak nyaman saat tidak dapat mengakses ponsel mulai mengganggu aktivitas sehari-hari, pertimbangkan untuk berkonsultasi dengan tenaga kesehatan profesional.',
            ],
        ],
    ],

    // Kategori skor DASS-21 Subskala Depresi (skor mentah 7 item, skala 1-4, rentang 7-28).
    // Batas mengikuti cutoff resmi DASS-21 (0-9/10-13/14-20/21-27/28+) sesuai arahan pengguna.
    'dass_depression_categories' => [
        [
            'key' => 'normal',
            'badge' => 1,
            'color' => 'green',
            'min' => 0,
            'max' => 9,
            'title' => 'Anda tidak menunjukkan gejala depresi bermakna.',
            'body' => [
                'Hasil kuesioner menunjukkan bahwa Anda tidak menunjukkan gejala depresi yang bermakna. Pertahankan dengan menjaga pola hidup sehat serta meluangkan waktu untuk kegiatan yang positif.',
            ],
        ],
        [
            'key' => 'mild',
            'badge' => 2,
            'color' => 'yellow',
            'min' => 10,
            'max' => 13,
            'title' => 'Anda menunjukkan gejala depresi ringan.',
            'body' => [
                'Hasil kuesioner menunjukkan bahwa Anda memiliki gejala depresi pada tingkat ringan. Anda mungkin mulai merasakan kondisi tersebut pada waktu-waktu tertentu. Tetap jaga pola hidup sehat dan luangkan waktu untuk mencurahkan perasaan dan keadaan Anda kepada orang yang dipercaya.',
                'Apabila gejala terus berlangsung atau semakin mengganggu aktivitas sehari-hari, pertimbangkan untuk berkonsultasi dengan tenaga kesehatan profesional.',
            ],
        ],
        [
            'key' => 'moderate',
            'badge' => 3,
            'color' => 'orange',
            'min' => 14,
            'max' => 20,
            'title' => 'Anda menunjukkan gejala depresi sedang.',
            'body' => [
                'Hasil kuesioner menunjukkan bahwa Anda memiliki gejala depresi pada tingkat sedang. Gejala tersebut mungkin mulai memengaruhi aktivitas sehari-hari, pekerjaan, maupun hubungan dengan orang lain.',
                'Apabila gejala terus berlangsung atau semakin mengganggu aktivitas sehari-hari, pertimbangkan untuk berkonsultasi dengan tenaga kesehatan profesional.',
            ],
        ],
        [
            'key' => 'severe',
            'badge' => 4,
            'color' => 'red',
            'min' => 21,
            'max' => 27,
            'title' => 'Anda menunjukkan gejala depresi berat.',
            'body' => [
                'Hasil kuesioner menunjukkan bahwa Anda memiliki gejala depresi pada tingkat berat. Kondisi ini berpotensi memberikan dampak yang signifikan terhadap fungsi sehari-hari dan kualitas hidup.',
                'Disarankan untuk segera berkonsultasi dengan psikolog atau psikiater agar dapat menjalani pemeriksaan lebih lanjut dan penanganan yang sesuai.',
            ],
        ],
        [
            'key' => 'extremely_severe',
            'badge' => 5,
            'color' => 'darkred',
            'min' => 28,
            'max' => 28,
            'title' => 'Anda menunjukkan gejala depresi sangat berat.',
            'body' => [
                'Hasil kuesioner menunjukkan bahwa Anda memiliki gejala depresi pada tingkat sangat berat. Kondisi ini memerlukan perhatian lebih lanjut karena dapat berdampak besar terhadap kesejahteraan dan aktivitas sehari-hari.',
                'Sangat disarankan untuk segera berkonsultasi dengan psikolog atau psikiater agar dapat menjalani pemeriksaan lebih lanjut dan penanganan yang sesuai.',
            ],
        ],
    ],

    // Kategori skor DASS-21 Subskala Kecemasan (skor mentah 7 item, skala 1-4, rentang 7-28).
    // Batas mengikuti cutoff resmi DASS-21 (0-7/8-9/10-14/15-19/20+) sesuai arahan pengguna.
    'dass_anxiety_categories' => [
        [
            'key' => 'normal',
            'badge' => 1,
            'color' => 'green',
            'min' => 0,
            'max' => 7,
            'title' => 'Anda tidak menunjukkan gejala kecemasan bermakna.',
            'body' => [
                'Hasil kuesioner menunjukkan bahwa Anda tidak menunjukkan gejala kecemasan yang bermakna. Pertahankan kondisi ini dengan menjaga keseimbangan aktivitas, istirahat yang cukup, dan menerapkan cara-cara positif dalam menghadapi tekanan sehari-hari.',
            ],
        ],
        [
            'key' => 'mild',
            'badge' => 2,
            'color' => 'yellow',
            'min' => 8,
            'max' => 9,
            'title' => 'Anda menunjukkan gejala kecemasan ringan.',
            'body' => [
                'Hasil kuesioner menunjukkan bahwa Anda memiliki gejala kecemasan pada tingkat ringan. Gejala yang dirasakan mungkin muncul pada situasi tertentu, namun umumnya masih dapat dikelola. Anda dapat mencoba mengenali pemicu kecemasan untuk membantu mengelola gejala yang dirasakan.',
                'Apabila gejala terus berlangsung atau semakin mengganggu aktivitas sehari-hari, pertimbangkan untuk berkonsultasi dengan tenaga kesehatan profesional.',
            ],
        ],
        [
            'key' => 'moderate',
            'badge' => 3,
            'color' => 'orange',
            'min' => 10,
            'max' => 14,
            'title' => 'Anda menunjukkan gejala kecemasan sedang.',
            'body' => [
                'Hasil kuesioner menunjukkan bahwa Anda memiliki gejala kecemasan pada tingkat sedang. Gejala tersebut mulai berpotensi memengaruhi konsentrasi, aktivitas, atau kenyamanan dalam menjalani keseharian.',
                'Apabila gejala terus berlangsung atau semakin mengganggu aktivitas sehari-hari, pertimbangkan untuk berkonsultasi dengan tenaga kesehatan profesional.',
            ],
        ],
        [
            'key' => 'severe',
            'badge' => 4,
            'color' => 'red',
            'min' => 15,
            'max' => 19,
            'title' => 'Anda menunjukkan gejala kecemasan berat.',
            'body' => [
                'Hasil kuesioner menunjukkan bahwa Anda memiliki gejala kecemasan pada tingkat berat. Kondisi ini dapat memberikan dampak yang cukup besar terhadap aktivitas sehari-hari maupun kualitas hidup.',
                'Disarankan untuk segera berkonsultasi dengan psikolog atau psikiater agar dapat menjalani pemeriksaan lebih lanjut dan penanganan yang sesuai.',
            ],
        ],
        [
            'key' => 'extremely_severe',
            'badge' => 5,
            'color' => 'darkred',
            'min' => 20,
            'max' => 28,
            'title' => 'Anda menunjukkan gejala kecemasan sangat berat.',
            'body' => [
                'Hasil kuesioner menunjukkan bahwa Anda memiliki gejala kecemasan pada tingkat sangat berat. Kondisi ini memerlukan perhatian lebih lanjut karena dapat berdampak besar terhadap kesejahteraan dan aktivitas sehari-hari.',
                'Sangat disarankan untuk segera berkonsultasi dengan psikolog atau psikiater agar dapat menjalani pemeriksaan lebih lanjut dan penanganan yang sesuai.',
            ],
        ],
    ],
];
