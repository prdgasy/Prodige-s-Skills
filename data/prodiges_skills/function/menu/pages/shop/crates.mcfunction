execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Shop.crateCooldown int 1 run scoreboard players get @p prodiges_skills.crate.cooldown
scoreboard players set __if_else__ skills.__variable__ 0
execute if score @p prodiges_skills.crate.cooldown matches 1.. run function prodiges_skills:__private__/if_else/83
execute if score __if_else__ skills.__variable__ matches 0 run function prodiges_skills:__private__/if_else/84
function prodiges_skills:__private__/anonymous/84 with storage prodiges_skills:prodiges_skills Menu.Pages.Shop