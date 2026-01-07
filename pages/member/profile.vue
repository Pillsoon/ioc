<template>
  <div class="pb-4 sm:pb-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6">
      <div class="mb-6 sm:mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">내 프로필</h1>
      </div>

      <div class="max-w-2xl mx-auto">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="text-center mb-6">
            <div class="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span class="text-3xl">👤</span>
            </div>
            <h2 class="text-xl font-semibold text-gray-900">김철수</h2>
            <p class="text-gray-600">소프라노 파트</p>
          </div>

          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">이름</label>
                <input
                  type="text"
                  value="김철수"
                  readonly
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">파트</label>
                <input
                  type="text"
                  value="소프라노"
                  readonly
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">이메일</label>
              <input
                type="email"
                value="kim@example.com"
                readonly
                class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">전화번호</label>
              <input
                type="tel"
                value="010-1234-5678"
                readonly
                class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">가입일</label>
              <input
                type="text"
                value="2024년 1월 15일"
                readonly
                class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>
          </div>

          <div class="mt-6 flex gap-3">
            <button class="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200">
              정보 수정
            </button>
            <button class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 py-2 px-4 rounded-lg font-medium transition-colors duration-200">
              비밀번호 변경
            </button>
          </div>
        </div>

        <!-- 활동 내역 -->
        <div class="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">최근 활동</h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div class="flex items-center">
                <span class="text-lg mr-3">🎵</span>
                <div>
                  <p class="font-medium text-gray-900">새 노래로 찬양 연습</p>
                  <p class="text-sm text-gray-600">2024년 1월 20일</p>
                </div>
              </div>
              <span class="text-sm text-gray-500">30분</span>
            </div>
            
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div class="flex items-center">
                <span class="text-lg mr-3">📢</span>
                <div>
                  <p class="font-medium text-gray-900">공지사항 확인</p>
                  <p class="text-sm text-gray-600">2024년 1월 18일</p>
                </div>
              </div>
              <span class="text-sm text-gray-500">읽음</span>
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
  title: '내 프로필 - Irvine Onnuri Choir'
})
</script>
