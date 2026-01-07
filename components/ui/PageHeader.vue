<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div class="text-center mb-8">
    <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-2">{{ title }}</h1>
    <p v-if="subtitle" class="text-gray-600">{{ subtitle }}</p>
  </div>
</template>


