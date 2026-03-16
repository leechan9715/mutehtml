<template>
    <a href="javascript:void(0)" class="col-2" @click="onItemClick">
        <img :src="img || trackImg" alt="album_cover" loading="lazy" decoding="async" draggable="false" />
        <div class="box col-2">
            <div class="artist-name-box">
                <p>{{ title }}</p>
                <p>{{ singer }}</p>
            </div>
            <p class="more-btn" @click.stop="openModal">⁝</p>
        </div>
    </a>
    <Modal v-model="isModalOpen" :track="trackInfo" />
</template>

<script>
import trackImg from '@/assets/images/main/1.png';
import Modal from '@/components/layout/Modal.vue';

export default {
    name: 'MainListItem',
    emits: ['click'],
    components: {
        Modal
    },
    props: {
        title: { type: String, default: '' },
        singer: { type: String, default: '' },
        img: { type: String, default: '' }
    },
    data() {
        return {
            trackImg,
            isModalOpen: false
        };
    },
    computed: {
        trackInfo() {
            return {
                img: this.img || this.trackImg,
                title: this.title || '제목 없음',
                artist: this.singer || '아티스트 없음'
            };
        }
    },
    methods: {
        onItemClick(event) {
            this.$emit('click', event);
        },
        openModal() {
            this.isModalOpen = true;
        }
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

    padding: 0 10px;
}

img {
    border: 1px solid #bbd1ff;
}
.artist-name-box p {
    min-width: 160px;
    max-width: 150px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
