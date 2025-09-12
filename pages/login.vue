
<template>
  <div class="min-h-screen bg-cover bg-center" :style="{ backgroundImage: `url(${bgImage})` }">
    <!-- Navbar -->
    <nav class="bg-white shadow-md w-full">
      <div class="flex justify-between items-center max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <a href="#" class="flex items-center space-x-3">
          <img src="../assets/image/header-logo.png" alt="Csucc Logo" class="h-8 sm:h-10 md:h-12" />
        </a>
      </div>
    </nav>

    <!-- Main Content -->
    <div 
      class=" flex flex-col md:flex-row justify-center items-center md:items-start max-w-screen-xl mx-auto p-6 mt-12 md:mt-24 gap-12 md:gap-24"
      
      >
      <!-- Info Section -->
      <div class="p-4 sm:p-6 flex-1 max-w-4xl mx-auto text-center">
        <img
          src="../assets/image/site-logo.svg"
          alt="Site Logo"
          class="h-36 sm:h-48 md:h-60 mx-auto mb-4 sm:mb-6"
        />
        <h1
          class="font-bold font-epundaslab text-4xl sm:text-5xl md:text-5xl text-gray-800 leading-snug "
        >
          CARAGA STATE UNIVERSITY
        </h1>
        <p class="text-lg font-poppins font-semibold sm:text-lg text-gray-600 mt-1">CABADBARAN CAMPUS</p>
        <p
          class="font-epundaslab text-gray-500 mt-4 sm:mt-5 text-sm sm:text-base md:text-lg"
        >
          A socially-engaged digital, innovation, and entrepreneurial university
          excelling globally in science, engineering, and the arts by 2028.
        </p>
      </div>

      <!-- Login Form -->
      <div
        class="bg-white border shadow-md p-4 sm:p-6 flex-1 max-w-sm sm:max-w-md md:mt-16 mx-auto w-full"
      >
        <h2 class="text-xl font-epundaslab sm:text-2xl font-bold text-gray-800 text-center mb-1">
          Login
        </h2>
        <p class="mb-6 text-center text-xs sm:text-sm font-inria font-regular text-gray-400">
          Please enter your details to login.
        </p>
         <form @submit.prevent="login">
            <input v-model="email" type="email" placeholder="Email" class="font-inria w-full mb-6 p-2 border"/>
            
            <input
            
              v-model="password"
              type="password"
              placeholder="Password"
              class="w-full mb-4 p-2 border font-inria "
            />
            <button
              type="submit"
              class="w-full bg-green-700 font-inria hover:bg-green-800 transition text-white p-2 mt-4"
            >
              Login
            </button>
          </form>

          <p v-if="error" class="text-red-500 mt-3">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import bgImage from '@/assets/image/background-image.png'

export default {

  middleware: 'auth',

  data() {
    return {
      bgImage,
      email: '',
      password: '',
      error: null
    }
  },

  
  methods: {
    async login() {
      try {
        const res = await this.$axios.post('/login', {
          email: this.email,
          password: this.password
        })

        this.$store.commit('auth/setUser', {
          email: this.email,
          role: res.data.role,
          token: res.data.access_token
        })


        localStorage.setItem('user', JSON.stringify(res.data))

        if (res.data.role === 'Admin') {
          this.$router.push('/admin')
        } else if (res.data.role === 'Instructor') {
          this.$router.push('/auth/users/instructor-module')
        } else {
          this.$router.push('/')
        }
      } catch (err) {
        this.error = err.response?.data?.message || 'Login failed'
      }
    },

  }
}
</script>
