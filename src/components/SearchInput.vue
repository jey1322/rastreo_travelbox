<template>
  <div
    class="flex items-center border border-gray-300 rounded-3xl text-gray-700 overflow-hidden bg-white px-1 py-1 mb-2"
  >
    <input
      type="text"
      required
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="placeholder"
      :disabled="loading"
      class="px-4 w-full outline-none bg-white"
    />
    <button
      type="submit"
      aria-label="Buscar"
      class="flex p-2 items-center justify-center bg-[#fca900] text-white h-full rounded-full select-none"
    >
      <LoadingAnimation v-if="loading" />
      <SearchSvg v-else />
    </button>
  </div>
</template>

<script setup>
import SearchSvg from '@/components/icons/SearchSvg.vue'
import LoadingAnimation from '@/components/LoadingAnimation.vue'

defineProps({
  modelValue: {
    type: [String, Number],
    required: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: 'Buscar'
  }
})
</script>
