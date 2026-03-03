<template>
    <a href="javascript:void(0)" class="col-2" v-for="(track, index) in tracks" :key="index">
        <img :src="track.img" alt="album_cover1" width="80" />
        <div class="col-2 type">
            <div class="music-singer">
                <p>{{ track.title }}</p>
                <p>{{ track.singer }}</p>
            </div>
            <p>⁝</p>
        </div>
    </a>
</template>

<script>
import trackImg from '@/assets/images/playlist/1.png';
export default {
    name: 'PlayListItem',
    data() {
        return {
            trackImg,
            tracks: Array.from({ length: 12 }, () => ({
                img: trackImg,
                title: '404(New Era)',
                singer: 'KiiiKiii (키키) / 2:59'
            }))
        };
    }
};
</script>

<style scoped>
.col-2 {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 10px;
}

.col-2 img {
    border-radius: 5px;
    border: 1px solid #bbd1ff;
}

.type {
    width: 100%;
    display: flex;
    border-radius: 5px;
    font-weight: 600;
    padding: 20px;
}

.type .music-singer p:first-child {
    font-size: var(--font-16);
}

.type .music-singer p:last-child {
    font-size: var(--font-14);
    padding-top: 5px;
    color: #737886;
}

.type > p {
    margin-left: auto;
    font-size: var(--font-24);
    line-height: 45px;
    cursor: pointer;
    align-self: center;
}
</style>
