import { ref } from 'vue';
import axios from 'axios';
import { toast } from '@/utils/toast';

const BASE_URL = 'https://financiera-backend-production.up.railway.app'; // Cambia esto por tu URL base
//const BASE_URL = 'http://localhost:3001';

export function useTrack() {
  const track = ref('');
  const result = ref({ client: null, loans: [] });
  const searching = ref(false);

  const search = async () => {
    searching.value = true;

    try {
      const { data } = await axios.get(`${BASE_URL}/search/${track.value}`);
      result.value = data; // Asigna los datos del cliente y préstamos al resultado
    } catch (error) {
      toast.error('Error al buscar el cliente');
      result.value = { client: null, loans: [] }; // Reinicia los datos en caso de error
    } finally {
      searching.value = false;
    }
  };

  const resetValues = () => {
    track.value = '';
    result.value = { client: null, loans: [] };
  };

  return {
    track,
    result,
    searching,
    search,
    resetValues
  };
}
