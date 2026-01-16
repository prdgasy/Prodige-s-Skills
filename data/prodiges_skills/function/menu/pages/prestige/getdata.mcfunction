execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Prestige.slot int 1 run scoreboard players get $slot prodiges_skills.__variable__
$data modify storage prodiges_skills:prodiges_skills Menu.Pages.Prestige.name set from storage prodiges_skills:prodiges_skills Config.Skills.$(name).name
$data modify storage prodiges_skills:prodiges_skills Menu.Pages.Prestige.item set from storage prodiges_skills:prodiges_skills Config.Skills.$(name).item
$data modify storage prodiges_skills:prodiges_skills Menu.Pages.Prestige.lore1 set from storage prodiges_skills:prodiges_skills Config.Skills.$(name).lore1
$data modify storage prodiges_skills:prodiges_skills Menu.Pages.Prestige.lore2 set from storage prodiges_skills:prodiges_skills Config.Skills.$(name).lore2
$data modify storage prodiges_skills:prodiges_skills Menu.Pages.Prestige.abilityLore1 set from storage prodiges_skills:prodiges_skills Config.Skills.$(name).Prestige.lore1
$data modify storage prodiges_skills:prodiges_skills Menu.Pages.Prestige.abilityLore2 set from storage prodiges_skills:prodiges_skills Config.Skills.$(name).Prestige.lore2
$data modify storage prodiges_skills:prodiges_skills Menu.Pages.Prestige.ability set from storage prodiges_skills:prodiges_skills Config.Skills.$(name).Prestige.ability
$scoreboard players operation $lvl prodiges_skills.__variable__ = @p prodiges_skills.$(name).lvl
$scoreboard players operation $prestigeLvl prodiges_skills.__variable__ = @p prodiges_skills.$(name).prestige
scoreboard players operation $prestigePower prodiges_skills.__variable__ = $prestigeLvl prodiges_skills.__variable__
scoreboard players operation $prestigePower prodiges_skills.__variable__ *= 5 prodiges_skills.__int__
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Prestige.power int 1 run scoreboard players get $prestigePower prodiges_skills.__variable__
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Prestige.lvl int 1 run scoreboard players get $lvl prodiges_skills.__variable__
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Prestige.lvlRoman int 1 run data modify storage prodiges_skills:prodiges_skills romanConverter.number set from storage prodiges_skills:prodiges_skills Menu.Pages.Prestige.lvl
function prodiges_skills:__private__/anonymous/99 with storage prodiges_skills:prodiges_skills romanConverter
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Prestige.prestigeLvl int 1 run data modify storage prodiges_skills:prodiges_skills romanConverter.number set from storage prodiges_skills:prodiges_skills Menu.Pages.Prestige.prestigeLvl
function prodiges_skills:__private__/anonymous/100 with storage prodiges_skills:prodiges_skills romanConverter
scoreboard players operation $prestigeNextLvl prodiges_skills.__variable__ = $prestigeLvl prodiges_skills.__variable__
scoreboard players add $prestigeNextLvl prodiges_skills.__variable__ 1
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Prestige.prestigeNextLvl int 1 run scoreboard players get $prestigeNextLvl prodiges_skills.__variable__
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Prestige.prestigeNextLvl int 1 run data modify storage prodiges_skills:prodiges_skills romanConverter.number set from storage prodiges_skills:prodiges_skills Menu.Pages.Prestige.prestigeNextLvl
function prodiges_skills:__private__/anonymous/101 with storage prodiges_skills:prodiges_skills romanConverter
scoreboard players operation $prestigeNextPower prodiges_skills.__variable__ = $prestigeNextLvl prodiges_skills.__variable__
scoreboard players operation $prestigeNextPower prodiges_skills.__variable__ *= 5 prodiges_skills.__int__
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Prestige.prestigeNextPower int 1 run scoreboard players get $prestigeNextPower prodiges_skills.__variable__
data modify storage prodiges_skills:prodiges_skills Menu.Pages.Prestige.color1 set value 'gray'
data modify storage prodiges_skills:prodiges_skills Menu.Pages.Prestige.color2 set value 'dark_gray'
data modify storage prodiges_skills:prodiges_skills Menu.Pages.Prestige.glint set value 'false'
$execute if score @p prodiges_skills.$(name).lvl matches 100 run function prodiges_skills:__private__/anonymous/102