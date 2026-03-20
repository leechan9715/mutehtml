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
            <h3 class="comment-title">
                <span class="comment-label">댓글</span>
                <span class="comment-count">{{ comments.length }}</span>
            </h3>

            <div class="comment-scroll">
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

            <form class="comment-form" @submit.prevent="commentAdd">
                <div class="input-profile-btn">
                    <img
                        :src="authData?.user?.profileImg || defaultProfileImg"
                        alt="my profile"
                        class="input-profile"
                    />
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
import { useAuthStore } from '@/store/auth';
import profileImgSrc from '@/assets/images/mypage/test.jpg';
import { storeToRefs } from 'pinia';
const authStore = useAuthStore();
const { authData } = storeToRefs(authStore);
const route = useRoute();
const id = route.params.id;
const result = ref(null);
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
    return authData.value?.user?.profileImg || defaultProfileImg;
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
        await authStore.fetchAuthData();

        if (authData.value?.user?.nickname) {
            username.value = authData.value.user.nickname;
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

async function commentAdd() {
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

onMounted(async () => {
    loadPostLike();
    loadShareState();
    loadDownloadState();
    loadLikedComments();
    loadCommentProfileMap();
    await getUserInfo();
    await getVideo();
    await getComments();
});
</script>

<style scoped src="@/assets/styles/pages/videoDetail.css"></style>
