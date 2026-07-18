CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    -- Sosiodemografi
    name TEXT,
    age_group TEXT NOT NULL,
    gender TEXT NOT NULL,
    cohort TEXT NOT NULL,
    other_device TEXT NOT NULL,
    phone_activity TEXT NOT NULL,
    daily_usage TEXT NOT NULL,
    screentime_image_path TEXT,

    -- NMP-Q (20 item, skala 1-7), disimpan sebagai JSON string
    nmpq_answers TEXT NOT NULL,
    nmpq_score INTEGER NOT NULL,
    nomophobia_category TEXT NOT NULL,

    -- DASS-21 Subskala Depresi (7 item, skala 1-4)
    dass_depression_answers TEXT NOT NULL,
    dass_depression_score INTEGER NOT NULL,
    dass_depression_category TEXT NOT NULL,

    -- DASS-21 Subskala Kecemasan (7 item, skala 1-4)
    dass_anxiety_answers TEXT NOT NULL,
    dass_anxiety_score INTEGER NOT NULL,
    dass_anxiety_category TEXT NOT NULL,

    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
