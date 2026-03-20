export default function ({ store, redirect, route }) {
    // 1. Check Vuex State (This is now populated by nuxtServerInit or login action)
    const user = store.state.user

    // 2. If no user, kick to login
    if (!user) {
        return redirect('/')
    }

    // 3. Strict Role Redirection
    // If a user tries to access a dashboard not meant for them, send them to THEIR dashboard
    const role = user.role
    const path = route.path

    // Define allowed home pages for each role
    const homePages = {
        'Admin': '/auth/admin-dashboard',
        'Instructor': '/auth/instructor-dashboard',
        'Dean': '/auth/dean-dashboard',
        'Chairperson': '/auth/chairperson-dashboard',
        'Guidance': '/auth/guidance-dashboard'
    }

    // If path contains 'dashboard' but doesn't match their role, fix it
    if (path.includes('dashboard')) {
        const correctPage = homePages[role];
        // If the current path is NOT the correct page, redirect
        // (Using 'includes' allows sub-pages if you ever add them)
        if (correctPage && !path.includes(correctPage)) {
            return redirect(correctPage)
        }
    }
}