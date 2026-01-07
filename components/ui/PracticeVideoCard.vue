<script setup>
const props = defineProps({
  partName: {
    type: String,
    required: true
  },
  videoUrl: {
    type: String,
    required: true
  },
  songTitle: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['open-youtube'])

const handleVideoClick = () => {
  emit('open-youtube', props.videoUrl)
}
</script>

<template>
  <div 
    class="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
    @click="handleVideoClick"
  >
    <div class="flex items-center justify-between">
      <h5 class="font-semibold text-gray-800 flex items-center gap-2">
        <span 
          class="w-2 h-2 rounded-full" 
          :class="partName === '합창' ? 'bg-blue-500' : 'bg-indigo-500'"
        ></span>
        {{ partName }}
      </h5>
      
      <button 
        class="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-1"
      >
        <span class="text-xs">▶️</span>
        Play
      </button>
    </div>
  </div>
</template>
