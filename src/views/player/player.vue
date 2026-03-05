<template>
    <h2 class="hidden">플레이어</h2>
    <section class="container">
        <div class="row top">
            <button>
                <img src="@/assets/images/icon/down-arrow.png" alt="down_button" />
            </button>
            <button>
                <img src="@/assets/images/icon/more.png" alt="more_button" />
            </button>
        </div>
    </section>
    <section class="container album-cover">
        <div class="row player-img">
            <div class="col-1">
                <div class="artist-img">
                    <img src="@/assets/images/player/player-img1.png" alt="player-img1" />
                </div>
            </div>
        </div>
    </section>
    <section class="container color-box">
        <div class="player-info">
            <p class="song-name">오르트구름</p>
            <p class="singer-name">윤하</p>
        </div>
        <div class="music-progress-container">
            <div class="progress-bar">
                <div class="progress-fill"></div>
                <div class="progress-thumb"></div>
            </div>
            <div class="time-display">
                <span class="current-time">0:00</span>
                <span class="total-time">3:37</span>
            </div>
        </div>
        <div class="row player-buttons">
            <div class="col-5 player-buttons-top">
                <button>
                    <img src="@/assets/images/player/repeat.png" alt="repeat-button" />
                </button>
                <button>
                    <img src="@/assets/images/player/prev.png" alt="prev-button" />
                </button>
                <button class="play-pause-button">
                    <img src="@/assets/images/player/play.png" alt="play-button" class="play-pause-img" />
                </button>
                <button>
                    <img src="@/assets/images/player/next.png" alt="next-button" />
                </button>
                <button>
                    <img src="@/assets/images/player/shuffle.png" alt="shuffle-button" />
                </button>
            </div>
        </div>
        <div class="col-3 player-buttons-bottom">
            <button>
                <img src="../../assets/images/player/like.png" alt="like-button" />
            </button>
            <button>
                <span>가사</span>
            </button>
            <button>
                <img src="../../assets/images/player/list.png" alt="list-button" />
            </button>
        </div>
    </section>
</template>

