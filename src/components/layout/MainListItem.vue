<template>
    <a href="javascript:void(0)" class="col-2" v-for="(track, index) in tracks" :key="index">
        <img :src="track.img" alt="album_cover1" />
        <div class="box col-2">
            <div class="artist-name-box">
                <p>{{ track.title }}</p>
                <p>{{ track.singer }}</p>
            </div>
            <p class="more-btn">⁝</p>
        </div>
    </a>
</template>

<script>
import trackImg from '@/assets/images/main/1.png';
export default {
    name: 'MainListItem',
    data() {
        return {
            trackImg,
            tracks: Array.from({ length: 10 }, () => ({
                img: trackImg,
                title: '404(New Era)',
                singer: 'KiiiKiii (키키) / 2:59'
            }))
        };
    }
};
</script>

<style scoped>
a > img {
    border-radius: 5px;
    width: 80px;
}

.col-2 {
    width: 100%;
    display: flex;
    justify-content: space-between;
}

.box {
    display: flex;
    align-items: center;
    margin-left: 20px;
    padding: 15px 20px;
    border-radius: 5px;
    border: 1px solid #bbd1ff;
    background: #ffffff;
}
.box .artist-name-box p:first-child {
    font-size: var(--font-16);
    color: var(--color-black);
    margin-bottom: 5px;
}

.box .artist-name-box p:last-child {
    font-size: var(--font-14);
    color: #737886;
}
.box .more-btn {
    font-size: var(--font-24);
    cursor: pointer;
}
</style>
