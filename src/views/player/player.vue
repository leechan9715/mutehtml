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
                <div class="artist-img" ref="artistImgBox">
                    <img
                        :src="albumCover"
                        alt="player-img1"
                        crossorigin="anonymous"
                        ref="albumImage"
                        @load="handleAlbumLoad"
                    />
                </div>
            </div>
        </div>
    </section>

    <section class="container color-box">
        <div class="player-info">
            <p class="song-name">{{ songName }}</p>
            <p class="singer-name">{{ singerName }}</p>
        </div>

        <audio ref="audio" :src="audioSrc[currentIndex]?.previewUrl" preload="metadata"></audio>

        <div class="music-progress-container">
            <div class="progress-bar">
                <div class="progress-fill"></div>
                <div class="progress-thumb"></div>
            </div>
            <div class="time-display">
                <span class="current-time">{{ formatTime(currentTime) }}</span>
                <span class="total-time">{{ formatTime(totalDuration) }}</span>
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
                    <img
                        :src="isPlaying ? pause : play"
                        :alt="isPlaying ? 'pause-button' : 'play-button'"
                        class="play-pause-img"
                    />
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
import pause from '@/assets/images/player/pause.png';
import play from '@/assets/images/player/play.png';

import { $api } from '@/mixins/mixins.js';

