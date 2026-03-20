<template>
    <main>
        <form class="container" name="signup-info" @submit.prevent="handleSubmit">
            <div class="row">
                <div class="col-1">
                    <h2 class="fw-semibold text-center color-black">
                        <span class="color-key">성별</span>을 알려주세요
                    </h2>
                </div>
            </div>

            <div class="row g-24">
                <label class="col-2 gender" for="female">
                    <p class="fw-semibold color-black font-18">여성</p>
                    <img :src="selectedGender === '여성' ? femaleActive : female" alt="female" />
                    <input
                        type="radio"
                        name="gender"
                        value="여성"
                        id="female"
                        class="hidden"
                        v-model="selectedGender"
                    />
                </label>

                <label for="male" class="col-2 gender">
                    <p class="fw-semibold color-black font-18">남성</p>
                    <img :src="selectedGender === '남성' ? maleActive : male" alt="male" />
                    <input type="radio" name="gender" value="남성" id="male" class="hidden" v-model="selectedGender" />
                </label>
            </div>

            <div class="row g-29">
                <div class="col-1">
                    <h2 class="fw-semibold text-center color-black">
                        <span class="text-center color-key">생년월일</span>을 알려주세요.
                    </h2>
                </div>

                <div class="col-1">
                    <div class="wheel-form">
                        <div class="wheel-card">
                            <div class="wheel-grid color-black">
                                <div class="wheel" ref="yearWheelRef"></div>
                                <div class="wheel" ref="monthWheelRef"></div>
                                <div class="wheel" ref="dayWheelRef"></div>
                                <div class="wheel-highlight"></div>
                            </div>
                        </div>

                        <BaseButton label="음악 들으러 가기" variant="active" @click="handleSubmit" />
                    </div>
                </div>
            </div>
        </form>
    </main>
</template>

<script>
import male from '@/assets/images/signup-info/gender-male.png';
import maleActive from '@/assets/images/signup-info/gender-male-active.png';
import female from '@/assets/images/signup-info/gender-female.png';
import femaleActive from '@/assets/images/signup-info/gender-female-active.png';
import BaseButton from '@/components/ui/BaseButton.vue';

