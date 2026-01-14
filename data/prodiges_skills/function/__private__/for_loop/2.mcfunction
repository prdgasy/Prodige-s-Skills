execute store result storage prodiges_skills:prodiges_skills exploitFilter.i int 1 run scoreboard players get $i skills.__variable__
function prodiges_skills:__private__/anonymous/7 with storage prodiges_skills:prodiges_skills exploitFilter
$execute if score @s prodiges_skills.exploitfilter.$(id) matches 1.. run function prodiges_skills:__private__/anonymous/8 with storage prodiges_skills:prodiges_skills exploitFilter
scoreboard players add $i skills.__variable__ 1
execute if score $i skills.__variable__ < $exploitFilter.objects skills.__variable__ run function prodiges_skills:__private__/for_loop/2