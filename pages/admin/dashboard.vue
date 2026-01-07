<template>
  <div class="pb-4 sm:pb-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6">
      <div class="mb-6 sm:mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">관리자 대시보드</h1>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- 통계 카드들 -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 rounded-lg">
              <span class="text-2xl">👥</span>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">전체 멤버</p>
              <p class="text-2xl font-bold text-gray-900">24</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 rounded-lg">
              <span class="text-2xl">🎵</span>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">등록된 찬양곡</p>
              <p class="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="p-2 bg-yellow-100 rounded-lg">
              <span class="text-2xl">📢</span>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">활성 공지사항</p>
              <p class="text-2xl font-bold text-gray-900">5</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 관리 기능들 -->
      <div class="mt-8">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">관리 기능</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NuxtLink 
            to="/admin/members"
            class="p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
          >
            <div class="flex items-center">
              <span class="text-2xl mr-3">👥</span>
              <div>
                <h3 class="font-medium text-gray-900">멤버 관리</h3>
                <p class="text-sm text-gray-600">멤버 정보 관리 및 권한 설정</p>
              </div>
            </div>
          </NuxtLink>

          <NuxtLink 
            to="/admin/songs"
            class="p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
          >
            <div class="flex items-center">
              <span class="text-2xl mr-3">🎵</span>
              <div>
                <h3 class="font-medium text-gray-900">찬양곡 관리</h3>
                <p class="text-sm text-gray-600">찬양곡 추가, 수정, 삭제</p>
              </div>
            </div>
          </NuxtLink>

          <NuxtLink 
            to="/admin/notices"
            class="p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
          >
            <div class="flex items-center">
              <span class="text-2xl mr-3">📢</span>
              <div>
                <h3 class="font-medium text-gray-900">공지사항 관리</h3>
                <p class="text-sm text-gray-600">공지사항 작성 및 관리</p>
              </div>
            </div>
          </NuxtLink>

          <NuxtLink 
            to="/admin/settings"
            class="p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
          >
            <div class="flex items-center">
              <span class="text-2xl mr-3">⚙️</span>
              <div>
                <h3 class="font-medium text-gray-900">시스템 설정</h3>
                <p class="text-sm text-gray-600">앱 설정 및 환경 구성</p>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Set page title
useHead({
  title: '관리자 대시보드 - Irvine Onnuri Choir'
})
</script>
