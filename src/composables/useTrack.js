import { useHistoryStore } from '@/stores/history'
import { toast } from '@/utils/toast.js'
import axios from 'axios'
import { ref } from 'vue'

export function useTrack() {
  const BASE_URL = 'https://ft-backend-production-e6f5.up.railway.app'
  //const BASE_URL = 'http://localhost:3001'
  const searching = ref(false)
  const track = ref('')
  const client = ref('')
  const method = ref('tracking')
  const history = useHistoryStore()

  const result = ref({
    details: [],
    logs: []
  })

  const packages = ref([])

  const search = async () => {
    searching.value = true

    await axios
      .get(`${BASE_URL}/search`, {
        params: {
          track: track.value,
          client: client.value
        }
      })
      .then(({ data }) => {
        if (method.value === 'name') {
          packages.value = data
        } else {
          result.value = data

          if (data.details.length > 1) {
            history.setTracking(track.value)
          }
        }
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
