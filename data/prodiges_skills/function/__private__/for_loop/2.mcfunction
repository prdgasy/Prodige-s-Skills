execute store result storage prodiges_skills:prodiges_skills exploitFilter.i int 1 run scoreboard players get $len prodiges_skills.__variable__
function prodiges_skills:__private__/anonymous/14 with storage prodiges_skills:prodiges_skills exploitFilter
function prodiges_skills:__private__/anonymous/15 with storage prodiges_skills:prodiges_skills exploitFilter
scoreboard players add $i prodiges_skills.__variable__ 1
execute if score $i prodiges_skills.__variable__ < $exploitFilter.objects prodiges_skills.__variable__ run function prodiges_skills:__private__/for_loop/2