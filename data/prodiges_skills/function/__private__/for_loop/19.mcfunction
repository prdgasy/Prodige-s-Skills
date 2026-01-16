scoreboard players remove $itemsLength prodiges_skills.__variable__ 1
execute if score $itemsLength prodiges_skills.__variable__ matches ..-1 run return 0
data remove storage prodiges_skills:prodiges_skills Menu.Pages.ItemShop
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.ItemShop.slot int 1 run scoreboard players get $slot prodiges_skills.__variable__
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.ItemShop.index int 1 run scoreboard players get $itemsLength prodiges_skills.__variable__
function prodiges_skills:menu/pages/itemshop/setparam with storage prodiges_skills:prodiges_skills Menu.Pages.ItemShop
function prodiges_skills:menu/pages/itemshop/setitem with storage prodiges_skills:prodiges_skills Menu.Pages.ItemShop
scoreboard players add $slot prodiges_skills.__variable__ 1
execute if score $slot prodiges_skills.__variable__ matches ..16 run function prodiges_skills:__private__/for_loop/19