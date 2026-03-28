import chokidar from "chokidar";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

const source = "C:/Users/TOSHIBA/Documents/Jeux/Minecraft/DATAPACKS/Prodige-s-Skills (sandstone)/prodige-skills/.sandstone/output/datapack";
const destination = "C:/Users/TOSHIBA/AppData/Roaming/ModrinthApp/profiles/Data_Resource Pack Modpack/saves/MAIN/datapacks/prodige-skills";

let isCopying = false;
let timeout: Timer | null = null;

async function fullSync() {
  if (isCopying) return;
  isCopying = true;

  process.stdout.write(chalk.cyan(`\r🔄 Copying files... `));

  try {
    // On copie tout le dossier d'un coup, c'veut dire moins d'erreurs de stream
    await fs.copy(source, destination, {
      overwrite: true,
      errorOnExist: false
    });

    // On attend un petit peu pour laisser le terminal respirer
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      process.stdout.write(chalk.green(`\r✅ Datapack updated!              \n`));
      isCopying = false;
    }, 300);

  } catch (err) {
    process.stdout.write(chalk.red(`\r❌ Copy failed, retrying...       `));
    setTimeout(fullSync, 500); // Relance en cas d'échec (fichier verrouillé)
    isCopying = false;
  }
}

console.log(chalk.bold.magenta("\n🚀 Watching Prodige's Packs output..."));
console.log(chalk.dim("--------------------------------------------"));

chokidar.watch(source, {
  ignoreInitial: false, // On synchronise tout au lancement pour être sûr
  persistent: true,
  awaitWriteFinish: {
    stabilityThreshold: 300,
    pollInterval: 100
  }
}).on("all", () => {
  // Peu importe l'événement (ajout, change, suppr), on synchronise tout
  fullSync();
});