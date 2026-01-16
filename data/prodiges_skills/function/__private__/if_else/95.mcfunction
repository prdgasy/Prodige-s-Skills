tellraw @p ["",{"text":"Skills \u2666 ","color":"red","bold":true,"type":"text"},{"text":"Inventory is full.","color":"red","type":"text"}]
playsound minecraft:entity.enderman.teleport ambient @p[tag=prodiges_skills.pref.sound] ~ ~ ~ 1 1
scoreboard players set __if_else__ prodiges_skills.__variable__ 1