<script setup>
defineProps({
  size: {
    type: String,
    default: 'medium'
  },
  text: {
    type: String,
    default: 'Loading...'
  }
})
</script>

<template>
  <div class="text-center py-12 px-4">
    <div 
      class="border-4 border-gray-200 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"
      :class="{
        'w-5 h-5 border-2': size === 'small',
        'w-10 h-10': size === 'medium',
        'w-15 h-15 border-6': size === 'large'
      }"
    ></div>
    <p v-if="text" class="text-gray-600 text-sm">{{ text }}</p>
  </div>
</template>


