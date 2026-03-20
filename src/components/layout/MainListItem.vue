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
import Modal from '@/components/layout/ListModal.vue';

export default {
    name: 'MainListItem',
    emits: ['click'],
    components: {
        Modal
    },
    props: {
        title: { type: String, default: '' },
        singer: { type: String, default: '' },
        img: { type: String, default: '' },
        previewUrl: { type: String, default: '' },
        playedAt: { type: Number, default: 0 }
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
                artist: this.singer || '아티스트 없음',
                previewUrl: this.previewUrl || '',
                playedAt: Number(this.playedAt) || 0
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
    box-shadow: 0px 2px 4px var(--color-shadow);
}

.col-2 {
    width: 100%;
    display: flex;
    justify-content: space-between;
}

.box {
    display: flex;
    align-items: center;
    margin-left: 15px;
    padding: 15px 20px;
    border-radius: 5px;
    box-shadow: 0px 2px 4px var(--color-shadow);
    border: 1px solid var(--color-accent-blue);
    background: #ffffff;
}
.box .artist-name-box p:first-child {
    font-size: var(--font-16);
    color: var(--color-black);
    margin-bottom: 5px;
}

.box .artist-name-box p:last-child {
    font-size: var(--font-14);
    color: var(--color-gray);
}
.box .more-btn {
    font-size: var(--font-24);
    cursor: pointer;
    padding: 0 10px;
}

img {
    border: 1px solid var(--color-accent-blue);
}
.artist-name-box p {
    min-width: 160px;
    max-width: 150px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

@media (max-width: 500px) {
    a > img {
        width: clamp(56px, 18vw, 80px);
        border-radius: clamp(4px, 1.5vw, 5px);
    }

    .box {
        margin-left: clamp(8px, 3vw, 15px);
        padding: clamp(10px, 3vw, 15px) clamp(12px, 4vw, 20px);
        border-radius: clamp(4px, 1.5vw, 5px);
    }

    .box .artist-name-box p:first-child {
        font-size: clamp(13px, 3.6vw, var(--font-16));
        margin-bottom: clamp(3px, 1vw, 5px);
    }

    .box .artist-name-box p:last-child {
        font-size: clamp(11px, 3.2vw, var(--font-14));
    }

    .box .more-btn {
        font-size: clamp(18px, 5vw, var(--font-24));
        transform: rotate(90deg) translateY(clamp(-5px, -1.6vw, -8px));
    }

    .artist-name-box p {
        min-width: clamp(90px, 28vw, 160px);
        max-width: clamp(90px, 28vw, 150px);
    }
}
</style>
