execute store result score $point prodiges_skills.__variable__ run function prodiges_skills:config/points
$scoreboard players operation .taskXp prodiges_skills.__variable__ = @s skills.$(name).task.$(task)
scoreboard players operation $pointGained prodiges_skills.__variable__ = $point prodiges_skills.__variable__
scoreboard players operation $pointGained prodiges_skills.__variable__ *= .taskXp prodiges_skills.__variable__
scoreboard players operation $pointGained prodiges_skills.__variable__ *= @s prodiges_skills.pointBooster.power
scoreboard players operation @s prodiges_skills.points += $pointGained prodiges_skills.__variable__
execute store result storage prodiges_skills:prodiges_skills Player.OnEvent.showComponents.pointGained int 1 run scoreboard players get $pointGained prodiges_skills.__variable__