<template>
    <div class="col-1 login-form-field">
        <label class="login-form-label" :for="id">
            <span class="hidden">{{ title }}</span>
            <span class="material-symbols-outlined color-key font-18 bold"> {{ icon }} </span>
            <input
                class="input"
                :id="id"
                :name="name"
                :type="type"
                :placeholder="placeholder"
                :value="modelValue"
                @input="$emit('update:modelValue', $event.target.value)"
            />
        </label>
        <button v-if="showcheck" type="button" class="name-check" @click="$emit('check')">
            <p>{{ checkText }}</p>
        </button>
    </div>
</template>

<script>
export default {
    name: 'BaseInput',
    props: {
        modelValue: { type: String, default: '' }, // ⭐ 추가

        title: { type: String, required: true },
        icon: { type: String, default: '' },
        placeholder: { type: String, default: '' },

        id: { type: String, required: true },
        name: { type: String, default: '' },
        type: { type: String, default: '' },

        showcheck: { type: Boolean, default: false },
        checkText: { type: String, default: '중복확인' }
    },
    emits: ['update:modelValue', 'check']
};
</script>

<style scoped>
.login-form-field {
    width: 100%;
    display: flex;
    align-items: center;
    border-radius: 30px;
    border: 1px solid var(--color-accent-blue);
    box-shadow: 0px 2px 4px 0px var(--color-shadow);
    height: 56px;
    padding: 0 19px;
    background-color: #ffffff;
}

.login-form-label {
    display: flex;
    gap: 25px;
    cursor: pointer;
}

.login-form-field > input {
    margin-left: 25px;
    width: 50%;
    background-color: var(--color-accent-blue);
}
.name-check {
    display: flex;
    border-radius: 35px;
    border: 1px solid var(--color-accent-blue);
    font-size: var(--font-14);
    padding: 7px 10px;
    margin-left: auto;
}
.name-check p {
    text-align: center;
    color: var(--color-gray);
}

.input::placeholder {
    transition: opacity 0.2s;
    color: var(--color-gray);
}

.input:focus::placeholder {
    opacity: 0;
}
</style>