<script>
export default {
    name: 'Player',

    data() {
        return {
            // 설정
            totalDuration: 217,
            currentTime: 0,
            isPlaying: false,
            isDragging: false,
            animationFrameId: null,
            rafId: null,
            lastTime: Date.now(),

            // DOM
            progressFill: null,
            progressThumb: null,
            currentTimeDisplay: null,
            totalTimeDisplay: null,
            progressBar: null,
            playPauseButton: null,
            playPauseImg: null,
            prevButton: null,
            nextButton: null,

            // color
            colorThief: null,
            albumImage: null,
            artistImgBox: null,

            // 이벤트 제거용 핸들러 참조
            _onPlayPauseClick: null,
            _onPrevClick: null,
            _onNextClick: null,
            _onMouseDown: null,
            _onMouseMove: null,
            _onMouseUp: null,
            _onTouchStart: null,
            _onTouchMove: null,
            _onTouchEnd: null,
            _onAlbumLoad: null
        };
    },

    mounted() {
        // ✅ DOM 캐싱
        this.progressFill = document.querySelector('.progress-fill');
        this.progressThumb = document.querySelector('.progress-thumb');
        this.currentTimeDisplay = document.querySelector('.current-time');
        this.totalTimeDisplay = document.querySelector('.total-time');
        this.progressBar = document.querySelector('.progress-bar');
        this.playPauseButton = document.querySelector('.play-pause-button');
        this.playPauseImg = document.querySelector('.play-pause-img');

        const prevImg = document.querySelector('button img[alt="prev-button"]');
        const nextImg = document.querySelector('button img[alt="next-button"]');
        this.prevButton = prevImg ? prevImg.parentElement : null;
        this.nextButton = nextImg ? nextImg.parentElement : null;

        this.albumImage = document.querySelector('.artist-img img');
        this.artistImgBox = document.querySelector('.artist-img');

        // ColorThief는 전역에 로딩돼있다는 가정
        this.colorThief = typeof ColorThief !== 'undefined' ? new ColorThief() : null;

        // ✅ 이벤트 핸들러 정의 + 등록
        this._onPlayPauseClick = () => {
            this.isPlaying = !this.isPlaying;

            if (this.isPlaying) {
                if (this.playPauseImg) {
                    this.playPauseImg.src = '../../assets/images/player/pause.png';
                    this.playPauseImg.alt = 'pause-button';
                }
                this.lastTime = Date.now();
                this.animationFrameId = requestAnimationFrame(this.playMusic);
            } else {
                if (this.playPauseImg) {
                    this.playPauseImg.src = '../../assets/images/player/play.png';
                    this.playPauseImg.alt = 'play-button';
                }
                if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
                this.animationFrameId = null;
            }

            if (this.currentTime >= this.totalDuration) {
                this.currentTime = 0;
                this.updateProgress();
            }
        };

        this._onPrevClick = () => {
            this.currentTime = Math.max(0, this.currentTime - 5);
            this.updateProgress();
        };

        this._onNextClick = () => {
            this.currentTime = Math.min(this.totalDuration, this.currentTime + 5);
            this.updateProgress();
        };

        this._onMouseDown = (e) => {
            this.isDragging = true;
            this.progressBar && this.progressBar.classList.add('dragging');
            this.updateTimeFromClick(e);
        };

        this._onMouseMove = (e) => {
            if (!this.isDragging) return;
            if (this.rafId) cancelAnimationFrame(this.rafId);
            this.rafId = requestAnimationFrame(() => this.updateTimeFromClick(e));
        };

        this._onMouseUp = () => {
            if (!this.isDragging) return;
            this.isDragging = false;
            this.progressBar && this.progressBar.classList.remove('dragging');
            if (this.rafId) cancelAnimationFrame(this.rafId);
            this.rafId = null;
        };

        this._onTouchStart = (e) => {
            this.isDragging = true;
            this.progressBar && this.progressBar.classList.add('dragging');
            this.updateTimeFromTouch(e);
        };

        this._onTouchMove = (e) => {
            if (!this.isDragging) return;
            e.preventDefault();
            if (this.rafId) cancelAnimationFrame(this.rafId);
            this.rafId = requestAnimationFrame(() => this.updateTimeFromTouch(e));
        };

        this._onTouchEnd = () => {
            if (!this.isDragging) return;
            this.isDragging = false;
            this.progressBar && this.progressBar.classList.remove('dragging');
            if (this.rafId) cancelAnimationFrame(this.rafId);
            this.rafId = null;
        };

        if (this.playPauseButton) this.playPauseButton.addEventListener('click', this._onPlayPauseClick);
        if (this.prevButton) this.prevButton.addEventListener('click', this._onPrevClick);
        if (this.nextButton) this.nextButton.addEventListener('click', this._onNextClick);

        if (this.progressBar) this.progressBar.addEventListener('mousedown', this._onMouseDown);
        window.addEventListener('mousemove', this._onMouseMove);
        window.addEventListener('mouseup', this._onMouseUp);

        if (this.progressBar) this.progressBar.addEventListener('touchstart', this._onTouchStart, { passive: true });
        window.addEventListener('touchmove', this._onTouchMove, { passive: false });
        window.addEventListener('touchend', this._onTouchEnd);

        // ✅ 이미지 로딩 시 배경색 적용
        if (this.albumImage) {
            this.albumImage.crossOrigin = 'Anonymous';
            this._onAlbumLoad = () => this.applyBackgroundColor();

            if (this.albumImage.complete) {
                this.applyBackgroundColor();
            } else {
                this.albumImage.addEventListener('load', this._onAlbumLoad);
            }
        }

        // ✅ 초기 설정
        if (this.totalTimeDisplay) this.totalTimeDisplay.textContent = this.formatTime(this.totalDuration);
        this.updateProgress();
    },

    beforeUnmount() {
        // 재생 루프 정리
        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;

        if (this.rafId) cancelAnimationFrame(this.rafId);
        this.rafId = null;

        // 이벤트 제거
        if (this.playPauseButton && this._onPlayPauseClick)
            this.playPauseButton.removeEventListener('click', this._onPlayPauseClick);

        if (this.prevButton && this._onPrevClick) this.prevButton.removeEventListener('click', this._onPrevClick);
        if (this.nextButton && this._onNextClick) this.nextButton.removeEventListener('click', this._onNextClick);

        if (this.progressBar && this._onMouseDown) this.progressBar.removeEventListener('mousedown', this._onMouseDown);
        window.removeEventListener('mousemove', this._onMouseMove);
        window.removeEventListener('mouseup', this._onMouseUp);

        if (this.progressBar && this._onTouchStart)
            this.progressBar.removeEventListener('touchstart', this._onTouchStart);
        window.removeEventListener('touchmove', this._onTouchMove);
        window.removeEventListener('touchend', this._onTouchEnd);

        if (this.albumImage && this._onAlbumLoad) this.albumImage.removeEventListener('load', this._onAlbumLoad);
    },

    methods: {
        // 시간 형식 변환
        formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        },

        // 진행바 업데이트
        updateProgress() {
            if (!this.progressFill || !this.progressThumb || !this.currentTimeDisplay) return;

            const percentage = (this.currentTime / this.totalDuration) * 100;
            const clamped = Math.max(0, Math.min(100, percentage));

            this.progressFill.style.width = clamped + '%';
            this.progressThumb.style.left = clamped + '%';
            this.currentTimeDisplay.textContent = this.formatTime(this.currentTime);
        },

        // 자동 재생 (requestAnimationFrame)
        playMusic() {
            if (this.isPlaying && !this.isDragging) {
                const now = Date.now();
                const delta = (now - this.lastTime) / 1000;
                this.lastTime = now;

                this.currentTime += delta;

                if (this.currentTime >= this.totalDuration) {
                    this.currentTime = this.totalDuration;
                    this.isPlaying = false;

                    if (this.playPauseImg) {
                        this.playPauseImg.src = '../../assets/images/player/play.png';
                        this.playPauseImg.alt = 'play-button';
                    }

                    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
                    this.animationFrameId = null;

                    this.updateProgress();
                    return;
                }

                this.updateProgress();
            }

            if (this.isPlaying) {
                this.animationFrameId = requestAnimationFrame(this.playMusic);
            }
        },

        // 진행바 클릭
        updateTimeFromClick(e) {
            if (!this.progressBar) return;
            const rect = this.progressBar.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const percentage = Math.max(0, Math.min(1, clickX / rect.width));
            this.currentTime = percentage * this.totalDuration;
            this.updateProgress();
        },

        // 진행바 터치
        updateTimeFromTouch(e) {
            if (!this.progressBar) return;
            const rect = this.progressBar.getBoundingClientRect();
            const touch = e.touches[0];
            const touchX = touch.clientX - rect.left;
            const percentage = Math.max(0, Math.min(1, touchX / rect.width));
            this.currentTime = percentage * this.totalDuration;
            this.updateProgress();
        },

        // 중앙 영역에서만 색상 추출
        getColorFromCenter(img) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = img.naturalWidth || img.width;
            canvas.height = img.naturalHeight || img.height;

            ctx.drawImage(img, 0, 0);

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const radius = Math.min(canvas.width, canvas.height) * 0.25;

            const imageData = ctx.getImageData(centerX - radius, centerY - radius, radius * 2, radius * 2);

            let r = 0,
                g = 0,
                b = 0,
                count = 0;

            for (let i = 0; i < imageData.data.length; i += 4) {
                const red = imageData.data[i];
                const green = imageData.data[i + 1];
                const blue = imageData.data[i + 2];

                const diff = Math.abs(red - green) + Math.abs(green - blue) + Math.abs(blue - red);
                if (diff > 30) {
                    r += red;
                    g += green;
                    b += blue;
                    count++;
                }
            }

            if (count === 0) return [220, 180, 120];
            return [Math.floor(r / count), Math.floor(g / count), Math.floor(b / count)];
        },

        // 색상 밝기 조절
        adjustBrightness(r, g, b, factor) {
            return [
                Math.min(255, Math.floor(r * factor)),
                Math.min(255, Math.floor(g * factor)),
                Math.min(255, Math.floor(b * factor))
            ];
        },

        // 색상 적용
        applyBackgroundColor() {
            if (!this.albumImage || !this.artistImgBox) return;

            let r, g, b;

            try {
                [r, g, b] = this.getColorFromCenter(this.albumImage);

                const [topR, topG, topB] = this.adjustBrightness(r, g, b, 1.15);
                const [midR, midG, midB] = this.adjustBrightness(r, g, b, 1.2);
                const [bottomR, bottomG, bottomB] = this.adjustBrightness(r, g, b, 1.25);

                this.artistImgBox.style.background = `
          linear-gradient(
            180deg,
            rgba(${topR}, ${topG}, ${topB}, 0.8) 0%,
            rgba(${midR}, ${midG}, ${midB}, 0.75) 50%,
            rgba(${bottomR}, ${bottomG}, ${bottomB}, 0.8) 100%
          )
        `;

                this.artistImgBox.style.boxShadow = `
          0 20px 60px rgba(${r}, ${g}, ${b}, 0.5),
          0 0 100px rgba(${r}, ${g}, ${b}, 0.3)
        `;
            } catch (error) {
                r = 220;
                g = 180;
                b = 120;

                // ⚠️ 원본 코드에 264/275 같은 255 초과 값이 있어서 255로 보정했어
                this.artistImgBox.style.background = `
          linear-gradient(
            180deg,
            rgba(253, 207, 138, 0.8) 0%,
            rgba(255, 216, 144, 0.75) 50%,
            rgba(255, 225, 150, 0.8) 100%
          )
        `;

                this.artistImgBox.style.boxShadow = `
          0 20px 60px rgba(${r}, ${g}, ${b}, 0.5),
          0 0 100px rgba(${r}, ${g}, ${b}, 0.3)
        `;
            }
        }
    }
};
</script>

<style scoped src="@/assets/styles/pages/player.css"></style>
