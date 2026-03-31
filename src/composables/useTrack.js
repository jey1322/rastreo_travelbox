import { toast } from '@/utils/toast.js'
import axios from 'axios'
import { ref } from 'vue'

export function useTrack() {
  const BASE_URL = 'https://ft-backend-production.up.railway.app'
  // const BASE_URL = 'http://localhost:3001'
  const searching = ref(false)
  const track = ref('')
  const client = ref('')
  const method = ref('tracking')

  const packages = ref([])

  const search = async () => {
    searching.value = true

    const params = method.value === 'tracking'
      ? { track: track.value }
      : { client: client.value }

    try {
      const { data } = await axios.get(`${BASE_URL}/search`, { params })

      // Si ya es un array (búsqueda por nombre), usarlo tal cual
      if (Array.isArray(data)) {
        packages.value = data
        return
      }

      // Nuevo formato de tracking: { details: [...], logs: [...] }
      if (data && Array.isArray(data.details)) {
        const details = data.details.map(d => (typeof d === 'string' ? d.trim() : d))

        // Intentar extraer campos comunes del array details (según ejemplos)
        const status = details[0] || ''
        const dateElem = details.find(d => /\d{1,2}\/\d{1,2}\/\d{4}/.test(d)) || ''
        let createdAtIso = new Date().toISOString()
        const dateMatch = (dateElem.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/) || [])
        if (dateMatch.length === 4) {
          const day = parseInt(dateMatch[1], 10)
          const month = parseInt(dateMatch[2], 10) - 1
          const year = parseInt(dateMatch[3], 10)
          const dt = new Date(year, month, day)
          if (!isNaN(dt.getTime())) createdAtIso = dt.toISOString()
        }

        // tracking suele estar en la posición 2 en los ejemplos
        const trackingCandidate = details[1] || ''
        const tracking = trackingCandidate && /[A-Za-z0-9-]{6,}/.test(trackingCandidate) ? trackingCandidate : (track.value || '')

        // guía
        const guideElem = details.find(d => /Gu[ií]a[:\s]/i.test(d)) || ''
        const guide = guideElem ? guideElem.replace(/Gu[ií]a[:\s]*/i, '').trim() : ''

        // peso (lb) - buscar "lb" o "lb(s)"
        const weightElem = details.find(d => /\d+(\.\d+)?\s*lb/i.test(d)) || ''
        const weightMatch = (weightElem.match(/(\d+(\.\d+)?)/) || [])[0]
        const weight = weightMatch ? parseFloat(weightMatch) : undefined

        // tipo (último elemento en ejemplos)
        const typeElem = details.find((d, ) => /Mar[ií]timo|Maritimo|Aereo|Air|Marítimo|Ocean|Oceanic/i.test(d)) || details[details.length - 1] || ''
        const type = typeElem || ''

        const pkg = {
          _id: guide || tracking || Date.now().toString(),
          tracking: tracking || '',
          weight: weight,
          type: type || '',
          client: '', // no viene en este formato
          status: status || '',
          guide: guide ? (isNaN(Number(guide)) ? guide : Number(guide)) : undefined,
          image: undefined,
          createdAt: createdAtIso,
          updatedAt: createdAtIso,
          logs: Array.isArray(data.logs) ? data.logs : [],
          rawDetails: details
        }

        packages.value = [pkg]
        return
      }

      // Si no es ninguno de los formatos esperados
      packages.value = []
    } catch (err) {
      packages.value = []
      // Si el servidor responde con un mensaje específico, lo mostramos. Si no, mostramos un error por defecto.
      const errorMessage = err.response?.data?.message || 'Error al buscar el paquete'
      toast.error(errorMessage)
    } finally {
      searching.value = false
    }
  }

  function resetValues() {
    packages.value = []
    track.value = ''
    client.value = ''
  }

  return { search, searching, track, resetValues, client, method, packages }
}

export default useTrack