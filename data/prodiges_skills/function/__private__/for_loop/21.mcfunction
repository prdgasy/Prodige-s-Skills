execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Prestige.slot int 1 run scoreboard players get $slot skills.__variable__
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Prestige.index int 1 run scoreboard players get $index skills.__variable__
function prodiges_skills:__private__/anonymous/114 with storage prodiges_skills:prodiges_skills Menu.Pages.Prestige
scoreboard players add $slot skills.__variable__ 1
scoreboard players add $index skills.__variable__ 1
execute if score $index skills.__variable__ matches ..4 run function prodiges_skills:__private__/for_loop/21