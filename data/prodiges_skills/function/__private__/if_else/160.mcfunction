scoreboard players set __if_else__ prodiges_skills.__variable__ 0
execute if entity @p[tag=prodiges_skills.pref.lvlNotif] run function prodiges_skills:__private__/if_else/159
execute if score __if_else__ prodiges_skills.__variable__ matches 0 run tag @p add prodiges_skills.pref.lvlNotif
playsound minecraft:entity.arrow.hit_player ambient @p[tag=prodiges_skills.pref.sound] ~ ~ ~ 1 0
scoreboard players set __if_else__ prodiges_skills.__variable__ 1