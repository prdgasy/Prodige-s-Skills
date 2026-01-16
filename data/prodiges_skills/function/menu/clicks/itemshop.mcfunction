function prodiges_skills:menu/pages/itemshop/click
scoreboard players set __if_else__ prodiges_skills.__variable__ 0
execute unless data entity @s Items[{Slot:0b}] run function prodiges_skills:__private__/if_else/178
execute if score __if_else__ prodiges_skills.__variable__ matches 0 unless data entity @s Items[{Slot:18b}] run function prodiges_skills:gui/constructor/close
function prodiges_skills:gui/refresh