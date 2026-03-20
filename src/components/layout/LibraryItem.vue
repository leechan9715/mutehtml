<template>
    <article class="library-item" @click="handleClick">
        <div class="cover-wrap" :class="{ artist: item.type === 'artist' }">
            <template v-if="item.type === 'artist'">
                <img
                    class="artist-cover"
                    :src="item.image || artistFallbackImage"
                    :alt="item.name"
                    @error="handleArtistImageError"
                />
            </template>

            <template v-else-if="item.coverImage">
                <img
                    class="playlist-cover"
                    :src="item.coverImage || playlistFallbackImage"
                    :alt="item.title"
                    @error="handlePlaylistImageError"
                />
            </template>

            <template v-else>
                <div class="collage-cover">
                    <div v-for="(cover, index) in collageImages" :key="`${item.id}-${index}`" class="collage-cell">
                        <img
                            :src="cover || playlistFallbackImage"
                            :alt="`${item.title}-${index}`"
                            @error="handlePlaylistImageError"
                        />
                    </div>
                </div>
            </template>
        </div>

        <div class="info">
            <p class="title">{{ item.type === 'artist' ? item.name : item.title }}</p>
            <p class="sub">
                <template v-if="item.type === 'artist'">Artist</template>
                <template v-else>Playlist · {{ item.owner }} · {{ item.tracks?.length || 0 }}곡</template>
            </p>
        </div>

        <button class="more-btn" type="button" @click.stop="openModal">
            <span class="material-symbols-outlined">more_vert</span>
        </button>
    </article>
    <LibraryModal v-model="isModalOpen" :track="modalTrack" />
</template>

<script>
import LibraryModal from '@/components/layout/LibraryModal.vue';

export default {
    name: 'LibraryItem',
    components: {
        LibraryModal
    },
    props: {
        item: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            playlistFallbackImage: require('@/assets/images/player/player-img1.png'),
            artistFallbackImage: require('@/assets/images/artist-select/default.png'),
            isModalOpen: false
        };
    },
    computed: {
        collageImages() {
            const covers = (this.item?.tracks || []).map((track) => track.artworkUrl100).filter(Boolean);

            if (!covers.length) {
                return [
                    this.playlistFallbackImage,
                    this.playlistFallbackImage,
                    this.playlistFallbackImage,
                    this.playlistFallbackImage
                ];
            }

            const result = covers.slice(0, 4);

            while (result.length < 4) {
                result.push(result[result.length - 1]);
            }

            return result;
        },
        modalTrack() {
            const isArtist = this.item?.type === 'artist';
            const title = isArtist ? this.item?.name || '아티스트' : this.item?.title || '플레이리스트';
            const artist = isArtist ? 'Artist' : this.item?.owner || 'Playlist';
            const coverImage = isArtist
                ? this.item?.image || this.artistFallbackImage
                : this.item?.coverImage || this.collageImages[0] || this.playlistFallbackImage;

            return {
                id: this.item?.id,
                type: this.item?.type || 'playlist',
                img: coverImage,
                title,
                artist
            };
        }
    },
    methods: {
        handleClick() {
            if (this.item.type === 'playlist') {
                this.$router.push(`/main/library/${this.item.id}`);
                return;
            }

            if (this.item.type === 'artist') {
                this.$router.push({
                    path: '/main/artist-info',
                    query: {
                        artist: this.item.name
                    }
                });
            }
        },
        handlePlaylistImageError(event) {
            event.target.src = this.playlistFallbackImage;
        },
        handleArtistImageError(event) {
            event.target.src = this.artistFallbackImage;
        },
        openModal() {
            this.isModalOpen = true;
        }
    }
};
</script>

<style scoped>
.library-item {
    display: flex;
    align-items: center;
    gap: 20px;
    width: 100%;
    cursor: pointer;
}

.cover-wrap {
    width: 80px;
    flex-shrink: 0;
    overflow: hidden;
    border: 1px solid var(--color-accent-blue);
    box-shadow: 0px 2px 4px var(--color-shadow);
    background: var(--color-white);
    border-radius: 5px;
}

.cover-wrap.artist {
    border-radius: 50%;
}

.artist-cover,
.playlist-cover {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
}

.collage-cover {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
}

.collage-cell {
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.collage-cell img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
}

.info {
    flex: 1;
    min-width: 0;
}

.title {
    margin: 0 0 5px;
    font-size: 16px;
    font-weight: 600;
    color: #1c274c;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.sub {
    margin: 0;
    font-size: 14px;
    color: #666;
}

.more-btn {
    font-size: var(--font-24);
    cursor: pointer;
    padding: 0 10px;
}
</style>
