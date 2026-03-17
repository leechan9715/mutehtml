<template>
    <div class="detail-page" v-if="result">
        <!-- 상단 고정 영역 -->
        <div class="top-fixed">
            <div class="video-wrap">
                <video autoplay muted playsinline loop controls class="video" :src="result.post.video_url"></video>
            </div>

            <div class="info-section">
                <h2 class="title">{{ result.post.title }}</h2>
                <p class="artist">{{ artistName }}</p>

                <div class="action-buttons">
                    <button
                        type="button"
                        class="action-btn like-btn"
                        :class="{ active: isPostLiked, popping: isLikeAnimating }"
                        @click="togglePostLike"
                    >
                        <span class="burst burst-1"></span>
                        <span class="burst burst-2"></span>
                        <span class="burst burst-3"></span>
                        <span class="burst burst-4"></span>

                        <span class="material-symbols-outlined btn-icon">thumb_up</span>
                        <span>좋아요</span>
                    </button>

                    <button type="button" class="action-btn" :class="{ active: isShareActive }" @click="toggleShare">
                        <span class="material-symbols-outlined btn-icon">share</span>
                        <span>공유</span>
                    </button>

                    <button
                        type="button"
                        class="action-btn"
                        :class="{ active: isDownloadActive }"
                        @click="toggleDownload"
                    >
                        <span class="material-symbols-outlined btn-icon">download</span>
                        <span>다운로드</span>
                    </button>
                </div>
            </div>
        </div>
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
                            <img :src="getCommentProfileImg(item)" alt="comment profile" class="profile-img" />
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
                <div class="input-profile-btn">
                    <img :src="userInfo.user?.profileImg || defaultProfileImg" alt="my profile" class="input-profile" />
                </div>

                <input v-model="comment" placeholder="댓글을 입력하세요" type="text" class="comment-input" />

                <button type="submit" class="submit-btn" :disabled="isSubmitting">
                    {{ isSubmitting ? '등록 중...' : '작성 완료' }}
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { commentAddApi, getCommentsApi, getVideoApi } from '@/api/_music_api';
import { checkAuthApi } from '@/api/_auth_api';
import profileImgSrc from '@/assets/images/mypage/test.jpg';

const route = useRoute();
const id = route.params.id;

const result = ref(null);
const userInfo = ref({});
const defaultProfileImg = profileImgSrc;

const username = ref('홍길동');
const comment = ref('');
const comments = ref([]);
const likedComments = ref({});
const commentProfileMap = ref({});

const isPostLiked = ref(false);
const isShareActive = ref(false);
const isDownloadActive = ref(false);
const isLikeAnimating = ref(false);
const isSubmitting = ref(false);

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

function getPostLikeStorageKey() {
    return `post_like_${id}`;
}

function getShareStorageKey() {
    return `post_share_${id}`;
}

function getDownloadStorageKey() {
    return `post_download_${id}`;
}

function getCommentLikeStorageKey() {
    return `liked_comments_${id}`;
}

function getCommentProfileMapKey() {
    return `comment_profile_map_${id}`;
}

function loadPostLike() {
    isPostLiked.value = localStorage.getItem(getPostLikeStorageKey()) === 'true';
}

function savePostLike() {
    localStorage.setItem(getPostLikeStorageKey(), String(isPostLiked.value));
}

function loadShareState() {
    isShareActive.value = localStorage.getItem(getShareStorageKey()) === 'true';
}

function saveShareState() {
    localStorage.setItem(getShareStorageKey(), String(isShareActive.value));
}

function loadDownloadState() {
    isDownloadActive.value = localStorage.getItem(getDownloadStorageKey()) === 'true';
}

function saveDownloadState() {
    localStorage.setItem(getDownloadStorageKey(), String(isDownloadActive.value));
}

function togglePostLike() {
    isPostLiked.value = !isPostLiked.value;
    savePostLike();

    if (isPostLiked.value) {
        isLikeAnimating.value = false;

        requestAnimationFrame(() => {
            isLikeAnimating.value = true;
        });

        setTimeout(() => {
            isLikeAnimating.value = false;
        }, 500);
    }
}

function toggleShare() {
    isShareActive.value = !isShareActive.value;
    saveShareState();
}

