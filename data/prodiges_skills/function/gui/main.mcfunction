kill @e[type=item,nbt={Item:{components:{"minecraft:custom_data":{skillsLIB:1b}}}}]
execute as @a[scores={_:triggerCommand:=1..}] at @s run function prodiges_skills:gui/constructor/summon
data modify storage _:triggerCommand @a set value 0
scoreboard players enable @a _:triggerCommand: