<template>
    <article class="library-item" @click="handleClick">
        <div class="col-2 cover-wrap" :class="{ artist: item.type === 'artist' }" @click.stop="openFilePicker">
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

            <template v-else-if="collageImages.length">
                <div class="collage-cover" :class="`count-${collageImages.length}`">
                    <div v-for="(cover, index) in collageImages" :key="`${item.id}-${index}`" class="collage-cell">
                        <img
                            :src="cover || playlistFallbackImage"
                            :alt="`${item.title}-${index}`"
                            @error="handlePlaylistImageError"
                        />
                    </div>
                </div>
            </template>

            <template v-else>
                <img
                    class="playlist-cover"
                    :src="playlistFallbackImage"
                    :alt="item.title || 'empty-playlist'"
                    @error="handlePlaylistImageError"
                />
            </template>
        </div>

        <div class="col-2 info-container">
            <div class="info">
                <p class="title">{{ item.type === 'artist' ? item.name : item.title }}</p>
                <p class="sub">
                    <template v-if="item.type === 'artist'">Artist</template>
                    <template v-else>Playlist · {{ item.owner }} · {{ item.tracks?.length || 0 }}곡</template>
                </p>
            </div>
            <p class="more-btn" @click.stop="openModal">⁝</p>
        </div>
    </article>

    <input ref="fileInput" type="file" accept="image/*" style="display: none" @change="handleImageChange" />

    <LibraryModal v-model="isModalOpen" :track="modalTrack" />
</template>

<script>
import LibraryModal from '@/components/layout/LibraryModal.vue';
import { getLibraryItems, saveLibraryItems } from '@/utils/libraryStorage';

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
            return (this.item?.tracks || [])
                .map((track) => track.artworkUrl100)
                .filter(Boolean)
                .slice(0, 4);
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
        },

        openFilePicker() {
            if (this.item.type !== 'playlist') return;

            // 이미 커버가 있으면 다시 누를 때 원복
            if (this.item.coverImage) {
                this.resetCoverImage();
                return;
            }

            this.$refs.fileInput?.click();
        },

        handleImageChange(event) {
            const file = event.target.files?.[0];
            if (!file) return;

            const reader = new FileReader();

            reader.onload = () => {
                const base64 = reader.result;
                const items = getLibraryItems();

                const updatedItems = items.map((it) => {
                    if (String(it.id) === String(this.item.id)) {
                        return {
                            ...it,
                            coverImage: base64
                        };
                    }
                    return it;
                });

                saveLibraryItems(updatedItems);

                window.dispatchEvent(
                    new CustomEvent('library-items-updated', {
                        detail: updatedItems
                    })
                );

                if (this.$refs.fileInput) {
                    this.$refs.fileInput.value = '';
                }
            };

            reader.readAsDataURL(file);
        },

        resetCoverImage() {
            const items = getLibraryItems();

            const updatedItems = items.map((it) => {
                if (String(it.id) === String(this.item.id)) {
                    return {
                        ...it,
                        coverImage: ''
                    };
                }
                return it;
            });

            saveLibraryItems(updatedItems);

            window.dispatchEvent(
                new CustomEvent('library-items-updated', {
                    detail: updatedItems
                })
            );

            if (this.$refs.fileInput) {
                this.$refs.fileInput.value = '';
            }
        }
    }
};
</script>

<style scoped src="@/assets/styles/pages/LibraryItem.css"></style>
