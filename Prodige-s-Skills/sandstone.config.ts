import type { DatapackConfig, ResourcePackConfig, SandstoneConfig } from 'sandstone'

export default {
  name: 'Prodige-s-Skills',
  packs: {
    datapack: {
      description: [ 'A ', { text: 'Sandstone', color: 'gold' }, ' datapack.' ],
      packFormat: 98,
    } as DatapackConfig,
    resourcepack: {
      description: [ 'A ', { text: 'Sandstone', color: 'gold' }, ' resource pack.' ],
      packFormat: 79,
    } as ResourcePackConfig
  },
  onConflict: {
    default: 'warn',
  },
  namespace: 'Prodige-s-Skills',
  packUid: 'L0DJOh__',
  mcmeta: 'latest',
  saveOptions: { clientPath: 'C:\\Users\\TOSHIBA\\AppData\\Roaming\\ModrinthApp\\profiles\\Data_Resource Pack Modpack', world: 'MAIN' },
} as SandstoneConfig
