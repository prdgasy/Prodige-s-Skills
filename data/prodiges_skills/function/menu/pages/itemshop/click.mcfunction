execute store result score $itemsLength skills.__variable__ run return run data get storage prodiges_skills:prodiges_skills Config.Shop.specialItems
scoreboard players set $slot skills.__variable__ 1
execute if score $slot skills.__variable__ matches ..7 run function prodiges_skills:__private__/for_loop/14
scoreboard players set $slot skills.__variable__ 10
execute if score $slot skills.__variable__ matches ..16 run function prodiges_skills:__private__/for_loop/15
scoreboard players set $slot skills.__variable__ 19
execute if score $slot skills.__variable__ matches ..25 run function prodiges_skills:__private__/for_loop/16