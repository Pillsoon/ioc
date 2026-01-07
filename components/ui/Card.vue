<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  },
  padding: {
    type: String,
    default: 'normal'
  }
})
</script>

<template>
  <div 
    class="bg-white rounded-2xl shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
    :class="{
      'p-4': padding === 'small',
      'p-6': padding === 'normal', 
      'p-8': padding === 'large'
    }"
  >
    <h3 v-if="title" class="text-xl font-semibold text-gray-800 mb-4 pl-2 border-l-4 border-indigo-500">
      {{ title }}
    </h3>
    <slot />
  </div>
</template>


