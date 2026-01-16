data remove storage prodiges_skills:prodiges_skills Menu.Pages.Tasks
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Tasks.slot int 1 run scoreboard players get $slot prodiges_skills.__variable__
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Tasks.index int 1 run scoreboard players get $index prodiges_skills.__variable__
function prodiges_skills:__private__/anonymous/82 with storage prodiges_skills:prodiges_skills Menu.Pages.Tasks
function prodiges_skills:menu/pages/tasks/settaskitem with storage prodiges_skills:prodiges_skills Menu.Pages.Tasks
scoreboard players add $index prodiges_skills.__variable__ 1
scoreboard players add $slot prodiges_skills.__variable__ 1
execute if score $slot prodiges_skills.__variable__ matches ..16 run function prodiges_skills:__private__/for_loop/12