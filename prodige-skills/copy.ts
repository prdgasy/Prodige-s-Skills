import chokidar, { FSWatcher } from "chokidar";
import fs from "fs-extra";
import chalk from "chalk";
import { spawn, execSync } from "child_process";
import readline from "readline";
import path from "path";
import os from "os";

// Fichiers de configuration
const OUTPUT_FILE_NAMES = ["outputPath", "outputPath.txt"];

/**
 * Récupère le nom du datapack depuis sandstone.config.ts, package.json ou le dossier courant
 */
function getDatapackName(): string {
  try {
    const configPath = path.join(process.cwd(), "sandstone.config.ts");
    if (fs.existsSync(configPath)) {
      const content = fs.readFileSync(configPath, "utf-8");
      const match = content.match(/name\s*:\s*['"`]([^'"`]+)['"`]/);
      if (match && match[1]) return match[1];
    }
  } catch { }

  try {
    const pkgPath = path.join(process.cwd(), "package.json");
    if (fs.existsSync(pkgPath)) {
      const pkg = fs.readJsonSync(pkgPath);
      if (pkg.name && pkg.name !== "sandstone-template") return pkg.name;
    }
  } catch { }

  return path.basename(process.cwd());
}

/**
 * Recherche le chemin de base des profils Modrinth
 */
function getModrinthProfilesDir(): string {
  if (process.platform === "win32") {
    const appData = process.env.APPDATA || path.join(os.homedir(), "AppData", "Roaming");
    return path.join(appData, "ModrinthApp", "profiles");
  } else if (process.platform === "darwin") {
    return path.join(os.homedir(), "Library", "Application Support", "ModrinthApp", "profiles");
  } else {
    return path.join(os.homedir(), ".config", "ModrinthApp", "profiles");
  }
}

/**
 * Pose une question dans la console
 */
function askQuestion(rl: readline.Interface, query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      resolve(answer.trim());
    });
  });
}

/**
 * Récupère les sous-dossiers d'un répertoire
 */
async function getSubdirectories(dirPath: string): Promise<string[]> {
  try {
    if (!(await fs.pathExists(dirPath))) return [];
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    return entries.filter((e) => e.isDirectory()).map((e) => e.name);
  } catch {
    return [];
  }
}

/**
 * Demande à l'utilisateur quel mode lancer (Watch ou Simple Compile & Copy)
 */
async function askExecutionMode(): Promise<"watch" | "build"> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log(chalk.cyan.bold("\n⚡ Choisissez le mode d'exécution :"));
  console.log(chalk.white("  [1] ") + chalk.green("Watch") + chalk.gray(" (surveille et synchronise en continu à chaque modification)"));
  console.log(chalk.white("  [2] ") + chalk.yellow("Simple compile & copy") + chalk.gray(" (compile une fois avec 'sand build' puis copie)"));

  let mode: "watch" | "build" | null = null;

  while (!mode) {
    const answer = await askQuestion(rl, chalk.cyan("\nVotre choix (1 ou 2, défaut = 2) : "));
    if (answer === "1" || answer.toLowerCase() === "watch" || answer.toLowerCase() === "w") {
      mode = "watch";
    } else if (answer === "" || answer === "2" || answer.toLowerCase() === "build" || answer.toLowerCase() === "b" || answer.toLowerCase() === "compile") {
      mode = "build";
    } else {
      console.log(chalk.red("Option invalide, choisissez 1 ou 2."));
    }
  }

  rl.close();
  return mode;
}

/**
 * Configure interactivement la destination du datapack
 */
async function promptForDestination(datapackName: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log(chalk.cyan.bold("\n🔧 Configuration initiale de la destination du datapack"));
  console.log(chalk.gray(`Datapack ciblé : ${chalk.white.bold(datapackName)}`));

  const modrinthDir = getModrinthProfilesDir();
  const profiles = await getSubdirectories(modrinthDir);

  let chosenProfileDir = "";

  if (profiles.length > 0) {
    console.log(chalk.yellow(`\n📁 Profils Modrinth détectés (${modrinthDir}) :`));
    profiles.forEach((p, idx) => {
      console.log(chalk.white(`  [${idx + 1}] `) + chalk.green(p));
    });
    console.log(chalk.white(`  [0] `) + chalk.gray("Entrer un chemin personnalisé"));

    while (!chosenProfileDir) {
      const answer = await askQuestion(
        rl,
        chalk.cyan(`\nChoisissez un profil (1-${profiles.length}) ou 0 : `)
      );

      if (answer === "0") {
        const customPath = await askQuestion(rl, chalk.cyan("Entrez le chemin complet du profil : "));
        if (customPath && (await fs.pathExists(customPath))) {
          chosenProfileDir = customPath;
        } else {
          console.log(chalk.red("Chemin invalide ou introuvable."));
        }
      } else {
        const num = parseInt(answer, 10);
        if (!isNaN(num) && num >= 1 && num <= profiles.length) {
          chosenProfileDir = path.join(modrinthDir, profiles[num - 1]);
        } else {
          console.log(chalk.red("Option invalide, veuillez réessayer."));
        }
      }
    }
  } else {
    console.log(chalk.yellow(`\nAucun profil Modrinth trouvé automatiquement dans : ${modrinthDir}`));
    const custom = await askQuestion(rl, chalk.cyan("Entrez le chemin complet vers le dossier du profil : "));
    chosenProfileDir = custom;
  }

  // Sélection du monde dans saves/
  const savesDir = path.join(chosenProfileDir, "saves");
  const worlds = await getSubdirectories(savesDir);

  let chosenWorld = "";

  if (worlds.length > 0) {
    console.log(chalk.yellow(`\n🌍 Mondes détectés dans le profil :`));
    worlds.forEach((w, idx) => {
      console.log(chalk.white(`  [${idx + 1}] `) + chalk.green(w));
    });
    console.log(chalk.white(`  [0] `) + chalk.gray("Entrer un nom de monde personnalisé"));

    while (!chosenWorld) {
      const answer = await askQuestion(
        rl,
        chalk.cyan(`\nChoisissez un monde (1-${worlds.length}) ou 0 : `)
      );

      if (answer === "0") {
        const customWorld = await askQuestion(rl, chalk.cyan("Entrez le nom du monde : "));
        if (customWorld) {
          chosenWorld = customWorld;
        }
      } else {
        const num = parseInt(answer, 10);
        if (!isNaN(num) && num >= 1 && num <= worlds.length) {
          chosenWorld = worlds[num - 1];
        } else {
          console.log(chalk.red("Option invalide, veuillez réessayer."));
        }
      }
    }
  } else {
    console.log(chalk.yellow(`\nAucun monde trouvé dans ${savesDir}`));
    chosenWorld = await askQuestion(rl, chalk.cyan("Entrez le nom du monde (ex: FRIANDISE) : "));
  }

  rl.close();

  // Chemin final vers datapacks/<datapackName>
  const finalPath = path.join(savesDir, chosenWorld, "datapacks", datapackName).replace(/\\/g, "/");

  // Enregistrement dans outputPath
  const saveFile = path.join(process.cwd(), "outputPath");
  await fs.writeFile(saveFile, finalPath, "utf-8");

  console.log(chalk.green(`\n💾 Destination enregistrée dans ${chalk.bold("outputPath")} :`));
  console.log(chalk.gray(`   ${finalPath}`));
  console.log(chalk.gray(`   (Pour changer plus tard, modifiez ou supprimez le fichier 'outputPath')\n`));

  return finalPath;
}

/**
 * Récupère ou demande le chemin de destination
 */
async function getDestinationPath(datapackName: string): Promise<string> {
  // 1. Vérifier si un fichier outputPath existe et n'est pas vide
  for (const fileName of OUTPUT_FILE_NAMES) {
    const filePath = path.join(process.cwd(), fileName);
    if (await fs.pathExists(filePath)) {
      const content = (await fs.readFile(filePath, "utf-8")).trim();
      if (content) {
        return content.replace(/\\/g, "/");
      }
    }
  }

  // 2. Si non trouvé ou vide, demander interactivement
  return await promptForDestination(datapackName);
}

// Variables d'exécution
let sand: any;
let watcher: FSWatcher | null = null;
let shuttingDown = false;
let copyTimeout: NodeJS.Timeout | null = null;
let isCopying = false;

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

  console.log(chalk.magenta("🚀 sand watch started\n"));

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

async function fullSync(source: string, destination: string) {
  if (isCopying || shuttingDown) return;
  isCopying = true;

  try {
    if (!(await fs.pathExists(source))) {
      isCopying = false;
      return;
    }

    // 1. On vide le dossier de destination pour remplacer proprement le datapack
    if (await fs.pathExists(destination)) {
      await fs.emptyDir(destination);
    } else {
      await fs.ensureDir(destination);
    }

    // 2. On copie le datapack fraîchement compilé
    await fs.copy(source, destination, {
      overwrite: true,
      errorOnExist: false,
    });

    console.log(chalk.green(`\n✔ Datapack synchronisé avec succès vers :\n   ${chalk.gray(destination)} (${new Date().toLocaleTimeString()})\n`));
  } catch (err) {
    console.log(chalk.red("\n❌ La synchronisation a échoué :"), err);
  }

  isCopying = false;
}

function triggerSync(source: string, destination: string) {
  if (shuttingDown) return;

  if (copyTimeout) clearTimeout(copyTimeout);

  copyTimeout = setTimeout(() => {
    fullSync(source, destination);
  }, 800);
}

async function main() {
  const datapackName = getDatapackName();
  const source = path.resolve(process.cwd(), ".sandstone/output/datapack").replace(/\\/g, "/");
  const destination = await getDestinationPath(datapackName);

  console.log(chalk.cyan("📦 Source Sandstone : ") + chalk.gray(source));
  console.log(chalk.cyan("🎯 Destination      : ") + chalk.green(destination));

  const mode = await askExecutionMode();

  if (mode === "build") {
    console.log(chalk.cyan("\n🔨 Compilation du datapack avec Sandstone (sand build)..."));
    try {
      execSync("sand build", { stdio: "inherit" });
      console.log(chalk.blue("\n📂 Copie en cours vers le monde Minecraft..."));
      await fullSync(source, destination);
      console.log(chalk.green("✨ Opération terminée avec succès !"));
      process.exit(0);
    } catch (err) {
      console.log(chalk.red("\n❌ Erreur lors de la compilation ou de la copie :"), err);
      process.exit(1);
    }
  }

  // Mode Watch
  console.log(chalk.gray("\nMode Watch activé. Appuyez sur 'q' ou 'Ctrl+C' pour quitter.\n"));

  // Clavier pour quitter
  readline.emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
  }
  process.stdin.resume();

  process.stdin.on("keypress", (_, key) => {
    if (key.name === "q" || (key.ctrl && key.name === "c")) {
      shutdown();
    }
  });

  // Watcher sur le dossier de sortie de Sandstone
  watcher = chokidar
    .watch(source, {
      ignoreInitial: false, // Permet de synchroniser au démarrage si déjà compilé
      persistent: true,
      awaitWriteFinish: {
        stabilityThreshold: 200,
        pollInterval: 50,
      },
    })
    .on("all", () => triggerSync(source, destination));

  // Lancement du compilateur Sandstone
  startSand();
}

main().catch((err) => {
  console.error(chalk.red("Erreur inattendue :"), err);
  process.exit(1);
});

