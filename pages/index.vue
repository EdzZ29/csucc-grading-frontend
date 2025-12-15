<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-green-900 relative overflow-hidden font-sans">

    <SuccessMessage ref="successMsg" />

    <div class="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
      <img src="../assets/image/header-logo.png" class="w-[600px] max-w-none grayscale" alt="Background Pattern" />
    </div>

    <div class="relative z-10 w-full max-w-lg px-4 flex flex-col items-center">

      <div class="text-center mb-8">
        <div class="inline-block bg-white p-3 rounded-full shadow-lg mb-4">
          <img src="../assets/image/header-logo.png" class="h-20 w-auto" alt="CSU Logo" />
        </div>
        <h1 class="text-3xl md:text-4xl font-bold text-white font-epundaslab tracking-wide">
          Grading System
        </h1>
        <p class="text-green-100 font-inria mt-1 tracking-wider text-sm uppercase">
          Caraga State University
        </p>
      </div>

      <div class="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        <div class="h-2 bg-gradient-to-r from-green-600 to-green-800"></div>

        <div class="p-8 md:p-10">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-6 text-center">
            Sign In to your account
          </h2>

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
              class="w-full text-white bg-green-900 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-3 text-center shadow-md transition-all duration-200 transform hover:-translate-y-0.5">
              Login
            </button>
          </form>
        </div>
      </div>

      <div class="mt-8 text-center text-yellow-200 text-xs space-y-1">
        <p>© 2024 Caraga State University. All Rights Reserved.</p>
      </div>

    </div>
  </div>
</template>

<script>
import * as yup from "yup";
import axios from "axios";
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
        // Using Vue 2 reactivity syntax based on your original code ($set)
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

        const res = await axios.post("http://localhost:9000/api/auth/login", {
          email: this.form.email,
          password: this.form.password,
        }, { withCredentials: true });

        this.$refs.successMsg.show("Successfully logged in!", "success");

        setTimeout(() => {
          window.location.href = res.data.redirect;
        }, 2000);
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