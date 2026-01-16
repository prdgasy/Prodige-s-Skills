execute store result score $itemsLength prodiges_skills.__variable__ run data get storage prodiges_skills:prodiges_skills Config.Shop.specialItems
scoreboard players set $slot prodiges_skills.__variable__ 1
execute if score $slot prodiges_skills.__variable__ matches ..7 run function prodiges_skills:__private__/for_loop/15
scoreboard players set $slot prodiges_skills.__variable__ 10
execute if score $slot prodiges_skills.__variable__ matches ..16 run function prodiges_skills:__private__/for_loop/16
scoreboard players set $slot prodiges_skills.__variable__ 19
execute if score $slot prodiges_skills.__variable__ matches ..25 run function prodiges_skills:__private__/for_loop/17