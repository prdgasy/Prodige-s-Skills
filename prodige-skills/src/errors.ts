import { say, tellraw } from "sandstone";

export namespace Errors {
  /**
   * Extrait l'appelant de la stack trace de manière dynamique.
   * @param offset Le nombre de niveaux à descendre dans la pile (2 par défaut).
   */
  const getCallerLink = (): string => {
    const stack = new Error().stack;
    if (!stack) return "unknown:0:0";

    const lines = stack.split('\n').filter(line =>
      (line.includes('.ts:') || line.includes('.js:')) &&
      !line.includes('errors.ts')
    );

    // 👉 Prend la vraie ligne appelante (parfois index 0, parfois 1)
    const callerLine = lines[0] ?? "unknown:0:0";

    const match = callerLine.match(/((?:[a-zA-Z]:)?[^)]+\.[jt]s:\d+:\d+)/);
    return match ? match[1] : callerLine.trim();
  };

  const seen = new Set<string>();

  const logWarning = (message: string): string => {
    const link = getCallerLink();
    const key = message + link;
    if (!seen.has(key)) {
      seen.add(key);
      console.warn(
        `\x1b[33m[ERRORSLIB]\x1b[0m ` +   // texte jaune sans fond
        `\x1b[1m${message}\x1b[0m` +        // message en gras
        ` \x1b[90m${link}\x1b[0m\n`        // lien en gris
      );
    };

    return `§l§c${message} §7${link.replaceAll('\\', '/')}§r`;
  };

  /**
   * Retourne un objet de texte JSON pour Minecraft.
   */
  export const textNotImplemented = () => {
    const warning = logWarning('textNotImplemented(chdange)');
    return { text: warning } as const;
  };

  /**
   * Exécute un tellraw en jeu.
   */
  export const functionNotImplemented = () => {
    const warning = logWarning('functionNotImplemented');
    return tellraw('@p', { text: warning });
  };

  export const macroArgumentNotImplemented = (key: string) => {
    const warning = logWarning('macroArgumentNotImplemented');
    return { [key]: warning };
  }
}