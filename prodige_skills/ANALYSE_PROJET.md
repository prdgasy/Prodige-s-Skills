# Audit du projet Prodige Skills

**Date :** 4 novembre 2026  
**Périmètre :** code source Sandstone, données CSV, menus et documentation du datapack. Le dossier `OLD/` contient une ancienne version JMC et n’est pas évalué comme implémentation active.

## Résumé

Le datapack se compile, mais plusieurs fonctions présentées dans les menus ne sont pas implémentées ou ne sont pas reliées à leur logique métier. Un défaut de calcul des points peut aussi faire dépendre la récompense du solde déjà accumulé. Les priorités sont de corriger l’économie, rendre les systèmes de progression fonctionnels, puis terminer les pages de boutique.

## À corriger en priorité

| Priorité | Constat | Emplacement | Conséquence |
|---|---|---|---|
| **P0** | Les points gagnés sont calculés à partir du solde actuel (`Player.pts`) au lieu des points définis pour l’action (`this.pts`). Le total attribué dépend donc du solde et du nombre d’actions ; il peut croître de façon incontrôlée. | [`src/skill/action.ts`](./src/skill/action.ts#L44) | Économie déséquilibrée et statistiques de points fausses. Calculer la récompense à partir de `this.pts × multiplicateur × quantité`. |
| **P1** | Les achievements sont chargés et affichés, mais leur progression n’est jamais augmentée : seule leur initialisation à zéro est présente. | [`src/data/loader.ts`](./src/data/loader.ts#L62), [`src/skill/index.ts`](./src/skill/index.ts#L194), [`src/menu/pages/skill/achievements.ts`](./src/menu/pages/skill/achievements.ts#L19) | Les objectifs ne peuvent pas être atteints ; les boutons de réclamation ne sont pas accessibles normalement. Relier les critères aux événements et mettre à jour le compteur/la séquence d’achievements. |
| **P1** | L’aptitude a une chance de déclenchement et un bouton d’amélioration, mais les deux aptitudes configurées ne font qu’afficher un message (`say`). Le bonus décrit comme un effet utile ne modifie pas le gameplay. | [`src/data/definitions.ts`](./src/data/definitions.ts#L98), [`src/data/definitions.ts`](./src/data/definitions.ts#L103), [`src/skill/ability.ts`](./src/skill/ability.ts#L96) | Les améliorations consomment des points sans fournir l’effet attendu. Définir les effets réels et ajuster les descriptions, ou masquer la progression jusqu’à leur implémentation. |
| **P1** | La récompense d’aptitude est enregistrée avec une fonction `give` vide. En parallèle, la notification de montée de niveau convertit chaque récompense en objet plutôt qu’en `reward.name`. | [`src/misc/reward.ts`](./src/misc/reward.ts#L43), [`src/skill/index.ts`](./src/skill/index.ts#L175) | Récompenses d’aptitude sans effet et notification susceptible d’afficher `[object Object]`. Implémenter l’octroi ou ne pas présenter cette entrée comme une récompense attribuée ; afficher `r.name`. |
| **P1** | La page **Items & Gear** n’affiche aucun outil : la boucle de création des boutons est entièrement commentée. | [`src/menu/pages/shop/items.ts`](./src/menu/pages/shop/items.ts#L13) | La catégorie est visible, mais aucun achat d’outil n’est possible depuis cette page. Rétablir la liste, ses descriptions et l’appel d’achat. |
| **P1** | Les tâches `brick`, `diamond` et `sandstone` reprennent respectivement le même critère que `stone`, `dirt` et `sand`, avec des noms et objectifs copiés. | [`src/data/loader.ts`](./src/data/loader.ts#L127) | Les tâches se chevauchent et ne correspondent pas à leur nom. Définir des critères, objectifs et récompenses distincts, ou supprimer les doublons. |

## Fonctions incomplètes ou boutons sans action utile

| Élément | Emplacement | État observé / action recommandée |
|---|---|---|
| Bouton de niveau courant | [`src/menu/pages/skill/progress.ts`](./src/menu/pages/skill/progress.ts#L41) | Le clic exécute `say('test')`. Remplacer par une action utile ou retirer le comportement de clic. |
| Niveaux verrouillés / déjà atteints | [`src/menu/pages/skill/progress.ts`](./src/menu/pages/skill/progress.ts#L31) | Les callbacks sont vides. Si ces éléments sont uniquement informatifs, les rendre non cliquables ; sinon expliquer les conditions et donner un retour. |
| Boutique de titres | [`src/menu/pages/shop/titles.ts`](./src/menu/pages/shop/titles.ts#L15) | La page ne fait qu’afficher les titres configurés ; aucun titre n’est défini dans les données actuelles et les boutons n’ont pas de callback. Il manque la définition, le déblocage, l’achat ou l’équipement du titre. |
| Guide des boosters et guide des caisses | [`src/menu/pages/shop/booster.ts`](./src/menu/pages/shop/booster.ts#L69), [`src/menu/pages/shop/crates.ts`](./src/menu/pages/shop/crates.ts#L94) | Les boutons ont des callbacks vides. Les rendre non interactifs ou leur donner une action explicative. |
| Achievements | [`src/skill/achievement.ts`](./src/skill/achievement.ts#L24) | La réclamation existe, mais elle dépend d’une progression qui n’est pas alimentée (voir P1). |
| Récompenses de niveau | [`src/data/loader.ts`](./src/data/loader.ts#L86) | Plusieurs niveaux affichent une amélioration d’aptitude ; vérifier que la récompense annoncée correspond à l’amélioration réellement accordée et à son coût. |
| Actions paginées | [`src/menu/pages/skill/actions.ts`](./src/menu/pages/skill/actions.ts#L17) | La page affiche au plus 17 actions, tandis que le calcul du nombre de pages divise par 18. Les compétences actuelles ont peu d’actions, mais une liste plus grande peut rendre des entrées inaccessibles. Utiliser une capacité unique pour le rendu et la pagination. |

## Descriptions et contenus à compléter

- [`src/data/definitions.ts`](./src/data/definitions.ts#L11) contient des descriptions temporaires (`This is a simple description`, `A very cool sword`) et des descriptions d’aptitude génériques (`Cool miner`, `Cool Forager`). Écrire des descriptions correspondant aux effets réels.
- La description de **Mining** est encore `This is a mining description` dans [`src/data/definitions.ts`](./src/data/definitions.ts#L97).
- Les effets des aptitudes, les conditions de déclenchement et les bonus des outils doivent être documentés précisément dans le menu. Les champs `durability`, `characteristics`, `onUse`, `onBreak` et `onHold` de [`src/misc/tool.ts`](./src/misc/tool.ts#L8) ne sont pas exploités par la boutique actuelle.
- Les noms et les critères des tâches doivent être revus ensemble ; les descriptions de tâches ne sont pas définies dans les données.
- La présentation de la boutique des titres annonce des titres gagnés par progression, mais le mécanisme de déblocage et d’équipement reste à construire.

## Améliorations recommandées

1. **Fiabiliser les données** : valider à l’initialisation les colonnes CSV, les critères, les nombres positifs, les noms de compétences et l’unicité des identifiants ; éviter les conversions permissives en `0` pour les données invalides dans [`src/data/loader.ts`](./src/data/loader.ts#L18).
2. **Tester les parcours de jeu** : progression XP/points avec et sans booster, montée de niveau, réclamation de récompenses, objectifs d’achievements, tirage et réinitialisation des tâches, ouverture de caisses et achats sans fonds/inventaire plein.
3. **Renforcer la cohérence des menus** : n’afficher que les fonctionnalités disponibles, indiquer clairement les éléments informatifs non cliquables et vérifier les limites de pagination.
4. **Clarifier l’installation et l’utilisation** : remplacer le [`README.md`](./README.md) de type template par une documentation utilisateur (version Minecraft/Sandstone visée, installation, commande d’ouverture du menu, fonctionnalités, configuration et dépannage).
5. **Compléter les métadonnées et scripts** : [`package.json`](./package.json) conserve une description générique, un auteur vide et aucun script de test ou de vérification de types. Ajouter ces éléments lorsque les commandes et tests correspondants existent.
6. **Prévoir les commandes de maintenance** : documenter le comportement de désinstallation et vérifier que les scores, tags, bossbars et données persistantes sont tous nettoyés.

## Vérification réalisée

- `npm run dev:build` exécuté depuis `prodige_skills` : **réussi** — Sandstone a généré 51 fonctions et 4 autres ressources.
- Cette compilation ne simule pas les clics d’interface ni les parties en jeu ; les comportements listés doivent être validés en jeu ou par des tests de fonctions dédiés.
- Aucun script de test ou de lint n’est déclaré dans le `package.json` actuel.

## Liste de suivi

### Corrections

- [ ] Corriger le calcul des points gagnés par action et vérifier l’effet des boosters.
- [ ] Relier les critères des actions à la progression des achievements.
- [ ] Vérifier la progression, le déblocage et la réclamation des achievements.
- [ ] Implémenter les effets réels des aptitudes ou masquer leur amélioration jusqu’à ce qu’ils existent.
- [ ] Implémenter les récompenses d’aptitude et afficher correctement leur nom dans les notifications.
- [ ] Corriger ou supprimer les tâches en doublon (`brick`, `diamond`, `sandstone`).
- [ ] Vérifier que les récompenses annoncées sont effectivement données.
- [ ] Corriger et tester la pagination des actions.

### Menus et fonctionnalités

- [ ] Rendre les outils visibles et achetables dans **Items & Gear**.
- [ ] Remplacer l’action de test du bouton de niveau courant.
- [ ] Rendre les niveaux informatifs non cliquables ou leur donner un comportement utile.
- [ ] Ajouter des titres et leur système de déblocage/équipement, ou retirer la catégorie incomplète.
- [ ] Rendre les boutons des guides non cliquables ou leur donner une action utile.
- [ ] Vérifier le parcours complet d’achat, de réclamation et d’ouverture de caisse.

### Contenu et qualité

- [ ] Remplacer les descriptions temporaires des compétences, outils et aptitudes.
- [ ] Documenter les effets, conditions de déclenchement et bonus réellement disponibles.
- [ ] Ajouter des descriptions et des objectifs cohérents aux tâches.
- [ ] Valider les CSV, critères, valeurs numériques, compétences et identifiants au chargement.
- [ ] Tester en jeu la progression, les boosters, les récompenses, les tâches, les caisses et les achats.
- [ ] Améliorer le README avec les prérequis, l’installation, l’utilisation, la configuration et le dépannage.
- [ ] Compléter les métadonnées du projet et ajouter des scripts de test/vérification lorsqu’ils existent.
- [ ] Vérifier que la désinstallation nettoie les scores, tags, bossbars et données persistantes.
