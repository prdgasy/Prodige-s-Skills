$data modify storage prodiges_skills:prodiges_skills Player.OnEvent.showComponents.currentXp int 1 set from score @s prodiges_skills.$(name).xpToNext
$data modify storage prodiges_skills:prodiges_skills Player.OnEvent.showComponents.xpToNext int 1 set from score @s prodiges_skills.$(name).xpToNext
$data modify storage prodiges_skills:prodiges_skills Player.OnEvent.showComponents.currentLvl int 1 set from score @s prodiges_skills.$(name).lvl
execute store result storage prodiges_skills:prodiges_skills Player.OnEvent.showComponents.currentLvl int 1 run data modify storage prodiges_skills:prodiges_skills romanConverter.number set from storage prodiges_skills:prodiges_skills Player.OnEvent.showComponents.currentLvl
function prodiges_skills:__private__/anonymous/28 with storage prodiges_skills:prodiges_skills romanConverter
execute if entity @s[tag=prodiges_skills.pref.lvlNotif] run function prodiges_skills:player/onevent/xpnotif with storage prodiges_skills:prodiges_skills Player.OnEvent.showComponents
$scoreboard players operation @s prodiges_skills.$(name).xp -= prodiges_skills.$(name).xpToNext:@s
$scoreboard players operation .playerXpToNext prodiges_skills.__variable__ @s prodiges_skills.$(name).xpToNext
scoreboard players operation $xpToNext prodiges_skills.__variable__ = .playerXpToNext prodiges_skills.__variable__
scoreboard players operation $xpToNext prodiges_skills.__variable__ *= 12 prodiges_skills.__int__
scoreboard players operation $xpToNext prodiges_skills.__variable__ /= 10 prodiges_skills.__int__
$scoreboard players operations @s prodiges_skills.$(name).xpToNext = $xpToNext prodiges_skills.__variable__
$execute if score @s prodiges_skills.$(name).xpToNext matches 5001.. run scoreboard players set @s prodiges_skills.$(name).xpToNext 5000
$scoreboard players operation $previousLvl prodiges_skills.__variable__ = @s prodiges_skills.$(name).lvl
execute store result storage prodiges_skills:prodiges_skills Player.OnEvent.lvlUp.previousLvl int 1 run scoreboard players get $previousLvl prodiges_skills.__variable__
function prodiges_skills:__private__/anonymous/29 with storage prodiges_skills:prodiges_skills Player.OnEvent.lvlUp
$scoreboard players operation @s prodiges_skills.$(name).lvl += 1
$data modify storage prodiges_skills:prodiges_skills Player.OnEvent.lvlUp.currentLvl int 1 set from score @s prodiges_skills.$(name).lvl
scoreboard players operation $nextLvl prodiges_skills.__variable__ += $previousLvl prodiges_skills.__variable__
scoreboard players add $nextLvl prodiges_skills.__variable__ 2
execute store result storage prodiges_skills:prodiges_skills Player.OnEvent.lvlUp.nextLvl int 1 run scoreboard players get $nextLvl prodiges_skills.__variable__
data modify storage prodiges_skills:prodiges_skills Player.OnEvent.lvlUp.name set from storage prodiges_skills:prodiges_skills Player.OnEvent.showComponents.name
execute store result storage prodiges_skills:prodiges_skills Player.OnEvent.lvlUp.nextLvl int 1 run data modify storage prodiges_skills:prodiges_skills romanConverter.number set from storage prodiges_skills:prodiges_skills Player.OnEvent.lvlUp.nextLvl
function prodiges_skills:__private__/anonymous/30 with storage prodiges_skills:prodiges_skills romanConverter
execute store result storage prodiges_skills:prodiges_skills Player.OnEvent.lvlUp.previousLvl int 1 run data modify storage prodiges_skills:prodiges_skills romanConverter.number set from storage prodiges_skills:prodiges_skills Player.OnEvent.lvlUp.previousLvl
function prodiges_skills:__private__/anonymous/31 with storage prodiges_skills:prodiges_skills romanConverter
execute store result storage prodiges_skills:prodiges_skills Player.OnEvent.lvlUp.currentLvl int 1 run data modify storage prodiges_skills:prodiges_skills romanConverter.number set from storage prodiges_skills:prodiges_skills Player.OnEvent.lvlUp.currentLvl
function prodiges_skills:__private__/anonymous/32 with storage prodiges_skills:prodiges_skills romanConverter
scoreboard players operation $mod prodiges_skills.__variable__ = $previousLvl prodiges_skills.__variable__
scoreboard players operation $mod prodiges_skills.__variable__ %= 10 prodiges_skills.__int__
scoreboard players set __if_else__ prodiges_skills.__variable__ 0
execute if score $mod prodiges_skills.__variable__ matches 0 run function prodiges_skills:__private__/if_else/7
execute if score __if_else__ prodiges_skills.__variable__ matches 0 run function prodiges_skills:__private__/if_else/10
execute if entity @s[tag=prodiges_skills.pref.lvlNotif] run function prodiges_skills:player/onevent/lvlnotif with storage prodiges_skills:prodiges_skills Player.OnEvent.lvlUp
execute if entity @s[tag=prodiges_skills.pref.lvlBroadcast] run function prodiges_skills:player/onevent/lvlbroadcast with storage prodiges_skills:prodiges_skills Player.OnEvent.showComponents
$execute if score @s prodiges_skills.$(name).xp >= @s prodiges_skills.$(name).xpToNext run function prodiges_skills:player/onevent/lvlup with storage prodiges_skills:prodiges_skills Player.OnEvent.showComponents