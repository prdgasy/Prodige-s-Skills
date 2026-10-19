// @ts-nocheck
import fs from 'fs-extra'
import chalk from 'chalk'
import { execSync } from 'child_process'
import readline from 'readline'
import path from 'path'
import os from 'os'

const OUTPUT_FILE = 'datapack-destination.txt'
const SOURCE = path.resolve('.sandstone/output/datapack')

function getDatapackName(): string {
  try {
    const config = fs.readFileSync('sandstone.config.ts', 'utf8')
    const match = config.match(/\bname\s*:\s*['"`]([^'"`]+)['"`]/)
    if (match) return match[1]
  } catch { }

  try {
    const pkg = fs.readJsonSync('package.json')
    if (pkg.name && pkg.name !== 'sandstone-template') return pkg.name
  } catch { }

  return path.basename(process.cwd())
}

function getProfilesDir(): string {
  if (process.platform === 'win32') {
    return path.join(
      process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming'),
      'ModrinthApp',
      'profiles',
    )
  }

  if (process.platform === 'darwin') {
    return path.join(os.homedir(), 'Library/Application Support/ModrinthApp/profiles')
  }

  return path.join(os.homedir(), '.config/ModrinthApp/profiles')
}

function ask(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close()
      resolve(answer.trim().replace(/^["']|["']$/g, ''))
    })
  })
}

async function select(
  title: string,
  options: string[],
): Promise<string> {
  if (!process.stdin.isTTY || !process.stdin.setRawMode) {
    console.log(`\n${title}`)
    options.forEach((option, i) => console.log(`  ${i + 1}. ${option}`))

    while (true) {
      const answer = Number(await ask('Choix : '))
      if (Number.isInteger(answer) && answer >= 1 && answer <= options.length) {
        return options[answer - 1]
      }
    }
  }

  let selected = 0
  let firstRender = true

  readline.emitKeypressEvents(process.stdin)
  process.stdin.setRawMode(true)
  process.stdin.resume()

  const render = () => {
    if (!firstRender) {
      process.stdout.write(`\x1B[${options.length + 1}A`)
    }

    firstRender = false
    process.stdout.write(`\x1B[2K\r${chalk.cyan(title)}\n`)

    options.forEach((option, i) => {
      const pointer = i === selected ? chalk.green('❯') : ' '
      const label = i === selected ? chalk.green.bold(option) : option
      process.stdout.write(`\x1B[2K\r${pointer} ${label}\n`)
    })
  }

  render()

  return new Promise(resolve => {
    const cleanup = () => {
      process.stdin.removeListener('keypress', onKeypress)
      process.stdin.setRawMode(false)
      process.stdout.write('\x1B[?25h')
      process.stdout.write('\n')
    }

    const onKeypress = (_: string, key: readline.Key) => {
      if (key.name === 'up') {
        selected = (selected - 1 + options.length) % options.length
        render()
      } else if (key.name === 'down') {
        selected = (selected + 1) % options.length
        render()
      } else if (key.name === 'return') {
        const result = options[selected]
        cleanup()
        resolve(result)
      } else if (key.ctrl && key.name === 'c') {
        cleanup()
        process.exit(1)
      }
    }

    process.stdout.write('\x1B[?25l')
    process.stdin.on('keypress', onKeypress)
  })
}

async function getDirectories(dir: string): Promise<string[]> {
  if (!(await fs.pathExists(dir))) return []

  const entries = await fs.readdir(dir, { withFileTypes: true })
  return entries.filter(entry => entry.isDirectory()).map(entry => entry.name)
}

async function getDestination(datapackName: string): Promise<string> {
  const savedPath = path.resolve(OUTPUT_FILE)

  if (await fs.pathExists(savedPath)) {
    const saved = (await fs.readFile(savedPath, 'utf8')).trim()
    if (saved) return path.resolve(saved)
  }

  const profilesDir = getProfilesDir()
  const profiles = await getDirectories(profilesDir)

  let profile: string

  if (profiles.length) {
    const custom = 'Entrer un chemin personnalisé'
    const choice = await select('Choisis un profil Modrinth :', [...profiles, custom])

    if (choice === custom) {
      profile = path.resolve(await ask('Chemin complet du profil : '))
    } else {
      profile = path.join(profilesDir, choice)
    }
  } else {
    profile = path.resolve(await ask('Chemin complet du profil Modrinth : '))
  }

  if (!(await fs.pathExists(profile))) {
    throw new Error(`Profil introuvable : ${profile}`)
  }

  const savesDir = path.join(profile, 'saves')
  const worlds = await getDirectories(savesDir)
  const customWorld = 'Saisir un nom de monde'

  let world: string

  if (worlds.length) {
    const choice = await select('Choisis un monde :', [...worlds, customWorld])
    world = choice === customWorld ? await ask('Nom du monde : ') : choice
  } else {
    world = await ask('Nom du monde : ')
  }

  const destination = path.join(savesDir, world, 'datapacks', datapackName)

  await fs.ensureDir(path.dirname(destination))
  await fs.writeFile(savedPath, destination, 'utf8')

  console.log(chalk.gray(`Destination saved to ${OUTPUT_FILE}`))

  return destination
}

async function syncDirectory(source: string, destination: string): Promise<void> {
  if (!(await fs.pathExists(source))) {
    throw new Error(`Dossier source introuvable : ${source}`)
  }

  await fs.ensureDir(destination)

  const sourceEntries = await fs.readdir(source)
  const destinationEntries = await fs.readdir(destination)

  for (const name of destinationEntries) {
    if (!sourceEntries.includes(name)) {
      await fs.remove(path.join(destination, name))
    }
  }

  for (const name of sourceEntries) {
    const src = path.join(source, name)
    const dest = path.join(destination, name)
    const stat = await fs.lstat(src)

    if (stat.isDirectory()) {
      await syncDirectory(src, dest)
    } else {
      const destExists = await fs.pathExists(dest)
      const same =
        destExists &&
        (await fs.stat(dest)).isFile() &&
        (await fs.stat(dest)).size === stat.size &&
        (await fs.stat(dest)).mtimeMs === stat.mtimeMs

      if (!same) {
        await fs.copy(src, dest, { overwrite: true })
      }
    }
  }
}


async function main() {
  const datapackName = getDatapackName()
  const destination = await getDestination(datapackName)

  const world = path.basename(path.dirname(path.dirname(destination)))
  const profile = destination.split(`${path.sep}saves${path.sep}`)[0]
  const instance = path.basename(profile)

  console.log(`${chalk.gray('Instance:')} ${instance}`)
  console.log(`${chalk.gray('World:')} ${world}`)

  execSync('sand build', { stdio: 'inherit' })

  await syncDirectory(SOURCE, destination)

  console.log(chalk.green(`\n✓ ${datapackName} successfully copied to ${world} (${instance}).`))
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(chalk.red(`\nError: ${error.message}`))
    process.exit(1)
  })