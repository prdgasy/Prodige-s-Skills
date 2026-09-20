import type { DatapackConfig, ResourcePackConfig, SandstoneConfig } from 'sandstone'

export default {
  name: 'prodige_skills',
  packs: {
    datapack: {
      description: ['A ', { text: 'Sandstone', color: 'gold' }, ' datapack.'],
      packFormat: 107,
    } as DatapackConfig,
    resourcepack: {
      description: ['A ', { text: 'Sandstone', color: 'gold' }, ' resource pack.'],
      packFormat: 88,
    } as ResourcePackConfig
  },
  onConflict: {
    default: 'ignore',
  },
  namespace: 'prodige_skills',
  packUid: 'xTSjehSB',
  mcmeta: 'latest',
  saveOptions: {},
} as SandstoneConfig
