<template>
  <transition name="fade">
    <div
      v-if="visible"
      :class="[
        'fixed top-6 left-1/2 px-6 py-3 rounded-lg shadow-lg z-50 transform -translate-x-1/2',
        type === 'success' ? 'bg-black700 text-white' : 'bg-red-500 text-white shake'
      ]"
    >
      {{ message }}
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      message: "",
      type: "success",
      timeoutId: null, // track timeout
    };
  },
  methods: {
    show(msg, type = "success", duration = 3000) {
      this.message = msg;
      this.type = type;
      this.visible = true;

      // clear previous timeout if user triggers again
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }

      // auto-hide after duration for both success & error
      this.timeoutId = setTimeout(() => {
        this.visible = false;
        this.timeoutId = null;
      }, duration);
    },
    hide() {
      this.visible = false;
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }
    },
  },
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10%);
}

@keyframes shake {
  0%, 100% { transform: translateX(-50%); }
  20%, 60% { transform: translateX(calc(-50% - 10px)); }
  40%, 80% { transform: translateX(calc(-50% + 10px)); }
}

.shake {
  animation: shake 0.5s;
}
</style>