function toggleDownload() {
    isDownloadActive.value = !isDownloadActive.value;
    saveDownloadState();
}

function loadLikedComments() {
    try {
        const saved = localStorage.getItem(getCommentLikeStorageKey());
        likedComments.value = saved ? JSON.parse(saved) : {};
    } catch (error) {
        likedComments.value = {};
    }
}

function saveLikedComments() {
    localStorage.setItem(getCommentLikeStorageKey(), JSON.stringify(likedComments.value));
}

function isLiked(commentId) {
    return !!likedComments.value[commentId];
}

function getLikeCount(item) {
    const baseCount = Number(item.likes || item.like_count || 0);
    return isLiked(item.id) ? baseCount + 1 : baseCount;
}

function toggleLike(item) {
    const commentId = item.id;
    likedComments.value[commentId] = !likedComments.value[commentId];
    saveLikedComments();
}

function loadCommentProfileMap() {
    try {
        const saved = localStorage.getItem(getCommentProfileMapKey());
        commentProfileMap.value = saved ? JSON.parse(saved) : {};
    } catch (error) {
        commentProfileMap.value = {};
    }
}

function saveCommentProfileMap() {
    localStorage.setItem(getCommentProfileMapKey(), JSON.stringify(commentProfileMap.value));
}

function getMyProfileImg() {
    return userInfo.value?.user?.profileImg || defaultProfileImg;
}

function getCommentProfileImg(item) {
    return (
        item.profileImg ||
        item.profile_img ||
        item.user?.profileImg ||
        commentProfileMap.value[item.writer] ||
        defaultProfileImg
    );
}

function saveWriterProfile(writer, profileImg) {
    if (!writer) return;

    commentProfileMap.value[writer] = profileImg || defaultProfileImg;
    saveCommentProfileMap();
}

async function getUserInfo() {
    try {
        const { data } = await checkAuthApi();
        userInfo.value = data;

        if (data?.user?.nickname) {
            username.value = data.user.nickname;
        }

        saveWriterProfile(username.value, getMyProfileImg());
    } catch (error) {
        console.error('사용자 정보 불러오기 실패', error);
    }
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

    if (isSubmitting.value) return;

    try {
        isSubmitting.value = true;

        saveWriterProfile(username.value, getMyProfileImg());

        await commentAddApi({
            postid: id,
            writer: username.value,
            content: comment.value.trim()
        });

        comment.value = '';
        await getComments();
    } catch (error) {
        console.error('댓글 등록 실패', error);
    } finally {
        isSubmitting.value = false;
    }
}

onMounted(() => {
    loadPostLike();
    loadShareState();
    loadDownloadState();
    loadLikedComments();
    loadCommentProfileMap();
    getUserInfo();
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
    display: block;
}

.info-section {
    position: relative;
    padding: 24px 26px 20px 26px;
    background: var(--gradient-light);
    border-bottom: 1px solid #d6e3ff;
    box-shadow: 0 4px 4px 0 #dae5ff;
}

.title {
    font-size: var(--font-26);
    font-weight: var(--fw-800);
    color: var(--color-black);
    padding-bottom: 4px;
}

.artist {
    font-size: var(--font-16);
    font-weight: var(--fw-400);
    color: #566789;
    padding-bottom: 16px;
}

.action-buttons {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
    width: 100%;
    align-items: center;
}

.action-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    padding: 6px 12% 6px 0;
    border: 1px solid var(--color-accent-blue);
    border-radius: 20px;
    background: var(--color-white);
    color: var(--color-black);
    font-size: var(--font-16);
    font-weight: var(--fw-500);
    box-shadow: 0 2px 6px rgba(132, 167, 255, 0.18);
    cursor: pointer;
    transition:
        background 0.2s,
        border-color 0.2s,
        color 0.2s,
        box-shadow 0.2s,
        transform 0.2s;
}

.action-btn .btn-icon {
    font-size: var(--font-24);
    color: var(--color-key);
    font-variation-settings:
        'FILL' 0,
        'wght' 400,
        'GRAD' 0,
        'opsz' 24;
    transition: color 0.2s;
}

