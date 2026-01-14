playsound minecraft:entity.arrow.shoot ambient @s ~ ~ ~ 1 0
particle minecraft:happy_villager ~ ~ ~ 1 1 1 1 100
execute store result score $r skills.__variable__ run random value 0..2
execute store result storage prodiges_skills:skills.__storage__ switch_key int 1 run scoreboard players get $r skills.__variable__
function prodiges_skills:__private__/switch_case/0/select with storage prodiges_skills:skills.__storage__
function prodiges_skills:__private__/anonymous/10 with storage prodiges_skills:prodiges_skills temp.Player.ability.foraging