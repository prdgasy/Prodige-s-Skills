$data modify storage prodiges_skills:prodiges_skills Menu.Pages.Prestige.ability set from storage prodiges_skills:prodiges_skills Config.Skills.$(name).prestige.ability
$data modify storage prodiges_skills:prodiges_skills Menu.Pages.Prestige.ability_desc1 set from storage prodiges_skills:prodiges_skills Config.Skills.$(name).prestige.lore1
$data modify storage prodiges_skills:prodiges_skills Menu.Pages.Prestige.ability_desc2 set from storage prodiges_skills:prodiges_skills Config.Skills.$(name).prestige.lore2
scoreboard players add $prestigeLvl prodiges_skills.__variable__ 1
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Prestige.lvl int 1 run scoreboard players get $prestigeLvl prodiges_skills.__variable__
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Prestige.lvl int 1 run data modify storage prodiges_skills:prodiges_skills romanConverter.number set from storage prodiges_skills:prodiges_skills Menu.Pages.Prestige.lvl
function prodiges_skills:__private__/anonymous/103 with storage prodiges_skills:prodiges_skills romanConverter
scoreboard players operation $power prodiges_skills.__variable__ = $prestigeLvl prodiges_skills.__variable__
scoreboard players operation $power prodiges_skills.__variable__ *= 5 prodiges_skills.__int__
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Prestige.power int 1 run scoreboard players get $power prodiges_skills.__variable__
function prodiges_skills:__private__/anonymous/104 with storage prodiges_skills:prodiges_skills Menu.Pages.Prestige
$scoreboard players add @p prodiges_skills.$(name).prestige 1
$scoreboard players set @p prodiges_skills.$(name).lvl 1
$scoreboard players set @p prodiges_skills.$(name).xp 0
$execute store result score @p prodiges_skills.$(name).xpToNext run data get storage prodiges_skills:prodiges_skills Config.Skills.$(name).xpstart
playsound minecraft:entity.ender_dragon.growl ambient @p[tag=prodiges_skills.pref.sound] ~ ~ ~ 1 1