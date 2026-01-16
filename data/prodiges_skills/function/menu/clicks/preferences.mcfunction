scoreboard players set __if_else__ prodiges_skills.__variable__ 0
execute unless data entity @s Items[{Slot:21b}] run function prodiges_skills:__private__/if_else/154
execute if score __if_else__ prodiges_skills.__variable__ matches 0 run function prodiges_skills:__private__/if_else/169
function prodiges_skills:gui/refresh