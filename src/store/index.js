import { createStore } from 'vuex';
import api from '@/api';

export default createStore({
    state: {
        // 전역에서 로그인 상태를 쓰고 싶으면 여기에 두고,
        // 모듈로만 쓰고 싶으면 state 비워도 됨.
    },

    getters: {},

    mutations: {},

    actions: {},

    modules: {
        auth: {
            namespaced: true,

            state: () => ({
                isLoggedIn: false,
                user: null,
                _bootstrapChecked: false
            }),

            getters: {
                isLoggedIn: (state) => state.isLoggedIn,
                user: (state) => state.user
            },

            mutations: {
                SET_AUTH(state, payload) {
                    state.isLoggedIn = payload.isLoggedIn;
                    state.user = payload.user;
                },
                SET_BOOTSTRAP_CHECKED(state, val) {
                    state._bootstrapChecked = val;
                }
            },

            actions: {
                async checkAuth({ state, commit }, force = false) {
                    if (state._bootstrapChecked && !force) return;

                    try {
                        const { data } = await api.get('/auth/check_login.php');
                        const isLoggedIn = !!data.logged_in;

                        // ✅ B 버전: 서버가 user 객체를 내려줌
                        const user = isLoggedIn ? (data.user ?? null) : null;

                        commit('SET_AUTH', { isLoggedIn, user });
                    } catch (e) {
                        commit('SET_AUTH', { isLoggedIn: false, user: null });
                    } finally {
                        commit('SET_BOOTSTRAP_CHECKED', true);
                    }
                },

                async login({ dispatch }, { username, password }) {
                    const { data } = await api.post('/auth/login.php', { username, password });
                    if (!data?.success) throw new Error('login failed');

                    await dispatch('checkAuth', true);
                },

                async register(_ctx, { username, password, email, phone, nickname }) {
                    const { data } = await api.post('/auth/register.php', {
                        username,
                        password,
                        email,
                        phone,
                        nickname
                    });
                    if (!data?.success) throw new Error(data?.message || 'register failed');
                },

                async logout({ commit }) {
                    await api.post('/auth/logout.php', {});
                    commit('SET_AUTH', { isLoggedIn: false, user: null });
                    commit('SET_BOOTSTRAP_CHECKED', true);
                }
            }
        }
    }
});
