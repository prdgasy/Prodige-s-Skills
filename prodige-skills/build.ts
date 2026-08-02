import chalk from "chalk";
import { execSync } from "child_process";
import fs from "fs-extra";

const source =
  "C:/Users/TOSHIBA/Documents/Jeux/Minecraft/DATAPACKS/Prodige-s-Skills (sandstone)/prodige-skills/.sandstone/output/datapack";

const destination =
  "C:/Users/TOSHIBA/AppData/Roaming/ModrinthApp/profiles/Data_Resource Pack Modpack/saves/FRIANDISE/datapacks/prodige-skills";

async function buildAndCopy() {
  console.log(chalk.cyan("🔨 Compilation du datapack avec Sandstone..."));

  try {
    // 1. Compilation unique du datapack
    execSync("sand build", { stdio: "inherit" });

    console.log(chalk.blue("📂 Copie en cours vers le monde Minecraft..."));

    // 2. Nettoyage et copie propre du dossier
    if (await fs.pathExists(destination)) {
      await fs.emptyDir(destination);
    }

    await fs.copy(source, destination, {
      overwrite: true,
      errorOnExist: false,
    });

    console.log(
      chalk.green(
        `\n✔ Datapack compilé et mis à jour avec succès ! (${new Date().toLocaleTimeString()})`
      )
    );
  } catch (err) {
    console.log(chalk.red("\n❌ Erreur lors de la compilation ou de la copie :"), err);
  }
}

buildAndCopy();