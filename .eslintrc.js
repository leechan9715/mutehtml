module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: ['plugin:vue/vue3-essential', '@vue/standard', 'eslint:recommended', 'plugin:prettier/recommended'],
    plugins: ['prettier'], // Prettier 플러그인 추가
    parserOptions: {
        parser: '@babel/eslint-parser',
        requireConfigFile: false
    },
    rules: {
        'prettier/prettier': ['error', { endOfLine: 'auto' }],
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'vue/multi-word-component-names': 'off',
        // 'no-unused-vars': 'warn',
        semi: ['error', 'always'], // 세미콜론 강제
        'no-unused-vars': 'off' // 사용하지 않는 변수 경고 비활성화
    }
};
