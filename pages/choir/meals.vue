<template>
  <div class="pb-4 sm:pb-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6">
      <!-- Page Header -->
      <div class="mb-6 sm:mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">식사 사인업</h1>
        <p class="text-gray-600 mt-1">주일 연습 후 식사 담당자를 신청해주세요</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-8">
        <p class="text-gray-500">데이터 로딩 중...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-8">
        <p class="text-red-500">오류: {{ error }}</p>
      </div>

      <!-- Meal Signup Cards -->
      <div v-else class="space-y-4">
        <div
          v-for="sunday in upcomingSundays"
          :key="sunday.date"
          class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div class="p-4 sm:p-6">
            <!-- Date Header -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-3">
                <span class="text-2xl">🍽️</span>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">{{ sunday.displayDate }}</h2>
                  <span class="text-sm text-gray-500">주일 연습</span>
                </div>
              </div>
              <span
                v-if="isPast(sunday.date)"
                class="bg-gray-100 text-gray-500 px-2 py-1 rounded text-xs"
              >
                마감
              </span>
            </div>

            <!-- Signups List -->
            <div class="mb-4">
              <div class="text-sm font-medium text-gray-700 mb-2">
                신청자 ({{ sunday.signups.length }}명)
              </div>
              <div v-if="sunday.signups.length > 0" class="flex flex-wrap gap-2">
                <span
                  v-for="(signup, index) in sunday.signups"
                  :key="index"
                  class="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                >
                  {{ signup.name }}
                </span>
              </div>
              <p v-else class="text-gray-400 text-sm">아직 신청자가 없습니다</p>
            </div>

            <!-- Signup Form -->
            <div v-if="!isPast(sunday.date)" class="flex gap-2">
              <input
                v-model="sunday.inputName"
                type="text"
                placeholder="이름을 입력하세요"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                @keyup.enter="handleSignup(sunday)"
              />
              <button
                @click="handleSignup(sunday)"
                :disabled="!sunday.inputName?.trim()"
                :class="sunday.inputName?.trim()
                  ? 'bg-gray-900 hover:bg-gray-800 text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'"
                class="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                신청하기
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Info Notice -->
      <div class="mt-6 bg-blue-50 rounded-lg p-4">
        <div class="flex items-start gap-3">
          <span class="text-blue-500">ℹ️</span>
          <div class="text-sm text-blue-700">
            <p class="font-medium mb-1">안내사항</p>
            <ul class="list-disc list-inside space-y-1 text-blue-600">
              <li>식사 준비는 2-3명이 함께 담당합니다</li>
              <li>신청 후 변경이 필요하면 담당자에게 연락해주세요</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getUpcomingSundays, formatDateKorean, isPastDate } from '~/utils/dateUtils.js'

// Set page title
useHead({
  title: '식사 사인업 - Irvine Onnuri Choir'
})

// State
const upcomingSundays = ref([])
const loading = ref(true)
const error = ref(null)

// Methods
const isPast = (dateStr) => isPastDate(dateStr)

const handleSignup = (sunday) => {
  const name = sunday.inputName?.trim()
  if (!name) return

  // 이미 신청한 이름인지 확인
  const alreadySignedUp = sunday.signups.some(
    s => s.name.toLowerCase() === name.toLowerCase()
  )

  if (alreadySignedUp) {
    alert(`"${name}" 님은 이미 신청되어 있습니다.`)
    return
  }

  // 로컬에 추가 (데모용)
  sunday.signups.push({
    name: name,
    signedAt: new Date().toISOString().split('T')[0]
  })

  // 입력 필드 초기화
  sunday.inputName = ''

  // 알림
  alert(`"${name}" 님이 ${sunday.displayDate} 식사 담당으로 신청되었습니다.\n\n(데모: 실제 저장은 Firebase 연동 후 가능합니다)`)
}

// Load data on mount
onMounted(async () => {
  try {
    // Load signup data
    const response = await fetch('/data/meal-signup.json')
    const data = await response.json()

    const weeksToShow = data.settings?.weeksToShow || 6
    const signupsData = data.signups || {}

    // 주일 날짜 생성 및 신청 데이터 병합
    const sundays = getUpcomingSundays(weeksToShow)
    upcomingSundays.value = sundays.map(date => ({
      date,
      displayDate: formatDateKorean(date),
      signups: signupsData[date] || [],
      inputName: ''
    }))

    loading.value = false
  } catch (err) {
    console.error('Failed to load data:', err)
    error.value = err.message
    loading.value = false
  }
})
</script>
