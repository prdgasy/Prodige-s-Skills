tag @s add prodiges_skills.pref.sound
tag @s add prodiges_skills.pref.lvlNotif
tag @s add prodiges_skills.pref.lvlBroadcast
tag @s add prodiges_skills.pref.xpNotif
tag @s add prodiges_skills.pref.skillProgression
scoreboard players set @s prodiges_skills.xpBooster 1
scoreboard players set @s prodiges_skills.pointBooster 1
tag @s add prodiges_skills.ability.Mining
scoreboard players set @s prodiges_skills.Mining.xp 0
scoreboard players set @s prodiges_skills.Mining.prestige 0
scoreboard players set @s prodiges_skills.Mining.lvl 1
execute store result score @s prodiges_skills.Mining.xpToNext run data get storage prodiges_skills:prodiges_skills DB.Skills.Mining.xpstart
tag @s add prodiges_skills.ability.Foraging
scoreboard players set @s prodiges_skills.Foraging.xp 0
scoreboard players set @s prodiges_skills.Foraging.prestige 0
scoreboard players set @s prodiges_skills.Foraging.lvl 1
execute store result score @s prodiges_skills.Foraging.xpToNext run data get storage prodiges_skills:prodiges_skills DB.Skills.Foraging.xpstart
tag @s add prodiges_skills.ability.Excavation
scoreboard players set @s prodiges_skills.Excavation.xp 0
scoreboard players set @s prodiges_skills.Excavation.prestige 0
scoreboard players set @s prodiges_skills.Excavation.lvl 1
execute store result score @s prodiges_skills.Excavation.xpToNext run data get storage prodiges_skills:prodiges_skills DB.Skills.Excavation.xpstart
tag @s add prodiges_skills.ability.Combat
scoreboard players set @s prodiges_skills.Combat.xp 0
scoreboard players set @s prodiges_skills.Combat.prestige 0
scoreboard players set @s prodiges_skills.Combat.lvl 1
execute store result score @s prodiges_skills.Combat.xpToNext run data get storage prodiges_skills:prodiges_skills DB.Skills.Combat.xpstart
tag @s add prodiges_skills.ability.Farming
scoreboard players set @s prodiges_skills.Farming.xp 0
scoreboard players set @s prodiges_skills.Farming.prestige 0
scoreboard players set @s prodiges_skills.Farming.lvl 1
execute store result score @s prodiges_skills.Farming.xpToNext run data get storage prodiges_skills:prodiges_skills DB.Skills.Farming.xpstart