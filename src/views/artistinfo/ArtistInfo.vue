<template>
    <h2 class="hidden">아티스트 소개</h2>

    <section class="container">
        <div class="row">
            <div class="col-1 artist-info">
                <div class="artist_img">
                    <img src="../../assets/images/artist-info/artist-img/artist_rose.png" alt="artist_rose" />
                </div>
                <p class="artist-name">Rosé</p>
                <p class="artist-type">솔로가수 · 아티스트</p>
                <p class="artist-fame">28,915,071 명이 응원합니다</p>
            </div>
        </div>

        <div class="icon-toggle-wrap">
            <button
                v-for="item in buttons"
                :key="item.id"
                class="icon-btn"
                :class="{
                    active: item.id !== 'menu' && activeButtons[item.id],
                    'menu-btn': item.id === 'menu'
                }"
                @click="handleIconClick(item)"
            >
                <span
                    class="material-symbols-outlined"
                    :class="{
                        pop: item.id === 'like' && likeAnimating
                    }"
                    :style="getIconStyle(item)"
                >
                    {{ item.icon }}
                </span>
            </button>
        </div>
    </section>

    <div style="padding: 16px">
        <MainContainer title="싱글 · 앨범" @click="goNext">
            <Swiper class="song-swiper" :slides-per-view="3.2" :space-between="16">
                <SwiperSlide v-for="(song, i) in songs" :key="i">
                    <SongCard :title="song.title" :artist="song.artist" :coverImage="song.cover" />
                </SwiperSlide>
            </Swiper>
        </MainContainer>
    </div>
</template>

<script>
import album1 from '@/assets/images/artist-info/album1.png';
import album2 from '@/assets/images/artist-info/album2.png';
import album3 from '@/assets/images/artist-info/album3.png';
import album4 from '@/assets/images/artist-info/album4.png';

import MainContainer from '@/components/ui/main-section-top.vue';
import SongCard from '@/components/ui/main-album-component.vue';

import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';

export default {
    name: 'TestView',
    components: { MainContainer, SongCard, Swiper, SwiperSlide },

    data() {
        return {
            likeAnimating: false,

            buttons: [
                { id: 'like', icon: 'favorite' },
                { id: 'music', icon: 'queue_music' },
                { id: 'menu', icon: 'more_vert' }
            ],

            activeButtons: {
                like: false,
                music: false
            },

            songs: [
                { title: 'On The Ground', artist: 'Single · Rosé', cover: album1 },
                { title: 'Gone', artist: 'Single · Rosé', cover: album1 },
                { title: 'APT', artist: 'Single · Rosé', cover: album2 },
                { title: 'R', artist: 'Album · Rosé', cover: album3 },
                { title: 'Rosie', artist: 'Album · Rosé', cover: album4 }
            ]
        };
    },

    methods: {
        goNext() {
            console.log('헤더 클릭!');
        },

        handleIconClick(item) {
            if (item.id === 'menu') {
                return;
            }

            if (item.id === 'like') {
                this.activeButtons.like = !this.activeButtons.like;

                if (this.activeButtons.like) {
                    alert('해당 가수를 응원합니다!');
                }

                this.likeAnimating = false;
                this.$nextTick(() => {
                    this.likeAnimating = true;
                });

                setTimeout(() => {
                    this.likeAnimating = false;
                }, 350);
            }

            if (item.id === 'music') {
                this.activeButtons.music = !this.activeButtons.music;

                if (this.activeButtons.music) {
                    alert('라이브러리에 저장했습니다!');
                }
            }
        },

        getIconStyle(item) {
            if (item.id === 'menu') {
                return {};
            }

            if (item.id === 'like') {
                return {
                    fontVariationSettings: this.activeButtons.like ? "'FILL' 1" : "'FILL' 0"
                };
            }

            return {};
        }
    }
};
</script>

<style scoped src="@/assets/styles/pages/artistinfo.css"></style>
