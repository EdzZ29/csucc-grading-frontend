<template>
  <div class="text-gray-800 container mx-auto px-4 py-6">
    <!-- Header with decorative element -->
    <div class="mb-8 flex items-center gap-3">
      <div class="w-1 h-8 bg-gradient-to-b from-orange-400 to-orange-500 rounded-full"></div>
      <h1 class="font-epundaslab font-bold text-3xl text-gray-800">My Profile</h1>
    </div>

    <div class="font-inria max-w-5xl mx-auto">
      <SuccessMessage ref="messageRef" />

      <!-- Main Profile Card -->
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        
        <!-- Profile Header with Cover Photo Effect -->
        <div class="relative h-32 bg-gradient-to-r from-orange-400 via-orange-500 to-pink-500">
          <!-- Decorative pattern -->
          <div class="absolute inset-0 opacity-10">
            <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <pattern id="pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="white" />
              </pattern>
              <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern)" />
            </svg>
          </div>
        </div>

        <!-- Profile Content -->
        <div class="px-6 pb-8">
          
          <!-- Avatar Section - Positioned to overlap cover -->
          <div class="flex flex-col md:flex-row gap-6 -mt-16 mb-6">
            <!-- Avatar -->
            <div class="flex justify-center md:justify-start">
              <div class="relative">
                <div class="w-32 h-32 rounded-2xl bg-white p-1 shadow-xl">
                  <img
                    src="../../assets/image/user.png"
                    alt="Profile Avatar"
                    class="w-full h-full rounded-xl object-cover bg-gradient-to-br from-orange-100 to-orange-50"
                  />
                </div>
                <!-- Online Status Badge -->
                <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
              </div>
            </div>

            <!-- User Info Summary -->
            <div class="flex-1 text-center md:text-left mt-4 md:mt-8">
              <h2 class="text-2xl md:text-3xl font-epundaslab font-bold text-gray-800">
                {{ user?.firstname }}
                {{ user?.middlename ? user.middlename : '' }}
                {{ user?.lastname }}
                {{ user?.extname ? user.extname : '' }}
              </h2>
              <div class="flex flex-wrap gap-3 justify-center md:justify-start mt-3">
                <span class="px-4 py-1.5 bg-orange-100 text-orange-600 rounded-full text-sm font-medium flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {{ user?.role }}
                </span>
                <span class="px-4 py-1.5 bg-blue-100 text-blue-600 rounded-full text-sm font-medium flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {{ user?.email }}
                </span>
              </div>
            </div>
          </div>

          <!-- Divider -->
          <div class="relative my-8">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200"></div>
            </div>
            <div class="relative flex justify-center">
              <span class="px-4 bg-white text-sm text-gray-400 font-inria">Personal Information</span>
            </div>
          </div>

          <!-- Information Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <!-- Firstname -->
            <div class="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-5 border border-gray-100 hover:shadow-md transition-shadow">
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                  <svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">First Name</span>
                  <p class="text-lg font-medium text-gray-800 mt-1">{{ user?.firstname }}</p>
                </div>
              </div>
            </div>

            <!-- Lastname -->
            <div class="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-5 border border-gray-100 hover:shadow-md transition-shadow">
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                  <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Last Name</span>
                  <p class="text-lg font-medium text-gray-800 mt-1">{{ user?.lastname }}</p>
                </div>
              </div>
            </div>

            <!-- Middlename -->
            <div class="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-5 border border-gray-100 hover:shadow-md transition-shadow">
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Middle Name</span>
                  <p class="text-lg font-medium text-gray-800 mt-1">{{ user?.middlename || '—' }}</p>
                </div>
              </div>
            </div>

            <!-- Extension Name -->
            <div class="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-5 border border-gray-100 hover:shadow-md transition-shadow">
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                  <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l5 5a2 2 0 01.586 1.414V19a2 2 0 01-2 2H7a3 3 0 01-3-3V6a3 3 0 013-3z" />
                  </svg>
                </div>
                <div>
                  <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Extension</span>
                  <p class="text-lg font-medium text-gray-800 mt-1">{{ user?.extname || '—' }}</p>
                </div>
              </div>
            </div>

            <!-- Email -->
            <div class="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-5 border border-gray-100 hover:shadow-md transition-shadow md:col-span-2 lg:col-span-1">
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                  <svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email Address</span>
                  <p class="text-base font-medium text-gray-800 mt-1 truncate">{{ user?.email }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Password Update Section -->
          <div class="relative my-8">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200"></div>
            </div>
            <div class="relative flex justify-center">
              <span class="px-4 bg-white text-sm text-gray-400 font-inria">Security Settings</span>
            </div>
          </div>

          <form @submit.prevent="updatePassword" class="max-w-2xl mx-auto">
            <div class="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl p-6 border border-gray-200">
              
              <!-- Password Fields -->
              <div class="space-y-5">
                <!-- New Password -->
                <div>
                  <label class="block text-sm font-semibold text-gray-600 mb-2">
                    <span class="flex items-center gap-2">
                      <svg class="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      New Password
                    </span>
                  </label>
                  <div class="relative">
                    <input
                      v-model="password"
                      type="password"
                      placeholder="Enter new password"
                      class="w-full p-3 pl-4 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white"
                    />
                    <svg class="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>

                <!-- Confirm Password -->
                <div>
                  <label class="block text-sm font-semibold text-gray-600 mb-2">
                    <span class="flex items-center gap-2">
                      <svg class="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Confirm Password
                    </span>
                  </label>
                  <input
                    v-model="passwordConfirm"
                    type="password"
                    placeholder="Confirm new password"
                    class="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white"
                  />
                </div>

                <!-- Password Strength Indicator (Optional) -->
                <div v-if="password" class="mt-2">
                  <div class="flex items-center gap-2">
                    <div class="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        class="h-full transition-all duration-300"
                        :class="[
                          password.length < 6 ? 'w-1/3 bg-red-400' :
                          password.length < 10 ? 'w-2/3 bg-yellow-400' :
                          'w-full bg-green-400'
                        ]"
                      ></div>
                    </div>
                    <span class="text-xs text-gray-400">
                      {{ password.length < 6 ? 'Weak' : password.length < 10 ? 'Medium' : 'Strong' }}
                    </span>
                  </div>
                </div>

                <!-- Password Match Indicator -->
                <div v-if="password && passwordConfirm" class="text-xs flex items-center gap-1">
                  <svg v-if="password === passwordConfirm" class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <svg v-else class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span :class="password === passwordConfirm ? 'text-green-600' : 'text-red-500'">
                    {{ password === passwordConfirm ? 'Passwords match' : 'Passwords do not match' }}
                  </span>
                </div>
              </div>

              <!-- Update Button -->
              <div class="flex justify-end mt-6">
                <button
                  type="submit"
                  class="px-8 py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-xl text-sm font-bold hover:from-orange-500 hover:to-orange-600 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Update Password
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- Footer Note -->
      <div class="mt-6 text-center text-xs text-gray-400">
        <p>Last updated: {{ new Date().toLocaleDateString() }}</p>
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
