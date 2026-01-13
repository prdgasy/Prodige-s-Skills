execute store result storage prodiges_skills:prodiges_skills Player.OnEvent.i int 1 run scoreboard players get $i skills.__variable__
function prodiges_skills:__private__/anonymous/15 with storage prodiges_skills:prodiges_skills Player.OnEvent
scoreboard players add $i skills.__variable__ 1
execute if score $taskExist skills.__variable__ matches 1.. run function prodiges_skills:__private__/while_loop/4