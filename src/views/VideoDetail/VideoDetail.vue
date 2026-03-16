<template>
    <div class="detail-page" v-if="result">
        <!-- 상단 고정 영역 -->
        <div class="top-fixed">
            <div class="video-wrap">
                <video autoplay loop controls class="video" :src="result.post.video_url"></video>
            </div>

            <div class="info-section">
                <h2 class="title">{{ result.post.title }}</h2>
                <p class="artist">{{ artistName }}</p>

                <div class="action-buttons">
                    <button type="button" class="action-btn">
                        <span class="material-symbols-outlined btn-icon">thumb_up</span>
                        <span>좋아요</span>
                    </button>

                    <button type="button" class="action-btn">
                        <span class="material-symbols-outlined btn-icon">share</span>
                        <span>공유</span>
                    </button>

                    <button type="button" class="action-btn">
                        <span class="material-symbols-outlined btn-icon">download</span>
                        <span>다운로드</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- 댓글 영역 -->
        <!-- 댓글 영역 -->
        <div class="comment-section">
            <div class="comment-scroll">
                <h3 class="comment-title">
                    <span class="comment-label">댓글</span>
                    <span class="comment-count">{{ comments.length }}</span>
                </h3>

                <div v-if="comments.length > 0" class="comment-list">
                    <div v-for="item in comments" :key="item.id" class="comment-item">
                        <div class="profile-img-wrap">
                            <div class="profile-img"></div>
                        </div>

                        <div class="comment-body">
                            <p class="comment-writer">{{ item.writer }}</p>
                            <p class="comment-content">{{ item.content }}</p>

                            <button type="button" class="comment-like" @click="toggleLike(item)">
                                <span class="material-symbols-outlined heart-icon" :class="{ liked: isLiked(item.id) }">
                                    favorite
                                </span>
                                <span>{{ getLikeCount(item) }}</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div v-else class="empty-comment">댓글이 없습니다.</div>
            </div>

            <form class="comment-form" @submit.prevent="comment_ADD">
                <button type="button" class="input-profile-btn" @click="changeUsername">
                    <div class="input-profile"></div>
                </button>

                <input v-model="comment" placeholder="댓글을 입력하세요" type="text" class="comment-input" />

                <button type="submit" class="submit-btn">작성 완료</button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { commentAddApi, getCommentsApi, getVideoApi } from '@/api/_music_api';

const route = useRoute();
const id = route.params.id;

const result = ref(null);
const username = ref(localStorage.getItem('comment_username') || '홍길동');
const comment = ref('');
const comments = ref([]);
const likedComments = ref({});

const artistName = computed(() => {
    if (!result.value?.post) return '';

    return (
        result.value.post.artist ||
        result.value.post.singer ||
        result.value.post.artist_name ||
        result.value.post.writer ||
        '아티스트 이름'
    );
});

function loadLikedComments() {
    const saved = localStorage.getItem(`liked_comments_${id}`);
    likedComments.value = saved ? JSON.parse(saved) : {};
}

function saveLikedComments() {
    localStorage.setItem(`liked_comments_${id}`, JSON.stringify(likedComments.value));
}

function isLiked(commentId) {
    return !!likedComments.value[commentId];
}

function getLikeCount(item) {
    const baseCount = item.likes || item.like_count || 0;
    return isLiked(item.id) ? baseCount + 1 : baseCount;
}

function toggleLike(item) {
    const commentId = item.id;
    likedComments.value[commentId] = !likedComments.value[commentId];
    saveLikedComments();
}

function changeUsername() {
    const newName = prompt('작성자 이름을 입력하세요', username.value);

    if (!newName || !newName.trim()) return;

    username.value = newName.trim();
    localStorage.setItem('comment_username', username.value);
}

async function getVideo() {
    try {
        const { data } = await getVideoApi(id);
        console.log('video data:', data);
        result.value = data;
    } catch (error) {
        console.error('영상 불러오기 실패', error);
    }
}

async function getComments() {
    try {
        const { data } = await getCommentsApi(id);
        console.log('comments data:', data);
        comments.value = data.comments || [];
    } catch (error) {
        console.error('댓글 불러오기 실패', error);
        comments.value = [];
    }
}

async function comment_ADD() {
    if (!comment.value.trim()) {
        alert('댓글을 입력해주세요.');
        return;
    }

    try {
        await commentAddApi({
            postid: id,
            writer: username.value,
            content: comment.value
        });

        comment.value = '';
        await getComments();
    } catch (error) {
        console.error('댓글 등록 실패', error);
    }
}

