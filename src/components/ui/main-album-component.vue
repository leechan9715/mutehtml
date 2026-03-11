<template>
    <div class="song-card">
        <div class="album-cover">
            <img v-if="coverImage" :src="coverImage" :alt="title" />
        </div>

        <p class="title">{{ title }}</p>
        <p class="artist">{{ artist }}</p>
    </div>
</template>

<script>
export default {
    name: 'SongCard',
    props: {
        title: { type: String, default: 'Song-name' },
        artist: { type: String, default: 'Artist' },
        coverImage: { type: String, default: '' }
    }
};
</script>

<style scoped>
.song-card {
    width: 120px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    /* overflow: hidden; */
    flex-shrink: 0;
}

.album-cover {
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: 10px;
    overflow: hidden; /* 이미지가 튀어나오지 않게 */
    background: #e9e9e9; /* 이미지 없을 때 기본 */
}

.album-cover img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* 비율 유지하면서 꽉 채우기 */
    display: block;
}

.title {
    font-size: var(--font-16);
    font-weight: var(--fw-600);
    color: var(--color-black);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.artist {
    font-size: var(--font-14);
    font-weight: var(--fw-600);
    color: var(--color-gray);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
