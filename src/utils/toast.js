import { createToaster } from '@meforma/vue-toaster'

export const toast = createToaster({
  position: 'top',
  duration: 3000,
  max: 2,
  pauseOnHover: false
})
