import type { MaskInputOptions } from 'maska'

export function createMaskaConfig(mask: string): MaskInputOptions {
  return {
    mask,
    tokens: {
      A: { pattern: /[A-Z]/, transform: (chr: string) => chr.toUpperCase() }
    }
  }
}
