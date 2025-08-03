<script setup>
import ReloadSvg from '@/components/icons/ReloadSvg.vue'
import PackageDetails from '@/components/PackageDetails.vue'
import SearchInput from '@/components/SearchInput.vue'
import useTrack from '@/composables/useTrack'
import { useHistoryStore } from '@/stores/history'
import { toast } from '@/utils/toast'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

const { search, result, searching, track, resetValues, client, method, packages } = useTrack()
const { history } = storeToRefs(useHistoryStore())
const { clear } = useHistoryStore()
const searchModel = ref('')

function showThis(tracking, from = '') {
  resetValues()

  if (from === 'name') {
    method.value = 'tracking'
  }

  searchModel.value = tracking
  track.value = tracking
  client.value = ''

  search()
}

function onSubmit() {
  if (method.value === 'tracking') {
    client.value = ''
    track.value = searchModel.value

    const trackingResult = validateTracking()

    if (trackingResult) {
      toast.error(trackingResult)
      return
    }
  }

  if (method.value === 'name') {
    track.value = ''
    client.value = searchModel.value

    const clientResult = validateClient()

    if (clientResult) {
      toast.error(clientResult)
      return
    }
  }

  search()
}

function validateTracking() {
  if (!track.value) {
    return 'Ingresa un número de rastreo'
  }

  if (track.value.includes(' ')) {
    return 'No se permiten espacios en blanco'
  }

  if (track.value.length < 5) {
    return 'Número de rastreo inválido'
  }

  return ''
}

function validateClient() {
  if (!client.value) {
    return 'Ingrese un nombre'
  }

  if (client.value.split(' ').length < 2) {
    return 'Ingrese al menos un nombre y un apellido'
  }

  return ''
}

function switchTo(type) {
  method.value = type
  searchModel.value = ''
}
</script>

<template>
  <section
    class="text-white rounded-b-3xl shadow-xl"
    style="background: linear-gradient(20deg, #3a6cb2, #004995)"
  >
    <div class="w-full flex flex-col items-center justify-center mb-[2.5rem]">
      <form @submit.prevent="onSubmit" class="text-center py-6 px-4 max-w-xl">
        <div class="flex items-center justify-center mb-2">
          <a href="https://megashopni.com">
            <img src="/icon.png" alt="Logo" class="w-[5rem] h-auto" />
          </a>
        </div>
        <h5 class="text-2xl lg:text-4xl font-bold mb-8 tracking-wider">¡Rastrea tu paquete!</h5>
        <div class="text-base font-light mb-10 leading-relaxed tracking-wide">
          Ingresa tu número de rastreo y monitorea el progreso de tu paquete al instante 🕒
        </div>

        <div class="grid grid-cols-2 mb-8">
          <button
            @click="switchTo('tracking')"
            type="button"
            class="border border-[#fca900] rounded-l-xl py-3 transition duration-300 ease-in-out"
            :class="method === 'tracking' ? 'bg-[#fca900]' : ''"
          >
            Buscar por tracking
          </button>
          <button
            @click="switchTo('name')"
            type="button"
            class="border border-[#fca900] rounded-r-xl py-3 transition duration-300 ease-in-out"
            :class="method === 'name' ? 'bg-[#fca900]' : ''"
          >
            Buscar por nombre
          </button>
        </div>

        <SearchInput
          v-model="searchModel"
          :loading="searching"
          :placeholder="method == 'tracking' ? 'Ingrese el número de rastreo' : 'Ingrese su nombre'"
        />

        <div v-if="method === 'name'" class="mt-5 text-sm text-slate-300">
          Ingresar su nombre tal como en la dirección de envío
        </div>
      </form>
    </div>
  </section>

  <section class="bg-white text-gray-600 h-full mb-4">
    <div class="max-w-xl mx-auto flex flex-col items-center justify-center mb-4 px-4">
      <template v-if="method === 'name'">
        <div class="w-full flex flex-col gap-4">
          <button
            type="button"
            v-for="item in packages"
            :key="item.id"
            @click.prevent="showThis(item.tracking, 'name')"
            class="flex items-center justify-between gap-1 border rounded-lg px-4 py-3"
          >
            <div class="text-left flex flex-col gap-1">
              <div class="font-bold text-[#3a6cb2] text-sm">
                {{ item.tracking }}
              </div>
              <div>
                {{ item.client }}
              </div>
              <div class="text-sm text-gray-400">{{ item.type }} - {{ item.weight }} lbs</div>
              <div class="text-sm text-gray-400">{{ item.status }}</div>
            </div>
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="44"
                height="44"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="icon icon-tabler icons-tabler-outline icon-tabler-chevron-right text-gray-200"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M9 6l6 6l-6 6" />
              </svg>
            </div>
          </button>
        </div>
        <div v-if="!packages.length">
          <div class="text-gray-400 mt-4">No se encontraron paquetes</div>
        </div>
      </template>
      <template v-else>
        <div
          v-if="!result.details?.length && history.length"
          class="w-full flex flex-col gap-4 cursor-pointer"
        >
          <div
            v-for="item in history"
            :key="item.date"
            class="border w-full rounded-xl px-3 py-2"
            @click="showThis(item.tracking)"
          >
            <div class="flex justify-between items-center">
              <div>
                <div class="text-xs mb-2 text-gray-300">
                  {{ new Date(item.date).toLocaleString('es-NI', { timeZone: 'America/Managua' }) }}
                </div>
                <div class="mb-1 text-sm text-[#3a6cb2]">
                  {{ item.tracking.slice(0, 20) }}
                </div>
              </div>
              <div>
                <ReloadSvg class="w-7 h-7 text-gray-300" />
              </div>
            </div>
          </div>
          <div class="mx-auto text-sm text-gray-400">
            <button type="button" @click="clear">Borrar historial</button>
          </div>
        </div>
        <div v-if="!result.details?.length && !history.length" class="text-gray-400 mt-4">
          No hay historial de búsquedas
        </div>
        <PackageDetails :result="result" />
      </template>
    </div>
  </section>
</template>
