-- Menambah kolom NIM pada data sosiodemografi.
-- Nullable dengan sengaja: 29 responden yang sudah mengisi sebelum kolom ini ada
-- tidak punya nilai NIM, dan datanya tidak boleh diubah.
ALTER TABLE submissions ADD COLUMN nim TEXT;
