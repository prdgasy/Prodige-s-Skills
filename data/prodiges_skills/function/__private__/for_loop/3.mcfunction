function prodiges_skills:menu/pages/main/getskillname
function prodiges_skills:__private__/anonymous/40 with storage prodiges_skills:prodiges_skills temp.init
scoreboard players add $slot skills.__variable__ 1
scoreboard players add $skillsIndex skills.__variable__ 1
execute if score $skillsIndex skills.__variable__ < $pagesNumber skills.__variable__ run function prodiges_skills:__private__/for_loop/3