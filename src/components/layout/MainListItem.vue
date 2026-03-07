<template>
    <a href="javascript:void(0)" class="col-2">
        <img :src="img" alt="album_cover1" />
        <div class="box col-2">
            <div class="artist-name-box">
                <p>{{ title }}</p>
                <p>{{ singer }}</p>
            </div>
            <p class="more-btn">⁝</p>
        </div>
    </a>
</template>

<script>
import trackImg from '@/assets/images/main/1.png';

export default {
    name: 'MainListItem',
    props: {
        title: { type: String, default: '' },
        singer: { type: String, default: '' },
        img: { type: String, default: '' }
    },
    data() {
        return {
            trackImg
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

img {
    border: 1px solid #bbd1ff;
}
</style>
