execute store result storage prodiges_skills:prodiges_skills exploitFilter.i int 1 run scoreboard players get $i prodiges_skills.__variable__
function prodiges_skills:__private__/anonymous/16 with storage prodiges_skills:prodiges_skills exploitFilter
$execute if score @s prodiges_skills.exploitfilter.$(id) matches 1.. run function prodiges_skills:__private__/anonymous/17 with storage prodiges_skills:prodiges_skills exploitFilter
scoreboard players add $i prodiges_skills.__variable__ 1
execute if score $i prodiges_skills.__variable__ < $exploitFilter.objects prodiges_skills.__variable__ run function prodiges_skills:__private__/for_loop/3