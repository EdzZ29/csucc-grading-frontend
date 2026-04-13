export const state = () => ({
    user: null,
    gradeComputedAt: null  // NEW: Tracks when grades are computed for auto-refresh
})

export const mutations = {
    SET_USER(state, user) {
        state.user = user
    },
    // NEW: Trigger OBE Risk Overview refresh
    TRIGGER_GRADE_REFRESH(state) {
        state.gradeComputedAt = new Date().getTime()
    }
}

export const actions = {
    // 1. Run automatically when the app starts (e.g., on refresh)
    nuxtServerInit({ commit }, { app }) {
        // Check if we have a saved user in the browser cookies
        const user = app.$cookies.get('user')
        if (user) {
            commit('SET_USER', user)
        }
    },

    // 2. Call this when the user logs in
    login({ commit }, user) {
        // Save to Cookie (Persistent)
        this.$cookies.set('user', user, {
            path: '/',
            maxAge: 60 * 60 * 24 * 7 // 7 Days
        })
        // Save to State (Immediate)
        commit('SET_USER', user)
    },

    // 3. Call this when the user logs out
    logout({ commit }) {
        this.$cookies.remove('user')
        commit('SET_USER', null)
    }
}