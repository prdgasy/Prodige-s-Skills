function prodiges_skills:__private__/anonymous/10 with storage prodiges_skills:prodiges_skills Consts.initSkills
function prodiges_skills:__private__/anonymous/11 with storage prodiges_skills:prodiges_skills Consts.initSkills
scoreboard players add $taskIndexe prodiges_skills.__variable__ 1
execute store result storage prodiges_skills:prodiges_skills Consts.initSkills.i int 1 run scoreboard players get $taskIndexe prodiges_skills.__variable__
function prodiges_skills:__private__/anonymous/12 with storage prodiges_skills:prodiges_skills Consts.initSkills
execute if score $exist prodiges_skills.__variable__ matches 1.. run function prodiges_skills:__private__/while_loop/0