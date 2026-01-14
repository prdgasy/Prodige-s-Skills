scoreboard players operation $mod skills.__variable__ = @s prodiges_skills.Menu.shop.shopState
scoreboard players operation $mod skills.__variable__ %= 2 skills.__int__
scoreboard players set __if_else__ skills.__variable__ 0
execute if score $mod skills.__variable__ matches 1 run function prodiges_skills:__private__/if_else/85
execute if score __if_else__ skills.__variable__ matches 0 run data modify storage prodiges_skills:prodiges_skills Menu.Pages.Shop.boosterButton set value 'gold_ingot'
function prodiges_skills:__private__/anonymous/85 with storage prodiges_skills:prodiges_skills Menu.Pages.Shop