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
    await fs.copy(source, destination, {
      overwrite: true,
      errorOnExist: false,
    });

    console.log(chalk.green("\n✔ files copied"));
  } catch {
    console.log(chalk.red("\n❌ copy failed"));
  }

  isCopying = false;
}

watcher = chokidar
  .watch(source, {
    ignoreInitial: false,
    persistent: true,
    awaitWriteFinish: {
      stabilityThreshold: 300,
      pollInterval: 100,
    },
  })
  .on("all", () => fullSync());

// start
startSand();