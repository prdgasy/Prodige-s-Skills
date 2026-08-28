import type { DatapackConfig, ResourcePackConfig, SandstoneConfig } from 'sandstone'

export default {
  name: 'prodige-skills',
  packs: {
    datapack: {
      description: ['A ', { text: 'Sandstone', color: 'gold' }, ' datapack.'],
      packFormat: 98,
    } as DatapackConfig,
    resourcepack: {
      description: ['A ', { text: 'Sandstone', color: 'gold' }, ' resource pack.'],
      packFormat: 79,
    } as ResourcePackConfig
  },
  onConflict: {
    default: 'throw',
  },
  namespace: 'prodige_skills',
  packUid: '46EQ989V',
  mcmeta: 'latest',
  saveOptions: { exportZips: true }
} as SandstoneConfig
