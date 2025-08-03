<script setup>
import SearchInput from '@/components/SearchInput.vue'
import useTrack from '@/composables/useTrack'
import { ref } from 'vue'

const { search, searching, track, client, method, packages, resetValues } = useTrack()
const searchModel = ref('')

function onSubmit() {
  resetValues();
  if (method.value === 'tracking') {
    client.value = '';
    track.value = searchModel.value;
  } else {
    track.value = '';
    client.value = searchModel.value;
  }
  search();
}

function switchTo(type) {
  method.value = type;
  searchModel.value = '';
}
function showThis(tracking) {
  // Aquí puedes mostrar detalles del paquete si lo deseas
  console.log(`Mostrando detalles para el tracking: ${tracking}`);
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
          Ingresa tu número de rastreo y monitorea el progreso de tu paquete al instante 🕒
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
      <div class="w-full flex flex-col gap-4">
        <div
          type="button"
          v-for="item in packages"
          :key="item.id"
          @click.prevent="showThis(item.tracking)"
          class="flex items-center justify-between gap-1 border rounded-lg px-4 py-3"
        >
          <div class="text-left flex flex-col gap-1">
            <div class="font-bold text-[#3a6cb2] text-sm">
              {{ item.tracking }}
            </div>
            <div>
              {{ item.client }}
            </div>
            <div class="text-sm text-gray-400">{{ item.type }} - {{}} lbs</div>
            <div class="text-sm text-gray-400">{{ item.description }}</div>
            <div class="text-xs text-gray-400">{{ new Date(item.createdAt).toLocaleDateString('es-NI', { year: 'numeric', month: 'long', day: 'numeric' }) }}</div>
          </div>
        </div>
      </div>
      <div v-if="!packages.length">
        <div class="text-gray-400 mt-4">No se encontraron paquetes</div>
      </div>
    </div>
  </section>
</template>
