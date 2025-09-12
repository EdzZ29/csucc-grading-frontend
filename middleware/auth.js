export default async function ({ $axios, redirect, store }) {
  try {
    if (!store.state.auth.user) {
      const res = await $axios.get('/user', { withCredentials: true });
      store.commit('auth/setUser', res.data);
    }
  } catch (err) {
    return redirect('/login');
  }
}
