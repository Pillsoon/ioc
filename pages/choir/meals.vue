<template>
  <div class="pb-4 sm:pb-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6">
      <!-- Page Header -->
      <div class="mb-6 sm:mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">식사 사인업</h1>
        <p class="text-gray-600 mt-1">주일 연습 후 식사 담당자를 신청해주세요 (최대 2명)</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-8">
        <p class="text-gray-500">데이터 로딩 중...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-8">
        <p class="text-red-500">오류: {{ error }}</p>
      </div>

      <div v-else>
        <!-- View Toggle -->
        <div class="flex gap-2 mb-6">
          <button
            @click="viewMode = 'upcoming'"
            :class="viewMode === 'upcoming'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            다가오는 주일
          </button>
          <button
            @click="viewMode = 'yearly'"
            :class="viewMode === 'yearly'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            1년 전체보기
          </button>
        </div>

        <!-- Upcoming View -->
        <div v-if="viewMode === 'upcoming'" class="space-y-4">
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
                  종료
                </span>
                <span
                  v-else-if="isFull(sunday)"
                  class="bg-green-100 text-green-700 px-2 py-1 rounded text-xs"
                >
                  마감
                </span>
              </div>

              <!-- Signups List -->
              <div class="mb-4">
                <div class="text-sm font-medium text-gray-700 mb-2">
                  신청자 ({{ sunday.signups.length }}/{{ maxSlots }}명)
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
              <div v-if="!isPast(sunday.date) && !isFull(sunday)" class="flex gap-2">
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

        <!-- Yearly View -->
        <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="p-4 sm:p-6">
            <!-- Quick Signup Form -->
            <div class="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 class="text-sm font-medium text-gray-700 mb-3">빠른 신청</h3>
              <div class="flex gap-2 mb-3">
                <input
                  v-model="yearlyInputName"
                  type="text"
                  placeholder="이름을 입력하세요"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <p class="text-xs text-gray-500 mb-2">이름을 입력 후 원하는 날짜를 클릭하세요</p>
            </div>

            <!-- Year Calendar -->
            <div class="space-y-6">
              <div v-for="(months, quarter) in yearlyCalendar" :key="quarter">
                <h3 class="text-sm font-semibold text-gray-600 mb-3">{{ quarter }}</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  <button
                    v-for="sunday in months"
                    :key="sunday.date"
                    @click="handleYearlySignup(sunday)"
                    :disabled="isPast(sunday.date) || isFull(sunday)"
                    :class="getYearlyButtonClass(sunday)"
                    class="p-3 rounded-lg text-left text-sm transition-colors duration-200"
                  >
                    <div class="flex items-center justify-between">
                      <span class="font-medium">{{ sunday.displayDate }}</span>
                      <span
                        v-if="isFull(sunday)"
                        class="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded"
                      >마감</span>
                      <span
                        v-else-if="isPast(sunday.date)"
                        class="text-xs text-gray-400"
                      >종료</span>
                      <span
                        v-else
                        class="text-xs text-gray-500"
                      >{{ sunday.signups.length }}/{{ maxSlots }}</span>
                    </div>
                    <div v-if="sunday.signups.length > 0" class="mt-1 text-xs text-gray-500 truncate">
                      {{ sunday.signups.map(s => s.name).join(', ') }}
                    </div>
                  </button>
                </div>
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
                <li>식사 준비는 2명이 함께 담당합니다</li>
                <li>신청 후 변경이 필요하면 담당자에게 연락해주세요</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getUpcomingSundays, formatDateKorean, isPastDate } from '~/utils/dateUtils.js'

// Set page title
useHead({
  title: '식사 사인업 - Irvine Onnuri Choir'
})

// Constants
const maxSlots = 2

// State
const viewMode = ref('upcoming')
const upcomingSundays = ref([])
const yearlySundays = ref([])
const yearlyInputName = ref('')
const loading = ref(true)
const error = ref(null)

// Computed
const yearlyCalendar = computed(() => {
  const quarters = {}
  const quarterNames = ['1분기 (1-3월)', '2분기 (4-6월)', '3분기 (7-9월)', '4분기 (10-12월)']

  yearlySundays.value.forEach(sunday => {
    const [year, month] = sunday.date.split('-').map(Number)
    const quarterIndex = Math.floor((month - 1) / 3)
    const quarterName = quarterNames[quarterIndex]

    if (!quarters[quarterName]) {
      quarters[quarterName] = []
    }
    quarters[quarterName].push(sunday)
  })

  return quarters
})

// Methods
const isPast = (dateStr) => isPastDate(dateStr)

const isFull = (sunday) => sunday.signups.length >= maxSlots

const getYearlyButtonClass = (sunday) => {
  if (isPast(sunday.date)) {
    return 'bg-gray-100 text-gray-400 cursor-not-allowed'
  }
  if (isFull(sunday)) {
    return 'bg-green-50 text-green-700 cursor-not-allowed'
  }
  return 'bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 cursor-pointer'
}

const handleSignup = (sunday) => {
  const name = sunday.inputName?.trim()
  if (!name) return

  if (isFull(sunday)) {
    alert('이 날짜는 이미 마감되었습니다.')
    return
  }

  const alreadySignedUp = sunday.signups.some(
    s => s.name.toLowerCase() === name.toLowerCase()
  )

  if (alreadySignedUp) {
    alert(`"${name}" 님은 이미 신청되어 있습니다.`)
    return
  }

  sunday.signups.push({
    name: name,
    signedAt: new Date().toISOString().split('T')[0]
  })

  sunday.inputName = ''

  if (isFull(sunday)) {
    alert(`"${name}" 님이 ${sunday.displayDate} 식사 담당으로 신청되었습니다.\n\n이 날짜는 마감되었습니다!`)
  } else {
    alert(`"${name}" 님이 ${sunday.displayDate} 식사 담당으로 신청되었습니다.\n\n(데모: 실제 저장은 Firebase 연동 후 가능합니다)`)
  }
}

const handleYearlySignup = (sunday) => {
  const name = yearlyInputName.value?.trim()
  if (!name) {
    alert('먼저 이름을 입력해주세요.')
    return
  }

  if (isPast(sunday.date) || isFull(sunday)) {
    return
  }

  const alreadySignedUp = sunday.signups.some(
    s => s.name.toLowerCase() === name.toLowerCase()
  )

  if (alreadySignedUp) {
    alert(`"${name}" 님은 ${sunday.displayDate}에 이미 신청되어 있습니다.`)
    return
  }

  sunday.signups.push({
    name: name,
    signedAt: new Date().toISOString().split('T')[0]
  })

  if (isFull(sunday)) {
    alert(`"${name}" 님이 ${sunday.displayDate} 식사 담당으로 신청되었습니다.\n\n이 날짜는 마감되었습니다!`)
  } else {
    alert(`"${name}" 님이 ${sunday.displayDate} 식사 담당으로 신청되었습니다.`)
  }
}

// Load data on mount
onMounted(async () => {
  try {
    const response = await fetch('/data/meal-signup.json')
    const data = await response.json()

    const signupsData = data.signups || {}

    // 다가오는 6주
    const upcoming = getUpcomingSundays(6)
    upcomingSundays.value = upcoming.map(date => ({
      date,
      displayDate: formatDateKorean(date),
      signups: signupsData[date] || [],
      inputName: ''
    }))

    // 1년치 (52주)
    const yearly = getUpcomingSundays(52)
    yearlySundays.value = yearly.map(date => ({
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