.action-btn.active {
    background: var(--color-white);
    border-color: var(--color-accent-blue);
    box-shadow: 0 4px 10px rgba(132, 167, 255, 0.25);
}

.action-btn.active .btn-icon {
    color: #4f7dff;
    font-variation-settings:
        'FILL' 1,
        'wght' 400,
        'GRAD' 0,
        'opsz' 24;
}

.like-btn {
    position: relative;
    overflow: visible;
}

.like-btn.popping {
    animation: likePop 0.45s ease;
}

.like-btn .burst {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--color-key);
    opacity: 0;
    pointer-events: none;
    transform: translate(-50%, -50%) scale(0.4);
}

.like-btn.popping .burst-1 {
    animation: burst1 0.5s ease-out;
}

.like-btn.popping .burst-2 {
    animation: burst2 0.5s ease-out;
}

.like-btn.popping .burst-3 {
    animation: burst3 0.5s ease-out;
}

.like-btn.popping .burst-4 {
    animation: burst4 0.5s ease-out;
}

.comment-section {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    padding: 16px 26px calc(16px + 80px);
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
    padding: 20px 0 16px;
    font-size: var(--font-20);
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

.comment-item {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding-bottom: 20px;
}

.profile-img-wrap {
    flex-shrink: 0;
    padding-top: 4px;
}

.profile-img {
    width: 44px;
    height: 44px;
    aspect-ratio: 1 / 1;
    border-radius: 50%;
    object-fit: cover;
    display: block;
    background: gray;
    flex-shrink: 0;
}

.comment-body {
    flex: 1;
    min-width: 0;
}

.comment-writer {
    font-size: var(--font-16);
    font-weight: var(--fw-500);
    color: var(--color-black);
}

.comment-content {
    margin: 0;
    font-size: var(--font-16);
    font-weight: var(--fw-400);
    color: var(--color-black);
    word-break: break-word;
}

.comment-like {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-top: 6px;
    padding: 0;
    border: none;
    background: transparent;
    font-size: var(--font-14);
    font-weight: var(--fw-400);
    color: var(--color-gray);
    cursor: pointer;
}

.heart-icon {
    font-size: var(--font-16);
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
    grid-template-columns: 42px 1fr auto;
    align-items: center;
    gap: 20px;
    margin-top: 10px;
    margin-bottom: 8px;
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
    width: 40px;
    height: 40px;
    aspect-ratio: 1 / 1;
    margin-left: 10px;
    border-radius: 50%;
    object-fit: cover;
    display: block;
    flex-shrink: 0;
}

.comment-input {
    width: 100%;
    border: none;
    outline: none;
    background: transparent;
    font-size: var(--font-16);
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
    font-weight: var(--fw-500);
    cursor: pointer;
}

.submit-btn:disabled {
    opacity: 0.6;
    cursor: default;
}

/* ----------------좋아요 버튼 클릭 애니메이션---------------- */

@keyframes likePop {
    0% {
        transform: scale(1);
    }
    35% {
        transform: scale(1.12);
    }
    100% {
        transform: scale(1);
    }
}

@keyframes burst1 {
    0% {
        opacity: 0.9;
        transform: translate(-50%, -50%) translate(0, 0) scale(0.4);
    }
    100% {
        opacity: 0;
        transform: translate(-50%, -50%) translate(-24px, -18px) scale(1);
    }
}

@keyframes burst2 {
    0% {
        opacity: 0.9;
        transform: translate(-50%, -50%) translate(0, 0) scale(0.4);
    }
    100% {
        opacity: 0;
        transform: translate(-50%, -50%) translate(24px, -16px) scale(1);
    }
}

@keyframes burst3 {
    0% {
        opacity: 0.9;
        transform: translate(-50%, -50%) translate(0, 0) scale(0.4);
    }
    100% {
        opacity: 0;
        transform: translate(-50%, -50%) translate(-18px, 18px) scale(1);
    }
}

@keyframes burst4 {
    0% {
        opacity: 0.9;
        transform: translate(-50%, -50%) translate(0, 0) scale(0.4);
    }
    100% {
        opacity: 0;
        transform: translate(-50%, -50%) translate(22px, 16px) scale(1);
    }
}
</style>
