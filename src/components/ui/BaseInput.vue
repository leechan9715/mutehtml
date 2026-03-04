<template>
    <div class="col-1 login-form-field">
        <label class="login-form-label" :for="id">
            <span class="hidden">{{ title }}</span>
            <span class="material-symbols-outlined color-primary-3 font-16 bold"> {{ icon }} </span>
            <input class="input" :id="id" :name="name" :type="type" :placeholder="placeholder" />
        </label>
        <button v-if="showcheck" type="button" class="name-check">
            <p>{{ checkText }}</p>
        </button>
    </div>
</template>

<script>
export default {
    name: 'BaseInput',
    props: {
        title: { type: String, required: true },
        icon: { type: String, default: '' },
        placeholder: { type: String, default: '' },

        id: { type: String, required: true },
        name: { type: String, default: '' },
        type: { type: String, default: '' },

        showcheck: { type: Boolean, default: false },
        checkText: { type: String, default: '중복확인' }
    }
};
</script>

<style scoped>
.login-form-field {
    width: 100%;
    display: flex;
    align-items: center;
    border-radius: 30px;
    border: 1px solid #bbd1ff;
    box-shadow: 0px 2px 4px 0px rgba(218, 229, 255, 1);
    height: 56px;
    padding: 0 19px;
    background-color: #ffffff;
}

.login-form-label {
    display: flex;
    gap: 25px;
    cursor: pointer;
    width: 100%;
    align-items: center;
}

/* ✅ 여기 수정 */
.login-form-field .input {
    font-size: 16px;
    width: 100%;
    border: none;
    outline: none;
    background: transparent;
}

/* ✅ placeholder 숨김 */
.login-form-field .input::placeholder {
    transition: opacity 0.15s ease;
}
.login-form-field .input:focus::placeholder {
    opacity: 0;
}

.name-check {
    display: flex;
    border-radius: 35px;
    border: 1px solid var(--color-surface);
    font-size: var(--font-14);
    padding: 7px 10px;
    margin-left: auto;
}

.name-check p {
    width: 50px;
    text-align: center;
    color: var(--color-black);
    opacity: 50%;
}
</style>
