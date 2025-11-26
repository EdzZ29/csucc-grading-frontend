<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">

    <SuccessMessage ref="successMsg" />

    <form
      @submit.prevent="onSubmit"
      class="w-full max-w-sm bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
    >
      <div class="mb-5">
        <label
          for="email"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Email
        </label>
        <input
          v-model="form.email"
          @input="validateField('email')"
          type="email"
          id="email"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        <p v-if="errors.email" class="text-red-500 text-sm mt-2">
          {{ errors.email }}
        </p>
        <p v-if="backendError" class="text-red-600 text-sm mt-2">
          {{ backendError }}
        </p>
      </div>

      <div class="mb-5">
        <label
          for="password"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Password
        </label>
        <input
          v-model="form.password"
          @input="validateField('password')"
          type="password"
          id="password"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        <p v-if="errors.password" class="text-red-500 text-sm mt-2">
          {{ errors.password }}
        </p>
      </div>

      <div class="flex items-center mb-5">
        <input
          id="remember"
          type="checkbox"
          v-model="form.remember"
          class="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
        />
        <label
          for="remember"
          class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          Remember me
        </label>
      </div>

      <button
        type="submit"
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Submit
      </button>
    </form>
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
        } else if (err.inner) {
          err.inner.forEach((e) => { this.$set(this.errors, e.path, e.message); });
        } else {
          this.$refs.successMsg.show("Something went wrong. Please try again.", "error");
        }
      }
    },
  },
};
</script>
