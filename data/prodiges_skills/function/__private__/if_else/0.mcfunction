summon chest_minecart ~ ~1 ~ {Tags:[prodiges_skills,this],NoGravity:1b,Silent:1b,Invulnerable:1b}
scoreboard players add global.id prodiges_skills.id 1
scoreboard players operation @e[type=chest_minecart,tag=prodiges_skills,tag=this] prodiges_skills.id = global.id prodiges_skills.id
scoreboard players operation @s prodiges_skills.id = global.id prodiges_skills.id
scoreboard players set @e[type=chest_minecart,tag=prodiges_skills,tag=this] prodiges_skills.page 0
execute as @e[type=chest_minecart,tag=prodiges_skills,tag=this] run function prodiges_skills:__private__/anonymous/2
scoreboard players set __if_else__ skills.__variable__ 1