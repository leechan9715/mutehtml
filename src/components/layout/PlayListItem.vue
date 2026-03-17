<template>
    <a
        href="javascript:void(0)"
        class="col-2"
        v-for="(track, index) in normalizedTracks"
        :key="`${track.trackName}-${track.artistName}-${index}`"
        @click.prevent="$emit('select-track', index)"
    >
        <img :src="track.albumCover" alt="album_cover" width="80" />
        <div class="col-2 type">
            <div class="music-singer">
                <p>{{ track.trackName }}</p>
                <p>{{ track.artistName }}</p>
            </div>
            <p>⁝</p>
        </div>
    </a>
</template>

<script>
import fallbackCover from '@/assets/images/playlist/1.png';

export default {
    name: 'PlayListItem',
    emits: ['select-track'],
    props: {
        tracks: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        normalizedTracks() {
            return (this.tracks || []).map((track) => ({
                trackName: track?.trackName || track?.title || '제목 없음',
                artistName: track?.artistName || track?.singer || '아티스트 정보 없음',
                albumCover: track?.albumCover || track?.artworkUrl100 || track?.img || fallbackCover
            }));
        }
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
