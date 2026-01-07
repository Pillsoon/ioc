<template>
  <div class="pb-4 sm:pb-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6">
      <!-- Page Header -->
      <div class="mb-6 sm:mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">공지사항</h1>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-8">
        <p class="text-gray-500">데이터 로딩 중...</p>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="text-center py-8">
        <p class="text-red-500">오류: {{ error }}</p>
      </div>

      <!-- Announcements List -->
      <div v-else class="space-y-4">
        <div v-for="announcement in announcements" :key="announcement.id" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="p-4 sm:p-6">
            <!-- Header -->
            <div class="flex items-start justify-between mb-3">
              <div class="flex items-center gap-2">
                <span 
                  :class="{
                    'bg-gray-900 text-white': announcement.priority === 'high',
                    'bg-gray-100 text-gray-700': announcement.priority === 'medium',
                    'bg-gray-50 text-gray-600': announcement.priority === 'low'
                  }"
                  class="px-2 py-1 rounded-full text-xs font-medium"
                >
                  {{ getPriorityLabel(announcement.priority) }}
                </span>
                <span class="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">{{ announcement.date }}</span>
              </div>
            </div>

            <!-- Title -->
            <h2 class="text-lg sm:text-xl font-semibold text-gray-900 mb-3">{{ announcement.title }}</h2>
            
            <!-- Content -->
            <p class="text-gray-600 mb-4">{{ announcement.content }}</p>

            <!-- Details -->
            <div v-if="announcement.details" class="mb-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div v-for="(value, key) in announcement.details" :key="key" class="flex">
                  <span class="font-medium text-gray-700 min-w-20">{{ getDetailLabel(key) }}:</span>
                  <span class="text-gray-600">{{ value }}</span>
                </div>
              </div>
            </div>

            <!-- Notes -->
            <div v-if="announcement.notes && announcement.notes.length > 0" class="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div class="text-xs font-medium text-gray-600 mb-2">📌 주의사항</div>
              <ul class="space-y-1">
                <li v-for="note in announcement.notes" :key="note" class="text-sm text-gray-700">
                  {{ note }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Annual Plan -->
      <div v-if="!loading && !error" class="mt-8">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="p-4 sm:p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span>📅</span>
              <span>연간 일정</span>
            </h2>
            <div class="space-y-4">
              <div v-for="month in annualPlan" :key="month.month" class="border-l-2 border-gray-200 pl-4">
                <h3 class="font-semibold text-gray-800 mb-2">{{ month.month }}</h3>
                <ul class="space-y-1">
                  <li v-for="event in month.events" :key="event" class="text-sm text-gray-600">
                    • {{ event }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Set page title
useHead({
  title: '공지사항 - Irvine Onnuri Choir'
})

// Data from announcements.json
const announcements = ref([])
const annualPlan = ref([])
const loading = ref(true)
const error = ref(null)

// Load data from announcements.json
onMounted(async () => {
  try {
    const response = await fetch('/data/announcements.json')
    const data = await response.json()
    announcements.value = data.announcements.filter(announcement => announcement.isActive)
    annualPlan.value = data.annualPlan
    loading.value = false
  } catch (err) {
    error.value = '공지사항을 불러오는데 실패했습니다.'
    loading.value = false
  }
})

// Utility functions
const getPriorityLabel = (priority) => {
  const labels = {
    'high': '중요',
    'medium': '일반',
    'low': '안내'
  }
  return labels[priority] || '일반'
}

const getDetailLabel = (key) => {
  const labels = {
    'top': '상의',
    'bottom': '하의',
    'shoes': '신발',
    'practiceDate': '연습일시',
    'location': '장소',
    'duration': '소요시간',
    'date': '일시',
    'cost': '비용',
    'deadline': '마감일',
    'specialSongs': '특별곡',
    'practiceSchedule': '연습일정',
    'dressCode': '복장',
    'recruitmentPeriod': '모집기간',
    'auditionDate': '오디션일시',
    'requirements': '자격요건'
  }
  return labels[key] || key
}
</script>