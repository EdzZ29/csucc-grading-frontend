<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-orange400 relative overflow-hidden font-sans">

    <SuccessMessage ref="successMsg" />

    <div class="absolute inset-0 flex items-center justify-center opacity-25 pointer-events-none">
      <img src="../assets/image/bg-ceit.jpg" class="w-full max-w-none grayscale" alt="Background Pattern" />
    </div>

    <div class="relative z-10 w-full max-w-lg px-4 flex flex-col items-center">

      <div class="text-center mb-8 mt-4">
        <div class="inline-block bg-white p-3 rounded-full shadow-lg mb-4">
          <img src="../assets/image/ceit-logo.png" class="h-28 w-auto" alt="CSU Logo" />
        </div>
        <h1 class="text-3xl md:text-4xl font-bold text-white font-epundaslab tracking-wide">
          Grading System
        </h1>
        <p class="text-white font-inria mt-1 tracking-wider text-sm uppercase">
          Caraga State University
        </p>
        <p class="text-white font-inria mt-1 tracking-wider text-md font-bold uppercase">
          College of Engineering and Information Technology
        </p>
      </div>

      <div class="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        <div class="h-2 bg-black700"></div>

        <div class="p-8 md:p-10">
          <h2 class="text-xl font-semibold font-inria text-black700 dark:text-white text-center">
            Sign In to your account
          </h2>
          <p class="text-gray-600 dark:text-gray-300 text-center text-sm mb-6">
            Please login to continue
          </p>

          <form @submit.prevent="onSubmit">
            <div class="mb-5">
              <label for="email" class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <div class="relative">
                <input v-model="form.email" @input="validateField('email')" type="email" id="email"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="name@csu.edu.ph" />
              </div>
              <p v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email }}</p>
              <p v-if="backendError" class="text-red-600 text-xs mt-1">{{ backendError }}</p>
            </div>

            <div class="mb-6">
              <div class="flex justify-between mb-2">
                <label for="password" class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
              </div>
              <input v-model="form.password" @input="validateField('password')" type="password" id="password"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="••••••••" />
              <p v-if="errors.password" class="text-red-500 text-xs mt-1">{{ errors.password }}</p>
            </div>

            <button type="submit"
              class="w-full text-white bg-orange400 hover:bg-orange300 focus:ring-2 focus:outline-none focus:ring-black700 font-medium rounded-lg text-sm px-5 py-3 text-center shadow-md transition-all duration-200 transform hover:-translate-y-0.5">
              Login
            </button>
          </form>
        </div>
      </div>

      <div class="mt-20 mb-4 text-center text-white text-xs space-y-1">
        <p>© 2024 Caraga State University. All Rights Reserved.</p>
      </div>

    </div>
  </div>
</template>

<script>
import * as yup from "yup";
import SuccessMessage from "@/components/success-message.vue";

export default {
  components: { SuccessMessage },
  data() {
    return {
      form: { email: "", password: "", remember: false },
      errors: {},
      backendError: "",
      schema: yup.object().shape({
        email: yup.string().email("Please enter a valid email").required("Email is required"),
        password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
      }),
    };
  },
  methods: {
    async validateField(field) {
      try {
        await this.schema.validateAt(field, this.form);
        this.$set(this.errors, field, "");
      } catch (err) {
        this.$set(this.errors, field, err.message);
      }
    },

    async onSubmit() {
      this.errors = {};
      this.backendError = "";

      try {
        await this.schema.validate(this.form, { abortEarly: false });

        // ── Use this.$axios so it reads BASE_URL from nuxt.config publicRuntimeConfig ──
        const loginRes = await this.$axios.post("/auth/login", {
          email: this.form.email,
          password: this.form.password,
        }, { withCredentials: true });

        const userRes = await this.$axios.get("/auth/user", { withCredentials: true });

        this.$store.dispatch('login', userRes.data);

        this.$refs.successMsg.show("Successfully logged in!", "success");

        setTimeout(() => {
          let path = loginRes.data.redirect;
          if (!path.startsWith('/')) {
            path = '/' + path;
          }
          console.log(path);
          this.$router.push(path);
        }, 1000);

      } catch (err) {
        if (err.response && err.response.data.message) {
          this.$refs.successMsg.show(err.response.data.message, "error");
          this.backendError = err.response.data.message;
        } else if (err.inner) {
          err.inner.forEach((e) => {
            this.$set(this.errors, e.path, e.message);
          });
        } else {
          this.$refs.successMsg.show("Something went wrong. Please try again.", "error");
        }
      }
    },
  },
};
</script>