export default {
    name: 'SignupInfoView',
    components: { BaseButton },

    data() {
        return {
            male,
            maleActive,
            female,
            femaleActive,

            selectedGender: '여성',
            selectedYear: null,
            selectedMonth: null,
            selectedDay: null,
            prevYear: null,
            prevMonth: null,

            MAX_YEAR: new Date().getFullYear(),
            scrollTimeouts: new Map(),
            cleanupFns: [],
            _timeouts: new Set(),

            yearWheel: null,
            monthWheel: null,
            dayWheel: null
        };
    },

    mounted() {
        this.yearWheel = this.$refs.yearWheelRef;
        this.monthWheel = this.$refs.monthWheelRef;
        this.dayWheel = this.$refs.dayWheelRef;

        this.init();
    },

    beforeUnmount() {
        this.cleanupFns.forEach((fn) => fn());
        this.cleanupFns = [];

        this.scrollTimeouts.forEach((id) => clearTimeout(id));
        this.scrollTimeouts.clear();

        this._timeouts.forEach((id) => clearTimeout(id));
        this._timeouts.clear();
    },

    methods: {
        addTimeout(fn, ms) {
            const id = setTimeout(fn, ms);
            this._timeouts.add(id);
            return id;
        },

        getVisibleCount() {
            const v = getComputedStyle(document.documentElement).getPropertyValue('--visible').trim();
            const n = Number(v);
            return Number.isFinite(n) && n > 0 ? n : 5;
        },

        getPadCount() {
            return Math.floor(this.getVisibleCount() / 2);
        },

        getItemHeight(wheel) {
            const item = wheel.querySelector('.wheel-item');
            return item ? item.getBoundingClientRect().height : 0;
        },

        buildWheel(wheel, values, formatter = (v) => String(v)) {
            if (!wheel) return;
            wheel.innerHTML = '';

            const PAD = this.getPadCount();

            for (let i = 0; i < PAD; i++) {
                const pad = document.createElement('div');
                pad.className = 'wheel-item wheel-pad';
                pad.dataset.value = '';
                wheel.appendChild(pad);
            }

            for (const v of values) {
                const div = document.createElement('div');
                div.className = 'wheel-item';
                div.textContent = formatter(v);
                div.dataset.value = v;
                wheel.appendChild(div);
            }

            for (let i = 0; i < PAD; i++) {
                const pad = document.createElement('div');
                pad.className = 'wheel-item wheel-pad';
                pad.dataset.value = '';
                wheel.appendChild(pad);
            }
        },

        scrollToValue(wheel, value, smooth = false) {
            if (!wheel) return;
            const item = wheel.querySelector(`[data-value="${value}"]`);
            if (!item) return;

            const itemH = item.getBoundingClientRect().height;
            const targetTop = item.offsetTop - wheel.clientHeight / 2 + itemH / 2;
            wheel.scrollTo({ top: targetTop, behavior: smooth ? 'smooth' : 'auto' });
        },

        getCenterValue(wheel) {
            if (!wheel) return null;
            const items = wheel.querySelectorAll('.wheel-item');
            if (!items.length) return null;

            const itemH = items[0].getBoundingClientRect().height;
            const center = wheel.scrollTop + wheel.clientHeight / 2;

            let closest = null;
            let minDist = Infinity;

            items.forEach((item) => {
                const itemCenter = item.offsetTop + itemH / 2;
                const dist = Math.abs(itemCenter - center);
                if (dist < minDist) {
                    minDist = dist;
                    closest = item;
                }
            });

            const val = closest?.dataset.value;
            return val ? Number(val) : null;
        },

        updateSelected(wheel) {
            if (!wheel) return null;
            const centerValue = this.getCenterValue(wheel);

            wheel.querySelectorAll('.wheel-item').forEach((item) => {
                const v = item.dataset.value ? Number(item.dataset.value) : null;
                item.classList.toggle('is-selected', v === centerValue);
            });

            return centerValue;
        },

        buildYears() {
            const years = [];
            for (let y = 1920; y <= this.MAX_YEAR; y++) years.push(y);
            this.buildWheel(this.yearWheel, years);
        },

        buildMonths() {
            const months = Array.from({ length: 12 }, (_, i) => i + 1);
            this.buildWheel(this.monthWheel, months);
        },

        buildDays(year, month) {
            const lastDay = new Date(year, month, 0).getDate();
            const days = Array.from({ length: lastDay }, (_, i) => i + 1);
            this.buildWheel(this.dayWheel, days);
        },

        updateValues() {
            const y = this.updateSelected(this.yearWheel);
            const m = this.updateSelected(this.monthWheel);
            const d = this.updateSelected(this.dayWheel);

            if (!y || !m) return;

            if (y !== this.prevYear || m !== this.prevMonth) {
                const lastDay = new Date(y, m, 0).getDate();
                this.buildDays(y, m);

                const fixedDay = Math.min(d || 1, lastDay);
                this.scrollToValue(this.dayWheel, fixedDay, false);
                this.updateSelected(this.dayWheel);

                this.prevYear = y;
                this.prevMonth = m;
            }

            this.selectedYear = y;
            this.selectedMonth = m;
            this.selectedDay = this.updateSelected(this.dayWheel);
        },

        handleScroll(wheel) {
            this.updateSelected(wheel);

            clearTimeout(this.scrollTimeouts.get(wheel));
            this.scrollTimeouts.set(
                wheel,
                setTimeout(() => {
                    this.updateValues();
                }, 100)
            );
        },

        rebuildAllKeepSelection() {
            const y = this.selectedYear;
            const m = this.selectedMonth;
            const d = this.selectedDay;

            if (!y || !m || !d) return;

            this.buildYears();
            this.buildMonths();
            this.buildDays(y, m);

            this.scrollToValue(this.yearWheel, y, false);
            this.scrollToValue(this.monthWheel, m, false);
            this.scrollToValue(this.dayWheel, d, false);

            this.updateValues();
        },

        attachWheelStepScroll(wheel) {
            let locked = false;

            const handler = (e) => {
                e.preventDefault();
                if (locked) return;
                locked = true;

                const itemH = this.getItemHeight(wheel) || 51;
                const dir = Math.sign(e.deltaY);
                wheel.scrollBy({ top: dir * itemH, behavior: 'smooth' });

                this.addTimeout(() => {
                    locked = false;
                }, 140);
            };

            wheel.addEventListener('wheel', handler, { passive: false });
            return () => wheel.removeEventListener('wheel', handler);
        },

        attachDragPickerWithInertia(wheel) {
            let isDown = false;
            let startY = 0;
            let startScrollTop = 0;
            let lastY = 0;
            let lastT = 0;
            let velocity = 0;
            let rafId = null;

            const stopInertia = () => {
                if (rafId) cancelAnimationFrame(rafId);
                rafId = null;
            };

            const snapToNearest = (smooth = true) => {
                wheel.style.scrollSnapType = 'y mandatory';
                const v = this.getCenterValue(wheel);
                if (v != null) this.scrollToValue(wheel, v, smooth);
                this.addTimeout(() => this.updateValues(), 220);
            };

            const onDown = (clientY) => {
                isDown = true;
                wheel.classList.add('is-dragging');
                stopInertia();

                wheel.style.scrollSnapType = 'none';
                startY = clientY;
                startScrollTop = wheel.scrollTop;

                lastY = clientY;
                lastT = performance.now();
                velocity = 0;
            };

            const onMove = (clientY) => {
                if (!isDown) return;

                const dy = clientY - startY;
                wheel.scrollTop = startScrollTop - dy;

                const now = performance.now();
                const dt = now - lastT;
                if (dt > 0) {
                    velocity = (clientY - lastY) / dt;
                    lastY = clientY;
                    lastT = now;
                }
            };

            const onUp = () => {
                if (!isDown) return;
                isDown = false;
                wheel.classList.remove('is-dragging');
                startInertia(-velocity);
            };

            const startInertia = (v0) => {
                const friction = 0.0042;
                let v = v0;

                if (Math.abs(v) < 0.05) {
                    snapToNearest(true);
                    return;
                }

                let prev = performance.now();

                const tick = (t) => {
                    const dt = t - prev;
                    prev = t;

                    wheel.scrollTop += v * dt;

                    const sign = Math.sign(v);
                    v -= sign * friction * dt;
                    if (Math.sign(v) !== sign) v = 0;

                    if (Math.abs(v) > 0) {
                        rafId = requestAnimationFrame(tick);
                    } else {
                        rafId = null;
                        snapToNearest(true);
                    }
                };

                rafId = requestAnimationFrame(tick);
            };

            const onMouseDown = (e) => {
                e.preventDefault();
                window.addEventListener('mousemove', onMouseMove);
                window.addEventListener('mouseup', onMouseUp);
                onDown(e.clientY);
            };
            const onMouseMove = (e) => onMove(e.clientY);
            const onMouseUp = () => {
                onUp();
                window.removeEventListener('mousemove', onMouseMove);
                window.removeEventListener('mouseup', onMouseUp);
            };

            const onTouchStart = (e) => onDown(e.touches[0].clientY);
            const onTouchMove = (e) => {
                if (!isDown) return;
                e.preventDefault();
                onMove(e.touches[0].clientY);
            };
            const onTouchEnd = () => onUp();

            wheel.addEventListener('mousedown', onMouseDown);

            wheel.addEventListener('touchstart', onTouchStart, { passive: true });
            wheel.addEventListener('touchmove', onTouchMove, { passive: false });
            wheel.addEventListener('touchend', onTouchEnd, { passive: true });
            wheel.addEventListener('touchcancel', onTouchEnd, { passive: true });

            return () => {
                wheel.removeEventListener('mousedown', onMouseDown);
                window.removeEventListener('mousemove', onMouseMove);
                window.removeEventListener('mouseup', onMouseUp);

                wheel.removeEventListener('touchstart', onTouchStart);
                wheel.removeEventListener('touchmove', onTouchMove);
                wheel.removeEventListener('touchend', onTouchEnd);
                wheel.removeEventListener('touchcancel', onTouchEnd);

                stopInertia();
            };
        },

        init() {
            this.buildYears();
            this.buildMonths();

            const today = new Date();
            this.selectedYear = today.getFullYear();
            this.selectedMonth = today.getMonth() + 1;
            this.selectedDay = today.getDate();

            this.prevYear = this.selectedYear;
            this.prevMonth = this.selectedMonth;

            this.buildDays(this.selectedYear, this.selectedMonth);

            this.scrollToValue(this.yearWheel, this.selectedYear, false);
            this.scrollToValue(this.monthWheel, this.selectedMonth, false);
            this.scrollToValue(this.dayWheel, this.selectedDay, false);

            [this.yearWheel, this.monthWheel, this.dayWheel].forEach((wheel) => {
                const c1 = this.attachWheelStepScroll(wheel);
                const c2 = this.attachDragPickerWithInertia(wheel);
                this.cleanupFns.push(c1, c2);

                const scrollHandler = () => this.handleScroll(wheel);
                wheel.addEventListener('scroll', scrollHandler, { passive: true });
                this.cleanupFns.push(() => wheel.removeEventListener('scroll', scrollHandler));
            });

            const onResize = () => this.rebuildAllKeepSelection();
            window.addEventListener('resize', onResize);
            this.cleanupFns.push(() => window.removeEventListener('resize', onResize));

            this.addTimeout(() => this.updateValues(), 0);
        },

        handleSubmit() {
            if (!this.selectedYear || !this.selectedMonth || !this.selectedDay) {
                alert('날짜를 선택해주세요.');
                return;
            }

            alert(
                `선택값: ${this.selectedYear}년 ${this.selectedMonth}월 ${this.selectedDay}일, ${this.selectedGender}`
            );

            this.$router.push('/main');
        }
    }
};
</script>

<style scoped src="@/assets/styles/pages/OnboardingFlow/signup-info-view.css"></style>
