function prodiges_skills:player/booster/give {type_int:2,type:"PP",power:2,duration:20,booster_color:"gold",model:gold_ingot}
playsound minecraft:block.note_block.pling ambient @p[tag=prodiges_skills.pref.sound] ~ ~ ~ 1 2
scoreboard players remove @p PPoints 50
tellraw @p ["",{"text":"Skills \u2666 ","color":"green","bold":true,"type":"text"},{"text":"You bought a ","color":"green","type":"text"},{"text":"x2 PP Booster ","color":"gold","type":"text"},{"text":"for ","color":"green","type":"text"},{"text":"50 SP","color":"gold","type":"text"},{"text":".","color":"green","type":"text"}]