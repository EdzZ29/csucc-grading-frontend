<template>
  <!-- ✅ Notification Modal -->
  <div 
    v-if="message" 
    class="fixed top-4 right-4 z-50 w-full max-w-sm"
  >
    <div 
      class="rounded shadow-lg p-1 text-center animate-slideDown"
      :class="type === 'success' ? 'bg-green-700 text-white' : 'bg-red-600 text-white'"
    >
      <p class="font-semibold">
        {{ message }}
      </p>
      <button 
        @click="$emit('close')" 
        class="mt-2 text-sm underline text-white"
      >
        Close
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: { type: String, default: "success" },
    message: { type: String, required: true }
  }
};
</script>

<style>
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-slideDown {
  animation: slideDown 0.3s ease-out;
}
</style>
