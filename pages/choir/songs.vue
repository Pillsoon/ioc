<template>
  <div class="pb-4 sm:pb-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6">
        <div class="mb-6 sm:mb-8">
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">예배 찬양곡</h1>
        </div>

        <!-- Weekly Songs -->
        <div v-if="loading" class="text-center py-8">
          <p class="text-gray-500">데이터 로딩 중...</p>
        </div>
        
        <div v-else-if="error" class="text-center py-8">
          <p class="text-red-500">오류: {{ error }}</p>
        </div>
        
        <div v-else>
          <!-- Weekly Songs -->
          <SongCard 
            v-for="song in weeklySongs" 
            :key="song.id" 
            :song="song" 
          />

          <!-- All Songs List -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6 sm:mb-8">
            <div class="p-4 sm:p-6">
              <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span>📋</span>
                <span>전체 찬양곡 목록</span>
              </h2>
              <div class="space-y-3">
                <div v-for="song in songs" :key="song.id" class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div class="flex flex-wrap items-center gap-2">
                    <span 
                      :class="{
                        'bg-blue-100 text-blue-800': song.date !== '미정',
                        'bg-gray-100 text-gray-600': song.date === '미정'
                      }"
                      class="px-2 py-1 rounded-full text-xs font-medium"
                    >
                      {{ song.date }}
                    </span>
                    <span class="font-medium text-gray-800">{{ song.title }}</span>
                    <span v-if="song.composer" class="text-sm text-gray-500">- {{ song.composer }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup>
// Set page title
useHead({
  title: '예배 찬양곡 - Irvine Onnuri Choir'
})

import { createWeeklySongs } from '~/utils/songsUtils.js'

// Load songs data from JSON file
const songsData = await $fetch('/data/songs.json')
const songs = ref(songsData.songs)

// Use utility function to create weeklySongs
const weeklySongs = ref(createWeeklySongs(songs.value))

const loading = ref(false)
const error = ref(null)

// SongCard component handles all song interactions
</script>