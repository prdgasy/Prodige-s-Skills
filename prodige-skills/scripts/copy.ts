import chokidar from "chokidar"
import fs from "fs-extra"
import path from "path"

const source = "C:/Users/TOSHIBA/Documents/Jeux/Minecraft/DATAPACKS/Prodige-s-Skills (sandstone)/prodige-skills/.sandstone/output/datapack"

const destination = "C:/Users/TOSHIBA/AppData/Roaming/ModrinthApp/profiles/Data_Resource Pack Modpack/saves/MAIN/datapacks/prodige-skills"

async function copyFile(src: string) {
  const relative = path.relative(source, src)
  const dest = path.join(destination, relative)

  await fs.ensureDir(path.dirname(dest))
  await fs.copy(src, dest)

  console.log("Copied:", relative)
}

async function removeFile(src: string) {
  const relative = path.relative(source, src)
  const dest = path.join(destination, relative)

  if (await fs.pathExists(dest)) {
    await fs.remove(dest)
    console.log("Removed:", relative)
  }
}

console.log("Watching datapack output...")

chokidar.watch(source, {
  ignoreInitial: false,
  persistent: true
})
  .on("add", copyFile)
  .on("change", copyFile)
  .on("unlink", removeFile)