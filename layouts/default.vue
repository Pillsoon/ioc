<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Desktop Navigation -->
    <DesktopNav />
    
    <!-- Mobile Navigation -->
    <MobileNav />
    
    <!-- Main Content -->
    <main class="pt-20 lg:pt-4">
      <slot />
    </main>
  </div>
</template>

<script setup>
// Layout logic can be added here if needed
</script>