export default {
    name: 'Player',

    data() {
        return {
            pause,
            play,

            terms: '',
            audioSrc: [],
            currentIndex: 0,
            songName: '곡 제목',
            singerName: '가수명',
            albumCover: null,

            totalDuration: 0,
            currentTime: 0,
            isPlaying: false,
            isDragging: false,
            rafId: null,

            progressFill: null,
            progressThumb: null,
            currentTimeDisplay: null,
            totalTimeDisplay: null,
            progressBar: null,
            playPauseButton: null,
            playPauseImg: null,
            prevButton: null,
            nextButton: null,

            colorThief: null,
            albumImage: null,
            artistImgBox: null,

            _onPlayPauseClick: null,
            _onPrevClick: null,
            _onNextClick: null,
            _onMouseDown: null,
            _onMouseMove: null,
            _onMouseUp: null,
            _onTouchStart: null,
            _onTouchMove: null,
            _onTouchEnd: null,
            _onAlbumLoad: null,

            _onLoadedMetadata: null,
            _onTimeUpdate: null,
            _onEnded: null
        };
    },
    methods: {
        async initSongData() {}
    },

    async mounted() {
        // URL 쿼리스트링에서 검색어(term) 가져오기
        // 예: /player?term=아이유
        this.terms = this.$route.query.term?.trim() || '';

        // 검색어가 있을 때만 실행
        if (this.terms) {
            // iTunes API로 노래 1개 검색
            const result = await $api('https://itunes.apple.com/search', 'GET', {
                term: this.terms, // 사용자가 입력한 검색어
                country: 'KR', // 한국 기준 검색
                media: 'music', // 음악만 검색
                entity: 'song', // 곡 단위로 검색
                limit: 1 // 첫 번째 결과만 가져오기
            });

            // 검색 결과에서 첫 번째 곡 꺼내기
            const song = result?.results?.[0];

            // 곡 정보가 있을 때만 실행
            if (song) {
                // 미리듣기 오디오 주소 저장
                this.audioSrc.splice(this.currentIndex + 1, 0, {
                    previewUrl: song.previewUrl,
                    artistName: song.artistName,
                    trackName: song.trackName
                });

                // 곡 제목 저장
                this.songName = song.trackName;

                // 가수 이름 저장
                this.singerName = song.artistName;

                // Last.fm API 키
                const LASTFM_API_KEY = process.env.VUE_APP_LASTFM_API_KEY;

                // Last.fm API 기본 주소
                const LASTFM_BASE_URL = 'https://ws.audioscrobbler.com/2.0/';

                // Last.fm에서 앨범 정보 조회
                const result = await $api(LASTFM_BASE_URL, 'GET', {
                    method: 'album.getinfo', // 앨범 정보 가져오기
                    api_key: LASTFM_API_KEY, // 발급받은 API 키
                    artist: this.singerName, // 가수명
                    album: this.songName, // 현재는 곡 제목이 들어가고 있음
                    format: 'json', // JSON 형식으로 받기
                    autocorrect: 1 // 오타 자동 보정
                });

                // 앨범 이미지 배열 가져오기
                // result.album.image 안에 small, medium, large 같은 이미지 목록이 들어있음
                const images = result?.album?.image || [];

                // 가장 큰 이미지부터 순서대로 찾기
                // mega -> extralarge -> large -> medium -> small
                // '#text' 안에 실제 이미지 URL이 들어있음
                const biggestImage =
                    images.find((img) => img.size === 'mega' && img['#text']?.trim())?.['#text'] ||
                    images.find((img) => img.size === 'extralarge' && img['#text']?.trim())?.['#text'] ||
                    images.find((img) => img.size === 'large' && img['#text']?.trim())?.['#text'] ||
                    images.find((img) => img.size === 'medium' && img['#text']?.trim())?.['#text'] ||
                    images.find((img) => img.size === 'small' && img['#text']?.trim())?.['#text'] ||
                    '';

                // Last.fm 큰 이미지가 있으면 그걸 사용
                // 없으면 iTunes 기본 앨범 이미지 사용
                this.albumCover = biggestImage || song.artworkUrl100 || '';
            }
            const track = await $api('https://itunes.apple.com/search', 'GET', {
                term: this.singerName,
                country: 'KR',
                media: 'music',
                entity: 'song',
                limit: 100
            });

            const tracks = track.results.map((list) => ({
                previewUrl: list.previewUrl,
                artistName: list.artistName,
                trackName: list.trackName,
                albumCover: list.artworkUrl100
            }));

            if (tracks) {
                this.audioSrc.splice(1, 0, ...tracks);
                console.log(this.audioSrc);
            }
        }

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

        this.albumImage = this.$refs.albumImage;
        this.artistImgBox = this.$refs.artistImgBox;

        this.colorThief = typeof ColorThief !== 'undefined' ? new ColorThief() : null;

        const audio = this.$refs.audio;

        this._onLoadedMetadata = () => {
            this.totalDuration = audio.duration || 0;
            this.updateProgress();
        };

        this._onTimeUpdate = () => {
            if (this.isDragging) return;
            this.currentTime = audio.currentTime || 0;
            this.updateProgress();
        };

        this._onEnded = async () => {
            this.isPlaying = false;
            this.currentTime = 0;
            this.updateProgress();
            this.currentIndex++;
            this.songName = this.audioSrc[this.currentIndex].trackName;
            this.singerName = this.audioSrc[this.currentIndex].artistName;
            const keyword = `${this.audioSrc[this.currentIndex].artistName}${this.audioSrc[this.currentIndex].trackName}`;
            console.log(keyword);
            const result = await $api('https://itunes.apple.com/search', 'GET', {
                term: keyword, // 사용자가 입력한 검색어
                country: 'KR', // 한국 기준 검색
                media: 'music', // 음악만 검색
                entity: 'song', // 곡 단위로 검색
                limit: 1 // 첫 번째 결과만 가져오기
            });
            const nextAlbumCover = result.results[0]?.artworkUrl100;
            this.albumCover = nextAlbumCover;
            await this.$nextTick();
            audio.play();
            this.isPlaying = true;
        };

        if (audio) {
            audio.addEventListener('loadedmetadata', this._onLoadedMetadata);
            audio.addEventListener('timeupdate', this._onTimeUpdate);
            audio.addEventListener('ended', this._onEnded);

            if (this.audioSrc) {
                audio.load();
            }
        }

        this._onPlayPauseClick = async () => {
            const audio = this.$refs.audio;
            if (!audio || !this.audioSrc) return;

            if (audio.paused) {
                try {
                    await audio.play();
                    this.isPlaying = true;
                } catch (error) {
                    console.log('재생 실패:', error);
                }
            } else {
                audio.pause();
                this.isPlaying = false;
            }
        };

        this._onPrevClick = () => {
            const audio = this.$refs.audio;
            if (!audio) return;

            audio.currentTime = Math.max(0, audio.currentTime - 5);
            this.currentTime = audio.currentTime;
            this.updateProgress();
        };

        this._onNextClick = () => {
            const audio = this.$refs.audio;
            if (!audio) return;

            audio.currentTime = Math.min(audio.duration || this.totalDuration, audio.currentTime + 5);
            this.currentTime = audio.currentTime;
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

        this.updateProgress();
    },

    beforeUnmount() {
        const audio = this.$refs.audio;

        if (this.rafId) cancelAnimationFrame(this.rafId);
        this.rafId = null;

        if (audio && this._onLoadedMetadata) {
            audio.removeEventListener('loadedmetadata', this._onLoadedMetadata);
        }
        if (audio && this._onTimeUpdate) {
            audio.removeEventListener('timeupdate', this._onTimeUpdate);
        }
        if (audio && this._onEnded) {
            audio.removeEventListener('ended', this._onEnded);
        }

        if (this.playPauseButton && this._onPlayPauseClick) {
            this.playPauseButton.removeEventListener('click', this._onPlayPauseClick);
        }

        if (this.prevButton && this._onPrevClick) {
            this.prevButton.removeEventListener('click', this._onPrevClick);
        }

        if (this.nextButton && this._onNextClick) {
            this.nextButton.removeEventListener('click', this._onNextClick);
        }

        if (this.progressBar && this._onMouseDown) {
            this.progressBar.removeEventListener('mousedown', this._onMouseDown);
        }

        window.removeEventListener('mousemove', this._onMouseMove);
        window.removeEventListener('mouseup', this._onMouseUp);

        if (this.progressBar && this._onTouchStart) {
            this.progressBar.removeEventListener('touchstart', this._onTouchStart);
        }

        window.removeEventListener('touchmove', this._onTouchMove);
        window.removeEventListener('touchend', this._onTouchEnd);

        if (this.albumImage && this._onAlbumLoad) {
            this.albumImage.removeEventListener('load', this._onAlbumLoad);
        }
    },

    methods: {
        formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        },

        updateProgress() {
            if (!this.progressFill || !this.progressThumb) return;

            const duration = this.totalDuration || 0;
            const percentage = duration > 0 ? (this.currentTime / duration) * 100 : 0;
            const clamped = Math.max(0, Math.min(100, percentage));

            this.progressFill.style.width = clamped + '%';
            this.progressThumb.style.left = clamped + '%';
        },

        updateTimeFromClick(e) {
            if (!this.progressBar) return;
            const audio = this.$refs.audio;
            if (!audio || !audio.duration) return;

            const rect = this.progressBar.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const percentage = Math.max(0, Math.min(1, clickX / rect.width));

            audio.currentTime = percentage * audio.duration;
            this.currentTime = audio.currentTime;
            this.updateProgress();
        },

        updateTimeFromTouch(e) {
            if (!this.progressBar) return;
            const audio = this.$refs.audio;
            if (!audio || !audio.duration) return;

            const rect = this.progressBar.getBoundingClientRect();
            const touch = e.touches[0];
            const touchX = touch.clientX - rect.left;
            const percentage = Math.max(0, Math.min(1, touchX / rect.width));

            audio.currentTime = percentage * audio.duration;
            this.currentTime = audio.currentTime;
            this.updateProgress();
        },

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

        adjustBrightness(r, g, b, factor) {
            return [
                Math.min(255, Math.floor(r * factor)),
                Math.min(255, Math.floor(g * factor)),
                Math.min(255, Math.floor(b * factor))
            ];
        },

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
        },
        handleAlbumLoad() {
            this.applyBackgroundColor();
        }
    }
};
</script>

<style scoped src="@/assets/styles/pages/player.css"></style>
