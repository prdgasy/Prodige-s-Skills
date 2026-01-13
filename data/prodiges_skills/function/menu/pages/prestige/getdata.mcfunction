execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Prestige.slot int 1 run scoreboard players get $slot skills.__variable__
$data modify storage prodiges_skills:prodiges_skills Menu.Pages.Prestige.name set from storage prodiges_skills:prodiges_skills Config.Skills.$(name).name
$data modify storage prodiges_skills:prodiges_skills Menu.Pages.Prestige.item set from storage prodiges_skills:prodiges_skills Config.Skills.$(name).item
$data modify storage prodiges_skills:prodiges_skills Menu.Pages.Prestige.lore1 set from storage prodiges_skills:prodiges_skills Config.Skills.$(name).lore1
$data modify storage prodiges_skills:prodiges_skills Menu.Pages.Prestige.lore2 set from storage prodiges_skills:prodiges_skills Config.Skills.$(name).lore2
$data modify storage prodiges_skills:prodiges_skills Menu.Pages.Prestige.abilityLore1 set from storage prodiges_skills:prodiges_skills Config.Skills.$(name).Prestige.lore1
$data modify storage prodiges_skills:prodiges_skills Menu.Pages.Prestige.abilityLore2 set from storage prodiges_skills:prodiges_skills Config.Skills.$(name).Prestige.lore2
$data modify storage prodiges_skills:prodiges_skills Menu.Pages.Prestige.ability set from storage prodiges_skills:prodiges_skills Config.Skills.$(name).Prestige.ability
$scoreboard players operation $lvl prodiges_skills.__variable__ = @p prodiges_skills.$(name).lvl
$scoreboard players operation $prestigeLvl prodiges_skills.__variable__ = @p prodiges_skills.$(name).prestige
scoreboard players operation $prestigePower skills.__variable__ = $prestigeLvl skills.__variable__
scoreboard players operation $prestigePower skills.__variable__ *= 5 skills.__int__
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Prestige.power int 1 run scoreboard players get $prestigePower skills.__variable__
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Prestige.lvl int 1 run scoreboard players get $lvl skills.__variable__
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Prestige.lvlRoman int 1 run data modify storage prodiges_skills:prodiges_skills romanConverter.number set from storage prodiges_skills:prodiges_skills Menu.Pages.Prestige.lvl
function prodiges_skills:__private__/anonymous/89 with storage prodiges_skills:prodiges_skills romanConverter
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Prestige.prestigeLvl int 1 run data modify storage prodiges_skills:prodiges_skills romanConverter.number set from storage prodiges_skills:prodiges_skills Menu.Pages.Prestige.prestigeLvl
function prodiges_skills:__private__/anonymous/90 with storage prodiges_skills:prodiges_skills romanConverter
scoreboard players operation $prestigeNextLvl skills.__variable__ = $prestigeLvl skills.__variable__
scoreboard players add $prestigeNextLvl skills.__variable__ 1
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Prestige.prestigeNextLvl int 1 run scoreboard players get $prestigeNextLvl skills.__variable__
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Prestige.prestigeNextLvl int 1 run data modify storage prodiges_skills:prodiges_skills romanConverter.number set from storage prodiges_skills:prodiges_skills Menu.Pages.Prestige.prestigeNextLvl
function prodiges_skills:__private__/anonymous/91 with storage prodiges_skills:prodiges_skills romanConverter
scoreboard players operation $prestigeNextPower skills.__variable__ = $prestigeNextLvl skills.__variable__
scoreboard players operation $prestigeNextPower skills.__variable__ *= 5 skills.__int__
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Prestige.prestigeNextPower int 1 run scoreboard players get $prestigeNextPower skills.__variable__
data modify storage prodiges_skills:prodiges_skills Menu.Pages.Prestige.color1 set value 'gray'
data modify storage prodiges_skills:prodiges_skills Menu.Pages.Prestige.color2 set value 'dark_gray'
data modify storage prodiges_skills:prodiges_skills Menu.Pages.Prestige.glint set value 'false'
$execute if score @p prodiges_skills.$(name).lvl matches 100 run function prodiges_skills:__private__/anonymous/92