playsound minecraft:block.chest.open ambient @p[tag=prodiges_skills.pref.sound] ~ ~ ~ 1 0
playsound minecraft:entity.wind_charge.wind_burst ambient @p[tag=prodiges_skills.pref.sound] ~ ~ ~ 1 0
scoreboard players set @p skills.crate.cooldown 60
execute store result score $crateLength prodiges_skills.__variable__ run data get storage prodiges_skills:prodiges_skills Config.Shop.crate
scoreboard players remove $len_crate prodiges_skills.__variable__ 1
execute store result storage prodiges_skills:prodiges_skills temp.gui.crate.len int 1 run scoreboard players get $len_crate prodiges_skills.__variable__
function prodiges_skills:__private__/anonymous/38 with storage prodiges_skills:prodiges_skills temp.gui.crate
function prodiges_skills:__private__/anonymous/39 with storage prodiges_skills:prodiges_skills temp.gui.crate
function prodiges_skills:__private__/anonymous/40 with storage prodiges_skills:prodiges_skills temp.gui.crate
function prodiges_skills:__private__/anonymous/41 with storage prodiges_skills:prodiges_skills temp.gui.crate