function prodiges_skills:player/booster/give {type_int:2,type:"PP",power:5,duration:30,booster_color:"gold",model:gold_ingot}
playsound minecraft:block.note_block.pling ambient @p[tag=prodiges_skills.pref.sound] ~ ~ ~ 1 2
scoreboard players remove @p PPoints 100
tellraw @p ["",{"text":"Skills \u2666 ","color":"green","bold":true,"type":"text"},{"text":"You bought a ","color":"green","type":"text"},{"text":"x5 PP Booster ","color":"gold","type":"text"},{"text":"for ","color":"green","type":"text"},{"text":"100 SP","color":"gold","type":"text"},{"text":".","color":"green","type":"text"}]