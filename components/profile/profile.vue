<template>
  <div class="text-gray-800 container mx-auto px-4">
    <p class="font-epundaslab font-bold text-3xl mb-5">Profile</p>

    <div
      class="font-inria bg-white shadow-lg rounded-lg overflow-hidden flex flex-col md:flex-row mt-8 border-l-8 border-green-700"
    >
      <SuccessMessage ref="messageRef" />

      <!-- Profile Sidebar -->
      <div
        class="mt-5 w-full md:w-1/3 bg-gradient-to-br from-orange-400 to-pink-500 p-6 flex flex-col items-center text-white"
      >
        <img
          src="../../assets/image/user.png"
          alt=""
          class="w-24 h-24 rounded-full object-cover"
        />
        <h2 class="mt-4 text-xl font-bold text-black text-center">
          {{ user?.firstname }}
          {{ user?.middlename ? user.middlename : '' }}
          {{ user?.lastname }}
          {{ user?.extname ? user.extname : '' }}
        </h2>
        <p class="mt-1 text-md text-black text-center">{{ user?.role }}</p>
      </div>

      <!-- Profile Information -->
      <div class="w-full md:w-2/3 p-6">
        <h3 class="text-lg font-semibold mb-4">Information</h3>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <span class="font-semibold text-gray-700">Firstname</span>
            <p class="text-gray-800 break-words">{{ user?.firstname }}</p>
          </div>
          <div>
            <span class="font-semibold text-gray-700">Middlename</span>
            <p class="text-gray-800 break-words">
              {{ user?.middlename || 'N/A' }}
            </p>
          </div>
          <div>
            <span class="font-semibold text-gray-700">Lastname</span>
            <p class="text-gray-800 break-words">{{ user?.lastname }}</p>
          </div>
          <div>
            <span class="font-semibold text-gray-700">Extname</span>
            <p class="text-gray-800 break-words">
              {{ user?.extname || 'N/A' }}
            </p>
          </div>
          <div>
            <span class="font-semibold text-gray-700">Email</span>
            <p class="text-gray-800 break-words">{{ user?.email }}</p>
          </div>
          <div>
            <span class="font-semibold text-gray-700">Role</span>
            <p class="text-gray-800 break-words">{{ user?.role }}</p>
          </div>
        </div>

        <hr class="my-4" />

        <!-- Password Update -->
        <form @submit.prevent="updatePassword" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <label class="font-semibold text-gray-700">New Password</label>
            <input
              v-model="password"
              type="password"
              placeholder="Enter new password"
              class="w-full p-2 border rounded"
            />
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <label class="font-semibold text-gray-700">Confirm Password</label>
            <input
              v-model="passwordConfirm"
              type="password"
              placeholder="Confirm new password"
              class="w-full p-2 border rounded"
            />
          </div>
          <div class="text-right">
            <button
              type="submit"
              class="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import SuccessMessage from '@/components/success-message.vue';

const user = ref(null);
const password = ref('');
const passwordConfirm = ref('');
const messageRef = ref(null);

const fetchUser = async () => {
  try {
    const response = await axios.get('http://localhost:9000/api/auth/user', {
      withCredentials: true
    });
    user.value = response.data;
  } catch (err) {
    console.error(err);
    messageRef.value?.show('Failed to load user data', 'error');
  }
};

const updatePassword = async () => {
  if (!password.value || !passwordConfirm.value) {
    messageRef.value?.show('Please fill both password fields.', 'error');
    return;
  }
  if (password.value !== passwordConfirm.value) {
    messageRef.value?.show('Passwords do not match!', 'error');
    return;
  }

  try {
    // No ID needed in URL, backend gets it from cookie/token
    await axios.put(
      `http://localhost:9000/api/auth/user/update-password`,
      {
        password: password.value,
        password_confirm: passwordConfirm.value
      },
      { withCredentials: true }
    );

    messageRef.value?.show('Password updated successfully!', 'success');
    password.value = '';
    passwordConfirm.value = '';
  } catch (err) {
    console.error(err);
    messageRef.value?.show(
      err.response?.data?.message || 'Failed to update password.',
      'error'
    );
  }
};

onMounted(fetchUser);
</script>
