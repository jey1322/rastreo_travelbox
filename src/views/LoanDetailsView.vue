<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { IconCurrencyDollar, IconCheck, IconCalendar } from '@tabler/icons-vue'; // Importa los iconos necesarios

const route = useRoute();
const router = useRouter();
const loanDetails = ref(null);
const payments = ref([]);
const loading = ref(true);

onMounted(async () => {
  const loanId = route.params.id; // Obtén el ID del préstamo desde la URL
  try {
    const { data } = await axios.get(`https://financiera-backend-production.up.railway.app/loansportal/${loanId}`);
    loanDetails.value = data.loan;
    payments.value = data.payments;
  } catch (error) {
    console.error('Error al obtener los detalles del préstamo:', error);
  } finally {
    loading.value = false;
  }
});

function goBack() {
  router.push({ name: 'home' }); // Regresa al HomeView
}

const sumAmountPaid = () => {
  return payments.value.reduce((sum, payment) => sum + (payment.amountPaid || 0), 0); // Sumar montos abonados
};

const sumLatePayments = () => {
  const now = new Date(); // Fecha actual
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Normaliza al inicio del día local

  return payments.value
    .filter(payment => {
      const paymentDate = new Date(payment.dateToPay);
      const normalizedPaymentDate = new Date(
        paymentDate.getFullYear(),
        paymentDate.getMonth(),
        paymentDate.getDate()
      );
      return normalizedPaymentDate < today && !payment.amountPaid; // Compara solo las fechas, sin horas
    })
    .reduce((sum, payment) => sum + (payment.amountToPay || 0), 0); // Sumar montos
};
</script>

<template>
  <!-- Topbar -->
  <header
    class="text-white py-4 px-6 shadow-md flex items-center justify-between rounded-b-3xl"
    style="background: linear-gradient(20deg, #77b885, #77b885)"
  >
    <h1 class="text-xl font-bold">Detalles del Préstamo</h1>
    <button
      @click="goBack"
      class="bg-white text-green-600 px-4 py-2 rounded-md shadow hover:bg-gray-100 transition"
    >
      Regresar
    </button>
  </header>

  <!-- Contenido -->
  <section class="bg-white text-gray-600 h-full mb-4 mt-6">
    <div class="max-w-6xl mx-auto flex flex-col items-center justify-center mb-4 px-4">
      <!-- Mostrar estado de carga -->
      <div v-if="loading" class="text-center my-4">
        <span class="loading loading-spinner text-gray-500 mx-auto"></span>
      </div>

      <!-- Mostrar detalles del préstamo -->
      <div v-else-if="loanDetails" class="card bg-white shadow-md rounded-lg p-6 mb-6 w-full border border-gray-200">
        <h2 class="text-xl font-bold mb-4 text-gray-800">Detalles del Préstamo</h2>
        <div class="text-sm text-gray-700 space-y-4">
          <div class="flex gap-2 items-center">
            <IconCurrencyDollar size="20" class="text-green-600" />
            <span><span class="font-semibold">Monto:</span> {{ loanDetails.amount }}</span>
          </div>
          <div class="flex gap-2 items-center">
            <IconCurrencyDollar size="20" class="text-green-600" />
            <span><span class="font-semibold">Interés:</span> {{ loanDetails.interest }}</span>
          </div>
          <div class="flex gap-2 items-center">
            <IconCurrencyDollar size="20" class="text-green-600" />
            <span><span class="font-semibold">Total:</span> {{ loanDetails.totalAmount }}</span>
          </div>
          <div class="flex gap-2 items-center">
            <IconCheck size="20" class="text-green-600" />
            <span><span class="font-semibold">Cuotas:</span> {{ loanDetails.quotas }}</span>
          </div>
          <div class="flex gap-2 items-center">
            <IconCalendar size="20" class="text-green-600" />
            <span><span class="font-semibold">Frecuencia de Pago:</span> {{ loanDetails.paymentFrequency }}</span>
          </div>
          <div class="flex gap-2 items-center">
            <IconCalendar size="20" class="text-green-600" />
            <span><span class="font-semibold">Fecha de Inicio:</span> {{ loanDetails.startDate }}</span>
          </div>
          <div class="flex gap-2 items-center">
            <IconCalendar size="20" class="text-green-600" />
            <span><span class="font-semibold">Fecha de Fin:</span> {{ loanDetails.endDate }}</span>
          </div>
          <div class="flex gap-2 items-center">
            <IconCheck size="20" class="text-green-600" />
            <span><span class="font-semibold">Estado:</span> {{ loanDetails.isCompleted ? 'Completado' : 'Pendiente' }}</span>
          </div>
          <div class="flex gap-2 items-center">
            <IconCurrencyDollar size="20" class="text-green-600" />
            <span><span class="font-semibold">Monto Abonado:</span> C$ {{ sumAmountPaid().toLocaleString('en') }}</span>
          </div>
          <div class="flex gap-2 items-center">
            <IconCurrencyDollar size="20" class="text-green-600" />
            <span><span class="font-semibold">Saldo Restante:</span> C$ {{ (loanDetails.totalAmount - sumAmountPaid()).toLocaleString('en') }}</span>
          </div>
          <div class="flex gap-2 items-center">
            <IconCurrencyDollar size="20" class="text-green-600" />
            <span><span class="font-semibold">Monto Cuotas Atrasadas:</span> C$ {{ sumLatePayments().toLocaleString('en') }}</span>
          </div>
        </div>
      </div>

      <!-- Mostrar listado de abonos -->
      <div v-if="payments.length" class="w-full">
        <h2 class="text-xl font-bold mb-4 text-gray-800">Listado de Abonos</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="payment in payments"
            :key="payment._id"
            class="card shadow-md rounded-lg p-6 border"
            :class="payment.amountPaid ? 'bg-green-100 border-green-400' : 'bg-white border-red-400'"
          >
            <h3 class="text-lg font-bold mb-4 text-gray-800">Abono #{{ payment.order }}</h3>
            <div class="text-sm text-gray-700 space-y-4">
              <div class="flex gap-2 items-center">
                <IconCurrencyDollar size="20" class="text-green-600" />
                <span><span class="font-semibold">Monto a Pagar:</span> {{ payment.amountToPay }}</span>
              </div>
              <div class="flex gap-2 items-center">
                <IconCalendar size="20" class="text-green-600" />
                <span><span class="font-semibold">Fecha de Pago:</span> {{ payment.dateToPay }}</span>
              </div>
              <div class="flex gap-2 items-center">
                <IconCurrencyDollar size="20" class="text-green-600" />
                <span><span class="font-semibold">Monto Pagado:</span> {{ payment.amountPaid || 'Pendiente' }}</span>
              </div>
              <div class="flex gap-2 items-center">
                <IconCalendar size="20" class="text-green-600" />
                <span><span class="font-semibold">Pagado el:</span> {{ payment.paidAt || 'N/A' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mostrar mensaje si no hay datos -->
      <div v-if="!loanDetails && !loading" class="text-center text-gray-500">
        <p>No se encontraron detalles para este préstamo.</p>
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