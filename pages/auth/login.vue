<template>
  <div class="pb-4 sm:pb-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6">
      <div class="mb-6 sm:mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">로그인</h1>
      </div>

      <div class="max-w-md mx-auto">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <form @submit.prevent="handleLogin" class="space-y-4">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                이메일
              </label>
              <input
                id="email"
                v-model="email"
                type="email"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="이메일을 입력하세요"
              />
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
                비밀번호
              </label>
              <input
                id="password"
                v-model="password"
                type="password"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="비밀번호를 입력하세요"
              />
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
            >
              {{ loading ? '로그인 중...' : '로그인' }}
            </button>
          </form>

          <div class="mt-6 text-center">
            <p class="text-sm text-gray-600">
              계정이 없으신가요?
              <NuxtLink to="/auth/register" class="text-blue-600 hover:text-blue-800 font-medium">
                회원가입
              </NuxtLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Set page title
useHead({
  title: '로그인 - Irvine Onnuri Choir'
})

const email = ref('')
const password = ref('')
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  
  try {
    // TODO: Implement actual login logic
    console.log('Login attempt:', { email: email.value, password: password.value })
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Redirect to dashboard or home
    await navigateTo('/admin/dashboard')
  } catch (error) {
    console.error('Login failed:', error)
    alert('로그인에 실패했습니다. 다시 시도해주세요.')
  } finally {
    loading.value = false
  }
}
</script>
