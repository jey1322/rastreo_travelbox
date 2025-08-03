import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useHistoryStore = defineStore(
  'history',
  () => {
    const history = ref([])

    function setTracking(tracking) {
      const found = history.value.find((item) => item.tracking === tracking)

      if (!found) {
        history.value.unshift({ tracking, date: new Date() })
      } else {
        found.date = new Date()
        history.value = history.value.filter((item) => item.tracking !== tracking)
        history.value.unshift(found)
      }
    }

    function clear() {
      history.value = []
    }

    return { history, setTracking, clear }
  },
  {
    persist: true
  }
)
