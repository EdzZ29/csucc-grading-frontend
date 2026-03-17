<template>
  <div class="font-inria min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-4 md:p-6 lg:p-8">
    <!-- Header with decorative element - Consistent with other modules -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-3 md:gap-4">
      <div class="flex items-center gap-3 md:gap-4">
        <div class="w-1 h-10 md:w-1.5 md:h-12 bg-gradient-to-b from-orange-400 to-orange-500 rounded-full"></div>
        <div>
          <h1 class="text-2xl md:text-3xl lg:text-4xl font-bold font-epundaslab text-gray-800">My Profile</h1>
          <p class="text-xs sm:text-sm text-gray-500 flex items-center gap-1 sm:gap-2 mt-0.5 sm:mt-1">
            <span class="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full"></span>
            <span>Manage your personal information and security settings</span>
          </p>
        </div>
      </div>
      
      <!-- Role Badge - Quick identifier -->
      <div v-if="user?.role" class="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 self-start sm:self-auto">
        <span class="text-xs font-medium text-gray-500">Logged in as</span>
        <span class="text-sm font-bold text-orange-500 ml-2">{{ user?.role }}</span>
      </div>
    </div>

    <!-- Main Content Card - Consistent with other modules -->
    <div class="max-w-5xl mx-auto">
      <SuccessMessage ref="messageRef" />

      <!-- Main Profile Card -->
      <div class="bg-white rounded-xl md:rounded-2xl shadow-lg md:shadow-xl border border-gray-200 overflow-hidden">
        
        <!-- Profile Header with Cover Photo Effect - Orange gradient consistent with theme -->
        <div class="relative h-28 sm:h-32 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600">
          <!-- Decorative pattern -->
          <div class="absolute inset-0 opacity-10">
            <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <pattern id="profile-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="white" />
              </pattern>
              <rect x="0" y="0" width="100%" height="100%" fill="url(#profile-pattern)" />
            </svg>
          </div>
          
          <!-- Wave effect at bottom (optional) -->
          <div class="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-6 text-white">
              <path d="M0 48h1440V0c-160 0-320 24-480 24S640 0 480 0 320 24 160 24 0 0 0 0v48z" fill="currentColor"/>
            </svg>
          </div>
        </div>

        <!-- Profile Content -->
        <div class="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
          
          <!-- Avatar Section - Positioned to overlap cover -->
          <div class="flex flex-col md:flex-row gap-4 sm:gap-6 -mt-12 sm:-mt-16 mb-4 sm:mb-6">
            <!-- Avatar -->
            <div class="flex justify-center md:justify-start">
              <div class="relative">
                <div class="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-xl sm:rounded-2xl bg-white p-1 shadow-xl">
                  <img
                    src="../../assets/image/user.png"
                    alt="Profile Avatar"
                    class="w-full h-full rounded-lg sm:rounded-xl object-cover bg-gradient-to-br from-orange-100 to-orange-50"
                  />
                </div>
                <!-- Online Status Badge -->
                <div class="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 border-3 sm:border-4 border-white rounded-full shadow-sm"></div>
              </div>
            </div>

            <!-- User Info Summary -->
            <div class="flex-1 text-center md:text-left mt-2 md:mt-8">
              <h2 class="text-xl sm:text-2xl md:text-3xl font-epundaslab font-bold text-gray-800 break-words">
                {{ user?.firstname }}
                {{ user?.middlename ? user.middlename : '' }}
                {{ user?.lastname }}
                {{ user?.extname ? user.extname : '' }}
              </h2>
              <div class="flex flex-wrap gap-2 sm:gap-3 justify-center md:justify-start mt-2 sm:mt-3">
                <span class="px-3 sm:px-4 py-1 sm:py-1.5 bg-orange-100 text-orange-600 rounded-full text-xs sm:text-sm font-medium flex items-center gap-1">
                  <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {{ user?.role }}
                </span>
                <span class="px-3 sm:px-4 py-1 sm:py-1.5 bg-blue-100 text-blue-600 rounded-full text-xs sm:text-sm font-medium flex items-center gap-1 max-w-full truncate">
                  <svg class="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span class="truncate">{{ user?.email }}</span>
                </span>
              </div>
            </div>
          </div>

          <!-- Divider - Consistent with other modules -->
          <div class="relative my-6 sm:my-8">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200"></div>
            </div>
            <div class="relative flex justify-center">
              <span class="px-3 sm:px-4 bg-white text-xs sm:text-sm text-gray-400 font-inria">Personal Information</span>
            </div>
          </div>

          <!-- Information Grid - Responsive cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
            <!-- Firstname -->
            <div class="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-5 border border-gray-100 hover:shadow-md transition-all hover:border-orange-200 group">
              <div class="flex items-center gap-2 sm:gap-3">
                <div class="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-orange-100 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div class="min-w-0 flex-1">
                  <span class="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider">First Name</span>
                  <p class="text-sm sm:text-base lg:text-lg font-medium text-gray-800 mt-0.5 truncate">{{ user?.firstname }}</p>
                </div>
              </div>
            </div>

            <!-- Lastname -->
            <div class="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-5 border border-gray-100 hover:shadow-md transition-all hover:border-orange-200 group">
              <div class="flex items-center gap-2 sm:gap-3">
                <div class="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div class="min-w-0 flex-1">
                  <span class="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider">Last Name</span>
                  <p class="text-sm sm:text-base lg:text-lg font-medium text-gray-800 mt-0.5 truncate">{{ user?.lastname }}</p>
                </div>
              </div>
            </div>

            <!-- Middlename -->
            <div class="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-5 border border-gray-100 hover:shadow-md transition-all hover:border-orange-200 group">
              <div class="flex items-center gap-2 sm:gap-3">
                <div class="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="min-w-0 flex-1">
                  <span class="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider">Middle Name</span>
                  <p class="text-sm sm:text-base lg:text-lg font-medium text-gray-800 mt-0.5 truncate">{{ user?.middlename || '—' }}</p>
                </div>
              </div>
            </div>

            <!-- Extension Name -->
            <div class="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-5 border border-gray-100 hover:shadow-md transition-all hover:border-orange-200 group">
              <div class="flex items-center gap-2 sm:gap-3">
                <div class="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l5 5a2 2 0 01.586 1.414V19a2 2 0 01-2 2H7a3 3 0 01-3-3V6a3 3 0 013-3z" />
                  </svg>
                </div>
                <div class="min-w-0 flex-1">
                  <span class="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider">Extension</span>
                  <p class="text-sm sm:text-base lg:text-lg font-medium text-gray-800 mt-0.5 truncate">{{ user?.extname || '—' }}</p>
                </div>
              </div>
            </div>

            <!-- Email - Full width on responsive -->
            <div class="sm:col-span-2 lg:col-span-1 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-5 border border-gray-100 hover:shadow-md transition-all hover:border-orange-200 group">
              <div class="flex items-center gap-2 sm:gap-3">
                <div class="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-amber-100 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div class="min-w-0 flex-1">
                  <span class="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider">Email Address</span>
                  <p class="text-xs sm:text-sm lg:text-base font-medium text-gray-800 mt-0.5 truncate">{{ user?.email }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Password Update Section Divider -->
          <div class="relative my-6 sm:my-8">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200"></div>
            </div>
            <div class="relative flex justify-center">
              <span class="px-3 sm:px-4 bg-white text-xs sm:text-sm text-gray-400 font-inria">Security Settings</span>
            </div>
          </div>

          <!-- Password Update Form -->
          <form @submit.prevent="updatePassword" class="max-w-2xl mx-auto">
            <div class="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 border border-gray-200">
              
              <!-- Password Fields -->
              <div class="space-y-4 sm:space-y-5">
                <!-- New Password -->
                <div>
                  <label class="block text-xs sm:text-sm font-semibold text-gray-600 mb-1 sm:mb-2">
                    <span class="flex items-center gap-1 sm:gap-2">
                      <svg class="w-3 h-3 sm:w-4 sm:h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      class="w-full p-2 sm:p-3 pl-3 sm:pl-4 pr-8 sm:pr-10 border border-gray-200 rounded-lg sm:rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white"
                    />
                    <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>

                <!-- Confirm Password -->
                <div>
                  <label class="block text-xs sm:text-sm font-semibold text-gray-600 mb-1 sm:mb-2">
                    <span class="flex items-center gap-1 sm:gap-2">
                      <svg class="w-3 h-3 sm:w-4 sm:h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Confirm Password
                    </span>
                  </label>
                  <input
                    v-model="passwordConfirm"
                    type="password"
                    placeholder="Confirm new password"
                    class="w-full p-2 sm:p-3 border border-gray-200 rounded-lg sm:rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white"
                  />
                </div>

                <!-- Password Strength Indicator -->
                <div v-if="password" class="mt-1 sm:mt-2">
                  <div class="flex items-center gap-1 sm:gap-2">
                    <div class="flex-1 h-1 sm:h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        class="h-full transition-all duration-300"
                        :class="[
                          password.length < 6 ? 'w-1/3 bg-red-400' :
                          password.length < 10 ? 'w-2/3 bg-yellow-400' :
                          'w-full bg-green-400'
                        ]"
                      ></div>
                    </div>
                    <span class="text-[10px] sm:text-xs text-gray-400">
                      {{ password.length < 6 ? 'Weak' : password.length < 10 ? 'Medium' : 'Strong' }}
                    </span>
                  </div>
                </div>

                <!-- Password Match Indicator -->
                <div v-if="password && passwordConfirm" class="text-[10px] sm:text-xs flex items-center gap-1">
                  <svg v-if="password === passwordConfirm" class="w-3 h-3 sm:w-4 sm:h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <svg v-else class="w-3 h-3 sm:w-4 sm:h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span :class="password === passwordConfirm ? 'text-green-600' : 'text-red-500'">
                    {{ password === passwordConfirm ? 'Passwords match' : 'Passwords do not match' }}
                  </span>
                </div>
              </div>

              <!-- Update Button - Consistent with other modules -->
              <div class="flex justify-end mt-4 sm:mt-6">
                <button
                  type="submit"
                  class="w-full sm:w-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 lg:py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-1 sm:gap-2"
                >
                  <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Update Password
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- Footer Note - Consistent with other modules -->
      <div class="mt-4 sm:mt-6 text-center text-[10px] sm:text-xs text-gray-400">
        <p>Last updated: {{ new Date().toLocaleDateString() }}</p>
      </div>
    </div>
  </div>
</template>


<script>
import SuccessMessage from "@/components/success-message.vue";
 
export default {
  name: "ProfilePage",
  components: { SuccessMessage },
  props: {
    user: { type: Object, default: null }
  },
  data() {
    return {
      password: "",
      passwordConfirm: "",
    };
  },
  methods: {
    async updatePassword() {
      if (!this.password || !this.passwordConfirm) {
        this.$refs.messageRef.show("Please fill both password fields.", "error");
        return;
      }
      if (this.password !== this.passwordConfirm) {
        this.$refs.messageRef.show("Passwords do not match!", "error");
        return;
      }
 
      try {
        await this.$axios.put(
          "/auth/user/update-password",
          {
            password: this.password,
            password_confirm: this.passwordConfirm,
          },
          { withCredentials: true }
        );
 
        this.$refs.messageRef.show("Password updated successfully!", "success");
        this.password = "";
        this.passwordConfirm = "";
      } catch (err) {
        console.error(err);
        this.$refs.messageRef.show(
          err.response?.data?.message || "Failed to update password.",
          "error"
        );
      }
    },
  },
};
</script>
