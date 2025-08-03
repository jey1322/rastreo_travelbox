<script setup>
import { ref, onMounted } from 'vue';
import { useTrack } from '@/composables/useTrack';
import SearchInput from '@/components/SearchInput.vue';
import { toast } from '@/utils/toast';
import { vMaska } from 'maska/vue';
import { createMaskaConfig } from '@/utils/maska';
import { IconUser, IconPhone, IconId, IconMapPin, IconStar, IconCalendar, IconCurrencyDollar, IconCheck } from '@tabler/icons-vue';

const { search, result, searching, track } = useTrack();
const searchModel = ref('');

onMounted(() => {
  const savedTrack = localStorage.getItem('track'); 
  if (savedTrack) {
    searchModel.value = savedTrack;
    track.value = savedTrack;
    search();
  }
});

function onSubmit() {
  if (!searchModel.value) {
    toast.error('Por favor, ingresa un número de cédula');
    return;
  }

  track.value = searchModel.value;
  localStorage.setItem('track', searchModel.value); 
  search();
}
</script>

<template>
  <!-- Sección de búsqueda -->
  <section
    class="text-white rounded-b-3xl shadow-xl"
    style="background: linear-gradient(20deg, #77b885, #77b885)"
  >
    <div class="w-full flex flex-col items-center justify-center mb-[2.5rem]">
      <form @submit.prevent="onSubmit" class="text-center py-6 px-4 max-w-xl">
        <div class="flex items-center justify-center mb-2">
          <a href="https://creditalinstante.com">
            <img
              src="https://raw.githubusercontent.com/jey1322/angular-course/refs/heads/main/CreditAlInstante.png"
              alt="Logo"
              class="w-[10rem] h-auto"
            />
          </a>
        </div>
        <h5 class="text-2xl lg:text-4xl font-bold mb-8 tracking-wider">
          ¡Lleva el control de tus préstamos!
        </h5>
        <div class="text-base font-light mb-10 leading-relaxed tracking-wide">
          Ingresa tu número de cédula y monitorea tus préstamos en tiempo real.
        </div>

        <SearchInput
          v-model="searchModel"
          :loading="searching"
          :placeholder="'Número de cédula'"
          v-maska="createMaskaConfig('###-######-####A')"
        />
      </form>
    </div>
  </section>

  <!-- Sección de resultados -->
  <section class="bg-white text-gray-600 h-full mb-4">
    <div class="max-w-6xl mx-auto flex flex-col items-center justify-center mb-4 px-4">
      <!-- Mostrar estado de carga -->
      <div v-if="searching" class="text-center my-4">
        <span class="loading loading-spinner text-gray-500 mx-auto"></span>
      </div>

      <!-- Mostrar datos del cliente -->
      <div v-if="result.client" class="card bg-white shadow-md rounded-lg p-6 mb-6 w-full border border-gray-200">
        <h2 class="text-xl font-bold mb-4 text-gray-800">Datos del Cliente</h2>
        <div class="text-sm text-gray-700 space-y-4">
          <div class="flex gap-2 items-center">
            <IconUser size="20" class="text-green-600" />
            <span><span class="font-semibold">Nombre:</span> {{ result.client.name }}</span>
          </div>
          <div class="flex gap-2 items-center">
            <IconPhone size="20" class="text-green-600" />
            <span><span class="font-semibold">Teléfono:</span> {{ result.client.phone }}</span>
          </div>
          <div class="flex gap-2 items-center">
            <IconId size="20" class="text-green-600" />
            <span><span class="font-semibold">Identificación:</span> {{ result.client.identificationNumber }}</span>
          </div>
          <div class="flex gap-2 items-center">
            <IconMapPin size="20" class="text-green-600" />
            <span><span class="font-semibold">Dirección:</span> {{ result.client.address }}</span>
          </div>
          <div class="flex gap-2 items-center">
            <IconStar size="20" class="text-yellow-500" />
            <span><span class="font-semibold">Calificación:</span> {{ result.client.rating }}</span>
          </div>
        </div>
      </div>

      <!-- Mostrar listado de préstamos -->
      <div v-if="result.loans.length" class="w-full">
        <h2 class="text-xl font-bold mb-4 text-gray-800">Listado de Préstamos</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="loan in result.loans"
            :key="loan._id"
            class="card bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-lg transition"
            @click="$router.push({ name: 'loan-details', params: { id: loan._id } })"
          >
            <h3 class="text-lg font-bold mb-4 text-gray-800">Préstamo</h3>
            <div class="text-sm text-gray-700 space-y-4">
              <div class="flex gap-2 items-center">
                <IconCurrencyDollar size="20" class="text-green-600" />
                <span><span class="font-semibold">Monto:</span> {{ loan.amount }}</span>
              </div>
              <div class="flex gap-2 items-center">
                <IconCurrencyDollar size="20" class="text-green-600" />
                <span><span class="font-semibold">Interés:</span> {{ loan.interest }}</span>
              </div>
              <div class="flex gap-2 items-center">
                <IconCurrencyDollar size="20" class="text-green-600" />
                <span><span class="font-semibold">Total:</span> {{ loan.totalAmount }}</span>
              </div>
              <div class="flex gap-2 items-center">
                <IconCheck size="20" class="text-green-600" />
                <span><span class="font-semibold">Cuotas:</span> {{ loan.quotas }}</span>
              </div>
              <div class="flex gap-2 items-center">
                <IconCalendar size="20" class="text-green-600" />
                <span><span class="font-semibold">Frecuencia de Pago:</span> {{ loan.paymentFrequency }}</span>
              </div>
              <div class="flex gap-2 items-center">
                <IconCalendar size="20" class="text-green-600" />
                <span><span class="font-semibold">Fecha de Inicio:</span> {{ loan.startDate }}</span>
              </div>
              <div class="flex gap-2 items-center">
                <IconCalendar size="20" class="text-green-600" />
                <span><span class="font-semibold">Fecha de Fin:</span> {{ loan.endDate }}</span>
              </div>
              <div class="flex gap-2 items-center">
                <IconCheck size="20" class="text-green-600" />
                <span><span class="font-semibold">Estado:</span> {{ loan.isCompleted ? 'Completado' : 'Pendiente' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mostrar mensaje si no hay datos -->
      <div v-if="!result.client && !result.loans.length && !searching" class="text-center text-gray-500">
        <p>No se encontraron datos para el cliente.</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.card {
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>