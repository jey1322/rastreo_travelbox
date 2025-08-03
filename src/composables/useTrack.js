import { toast } from '@/utils/toast.js'
import axios from 'axios'
import { ref } from 'vue'

export function useTrack() {
  const BASE_URL = 'https://agency-api-production-883f.up.railway.app'
  //const BASE_URL = 'http://localhost:3001'
  const searching = ref(false)
  const track = ref('')
  const client = ref('')
  const method = ref('tracking')

  const result = ref({
    details: [],
    logs: []
  })

  const packages = ref([])

  const search = async () => {
    searching.value = true

    const params = method.value === 'tracking'
      ? { track: track.value }
      : { client: client.value };

    await axios
      .get(`${BASE_URL}/search`, {
        params
      })
      .then(({ data }) => {
        packages.value = data;
      })
      .catch(() => {
        toast.error('Error al buscar el paquete')
      })
      .finally(() => {
        searching.value = false
      })
  }

  function resetValues() {
    result.value = { details: [], logs: [] }
  }

  return { search, result, searching, track, resetValues, client, method, packages }
}

export default useTrack
