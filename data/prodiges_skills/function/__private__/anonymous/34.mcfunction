scoreboard players set $previousLvl prodiges_skills.__variable__ 99
$tag @s add prodiges_skills.toClaim.$(name).99
$scoreboard players operation @s prodiges_skills.$(name).lvl = 100
scoreboard players set $current_lvl prodiges_skills.__variable__ 100
data modify storage prodiges_skills:prodiges_skills Player.OnEvent.lvlUp.name set from storage prodiges_skills:prodiges_skills Player.OnEvent.showComponents.name
data modify storage prodiges_skills:prodiges_skills Player.OnEvent.lvlUp.previousLvl set from storage prodiges_skills:prodiges_skills RomanConverter.Numbers.99
$execute store result storage prodiges_skills:prodiges_skills Player.OnEvent.lvlUp.xp int 1 run scoreboard players get @s skills.$(name).xp
data modify storage prodiges_skills:prodiges_skills Player.OnEvent.lvlUp.100ratio set value 100
data modify storage prodiges_skills:prodiges_skills Player.OnEvent.lvlUp.bar set from storage prodiges_skills:prodiges_skills Consts.Bars.15
scoreboard players operation $mod prodiges_skills.__variable__ = $previousLvl prodiges_skills.__variable__
scoreboard players operation $mod prodiges_skills.__variable__ %= 10 prodiges_skills.__int__
scoreboard players set __if_else__ prodiges_skills.__variable__ 0
execute if score $mod prodiges_skills.__variable__ matches 0 run function prodiges_skills:__private__/if_else/11
execute if score __if_else__ prodiges_skills.__variable__ matches 0 run function prodiges_skills:__private__/if_else/14
execute if entity @s[tag=prodiges_skills.pref.lvlNotif] run function prodiges_skills:player/onevent/lvlmax with storage prodiges_skills:prodiges_skills Player.OnEvent.lvlUp
execute if entity @s[tag=prodiges_skills.pref.lvlBbroadcast] run function prodiges_skills:player/onevent/lvlbroadcast with storage prodiges_skills:prodiges_skills Player.OnEvent.lvlUp