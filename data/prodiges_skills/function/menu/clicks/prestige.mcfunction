scoreboard players set $slot prodiges_skills.__variable__ 11
scoreboard players set $index prodiges_skills.__variable__ 0
execute if score $index prodiges_skills.__variable__ matches ..4 run function prodiges_skills:__private__/for_loop/22
scoreboard players set __if_else__ prodiges_skills.__variable__ 0
execute unless data entity @s Items[{Slot:21b}] run function prodiges_skills:__private__/if_else/177
execute if score __if_else__ prodiges_skills.__variable__ matches 0 unless data entity @s Items[{Slot:23b}] run function prodiges_skills:gui/constructor/close
function prodiges_skills:gui/refresh