function prodiges_skills:player/onevent/givexp with storage prodiges_skills:prodiges_skills Player.OnEvent.taskData
function prodiges_skills:player/onevent/givepoint with storage prodiges_skills:prodiges_skills Player.OnEvent.taskData
$data modify storage prodiges_skills:prodiges_skills Player.OnEvent.showComponents.currentXp int 1 set from score @s prodiges_skills.$(name).xp
$data modify storage prodiges_skills:prodiges_skills Player.OnEvent.showComponents.lvl int 1 set from score @s prodiges_skills.$(name).lvl
$data modify storage prodiges_skills:prodiges_skills Player.OnEvent.showComponents.xpToNext int 1 set from score @s prodiges_skills.$(name).xpToNext
execute store result storage prodiges_skills:prodiges_skills Player.OnEvent.showComponents.romanLvl int 1 run data modify storage prodiges_skills:prodiges_skills romanConverter.number set from storage prodiges_skills:prodiges_skills Player.OnEvent.showComponents.currentLvl
function prodiges_skills:__private__/anonymous/18 with storage prodiges_skills:prodiges_skills romanConverter
$scoreboard players operation .xp prodiges_skills.__variable__ = @s skills.$(name).xp
$scoreboard players operation .xpToNNext prodiges_skills.__variable__ = @s skills.$(name).xpToNext
scoreboard players operation $progress_100 skills.__variable__ = .xp prodiges_skills.__variable__
scoreboard players operation $progress_100 skills.__variable__ *= 100 skills.__int__
scoreboard players operation $progress_100 skills.__variable__ /= .xpToNNext prodiges_skills.__variable__
execute store result storage prodiges_skills:prodiges_skills Player.OnEvent.showComponents.progress_100 int 1 run scoreboard players get $progress_100 skills.__variable__
$execute if score @s prodiges_skills.$(name).lvl matches ..99 if entity @s[tag=prodiges_skills.ref.xpNotif] run function prodiges_skills:player/onevent/xpnotif with storage prodiges_skills:prodiges_skills Player.OnEvent.showComponents
$execute if score @s prodiges_skills.$(name).lvl matches 100 if entity @s[tag=prodiges_skills.pref.xpNotif] run function prodiges_skills:player/onevent/xpnotifmax with storage prodiges_skills:prodiges_skills Player.OnEvent.showComponents
$execute if score @s prodiges_skills.$(name).lvl matches ..99 if score @s prodiges_skills.$(name).xp >= @s prodiges_skills.$(name).xpToNext run function prodiges_skills:player/onevent/lvlup with storage prodiges_skills:prodiges_skills Player.OnEvent.showComponents