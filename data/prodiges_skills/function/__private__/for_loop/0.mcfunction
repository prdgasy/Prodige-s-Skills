execute store result storage prodiges_skills:prodiges_skills Arrays.forEach.index int 1 run scoreboard players get $forEach.index prodiges_skills.__variable__
function prodiges_skills:__private__/anonymous/4 with storage prodiges_skills:prodiges_skills Arrays.forEach
function prodiges_skills:gui/findname with storage prodiges_skills:prodiges_skills Arrays.forEach
scoreboard players add $forEach.index prodiges_skills.__variable__ 1
execute if score $forEach.index prodiges_skills.__variable__ < $forEach.length prodiges_skills.__variable__ run function prodiges_skills:__private__/for_loop/0