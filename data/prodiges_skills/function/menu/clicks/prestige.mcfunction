scoreboard players set $slot skills.__variable__ 11
scoreboard players set $index skills.__variable__ 0
execute if score $index skills.__variable__ matches ..4 run function prodiges_skills:__private__/for_loop/21
scoreboard players set __if_else__ skills.__variable__ 0
execute unless data entity @s Items[{Slot:21b}] run function prodiges_skills:__private__/if_else/179
execute if score __if_else__ skills.__variable__ matches 0 unless data entity @s Items[{Slot:23b}] run function prodiges_skills:gui/constructor/close
function prodiges_skills:gui/refresh