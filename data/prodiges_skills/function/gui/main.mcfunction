kill @e[type=item,nbt={Item:{components:{"minecraft:custom_data":{prodiges_skills:1b}}}}]
execute as @a[scores={Skills=1..}] at @s run function prodiges_skills:gui/constructor/summon
scoreboard players set @a Skills 0
scoreboard players enable @a Skills