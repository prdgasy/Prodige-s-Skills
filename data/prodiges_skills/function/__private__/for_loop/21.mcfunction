execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Main.slot int 1 run scoreboard players get $slot prodiges_skills.__variable__
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Main.index int 1 run scoreboard players get $index prodiges_skills.__variable__
function prodiges_skills:menu/pages/main/isprogresspage with storage prodiges_skills:prodiges_skills Menu.Pages.Main
scoreboard players add $slot prodiges_skills.__variable__ 1
scoreboard players add $index prodiges_skills.__variable__ 1
execute if score $index prodiges_skills.__variable__ matches ..4 unless score $break prodiges_skills.__variable__ matches 1.. run function prodiges_skills:__private__/for_loop/21