summon __guiEntity__ ~ ~1 ~ {Tags:[skillsLIB,this],NoGravity:1b,Silent:1b,Invulnerable:1b}
scoreboard players add global.id __namespace__.id 1
scoreboard players operation @e[type=__guiEntity__,tag=skillsLIB,tag=this] __namespace__.id = global.id __namespace__.id
scoreboard players operation @s __namespace__.id = global.id __namespace__.id
scoreboard players set @e[type=__guiEntity__,tag=skillsLIB,tag=this] __namespace__.page 0
execute as @e[type=__guiEntity__,tag=skillsLIB,tag=this] run function prodiges_skills:__private__/anonymous/1
scoreboard players set __if_else__ skills.__variable__ 1