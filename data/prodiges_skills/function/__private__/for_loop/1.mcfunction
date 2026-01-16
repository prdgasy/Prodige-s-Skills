execute store result storage prodiges_skills:prodiges_skills Consts.initSkills.i int 1 run scoreboard players get $skillIndex prodiges_skills.__variable__
function prodiges_skills:__private__/anonymous/9 with storage prodiges_skills:prodiges_skills Consts.initSkills
function prodiges_skills:__private__/anonymous/13 with storage prodiges_skills:prodiges_skills Consts.initSkills
scoreboard players add $skillIndex prodiges_skills.__variable__ 1
execute if score $skillIndex prodiges_skills.__variable__ matches ..6 run function prodiges_skills:__private__/for_loop/1