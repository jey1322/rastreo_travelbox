<script setup>
import SearchInput from '@/components/SearchInput.vue'
import useTrack from '@/composables/useTrack'
import { ref } from 'vue'

const { search, searching, track, client, method, packages, resetValues } = useTrack()
const searchModel = ref('')

function onSubmit() {
  resetValues()
  if (method.value === 'tracking') {
    client.value = ''
    track.value = searchModel.value
  } else {
    track.value = ''
    client.value = searchModel.value
  }
  search()
}

function switchTo(type) {
  method.value = type
  searchModel.value = ''
}

function formatDate(d) {
  if (!d) return 'Sin fecha'
  const dt = new Date(d)
  if (isNaN(dt.getTime())) return 'Sin fecha'
  return dt.toLocaleDateString('es-NI', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<template>
  <section
    class="text-white rounded-b-3xl shadow-xl"
    style="background: linear-gradient(20deg, #1a1c27, #03001c)"
  >
    <div class="w-full flex flex-col items-center justify-center mb-[2.5rem]">
      <form @submit.prevent="onSubmit" class="text-center py-6 px-4 max-w-xl">
        <div class="flex items-center justify-center mb-2">
          <a href="https://travelboxni.com">
            <img src="/icon.png" alt="Logo" class="w-[5rem] h-auto" />
          </a>
        </div>

        <h5 class="text-2xl lg:text-4xl font-bold mb-8 tracking-wider">¡Busca tu paquete!</h5>
        <div class="text-base font-light mb-10 leading-relaxed tracking-wide">
          Ingresa tu número de rastreo o el nombre y monitorea tu paquete al instante 🕒
        </div>

        <div class="grid grid-cols-2 mb-8">
          <button
            @click="switchTo('tracking')"
            type="button"
            class="border border-[#77477e] rounded-l-xl py-3 transition duration-300 ease-in-out"
            :class="method === 'tracking' ? 'bg-[#77477e]' : ''"
          >
            Buscar por tracking
          </button>
          <button
            @click="switchTo('name')"
            type="button"
            class="border border-[#77477e] rounded-r-xl py-3 transition duration-300 ease-in-out"
            :class="method === 'name' ? 'bg-[#77477e]' : ''"
          >
            Buscar por nombre
          </button>
        </div>

        <SearchInput
          v-model="searchModel"
          :loading="searching"
          :placeholder="method == 'tracking' ? 'Ingrese el número de rastreo.' : 'Ingrese su nombre'"
        />

        <div v-if="method === 'name'" class="mt-5 text-sm text-slate-300">
          Ingresar su nombre tal como en la dirección de envío
        </div>
      </form>
    </div>
  </section>

  <section class="bg-white text-gray-600 h-full mb-4">
    <div class="max-w-3xl mx-auto flex flex-col items-stretch mb-4 px-4">
      <div v-if="packages.length" class="w-full flex flex-col gap-4">
        <div
          v-for="item in packages"
          :key="item._id || item.id || item.tracking || item.guide || item.createdAt"
          class="border rounded-lg p-4 bg-white shadow-sm"
        >
          <!-- Encabezado -->
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1">
              <div class="text-sm font-bold text-[#1a1c27]">
                {{ item.tracking || item.guide || item._id || item.id }}
              </div>
              <div class="text-xs text-gray-500">
                {{ item.client || 'Cliente no disponible' }}
              </div>
            </div>

            <div class="text-xs text-gray-400 text-right">
              <div>{{ formatDate(item.createdAt) }}</div>
            </div>
          </div>

          <!-- Campos solicitados: tracking, weight, type, client, status, createdAt, image -->
          <div class="mt-3 text-sm text-gray-700 space-y-1">
            <div><strong>Tracking:</strong> {{ item.tracking || 'N/A' }}</div>
            <div v-if="item.weight !== undefined"><strong>Peso:</strong> {{ item.weight }} lb(s)</div>
            <div v-else-if="item.grossWeight !== undefined"><strong>Peso:</strong> {{ item.grossWeight }} lb(s)</div>
            <div v-if="item.type"><strong>Tipo:</strong> {{ item.type }}</div>
            <div v-if="item.status"><strong>Estado:</strong> {{ item.status }}</div>
          </div>

          <!-- Imagen o 'Sin imagen' -->
          <div class="mt-3">
            <div class="text-sm text-gray-500 mb-1"><strong>Imagen:</strong></div>
            <div v-if="item.image">
              <img :src="item.image" alt="imagen paquete" class="w-40 h-auto rounded" />
            </div>
            <div v-else class="text-sm text-gray-400">Sin imagen</div>
          </div>
        </div>
      </div>

      <div v-else class="text-center mt-6">
        <div class="text-gray-400">No se encontraron paquetes</div>
      </div>
    </div>
  </section>
</template>