scoreboard players operation $itemShopState skills.__variable__ = @s prodiges_skills.Menu.shop.itemShopState
scoreboard players operation $itemShopState skills.__variable__ %= 4 skills.__int__
execute store result storage prodiges_skills:skills.__storage__ switch_key int 1 run scoreboard players get $itemShopState skills.__variable__
function prodiges_skills:__private__/switch_case/2/select with storage prodiges_skills:skills.__storage__
function prodiges_skills:__private__/anonymous/82 with storage prodiges_skills:prodiges_skills Menu.Pages.Shop