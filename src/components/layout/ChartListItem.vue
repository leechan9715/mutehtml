<template>
    <a href="javascript:void(0)" class="col-2" v-for="(track, index) in tracks" :key="index">
        <img :src="track.img" alt="album_cover1" width="80" />
        <div class="col-3">
            <div class="upDown">
                {{ index + 2 }}<br />
                <span :class="track.trend === 'up' ? 'up' : 'down'">
                    {{ track.trend === 'up' ? '▴' : '▾' }}
                </span>
            </div>
            <div class="music-singer">
                <p>{{ track.title }}</p>
                <p>{{ track.singer }}</p>
            </div>
            <p>⁝</p>
        </div>
    </a>
</template>

<script>
import img1 from '@/assets/images/chart/1.png';
import img2 from '@/assets/images/chart/2.jpg';
import img3 from '@/assets/images/chart/3.jpg';
import img4 from '@/assets/images/chart/4.jpg';
import img5 from '@/assets/images/chart/5.jpg';
import img6 from '@/assets/images/chart/6.jpg';
import img7 from '@/assets/images/chart/7.jpg';
import img8 from '@/assets/images/chart/8.jpg';
import img9 from '@/assets/images/chart/9.jpg';

export default {
    name: 'ChartListItem',
    data() {
        return {
            tracks: [
                { img: img1, title: '404(New Era)', singer: 'KiiiKiii (키키) / 2:59', trend: 'up' },
                { img: img2, title: 'Good Goodbye', singer: '화사 / 3:20', trend: 'down' },
                { img: img3, title: 'BANG BANG', singer: 'IVE / 3:39', trend: 'up' },
                { img: img4, title: 'DROWNING', singer: 'WOODZ / 2:40', trend: 'down' },
                { img: img5, title: '사랑하게 될거야', singer: '한로로 / 3:35', trend: 'up' },
                { img: img6, title: 'APT', singer: 'ROSE / 3:02', trend: 'up' },
                { img: img7, title: 'Blue Valentine', singer: 'NMIXX / 2:31', trend: 'down' },
                { img: img8, title: 'SPAGHETTI (feat. j-hope of BTS)', singer: 'LE SSERAFIM / 3:01', trend: 'up' },
                { img: img9, title: 'Mono (Feat. skaiwater)', singer: 'i-dle (아이들) / 2:34', trend: 'down' }
            ]
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
