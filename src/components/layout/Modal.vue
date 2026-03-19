<template>
    <teleport to="body">
        <transition name="sheet-fade">
            <div v-if="modelValue" class="sheet-overlay" @click.self="close">
                <div ref="sheet" class="sheet" :style="sheetStyle">
                    <!-- 드래그 핸들/접기 -->
                    <button
                        class="sheet-handle"
                        type="button"
                        aria-label="닫기"
                        @mousedown.prevent="onDragStartMouse"
                        @touchstart.prevent="onDragStartTouch"
                    >
                        <span class="handle-bar"></span>
                    </button>

                    <!-- 곡 정보 -->
                    <div class="track">
                        <img class="cover" :src="track.img" alt="cover" />
                        <div class="meta">
                            <p class="title">{{ track.title }}</p>
                            <p class="artist">{{ track.artist }}</p>
                        </div>
                    </div>
                    <!-- 메뉴 -->
                    <ul class="menu">
                        <li>
                            <button class="menu-item" type="button" @click="onAction('share')">
                                <img class="icon" src="@/assets/images/icon/share.png" alt="share" />
                                <span class="label">공유</span>
                            </button>
                        </li>

                        <li>
                            <button class="menu-item" type="button" @click="onAction('download')">
                                <img class="icon" src="@/assets/images/icon/playlist.png" alt="playlist" />
                                <span class="label">기존 플레이리스트에 담기</span>
                            </button>
                        </li>

                        <li>
                            <button class="menu-item" type="button" @click="onAction('artist')">
                                <img class="icon" src="@/assets/images/icon/artist.png" alt="artist" />
                                <span class="label">아티스트 정보</span>
                            </button>
                        </li>

                        <li>
                            <button class="menu-item" type="button" @click="onAction('song')">
                                <img class="icon" src="@/assets/images/icon/info.png" alt="info" />
                                <span class="label">곡 정보</span>
                            </button>
                        </li>

                        <li>
                            <button class="menu-item" type="button" @click="onAction('block_reco')">
                                <img class="icon" src="@/assets/images/icon/block.png" alt="block" />
                                <span class="label">노래 추천에 뜨지 않기</span>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </transition>
    </teleport>
</template>

<script>
import coverImg from '@/assets/images/chart/1.png';
export default {
    name: 'BottomSheetMenu',
    props: {
        modelValue: { type: Boolean, default: true }, // v-model
        track: {
            type: Object,
            default: () => ({
                img: coverImg,
                title: '404 (New Era)',
                artist: 'KiiiKiii (키키)'
            })
        }
    },
    emits: ['update:modelValue', 'action'],
    data() {
        return {
            isDragging: false,
            dragStartY: 0,
            dragOffsetY: 0,
            sheetHeight: 0
        };
    },
    computed: {
        sheetStyle() {
            return {
                transform: `translateY(${this.dragOffsetY}px)`,
                transition: this.isDragging ? 'none' : 'transform 0.2s ease'
            };
        }
    },
    watch: {
        modelValue(next) {
            if (!next) this.resetDrag();
        }
    },
    beforeUnmount() {
        this.removeDragListeners();
    },
    methods: {
        close() {
            this.resetDrag();
            this.$emit('update:modelValue', false);
        },
        onDragStartMouse(event) {
            this.startDrag(event.clientY);
        },
        onDragStartTouch(event) {
            const touch = event.touches?.[0];
            if (!touch) return;
            this.startDrag(touch.clientY);
        },
        startDrag(clientY) {
            this.isDragging = true;
            this.dragStartY = clientY;
            this.dragOffsetY = 0;
            this.sheetHeight = this.$refs.sheet?.offsetHeight || 0;

            window.addEventListener('mousemove', this.onDragMoveMouse);
            window.addEventListener('mouseup', this.onDragEnd);
            window.addEventListener('touchmove', this.onDragMoveTouch, { passive: false });
            window.addEventListener('touchend', this.onDragEnd);
            window.addEventListener('touchcancel', this.onDragEnd);
        },
        onDragMoveMouse(event) {
            this.updateDrag(event.clientY);
        },
        onDragMoveTouch(event) {
            const touch = event.touches?.[0];
            if (!touch) return;
            this.updateDrag(touch.clientY);
            event.preventDefault();
        },
        updateDrag(clientY) {
            if (!this.isDragging) return;
            const diff = clientY - this.dragStartY;
            this.dragOffsetY = Math.max(0, diff);
        },
        onDragEnd() {
            if (!this.isDragging) return;

            const threshold = this.sheetHeight * 0.2;
            const shouldClose = this.dragOffsetY >= threshold;

            this.removeDragListeners();
            this.isDragging = false;

            if (shouldClose) {
                this.close();
                return;
            }

            this.dragOffsetY = 0;
        },
        removeDragListeners() {
            window.removeEventListener('mousemove', this.onDragMoveMouse);
            window.removeEventListener('mouseup', this.onDragEnd);
            window.removeEventListener('touchmove', this.onDragMoveTouch);
            window.removeEventListener('touchend', this.onDragEnd);
            window.removeEventListener('touchcancel', this.onDragEnd);
        },
        resetDrag() {
            this.isDragging = false;
            this.dragStartY = 0;
            this.dragOffsetY = 0;
            this.sheetHeight = 0;
            this.removeDragListeners();
        },
        onAction(type) {
            this.$emit('action', type);
            // 보통 메뉴 누르면 닫힘
            this.close();
        }
    }
};
</script>

<style scoped>
.sheet-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.35);
    display: flex;
    align-items: flex-end;
    justify-content: center;
    z-index: 9999;
}

.sheet {
    width: min(420px, 100%);
    background: #ffffff;
    border-top-left-radius: 22px;
    border-top-right-radius: 22px;
    padding: 10px 20px 16px;
    box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.18);
    will-change: transform;
}

.sheet-handle {
    width: 100%;
    border: 0;
    background: transparent;
    padding: 6px 0 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    cursor: grab;
}

.sheet-handle:active {
    cursor: grabbing;
}

.handle-bar {
    width: 52px;
    height: 5px;
    border-radius: 999px;
    background: #d9d9d9;
}

.track {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 6px 0 10px;
}

.cover {
    width: 48px;
    height: 48px;
    border-radius: 10px;
    object-fit: cover;
    border: 1px solid #eee;
}

.meta .title {
    margin: 0;
    font-size: 15px;
    font-weight: 700;
    color: var(--color-black);
}

.meta .artist {
    margin: 4px 0 0;
    font-size: 13px;
    color: var(--color-gray);
}

.menu {
    list-style: none;
    padding: 6px 0 0;
    margin: 0;
}

.menu-item {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 14px 6px;
    border: 0;
    background: transparent;
    cursor: pointer;
}

.menu-item:active {
    background: rgba(0, 0, 0, 0.04);
    border-radius: 12px;
}

.icon {
    width: 26px;
    display: inline-flex;
    justify-content: center;
    font-size: 18px;
}

.label {
    font-size: 16px;
    font-weight: 600;
    color: var(--color-black);
}

.sheet-fade-enter-active,
.sheet-fade-leave-active {
    transition: opacity 0.25s ease;
}

.sheet-fade-enter-active .sheet,
.sheet-fade-leave-active .sheet {
    transition:
        transform 0.28s ease,
        opacity 0.28s ease;
}

.sheet-fade-enter-from,
.sheet-fade-leave-to {
    opacity: 0;
}

.sheet-fade-enter-from .sheet,
.sheet-fade-leave-to .sheet {
    transform: translateY(24px);
    opacity: 0.95;
}
</style>
