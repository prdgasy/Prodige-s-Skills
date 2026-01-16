execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Prestige.index int 1 run scoreboard players get $index prodiges_skills.__variable__
function prodiges_skills:__private__/anonymous/97 with storage prodiges_skills:prodiges_skills Menu.Pages.Prestige
function prodiges_skills:menu/pages/prestige/getdata with storage prodiges_skills:prodiges_skills Menu.Pages.Prestige
function prodiges_skills:__private__/anonymous/98 with storage prodiges_skills:prodiges_skills Menu.Pages.Prestige
scoreboard players add $slot prodiges_skills.__variable__ 1
scoreboard players add $index prodiges_skills.__variable__ 1
execute if score $index prodiges_skills.__variable__ matches ..4 run function prodiges_skills:__private__/for_loop/14