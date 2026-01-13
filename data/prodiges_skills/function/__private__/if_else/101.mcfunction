function prodiges_skills:player/booster/give {type_int:1,type:"XP",power:3,duration:60,booster_color:"aqua",model:experience_bottle}
playsound minecraft:block.note_block.pling ambient @p[tag=prodiges_skills.pref.sound] ~ ~ ~ 1 2
scoreboard players remove @p PPoints 50
tellraw @p ["",{"text":"Skills \u2666 ","color":"green","bold":true,"type":"text"},{"text":"You bought a ","color":"green","type":"text"},{"text":"x3 XP Booster ","color":"aqua","type":"text"},{"text":"for ","color":"green","type":"text"},{"text":"50 SP","color":"gold","type":"text"},{"text":".","color":"green","type":"text"}]