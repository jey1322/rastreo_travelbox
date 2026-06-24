<script setup>
import SearchInput from '@/components/SearchInput.vue'
import useTrack from '@/composables/useTrack'
import { ref, onMounted } from 'vue'

const { search, searching, track, client, method, packages, resetValues } = useTrack()
const searchModel = ref('')

// Cargar estado inicial al abrir la página
onMounted(() => {
  const savedMethod = localStorage.getItem('lastMethod') || 'tracking'
  method.value = savedMethod // Selecciona la pestaña que usó por última vez
  
  if (savedMethod === 'tracking') {
    searchModel.value = localStorage.getItem('lastTracking') || ''
  } else {
    searchModel.value = localStorage.getItem('lastName') || ''
  }
})

function onSubmit() {
  resetValues()
  const cleanSearch = searchModel.value.trim()
  
  // Guardamos la pestaña actual
  localStorage.setItem('lastMethod', method.value)

  if (method.value === 'tracking') {
    client.value = ''
    track.value = cleanSearch
    // Guardamos el tracking buscado
    localStorage.setItem('lastTracking', cleanSearch)
  } else {
    track.value = ''
    client.value = cleanSearch
    // Guardamos el nombre buscado
    localStorage.setItem('lastName', cleanSearch)
  }
  search()
}

function switchTo(type) {
  method.value = type
  localStorage.setItem('lastMethod', type)
  
  // Al cambiar de pestaña, cargamos el valor guardado para esa opción (o lo dejamos en blanco)
  if (type === 'tracking') {
    searchModel.value = localStorage.getItem('lastTracking') || ''
  } else {
    searchModel.value = localStorage.getItem('lastName') || ''
  }
}

function formatDate(d) {
  if (!d) return 'Sin fecha'
  const dt = new Date(d)
  if (isNaN(dt.getTime())) return 'Sin fecha'
  return dt.toLocaleDateString('es-NI', { year: 'numeric', month: 'long', day: 'numeric' })
}

function getLastActiveStatus(item) {
  if (item.logs && Array.isArray(item.logs) && item.logs.length > 0) {
    const activeLogs = item.logs.filter(log => log.date && log.date.trim() !== '')
    
    if (activeLogs.length > 0) {
      const lastActive = activeLogs[activeLogs.length - 1]
      return `${lastActive.status} - ${lastActive.date}`
    }
  }
  return item.status || 'Estado no disponible'
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
          v-for="(item, index) in packages"
          :key="item.tracking || index"
          class="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
        >
          <!-- ============================================== -->
          <!-- VISTA: BÚSQUEDA POR NOMBRE                     -->
          <!-- Endpoint devuelve: client, tracking, weight,   -->
          <!-- type, description, createdAt                   -->
          <!-- ============================================== -->
          <template v-if="method === 'name'">
            <div class="flex items-start justify-between gap-4 mb-2">
              <div class="flex-1 border-b pb-2">
                <div class="text-sm font-bold text-[#1a1c27]">{{ item.tracking || 'Sin tracking' }}</div>
                <div class="text-xs text-gray-500 uppercase">{{ item.client }}</div>
              </div>
            </div>
            
            <div class="mt-2 text-sm text-gray-700 space-y-1">
              <div v-if="item.description"><strong>Descripción:</strong> {{ item.description }}</div>
              <div v-if="item.type"><strong>Tipo:</strong> {{ item.type }}</div>
              <div v-if="item.createdAt"><strong>Fecha de Ingreso:</strong> {{ formatDate(item.createdAt) }}</div>
            </div>
          </template>

          <!-- ============================================== -->
          <!-- VISTA: BÚSQUEDA POR TRACKING                   -->
          <!-- Endpoint devuelve en details/logs: status,     -->
          <!-- tracking, guide, weight, description, type     -->
          <!-- ============================================== -->
          <template v-else>
            <div class="flex items-start justify-between gap-4 mb-2">
              <div class="flex-1 border-b pb-2">
                <div class="text-sm font-bold text-[#1a1c27]">{{ item.tracking || 'Sin tracking' }}</div>
                <div v-if="item.guide" class="text-xs text-gray-500">Guía: {{ item.guide }}</div>
              </div>
            </div>

            <div class="mt-2 text-sm text-gray-700 space-y-1">
              <div v-if="item.status || (item.logs && item.logs.length)">
                <strong>Estado:</strong> <span class="font-medium text-blue-800">{{ getLastActiveStatus(item) }}</span>
              </div>
              <div v-if="item.description"><strong>Descripción:</strong> {{ item.description }}</div>
              <div v-if="item.type"><strong>Tipo:</strong> {{ item.type }}</div>
            </div>
          </template>

        </div>
      </div>

      <div v-else class="text-center mt-6">
        <div class="text-gray-400">No se encontraron paquetes</div>
      </div>
    </div>
  </section>
</template>