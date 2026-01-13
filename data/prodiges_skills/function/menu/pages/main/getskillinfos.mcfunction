$data modify storage prodiges_skills:prodiges_skills Menu.Pages.Main.name set from storage prodiges_skills:prodiges_skills Config.Skills.$(name).name
$data modify storage prodiges_skills:prodiges_skills Menu.Pages.Main.item set from storage prodiges_skills:prodiges_skills Config.Skills.$(name).item
$data modify storage prodiges_skills:prodiges_skills Menu.Pages.Main.lore1 set from storage prodiges_skills:prodiges_skills Config.Skills.$(name).lore1
$data modify storage prodiges_skills:prodiges_skills Menu.Pages.Main.lore2 set from storage prodiges_skills:prodiges_skills Config.Skills.$(name).lore2
$data modify storage prodiges_skills:prodiges_skills Menu.Pages.Main.prestigeLore1 set from storage prodiges_skills:prodiges_skills Config.Skills.$(name).prestige.lore1
$data modify storage prodiges_skills:prodiges_skills Menu.Pages.Main.prestigeLore2 set from storage prodiges_skills:prodiges_skills Config.Skills.$(name).prestige.lore2
$data modify storage prodiges_skills:prodiges_skills Menu.Pages.Main.ability set from storage prodiges_skills:prodiges_skills Config.Skills.$(name).prestige.ability
$scoreboard players operation $prestigeLvl prodiges_skills.__variable__ = @p prodiges_skills.$(name).prestige
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Main.prestigeLvl int 1 run scoreboard players get $prestigeLvl skills.__variable__
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Main.prestigeLvl int 1 run data modify storage prodiges_skills:prodiges_skills romanConverter.number set from storage prodiges_skills:prodiges_skills Menu.Pages.Main.prestigeLvl
function prodiges_skills:__private__/anonymous/40 with storage prodiges_skills:prodiges_skills romanConverter
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Main.abilityPower int 1 run scoreboard players operation $abilityPower skills.__variable__ = $prestigeLvl skills.__variable__
scoreboard players operation $abilityPower skills.__variable__ *= 5 skills.__int__
$scoreboard players operation $xp prodiges_skills.__variable__ = @p prodiges_skills.$(name).xp
$scoreboard players operation $xpToNext prodiges_skills.__variable__ = @p prodiges_skills.$(name).xpToNext
$scoreboard players operation $lvl prodiges_skills.__variable__ = @p prodiges_skills.$(name).lvl
scoreboard players operation $nextLvl skills.__variable__ = $lvl skills.__variable__
scoreboard players add $nextLvl skills.__variable__ 1
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Main.xp int 1 run scoreboard players get $xp skills.__variable__
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Main.xpToNext int 1 run scoreboard players get $xpToNext skills.__variable__
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Main.lvl int 1 run scoreboard players get $lvl skills.__variable__
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Main.lvlRoman int 1 run scoreboard players get $lvl skills.__variable__
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Main.nextLvl int 1 run scoreboard players get $nextLvl skills.__variable__
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Main.lvlRoman int 1 run data modify storage prodiges_skills:prodiges_skills romanConverter.number set from storage prodiges_skills:prodiges_skills Menu.Pages.Main.lvlRoman
function prodiges_skills:__private__/anonymous/41 with storage prodiges_skills:prodiges_skills romanConverter
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Main.nextLvl int 1 run data modify storage prodiges_skills:prodiges_skills romanConverter.number set from storage prodiges_skills:prodiges_skills Menu.Pages.Main.nextLvl
function prodiges_skills:__private__/anonymous/42 with storage prodiges_skills:prodiges_skills romanConverter
scoreboard players operation $ratio_100 skills.__variable__ = $xp skills.__variable__
scoreboard players operation $ratio_100 skills.__variable__ *= 100 skills.__int__
scoreboard players operation $ratio_100 skills.__variable__ /= $xpToNext skills.__variable__
scoreboard players operation $ratio_15 skills.__variable__ = $xp skills.__variable__
scoreboard players operation $ratio_15 skills.__variable__ *= 15 skills.__int__
scoreboard players operation $ratio_15 skills.__variable__ /= $xpToNext skills.__variable__
scoreboard players operation $100ratio skills.__variable__ = $xp skills.__variable__
scoreboard players operation $10ratio skills.__variable__ = $xp skills.__variable__
scoreboard players operation $100ratio skills.__variable__ *= 100 skills.__int__
scoreboard players operation $100ratio skills.__variable__ /= $xpToNext skills.__variable__
scoreboard players operation $10ratio skills.__variable__ *= 15 skills.__int__
scoreboard players operation $10ratio skills.__variable__ /= $xpToNext skills.__variable__
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Main.ratio_100 int 1 run scoreboard players get $ratio_100 skills.__variable__
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Main.ratio_15 int 1 run scoreboard players get $ratio_15 skills.__variable__