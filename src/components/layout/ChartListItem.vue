<template>
    <a href="javascript:void(0)" class="col-2" v-for="(track, index) in tracks" :key="index">
        <img :src="track.img" alt="album_cover1" width="80" />
        <div class="col-3">
            <div class="upDown">2<br /><span class="up">▴</span></div>
            <div class="music-singer">
                <p>{{ track.title }}</p>
                <p>{{ track.singer }}</p>
            </div>
            <p>⁝</p>
        </div>
    </a>
</template>

<script>
import trackImg from '@/assets/images/chart/1.png';
export default {
    name: 'ChartListItem',
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
    align-items: center;
    padding-bottom: 20px;
}

.col-2 img {
    border-radius: 10px;
    border: 2px solid #ffffff;
    box-shadow: 0px 2px 4px #58648d;
}

.col-3 {
    width: 100%;
    display: flex;
    padding: 20px 0;
    margin-left: 20px;
}

.col-3 .upDown {
    width: 30px;
    text-align: center;
    margin-right: 20px;
    font-weight: var(--fw-600);
}
.up {
    display: inline-block;
    color: rgb(40, 176, 255);
}

.down {
    display: inline-block;
    color: rgb(255, 40, 40);
}

.col-3 .music-singer p:first-child {
    font-size: var(--font-16);
}

.col-3 .music-singer p:last-child {
    font-size: var(--font-16);
    padding-top: 5px;
    color: #737886;
}

.col-3 > p {
    margin-left: auto;
    margin-right: 20px;
    font-size: var(--font-24);
    align-self: center;
}
</style>
