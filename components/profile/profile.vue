<template>
  <div class="font-inria min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-4 md:p-6 lg:p-8">
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
      <div v-if="user?.role" class="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 self-start sm:self-auto">
        <span class="text-xs font-medium text-gray-500">Logged in as</span>
        <span class="text-sm font-bold text-orange-500 ml-2">{{ user?.role }}</span>
      </div>
    </div>

    <div class="max-w-5xl mx-auto">
      <SuccessMessage ref="messageRef" />

      <div class="bg-white rounded-xl md:rounded-2xl shadow-lg md:shadow-xl border border-gray-200 overflow-hidden">

        <!-- Cover -->
        <div class="relative h-28 sm:h-32 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600">
          <div class="absolute inset-0 opacity-10">
            <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <pattern id="profile-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="white" />
              </pattern>
              <rect x="0" y="0" width="100%" height="100%" fill="url(#profile-pattern)" />
            </svg>
          </div>
          <div class="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-6 text-white">
              <path d="M0 48h1440V0c-160 0-320 24-480 24S640 0 480 0 320 24 160 24 0 0 0 0v48z" fill="currentColor"/>
            </svg>
          </div>
        </div>

        <!-- Profile Content -->
        <div class="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">

          <!-- Avatar + Info Row -->
          <div class="flex flex-col md:flex-row gap-4 sm:gap-6 -mt-12 sm:-mt-16 mb-4 sm:mb-6">

            <!-- Avatar with upload -->
            <div class="flex justify-center md:justify-start">
              <div class="relative group">
                <div class="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-xl sm:rounded-2xl bg-white p-1 shadow-xl">
                  <img
                    :src="profilePicture || defaultAvatar"
                    alt="Profile Avatar"
                    class="w-full h-full rounded-lg sm:rounded-xl object-cover bg-gradient-to-br from-orange-100 to-orange-50"
                  />
                </div>
                <!-- Online badge -->
                <div class="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 border-2 border-white rounded-full shadow-sm z-10"></div>
                <!-- Camera overlay -->
                <div
                  @click="triggerFileInput"
                  class="absolute inset-0 rounded-xl sm:rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex flex-col items-center justify-center gap-1 m-1"
                >
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span class="text-white text-[10px] font-bold">Change</span>
                </div>
                <!-- Hidden file input -->
                <input
                  ref="avatarInput"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  class="hidden"
                  @change="onAvatarChange"
                />
              </div>
            </div>

            <!-- User Info -->
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
              <!-- Remove picture link -->
              <button
                v-if="profilePicture"
                @click="removePicture"
                class="mt-3 text-xs text-red-400 hover:text-red-600 flex items-center gap-1 mx-auto md:mx-0 transition-colors"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Remove picture
              </button>
            </div>
          </div>

          <!-- Personal Info Divider -->
          <div class="relative my-6 sm:my-8">
            <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-gray-200"></div></div>
            <div class="relative flex justify-center">
              <span class="px-3 sm:px-4 bg-white text-xs sm:text-sm text-gray-400 font-inria">Personal Information</span>
            </div>
          </div>

          <!-- Info Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
            <div class="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-5 border border-gray-100 hover:shadow-md transition-all hover:border-orange-200 group">
              <div class="flex items-center gap-2 sm:gap-3">
                <div class="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-orange-100 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <div class="min-w-0 flex-1">
                  <span class="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider">First Name</span>
                  <p class="text-sm sm:text-base lg:text-lg font-medium text-gray-800 mt-0.5 truncate">{{ user?.firstname }}</p>
                </div>
              </div>
            </div>
            <div class="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-5 border border-gray-100 hover:shadow-md transition-all hover:border-orange-200 group">
              <div class="flex items-center gap-2 sm:gap-3">
                <div class="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <div class="min-w-0 flex-1">
                  <span class="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider">Last Name</span>
                  <p class="text-sm sm:text-base lg:text-lg font-medium text-gray-800 mt-0.5 truncate">{{ user?.lastname }}</p>
                </div>
              </div>
            </div>
            <div class="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-5 border border-gray-100 hover:shadow-md transition-all hover:border-orange-200 group">
              <div class="flex items-center gap-2 sm:gap-3">
                <div class="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div class="min-w-0 flex-1">
                  <span class="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider">Middle Name</span>
                  <p class="text-sm sm:text-base lg:text-lg font-medium text-gray-800 mt-0.5 truncate">{{ user?.middlename || '—' }}</p>
                </div>
              </div>
            </div>
            <div class="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-5 border border-gray-100 hover:shadow-md transition-all hover:border-orange-200 group">
              <div class="flex items-center gap-2 sm:gap-3">
                <div class="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l5 5a2 2 0 01.586 1.414V19a2 2 0 01-2 2H7a3 3 0 01-3-3V6a3 3 0 013-3z" /></svg>
                </div>
                <div class="min-w-0 flex-1">
                  <span class="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider">Extension</span>
                  <p class="text-sm sm:text-base lg:text-lg font-medium text-gray-800 mt-0.5 truncate">{{ user?.extname || '—' }}</p>
                </div>
              </div>
            </div>
            <div class="sm:col-span-2 lg:col-span-1 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-5 border border-gray-100 hover:shadow-md transition-all hover:border-orange-200 group">
              <div class="flex items-center gap-2 sm:gap-3">
                <div class="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-amber-100 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <div class="min-w-0 flex-1">
                  <span class="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider">Email Address</span>
                  <p class="text-xs sm:text-sm lg:text-base font-medium text-gray-800 mt-0.5 truncate">{{ user?.email }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Security Divider -->
          <div class="relative my-6 sm:my-8">
            <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-gray-200"></div></div>
            <div class="relative flex justify-center">
              <span class="px-3 sm:px-4 bg-white text-xs sm:text-sm text-gray-400 font-inria">Security Settings</span>
            </div>
          </div>

          <!-- Password Form -->
          <form @submit.prevent="updatePassword" class="max-w-2xl mx-auto">
            <div class="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 border border-gray-200">
              <div class="space-y-4 sm:space-y-5">
                <div>
                  <label class="block text-xs sm:text-sm font-semibold text-gray-600 mb-1 sm:mb-2">
                    <span class="flex items-center gap-1 sm:gap-2">
                      <svg class="w-3 h-3 sm:w-4 sm:h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                      New Password
                    </span>
                  </label>
                  <input v-model="password" type="password" placeholder="Enter new password"
                    class="w-full p-2 sm:p-3 border border-gray-200 rounded-lg sm:rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white" />
                </div>
                <div>
                  <label class="block text-xs sm:text-sm font-semibold text-gray-600 mb-1 sm:mb-2">
                    <span class="flex items-center gap-1 sm:gap-2">
                      <svg class="w-3 h-3 sm:w-4 sm:h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                      Confirm Password
                    </span>
                  </label>
                  <input v-model="passwordConfirm" type="password" placeholder="Confirm new password"
                    class="w-full p-2 sm:p-3 border border-gray-200 rounded-lg sm:rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white" />
                </div>
                <div v-if="password">
                  <div class="flex items-center gap-2">
                    <div class="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div class="h-full transition-all duration-300"
                        :class="[password.length < 6 ? 'w-1/3 bg-red-400' : password.length < 10 ? 'w-2/3 bg-yellow-400' : 'w-full bg-green-400']"></div>
                    </div>
                    <span class="text-xs text-gray-400">{{ password.length < 6 ? 'Weak' : password.length < 10 ? 'Medium' : 'Strong' }}</span>
                  </div>
                </div>
                <div v-if="password && passwordConfirm" class="text-xs flex items-center gap-1">
                  <svg v-if="password === passwordConfirm" class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                  <svg v-else class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  <span :class="password === passwordConfirm ? 'text-green-600' : 'text-red-500'">
                    {{ password === passwordConfirm ? 'Passwords match' : 'Passwords do not match' }}
                  </span>
                </div>
              </div>
              <div class="flex justify-end mt-4 sm:mt-6">
                <button type="submit"
                  class="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl text-sm font-bold hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  Update Password
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div class="mt-4 sm:mt-6 text-center text-xs text-gray-400">
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
      profilePicture: null,
      defaultAvatar: require("../../assets/image/user.png"),
    };
  },
  mounted() {
    this.loadProfilePicture();
  },
  watch: {
    user(val) {
      if (val) this.loadProfilePicture();
    }
  },
  methods: {

    // ── Profile Picture ──────────────────────────────────────────────

    loadProfilePicture() {
      if (!this.user?.empid) return;
      try {
        const saved = localStorage.getItem("profile_pic_" + this.user.empid);
        this.profilePicture = saved || null;
      } catch (e) {
        this.profilePicture = null;
      }
    },

    triggerFileInput() {
      this.$refs.avatarInput.click();
    },

    onAvatarChange(e) {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      if (file.size > 2 * 1024 * 1024) {
        this.$refs.messageRef.show("Image must be under 2MB.", "error");
        e.target.value = null;
        return;
      }

      const reader = new FileReader();
      reader.onload = (ev) => {
        this.profilePicture = ev.target.result;
        try {
          if (this.user?.empid) {
            localStorage.setItem("profile_pic_" + this.user.empid, ev.target.result);
          }
        } catch (err) {
          console.warn("localStorage full — picture not saved persistently");
        }
        this.$refs.messageRef.show("Profile picture updated!", "success");
      };
      reader.readAsDataURL(file);
      e.target.value = null;
    },

    removePicture() {
      this.profilePicture = null;
      if (this.user?.empid) {
        try { localStorage.removeItem("profile_pic_" + this.user.empid); } catch (e) {}
      }
      this.$refs.messageRef.show("Profile picture removed.", "success");
    },

    // ── Password ─────────────────────────────────────────────────────

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
          { password: this.password, password_confirm: this.passwordConfirm },
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