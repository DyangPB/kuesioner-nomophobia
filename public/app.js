const nmpqScaleEntries = Object.entries(nmpqScale).map(([value, label]) => ({ value: Number(value), label }));
const dassScaleEntries = Object.entries(dassScale).map(([value, label]) => ({ value: Number(value), label }));

document.addEventListener('alpine:init', () => {
    Alpine.data('questionnaireApp', () => ({
        step: 0,
        steps: ['landing', 'info', 'consent', 'biodata', 'nmpq', 'dass_depression', 'dass_anxiety', 'result'],

        submitting: false,
        submitError: '',
        results: null,
        carouselIndex: 0,
        carouselSlides: ['nmpq', 'dass_depression', 'dass_anxiety'],
        touchStartX: null,
        showInfografis: false,

        nmpqItems,
        dassDepressionItems,
        dassAnxietyItems,
        nmpqScaleEntries,
        dassScaleEntries,

        form: {
            name: '',
            age_group: '',
            gender: '',
            cohort: '',
            other_device: '',
            phone_activity: '',
            daily_usage: '',
            screentime_image: null,
            nmpq: Array(nmpqItems.length).fill(null),
            dass_depression: Array(dassDepressionItems.length).fill(null),
            dass_anxiety: Array(dassAnxietyItems.length).fill(null),
        },

        screentimePreviewName: '',

        get currentStepName() {
            return this.steps[this.step];
        },

        get activeCarouselCategory() {
            if (!this.results) return null;
            const slide = this.carouselSlides[this.carouselIndex];
            return this.results[slide];
        },

        get prevCarouselCategory() {
            if (!this.results) return null;
            const i = (this.carouselIndex - 1 + this.carouselSlides.length) % this.carouselSlides.length;
            return this.results[this.carouselSlides[i]];
        },

        get nextCarouselCategory() {
            if (!this.results) return null;
            const i = (this.carouselIndex + 1) % this.carouselSlides.length;
            return this.results[this.carouselSlides[i]];
        },

        carouselNext() {
            this.carouselIndex = (this.carouselIndex + 1) % this.carouselSlides.length;
        },

        carouselPrev() {
            this.carouselIndex = (this.carouselIndex - 1 + this.carouselSlides.length) % this.carouselSlides.length;
        },

        goToCarouselSlide(index) {
            this.carouselIndex = index;
        },

        onTouchStart(event) {
            this.touchStartX = event.touches[0].clientX;
        },

        onTouchEnd(event) {
            if (this.touchStartX === null) return;
            const deltaX = event.changedTouches[0].clientX - this.touchStartX;
            const threshold = 40;
            if (deltaX > threshold) {
                this.carouselPrev();
            } else if (deltaX < -threshold) {
                this.carouselNext();
            }
            this.touchStartX = null;
        },

        goTo(name) {
            const idx = this.steps.indexOf(name);
            if (idx !== -1) {
                this.step = idx;
                window.scrollTo({ top: 0, behavior: 'instant' });
            }
        },

        next() {
            if (!this.validateCurrentStep()) {
                return;
            }

            if (this.currentStepName === 'dass_anxiety') {
                this.submit();
                return;
            }

            this.step = Math.min(this.step + 1, this.steps.length - 1);
            window.scrollTo({ top: 0, behavior: 'instant' });
        },

        back() {
            this.step = Math.max(this.step - 1, 0);
            window.scrollTo({ top: 0, behavior: 'instant' });
        },

        restart() {
            window.location.href = '/';
        },

        selectOption(group, index, value) {
            this.form[group][index] = value;
        },

        isSelected(group, index, value) {
            return this.form[group][index] === value;
        },

        onFileChange(event) {
            const file = event.target.files[0] || null;
            this.form.screentime_image = file;
            this.screentimePreviewName = file ? file.name : '';
        },

        onFileDrop(event) {
            const file = event.dataTransfer.files[0] || null;
            if (file && !['image/jpeg', 'image/png'].includes(file.type)) {
                this.submitError = 'File harus berformat jpg atau png.';
                return;
            }
            this.form.screentime_image = file;
            this.screentimePreviewName = file ? file.name : '';
        },

        validateCurrentStep() {
            this.submitError = '';

            switch (this.currentStepName) {
                case 'biodata':
                    if (!this.form.age_group || !this.form.gender || !this.form.cohort ||
                        !this.form.other_device || !this.form.phone_activity || !this.form.daily_usage) {
                        this.submitError = 'Mohon lengkapi semua pertanyaan sebelum melanjutkan.';
                        return false;
                    }
                    return true;

                case 'nmpq':
                    if (this.form.nmpq.some((v) => v === null)) {
                        this.submitError = 'Mohon jawab semua pertanyaan sebelum melanjutkan.';
                        return false;
                    }
                    return true;

                case 'dass_depression':
                    if (this.form.dass_depression.some((v) => v === null)) {
                        this.submitError = 'Mohon jawab semua pertanyaan sebelum melanjutkan.';
                        return false;
                    }
                    return true;

                case 'dass_anxiety':
                    if (this.form.dass_anxiety.some((v) => v === null)) {
                        this.submitError = 'Mohon jawab semua pertanyaan sebelum melanjutkan.';
                        return false;
                    }
                    return true;

                default:
                    return true;
            }
        },

        async submit() {
            this.submitting = true;
            this.submitError = '';

            const payload = new FormData();
            payload.append('name', this.form.name || '');
            payload.append('age_group', this.form.age_group);
            payload.append('gender', this.form.gender);
            payload.append('cohort', this.form.cohort);
            payload.append('other_device', this.form.other_device);
            payload.append('phone_activity', this.form.phone_activity);
            payload.append('daily_usage', this.form.daily_usage);
            if (this.form.screentime_image) {
                payload.append('screentime_image', this.form.screentime_image);
            }
            this.form.nmpq.forEach((v, i) => payload.append(`nmpq_answers[${i}]`, v));
            this.form.dass_depression.forEach((v, i) => payload.append(`dass_depression_answers[${i}]`, v));
            this.form.dass_anxiety.forEach((v, i) => payload.append(`dass_anxiety_answers[${i}]`, v));

            try {
                const response = await fetch('/submit', {
                    method: 'POST',
                    headers: { Accept: 'application/json' },
                    body: payload,
                });

                if (!response.ok) {
                    const data = await response.json().catch(() => ({}));
                    throw new Error(data.message || 'Terjadi kesalahan saat mengirim kuesioner.');
                }

                const data = await response.json();
                const findCategory = (list, key) => list.find((c) => c.key === key);

                this.results = {
                    nmpq: findCategory(nomophobiaCategories, data.nomophobia_category),
                    dass_depression: findCategory(dassDepressionCategories, data.dass_depression_category),
                    dass_anxiety: findCategory(dassAnxietyCategories, data.dass_anxiety_category),
                };
                this.carouselIndex = 0;
                await new Promise((resolve) => setTimeout(resolve, 3000));
                this.goTo('result');
            } catch (err) {
                this.submitError = err.message || 'Terjadi kesalahan saat mengirim kuesioner. Silakan coba lagi.';
            } finally {
                this.submitting = false;
            }
        },
    }));
});
