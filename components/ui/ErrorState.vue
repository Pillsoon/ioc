<script setup>
defineProps({
  message: {
    type: String,
    required: true
  },
  showRetry: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['retry'])
</script>

<template>
  <div class="text-center py-12 px-4">
    <div class="text-5xl mb-4">⚠️</div>
    <p class="text-red-600 mb-4 text-base">{{ message }}</p>
    <button 
      v-if="showRetry" 
      @click="$emit('retry')" 
      class="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
    >
      다시 시도
    </button>
  </div>
</template>


