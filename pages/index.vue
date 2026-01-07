<template>
  <div class="pb-4 sm:pb-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6">
      <!-- Page Header -->
      <div class="mb-6 sm:mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">홈</h1>
      </div>

      <!-- Welcome Section -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div class="p-4 sm:p-6">
          <div class="text-center">
            <div class="text-6xl mb-4">🎵</div>
            <h2 class="text-xl font-semibold text-gray-900 mb-2">Irvine Onnuri Choir</h2>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-8">
        <p class="text-gray-500">데이터 로딩 중...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-8">
        <p class="text-red-500">오류: {{ error }}</p>
      </div>

      <!-- Current Week Song Preview -->
      <div v-else-if="currentWeekSong" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div class="p-4">
          <h2 class="text-lg font-semibold text-gray-900 mb-3">이번 주 찬양곡</h2>

          <!-- Song Info -->
          <div class="mb-4">
            <div class="flex flex-wrap items-center gap-2 mb-1">
              <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">{{ currentWeekSong.displayDate }}</span>
              <span v-if="currentWeekSong.event" class="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">{{ currentWeekSong.event }}</span>
              <span class="text-base font-medium text-gray-800">{{ currentWeekSong.title }}</span>
            </div>
            <span v-if="currentWeekSong.composer" class="text-sm text-gray-500">작곡: {{ currentWeekSong.composer }}</span>
          </div>

          <!-- Action Button -->
          <div class="mb-4">
            <button
              @click="handleDownloadScore(currentWeekSong)"
              :disabled="!hasScoreAvailable"
              :class="hasScoreAvailable
                ? 'bg-gray-900 hover:bg-gray-800 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'"
              class="w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              📄 악보 다운로드
            </button>
          </div>

          <!-- Practice Videos -->
          <div v-if="Object.keys(youtubeVideos).length > 0" class="mb-3">
            <div class="text-xs font-medium text-gray-600 mb-2">📺 연습 비디오</div>
            <div class="grid grid-cols-2 gap-1">
              <a
                v-for="(item, part) in youtubeVideos"
                :key="part"
                :href="item.url"
                target="_blank"
                class="p-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded text-xs font-medium transition-colors duration-200 text-center"
              >
                {{ getPartLabel(part) }}
              </a>
            </div>
          </div>

          <!-- Practice Files -->
          <div v-if="Object.keys(audioFiles).length > 0" class="mb-3">
            <div class="text-xs font-medium text-gray-600 mb-2">🎵 연습 파일</div>
            <div class="grid grid-cols-2 gap-1">
              <button
                v-for="(item, part) in audioFiles"
                :key="part"
                @click="handleSharePracticeFile(item, part)"
                class="p-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded text-xs font-medium transition-colors duration-200"
              >
                {{ getPartLabel(part) }}
              </button>
            </div>
          </div>

          <!-- View All Link -->
          <div class="pt-3 border-t border-gray-200">
            <NuxtLink
              to="/choir/songs"
              class="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              전체 찬양곡 보기 →
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- This Week's Announcements -->
      <div v-if="thisWeekAnnouncements.length > 0" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div class="p-4">
          <h2 class="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span>📢</span>
            <span>이번 주 공지사항</span>
          </h2>

          <div class="space-y-3">
            <div v-for="announcement in thisWeekAnnouncements" :key="announcement.id" class="border border-gray-200 rounded-lg p-3">
              <div class="flex items-center gap-2 mb-2">
                <span
                  :class="{
                    'bg-red-100 text-red-800': announcement.priority === 'high',
                    'bg-blue-100 text-blue-800': announcement.priority === 'medium',
                    'bg-gray-100 text-gray-700': announcement.priority === 'low'
                  }"
                  class="px-2 py-1 rounded-full text-xs font-medium"
                >
                  {{ getPriorityLabel(announcement.priority) }}
                </span>
                <span class="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">{{ formatAnnouncementDate(announcement.date) }}</span>
              </div>

              <h3 class="font-medium text-gray-900 mb-1">{{ announcement.title }}</h3>
              <p class="text-sm text-gray-600">{{ announcement.content }}</p>

              <div v-if="announcement.details" class="mt-2">
                <div class="grid grid-cols-1 gap-1">
                  <div v-for="(value, key) in Object.fromEntries(Object.entries(announcement.details).slice(0, 2))" :key="key" class="flex text-xs">
                    <span class="font-medium text-gray-700 min-w-16">{{ getDetailLabel(key) }}:</span>
                    <span class="text-gray-600">{{ value }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-3 pt-3 border-t border-gray-200">
            <NuxtLink
              to="/choir/notices"
              class="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              전체 공지사항 보기 →
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  createWeeklySongs,
  downloadScore,
  sharePracticeFile,
  hasScore,
  getYoutubeVideos,
  getAudioFiles,
  VOICE_PART_LABELS
} from '~/utils/songsUtils.js'

// Set page title
useHead({
  title: '홈 - Irvine Onnuri Choir'
})

// State
const songs = ref([])
const currentWeekSong = ref(null)
const thisWeekAnnouncements = ref([])
const loading = ref(true)
const error = ref(null)

// Computed
const hasScoreAvailable = computed(() => currentWeekSong.value && hasScore(currentWeekSong.value))
const youtubeVideos = computed(() => currentWeekSong.value ? getYoutubeVideos(currentWeekSong.value.practice) : {})
const audioFiles = computed(() => currentWeekSong.value ? getAudioFiles(currentWeekSong.value.practice) : {})

// Methods
const getPartLabel = (part) => VOICE_PART_LABELS[part] || part

const handleDownloadScore = (song) => {
  downloadScore(song)
}

const handleSharePracticeFile = (item, part) => {
  sharePracticeFile(item, part)
}

const formatAnnouncementDate = (dateStr) => {
  if (!dateStr) return ''
  const [year, month, day] = dateStr.split('-').map(Number)
  return `${month}/${day}`
}

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

// Load data on mount
onMounted(async () => {
  try {
    // Load songs
    const songsResponse = await fetch('/data/songs.json')
    const songsData = await songsResponse.json()
    songs.value = songsData.songs

    const weeklySongs = createWeeklySongs(songs.value)
    currentWeekSong.value = weeklySongs.length > 0 ? weeklySongs[0] : null

    // Load announcements
    const announcementsResponse = await fetch('/data/announcements.json')
    const announcementsData = await announcementsResponse.json()
    thisWeekAnnouncements.value = announcementsData.announcements
      .filter(announcement => announcement.isActive)
      .slice(0, 3)

    loading.value = false
  } catch (err) {
    console.error('Failed to load data:', err)
    error.value = err.message
    loading.value = false
  }
})
</script>
