<template>
    <a href="javascript:void(0)" class="col-2" @click="onItemClick">
        <img :src="img" alt="album_cover1" width="80" loading="lazy" decoding="async" draggable="false" />
        <div class="col-3">
            <div class="upDown">
                {{ index + 2 }}<br />
                <span :class="trend === 'up' ? 'up' : 'down'">
                    {{ trend === 'up' ? '▴' : '▾' }}
                </span>
            </div>
            <div class="music-singer">
                <p>{{ title }}</p>
                <p>{{ singer }}</p>
            </div>
            <p class="more-btn" @click.stop="openModal">⁝</p>
        </div>
    </a>
    <Modal v-model="isModalOpen" :track="trackInfo" />
</template>

<script>
import fallbackCover from '@/assets/images/main/1.png';
import Modal from '@/components/layout/Modal.vue';

export default {
    name: 'ChartListItem',
    emits: ['click'],
    components: {
        Modal
    },
    props: {
        title: { type: String, default: '' },
        singer: { type: String, default: '' },
        img: { type: String, default: '' },
        trend: { type: String, default: '' },
        index: { type: Number, default: 0 }
    },
    data() {
        return {
            fallbackCover,
            isModalOpen: false
        };
    },
    computed: {
        trackInfo() {
            return {
                img: this.img || this.fallbackCover,
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
.col-2 {
    width: 100%;
    display: flex;
    align-items: center;
    padding-bottom: 20px;
}

.col-2 img {
    border-radius: 10px;
    border: 2px solid #ffffff;
    box-shadow: 0px 2px 4px var(--color-shadow);
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
    color: var(--color-black);
}

.col-3 .music-singer p:last-child {
    font-size: var(--font-16);
    padding-top: 5px;
    color: var(--color-gray);
}

.col-3 > p {
    margin-left: auto;
    margin-right: 20px;
    font-size: var(--font-24);
    align-self: center;
    cursor: pointer;
}
.more-btn {
    font-size: var(--font-24);
    cursor: pointer;
    padding: 0 0 0 10px;
}
</style>
