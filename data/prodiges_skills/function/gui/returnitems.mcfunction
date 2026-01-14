data modify block 930005 0 930005 Items set from entity @s Items
data remove block 930005 0 930005 Items[{components:{"minecraft:custom_data":{prodiges_skills:1b}}}]
execute store result score $foreignItem skills.__variable__ run loot give @p mine 930005 0 930005 stick[custom_data={drop_contents:1b}]
execute if score $foreignItem skills.__variable__ matches 1.. run function prodiges_skills:gui/refresh