$data modify storage prodiges_skills:prodiges_skills Menu.Pages.Main.name set from storage prodiges_skills:prodiges_skills Config.Skills.$(skillName).name
$data modify storage prodiges_skills:prodiges_skills Menu.Pages.Main.item set from storage prodiges_skills:prodiges_skills Config.Skills.$(skillName).item
$data modify storage prodiges_skills:prodiges_skills Menu.Pages.Main.lore1 set from storage prodiges_skills:prodiges_skills Config.Skills.$(skillName).lore1
$data modify storage prodiges_skills:prodiges_skills Menu.Pages.Main.lore2 set from storage prodiges_skills:prodiges_skills Config.Skills.$(skillName).lore2
$data modify storage prodiges_skills:prodiges_skills Menu.Pages.Main.prestigeLore1 set from storage prodiges_skills:prodiges_skills Config.Skills.$(skillName).Prestige.lore1
$data modify storage prodiges_skills:prodiges_skills Menu.Pages.Main.prestigeLore2 set from storage prodiges_skills:prodiges_skills Config.Skills.$(skillName).Prestige.lore2
$data modify storage prodiges_skills:prodiges_skills Menu.Pages.Main.ability set from storage prodiges_skills:prodiges_skills Config.Skills.$(skillName).Prestige.ability
$scoreboard players operation $prestigeLvl prodiges_skills.__variable__ = @p prodiges_skills.$(skillName).Prestige
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Main.prestigeLvl int 1 run scoreboard players get $prestigeLvl prodiges_skills.__variable__
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Main.prestigeLvl int 1 run data modify storage prodiges_skills:prodiges_skills romanConverter.number set from storage prodiges_skills:prodiges_skills Menu.Pages.Main.prestigeLvl
function prodiges_skills:__private__/anonymous/49 with storage prodiges_skills:prodiges_skills romanConverter
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Main.abilityPower int 1 run scoreboard players operation $abilityPower prodiges_skills.__variable__ = $prestigeLvl prodiges_skills.__variable__
scoreboard players operation $abilityPower prodiges_skills.__variable__ *= 5 prodiges_skills.__int__
$scoreboard players operation $xp prodiges_skills.__variable__ = @p prodiges_skills.$(skillName).xp
$scoreboard players operation $xpToNext prodiges_skills.__variable__ = @p prodiges_skills.$(skillName).xpToNext
$scoreboard players operation $lvl prodiges_skills.__variable__ = @p prodiges_skills.$(skillName).lvl
scoreboard players operation $nextLvl prodiges_skills.__variable__ = $lvl prodiges_skills.__variable__
scoreboard players add $nextLvl prodiges_skills.__variable__ 1
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Main.xp int 1 run scoreboard players get $xp prodiges_skills.__variable__
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Main.xpToNext int 1 run scoreboard players get $xpToNext prodiges_skills.__variable__
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Main.lvl int 1 run scoreboard players get $lvl prodiges_skills.__variable__
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Main.lvlRoman int 1 run scoreboard players get $lvl prodiges_skills.__variable__
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Main.nextLvl int 1 run scoreboard players get $nextLvl prodiges_skills.__variable__
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Main.lvlRoman int 1 run data modify storage prodiges_skills:prodiges_skills romanConverter.number set from storage prodiges_skills:prodiges_skills Menu.Pages.Main.lvlRoman
function prodiges_skills:__private__/anonymous/50 with storage prodiges_skills:prodiges_skills romanConverter
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Main.nextLvl int 1 run data modify storage prodiges_skills:prodiges_skills romanConverter.number set from storage prodiges_skills:prodiges_skills Menu.Pages.Main.nextLvl
function prodiges_skills:__private__/anonymous/51 with storage prodiges_skills:prodiges_skills romanConverter
scoreboard players operation $ratio_100 prodiges_skills.__variable__ = $xp prodiges_skills.__variable__
scoreboard players operation $ratio_100 prodiges_skills.__variable__ *= 100 prodiges_skills.__int__
scoreboard players operation $ratio_100 prodiges_skills.__variable__ /= $xpToNext prodiges_skills.__variable__
scoreboard players operation $ratio_15 prodiges_skills.__variable__ = $xp prodiges_skills.__variable__
scoreboard players operation $ratio_15 prodiges_skills.__variable__ *= 15 prodiges_skills.__int__
scoreboard players operation $ratio_15 prodiges_skills.__variable__ /= $xpToNext prodiges_skills.__variable__
scoreboard players operation $ratio_100 prodiges_skills.__variable__ = $xp prodiges_skills.__variable__
scoreboard players operation $ratio_15 prodiges_skills.__variable__ = $xp prodiges_skills.__variable__
scoreboard players operation $ratio_100 prodiges_skills.__variable__ *= 100 prodiges_skills.__int__
scoreboard players operation $ratio_100 prodiges_skills.__variable__ /= $xpToNext prodiges_skills.__variable__
scoreboard players operation $ratio_15 prodiges_skills.__variable__ *= 15 prodiges_skills.__int__
scoreboard players operation $ratio_15 prodiges_skills.__variable__ /= $xpToNext prodiges_skills.__variable__
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Main.ratio_100 int 1 run scoreboard players get $ratio_100 prodiges_skills.__variable__
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Main.ratio_15 int 1 run scoreboard players get $ratio_15 prodiges_skills.__variable__
function prodiges_skills:__private__/anonymous/52 with storage prodiges_skills:prodiges_skills Menu.Page.Main