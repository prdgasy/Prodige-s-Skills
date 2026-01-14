execute store result score $get skills.__variable__ run random value 0..100
$scoreboard players operation $prestige_lvl skills.__variable__ = @s skills.$(name).prestige
scoreboard players operation $chance skills.__variable__ = $prestige_lvl skills.__variable__
scoreboard players operation $chance skills.__variable__ *= 5 skills.__int__
execute if score $get skills.__variable__ < $chance skills.__variable__ run function prodiges_skills:__private__/anonymous/9 with storage prodiges_skills:prodiges_skills Player.OnEvent.taskData