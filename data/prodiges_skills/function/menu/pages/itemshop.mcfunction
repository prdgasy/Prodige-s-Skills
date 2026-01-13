function prodiges_skills:menu/masks/gray
item replace entity @s container.0 with arrow[custom_data={skillsLIB:1b},custom_name='{ "text":"Go Back", "color":"gray", "italic":false } ']
item replace entity @s container.9 with stone[item_model="minecraft:leather_helmet",custom_data={skillsLIB:1b},custom_name='{ "text":"Special Items", "color":"aqua", "italic":false } ',lore=['["", { "text":"Browse and purchase ", "italic":false, "color":"white" }, { "text":"exclusive", "italic":false, "color":"light_purple" } ]','["", { "text":"tools ", "italic":false, "color":"light_purple" }, { "text":"and", "italic":false, "color":"white" }, { "text":" armor", "italic":false, "color":"light_purple" }, { "text":".", "italic":false, "color":"white" } ]','["", { "text":"Unlock powerful gear!", "italic":false, "color":"gray" } ]']]
item replace entity @s container.18 with barrier[custom_data={skillsLIB:1b},custom_name='{ "text":"Close", "color":"red", "italic":false } ']
execute store result score $itemsLength skills.__variable__ run return run data get storage prodiges_skills:prodiges_skills Config.Shop.specialItems
scoreboard players set $slot skills.__variable__ 1
execute if score $slot skills.__variable__ matches ..7 run function prodiges_skills:__private__/for_loop/17
scoreboard players set $slot skills.__variable__ 10
execute if score $slot skills.__variable__ matches ..16 run function prodiges_skills:__private__/for_loop/18
scoreboard players set $slot skills.__variable__ 19
execute if score $slot skills.__variable__ matches ..25 run function prodiges_skills:__private__/for_loop/19