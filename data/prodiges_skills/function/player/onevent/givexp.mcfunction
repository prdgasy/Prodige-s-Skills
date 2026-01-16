$scoreboard players operation .taskXp prodiges_skills.__variable__ = @s skills.$(name).task.$(task)
execute store result score $xpGained prodiges_skills.__variable__ run data get storage prodiges_skills:prodiges_skills Player.OnEvent.taskData.xp
scoreboard players operation $xpGained prodiges_skills.__variable__ *= .taskXp prodiges_skills.__variable__
scoreboard players operation $xpGained prodiges_skills.__variable__ *= @s prodiges_skills.xpBooster.power
$scoreboard players operation @s prodiges_skills.$(name).xp += $xpGained prodiges_skills.__variable__
execute store result storage prodiges_skills:prodiges_skills Player.OnEvent.showComponents.xpGained int 1 run scoreboard players get $xpGained prodiges_skills.__variable__