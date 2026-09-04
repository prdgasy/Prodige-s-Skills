import fs from "fs-extra";
import chalk from "chalk";
import { execSync } from "child_process";
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
  for (const fileName of OUTPUT_FILE_NAMES) {
    const filePath = path.join(process.cwd(), fileName);
    if (await fs.pathExists(filePath)) {
      const content = (await fs.readFile(filePath, "utf-8")).trim();
      if (content) {
        return content.replace(/\\/g, "/");
      }
    }
  }

  return await promptForDestination(datapackName);
}

async function fullSync(source: string, destination: string) {
  if (!(await fs.pathExists(source))) {
    throw new Error(`Le dossier source n'existe pas : ${source}`);
  }

  if (await fs.pathExists(destination)) {
    await fs.emptyDir(destination);
  } else {
    await fs.ensureDir(destination);
  }

  await fs.copy(source, destination, {
    overwrite: true,
    errorOnExist: false,
  });
}

async function main() {
  const datapackName = getDatapackName();
  const source = path.resolve(process.cwd(), ".sandstone/output/datapack").replace(/\\/g, "/");
  const destination = await getDestinationPath(datapackName);

  console.log(chalk.cyan("📦 Source Sandstone : ") + chalk.gray(source));
  console.log(chalk.cyan("🎯 Destination      : ") + chalk.green(destination));

  console.log(chalk.cyan("\n🔨 Compilation du datapack avec Sandstone (sand build)..."));
  try {
    execSync("sand build", { stdio: "inherit" });
    console.log(chalk.blue("\n📂 Copie en cours vers le monde Minecraft..."));
    await fullSync(source, destination);
    console.log(chalk.green(`\n✨ Opération terminée avec succès !\n   ${chalk.gray(destination)}`));
    process.exit(0);
  } catch (err) {
    console.log(chalk.red("\n❌ Erreur lors de la compilation ou de la copie :"), err);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(chalk.red("Erreur inattendue :"), err);
  process.exit(1);
});