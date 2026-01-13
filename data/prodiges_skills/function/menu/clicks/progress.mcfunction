scoreboard players set __if_else__ skills.__variable__ 0
execute unless data entity @s Items[{Slot:0b}] run function prodiges_skills:__private__/if_else/147
execute if score __if_else__ skills.__variable__ matches 0 run function prodiges_skills:__private__/if_else/154
function prodiges_skills:menu/pages/progress/sliders
function prodiges_skills:gui/refresh