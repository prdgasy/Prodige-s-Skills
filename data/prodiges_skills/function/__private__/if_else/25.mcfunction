playsound minecraft:block.chest.open ambient @p[tag=prodiges_skills.pref.sound] ~ ~ ~ 1 0
playsound minecraft:entity.wind_charge.wind_burst ambient @p[tag=prodiges_skills.pref.sound] ~ ~ ~ 1 0
scoreboard players set @p skills.crate.cooldown 60
execute store result score $crateLength skills.__variable__ run return run data get storage prodiges_skills:prodiges_skills Config.Shop.crate
scoreboard players remove $len_crate skills.__variable__ 1
execute store result storage prodiges_skills:prodiges_skills temp.gui.crate.len int 1 run scoreboard players get $len_crate skills.__variable__
function prodiges_skills:__private__/anonymous/29 with storage prodiges_skills:prodiges_skills temp.gui.crate
function prodiges_skills:__private__/anonymous/30 with storage prodiges_skills:prodiges_skills temp.gui.crate
function prodiges_skills:__private__/anonymous/31 with storage prodiges_skills:prodiges_skills temp.gui.crate
function prodiges_skills:__private__/anonymous/32 with storage prodiges_skills:prodiges_skills temp.gui.crate