onMounted(() => {
    loadLikedComments();
    getVideo();
    getComments();
});
</script>

<style scoped>
.detail-page {
    max-width: 600px;
    margin: 0 auto;
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.top-fixed {
    flex-shrink: 0;
}

.video {
    width: 100%;
}

.info-section {
    position: relative;
    padding: 24px 30px 28px;
    background: var(--gradient-light);
    border-bottom: 1px solid #d6e3ff;
    box-shadow: 0 4px 4px 0 #dae5ff;
}

.title {
    font-size: var(--font-26);
    font-weight: var(--fw-800);
    color: var(--color-black);
    padding-bottom: 3px;
}

.artist {
    font-size: var(--font-20);
    font-weight: var(--fw-400);
    color: #566789;
    padding-bottom: 20px;
}

.action-buttons {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
}

.action-btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 10px 48px 10px 43px;
    border: 1px solid var(--color-accent-blue);
    border-radius: 20px;
    background: var(--color-white);
    color: var(--color-black);
    font-size: var(--font-18);
    font-weight: var(--fw-400);
    box-shadow: 0 2px 6px rgba(132, 167, 255, 0.18);
    cursor: pointer;
}

.btn-icon {
    font-size: var(--font-24);
    color: var(--color-key);
    font-variation-settings:
        'FILL' 0,
        'wght' 600,
        'GRAD' 0,
        'opsz' 24;
}

.comment-section {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    padding: 16px 30px;
    background: var(--color-white);
}

.comment-scroll {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.comment-scroll::-webkit-scrollbar {
    display: none;
}

.comment-title {
    display: flex;
    align-items: baseline;
    gap: 4px;
    padding: 20px 0;
    font-size: var(--font-24);
    font-weight: var(--fw-700);
    color: var(--color-black);
}

.comment-count {
    color: #566789;
    font-weight: var(--fw-400);
}

.comment-list {
    padding: 12px 12px 5px 12px;
}

.comment-list::-webkit-scrollbar {
    display: none;
}

.comment-item {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding-bottom: 20px;
}

.profile-img-wrap {
    flex-shrink: 0;
}

.profile-img {
    width: 46px;
    height: 46px;
    border-radius: 50%;
    background: gray;
    flex-shrink: 0;
}

.comment-body {
    flex: 1;
    min-width: 0;
}

.comment-writer {
    font-size: var(--font-18);
    font-weight: var(--fw-500);
    color: var(--color-black);
    padding-bottom: 2px;
}

.comment-content {
    margin: 0;
    font-size: var(--font-18);
    font-weight: var(--fw-400);
    color: var(--color-black);
    word-break: break-word;
}

.comment-like {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-top: 6px;
    border: none;
    background: transparent;
    font-size: var(--font-16);
    font-weight: var(--fw-400);
    color: var(--color-gray);
    cursor: pointer;
}

.heart-icon {
    font-size: var(--font-18);
    color: #b8c7ea;
    font-variation-settings:
        'FILL' 1,
        'wght' 400,
        'GRAD' 0,
        'opsz' 24;
    transition: 0.2s;
}

.heart-icon.liked {
    color: var(--color-key);
}

.empty-comment {
    flex: 1;
    color: var(--color-gray);
    font-size: var(--font-14);
}

.comment-form {
    flex-shrink: 0;
    display: grid;
    grid-template-columns: 36px 1fr auto;
    align-items: center;
    gap: 20px;
    margin-top: 10px;
    padding: 10px 12px;
    border: 1px solid var(--color-accent-blue);
    border-radius: 30px;
    background: var(--color-white);
}

.input-profile-btn {
    padding: 0;
    border: none;
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.input-profile {
    width: 42px;
    height: 42px;
    margin-left: 10px;
    border-radius: 50%;
    background: #d9d9d9;
    flex-shrink: 0;
}

.comment-input {
    width: 100%;
    border: none;
    outline: none;
    background: transparent;
    font-size: var(--font-18);
    color: var(--color-black);
    text-indent: 18px;
}

.comment-input::placeholder {
    color: var(--color-black);
    opacity: 0.6;
}

.submit-btn {
    height: 38px;
    padding: 0 16px;
    border: 2px solid #c9d8ff;
    border-radius: 49px;
    background: #ffffff;
    color: var(--color-black);
    font-size: var(--font-16);
    font-weight: var(--fw-400);
    cursor: pointer;
}
</style>
