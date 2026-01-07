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
            <p class="text-gray-600">온누리교회 어바인 합창단</p>
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
            <div class="flex items-center gap-2 mb-1">
              <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">{{ currentWeekSong.date }}</span>
              <span class="text-base font-medium text-gray-800">{{ currentWeekSong.title }}</span>
            </div>
            <span v-if="currentWeekSong.composer" class="text-sm text-gray-500">작곡: {{ currentWeekSong.composer }}</span>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex gap-2 mb-4">
            <button 
              @click="downloadScore(currentWeekSong)"
              class="flex-1 bg-gray-900 hover:bg-gray-800 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              📄 악보
            </button>
            <NuxtLink 
              to="/choir/songs"
              class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 text-center"
            >
              🎵 전체보기
            </NuxtLink>
          </div>

          <!-- Practice Materials - Compact Grid -->
          <div v-if="currentWeekSong.practiceVideos" class="mb-3">
            <div class="text-xs font-medium text-gray-600 mb-2">📺 연습 비디오</div>
            <div class="grid grid-cols-2 gap-1">
              <a 
                v-for="(url, part) in Object.fromEntries(Object.entries(currentWeekSong.practiceVideos).slice(0, 4))" 
                :key="part"
                :href="url" 
                target="_blank" 
                class="p-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded text-xs font-medium transition-colors duration-200 text-center"
              >
                {{ part }}
              </a>
            </div>
          </div>

          <div v-if="currentWeekSong.practiceFiles" class="mb-3">
            <div class="text-xs font-medium text-gray-600 mb-2">🎵 연습 파일</div>
            <div class="grid grid-cols-2 gap-1">
              <button 
                v-for="(file, part) in Object.fromEntries(Object.entries(currentWeekSong.practiceFiles).slice(0, 4))" 
                :key="part"
                @click="sharePracticeFile(file, part)"
                class="p-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded text-xs font-medium transition-colors duration-200"
              >
                {{ part }}
              </button>
            </div>
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
                <span class="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">{{ announcement.date }}</span>
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
import { ref, onMounted } from 'vue'
import { createWeeklySongs, hasScore, isFirebaseUrl } from '~/utils/songsUtils.js'

// Set page title
useHead({
  title: '홈 - Irvine Onnuri Choir'
})

// Hardcoded data (same as songs.vue for consistency)
const songs = ref([
  {
    id: 2,
    date: "9/22",
    title: "강하고 담대하라",
    composer: "김영광",
    voiceParts: ["소프라노", "앨토", "테너", "베이스"],
    hasScore: true,
    hasAudio: true,
    scoreUrl: "https://firebase-storage-url.com/scores/song1.pdf",
    isYouTube: true,
    practiceVideos: {
      "합창": "https://youtu.be/qSKgDGN5FBM?si=fmHVYr1OD4XZlt5S",
      "소프라노": "https://youtu.be/Fnvx0EC14v0?si=I5mGnB2nEKlTZJb4",
      "앨토": "https://youtu.be/3pRpFBNNu-0?si=zqU-ooqutfkG6kzk",
      "테너": "https://youtu.be/SKncI5nagyQ?si=0J-J2ZmtWXnxbcqi",
      "베이스": "https://youtu.be/3yBRE_yTHK4?si=T_VmpWXETEovaXYK"
    },
    notes: "감사 찬양으로 시작하는 주일 예배"
  },
  {
    id: 1,
    date: "9/29",
    title: "새 노래로 찬양",
    voiceParts: ["소프라노", "앨토", "테너", "베이스"],
    hasScore: true,
    hasAudio: true,
    scoreUrl: "/data/새 노래로 찬양/score.pdf",
    practiceFiles: {
      "소프라노": {
        "audioUrl": "/data/새 노래로 찬양/soprano.mp3",
        "fileType": "mp3"
      },
      "앨토": {
        "audioUrl": "/data/새 노래로 찬양/alto.mp3",
        "fileType": "mp3"
      },
      "테너": {
        "audioUrl": "/data/새 노래로 찬양/tenor.mp3",
        "fileType": "mp3"
      },
      "베이스": {
        "audioUrl": "/data/새 노래로 찬양/bass.mp3",
        "fileType": "mp3"
      }
    },
    notes: "새로운 찬양, 각 파트별 연습 파일 제공"
  },
  {
    id: 3,
    date: "미정",
    title: "주님의 은혜",
    voiceParts: ["소프라노", "앨토", "테너", "베이스"],
    hasScore: false,
    hasAudio: false,
    notes: "예정된 찬양곡"
  }
])

// Get the first song (current week) from weeklySongs
const weeklySongs = createWeeklySongs(songs.value)
const currentWeekSong = ref(weeklySongs.length > 0 ? weeklySongs[0] : null)
const loading = ref(false)
const error = ref(null)

// This week's announcements
const thisWeekAnnouncements = ref([])

// Load announcements on mount
onMounted(async () => {
  try {
    const response = await fetch('/data/announcements.json')
    const data = await response.json()
    // Get this week's announcements (first 2-3 announcements)
    thisWeekAnnouncements.value = data.announcements
      .filter(announcement => announcement.isActive)
      .slice(0, 3)
  } catch (err) {
    console.error('Failed to load announcements:', err)
  }
})

// Button functions (same as songs.vue)
const downloadScore = (song) => {
  if (hasScore(song)) {
    if (isFirebaseUrl(song.scoreUrl)) {
      window.open(song.scoreUrl, '_blank')
    } else {
      const link = document.createElement('a')
      link.href = song.scoreUrl
      link.download = `${song.title}.pdf`
      link.click()
    }
    alert(`📄 "${song.title}" 악보를 다운로드합니다.`)
  } else {
    alert(`📄 "${song.title}" 악보가 준비되지 않았습니다.`)
  }
}

const sharePracticeFile = async (file, part) => {
  try {
    if (navigator.share && file.audioUrl) {
      await navigator.share({
        title: `${part} 파트 연습 파일`,
        text: `${part} 파트 연습용 오디오 파일입니다.`,
        url: file.audioUrl
      })
    } else {
      const link = document.createElement('a')
      link.href = file.audioUrl
      link.download = `${part}.${file.fileType}`
      link.click()
      alert(`🎵 "${part}" 파트 연습 파일을 다운로드합니다.`)
    }
  } catch (error) {
    console.error('Share failed:', error)
    const link = document.createElement('a')
    link.href = file.audioUrl
    link.download = `${part}.${file.fileType}`
    link.click()
    alert(`🎵 "${part}" 파트 연습 파일을 다운로드합니다.`)
  }
}

// Utility functions for announcements
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