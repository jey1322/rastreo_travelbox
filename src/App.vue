<script setup>
import { RouterView } from 'vue-router'
import FooterComponent from '@/components/Footer.vue'
</script>

<template>
  <main class="min-h-screen">
    <RouterView />
    <FooterComponent />
  </main>
</template>
