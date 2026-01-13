scoreboard players set $slot skills.__variable__ 11
scoreboard players set $break skills.__variable__ 0
scoreboard players set $index skills.__variable__ 0
execute if score $index skills.__variable__ matches ..4 unless score $break skills.__variable__ matches 1.. run function prodiges_skills:__private__/for_loop/20
scoreboard players set __if_else__ skills.__variable__ 0
execute unless data entity @s Items[{Slot:4b}] run function prodiges_skills:__private__/if_else/138
execute if score __if_else__ skills.__variable__ matches 0 run function prodiges_skills:__private__/if_else/146
function prodiges_skills:gui/refresh