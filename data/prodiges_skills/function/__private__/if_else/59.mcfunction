tellraw @p ["",{"text":"Skills \u2666 ","color":"red","bold":true,"type":"text"},{"text":"You already claimed this reward.","color":"red","type":"text"}]
execute at @p run playsound minecraft:entity.enderman.teleport ambient @p[tag=prodiges_skills.pref.sound] ~ ~ ~ 1 1
scoreboard players set __if_else__ skills.__variable__ 1