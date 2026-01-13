scoreboard players remove $itemsLength skills.__variable__ 1
execute if score $itemsLength skills.__variable__ matches ..-1 run return 0
data remove storage prodiges_skills:prodiges_skills Menu.Pages.ItemShop
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.ItemShop.slot int 1 run scoreboard players get $slot skills.__variable__
function prodiges_skills:__private__/anonymous/100 with storage prodiges_skills:prodiges_skills Menu.Pages.ItemShop
scoreboard players add $slot skills.__variable__ 1
execute if score $slot skills.__variable__ matches ..16 run function prodiges_skills:__private__/for_loop/15