<template>
    <div class="col-3">
        <label :for="artistId" class="artist-card">
            <img :src="artistImg" alt="select_img_3" />
            <input type="checkbox" :id="artistId" name="artists[]" :value="value" class="hidden" v-model="model" />
            <div class="checked-heart">
                <div class="heart">
                    <img :src="heart" alt="heart" />
                </div>
            </div>
        </label>
        <h2 class="text-center fw-semibold font-22">{{ artistName }}</h2>
    </div>
</template>
<script>
import heart from '@/assets/images/artist-select/heart.png';
export default {
    name: 'ArtistSelectBtn',
    data() {
        return {
            heart
        };
    },
    props: {
        artistImg: { type: String, required: true },
        artistName: { type: String, required: true },
        value: { type: Number, required: true },
        artistId: { type: String, required: true },
        modelValue: { type: Array, required: true } // ✅ v-model 받기
    },
    emits: ['update:modelValue'],
    computed: {
        model: {
            get() {
                return this.modelValue;
            },
            set(v) {
                this.$emit('update:modelValue', v);
            }
        }
    }
};
</script>

<style scoped>
label {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0px 2px 4px 0px rgba(218, 229, 255, 1);
    border-radius: 50%;
}
label > img {
    object-fit: cover;
    padding: 4px;
    width: 100%;
}
label .checked-heart {
    position: absolute;
    background-color: rgba(0, 0, 0, 0.5);
    width: 100%;
    height: 100%;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
}

label:has(input:checked) .checked-heart {
    opacity: 1;
}
h2 {
    margin-top: 4px;
}
</style>
