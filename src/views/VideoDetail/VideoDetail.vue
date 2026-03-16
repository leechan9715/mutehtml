<template>
    <div class="container" v-if="result">
        <video autoplay loop controls class="video" :src="result.post.video_url"></video>
        <p>{{ result.post.title }}</p>

        <form @submit.prevent="comment_ADD">
            <input v-model="username" placeholder="작성자" type="text" />
            <input v-model="comment" placeholder="댓글내용" type="text" />
            <button type="submit">댓글추가버튼</button>
        </form>

        <div v-if="comments.length > 0">
            <div v-for="item in comments" :key="item.id">
                <p>{{ item.writer }}</p>
                <p>{{ item.content }}</p>
            </div>
        </div>

        <div v-else>
            <p>댓글이 없습니다.</p>
        </div>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';
import { commentAddApi, getCommentsApi, getVideoApi } from '@/api/_music_api';

const route = useRoute();
const id = route.params.id;

const result = ref(null);
const username = ref('');
const comment = ref('');
const comments = ref([]);

async function getVideo() {
    const { data } = await getVideoApi(id);
    result.value = data;
}

async function comment_ADD() {
    const { data } = await commentAddApi({
        postid: id,
        writer: username.value,
        content: comment.value
    });
    alert('테스트성공');
    console.log(data);
    comment.value = '';
    await getComments();
}
async function getComments() {
    const { data } = await getCommentsApi(id);
    console.log(data);
    comments.value = data.comments || [];
}

onMounted(() => {
    getVideo();
    getComments();
});
</script>

<style></style>
