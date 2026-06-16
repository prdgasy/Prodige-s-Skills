import chokidar, { FSWatcher } from "chokidar";
import fs from "fs-extra";
import chalk from "chalk";
import { spawn } from "child_process";
import readline from "readline";

const source =
  "C:/Users/TOSHIBA/Documents/Jeux/Minecraft/DATAPACKS/Prodige-s-Skills (sandstone)/prodige-skills/.sandstone/output/datapack";

const destination =
  "C:/Users/TOSHIBA/AppData/Roaming/ModrinthApp/profiles/Data_Resource Pack Modpack/saves/FRIANDISE/datapacks/prodige-skills";

let sand: any;
let watcher: FSWatcher | null = null;
let shuttingDown = false;
let copyTimeout: NodeJS.Timeout | null = null; // Pour gérer l'anti-rebond

// clavier
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.resume();

process.stdin.on("keypress", (_, key) => {
  if (key.name === "q" || (key.ctrl && key.name === "c")) {
    shutdown();
  }
});

function shutdown() {
  if (shuttingDown) return;
  shuttingDown = true;

  console.log(chalk.yellow("\n👋 Shutting down..."));
  if (copyTimeout) clearTimeout(copyTimeout);
  if (watcher) watcher.close();
  if (sand) sand.kill("SIGTERM");

  process.exit(0);
}

function startSand() {
  if (shuttingDown) return;

  console.log(chalk.magenta("\n🚀 sand watch started\n"));

  sand = spawn("sand", ["watch"], {
    shell: true,
    stdio: "inherit",
  });

  sand.on("exit", (code: number) => {
    if (shuttingDown) return;

    console.log(chalk.red(`\n❌ sand stopped (code ${code})`));

    setTimeout(() => {
      console.log(chalk.yellow("🔄 restarting sand watch...\n"));
      startSand();
    }, 1000);
  });
}

let isCopying = false;

async function fullSync() {
  if (isCopying || shuttingDown) return;
  isCopying = true;

  try {
    // 1. On vide entièrement le dossier de destination pour remplacer proprement le datapack
    if (await fs.pathExists(destination)) {
      await fs.emptyDir(destination);
    }

    // 2. On copie le nouveau datapack fraîchement compilé
    await fs.copy(source, destination, {
      overwrite: true,
      errorOnExist: false,
    });

    console.log(chalk.green(`\n✔ Datapack mis à jour avec succès ! (${new Date().toLocaleTimeString()})`));
  } catch (err) {
    console.log(chalk.red("\n❌ La copie a échoué :"), err);
  }

  isCopying = false;
}

// Déclencheur intelligent (Anti-rebond / Debounce)
function triggerSync() {
  if (shuttingDown) return;

  // Tant que Sandstone modifie des fichiers, on repousse la copie à plus tard
  if (copyTimeout) clearTimeout(copyTimeout);

  // On attend 800ms de calme total avant d'ordonner la copie unique
  copyTimeout = setTimeout(() => {
    fullSync();
  }, 800);
}

watcher = chokidar
  .watch(source, {
    ignoreInitial: true, // Évite de copier dès le lancement du script avant Sandstone
    persistent: true,
    awaitWriteFinish: {
      stabilityThreshold: 400, // Attend qu'un fichier soit stable avant de réagir
      pollInterval: 100,
    },
  })
  // On appelle triggerSync() qui va temporiser, plutôt que fullSync() en direct
  .on("all", () => triggerSync());

// start
startSand();