execute store result score $get prodiges_skills.__variable__ run random value 0..100
$scoreboard players operation $prestige_lvl skills.__variable__ = @s skills.$(name).prestige
scoreboard players operation $chance prodiges_skills.__variable__ = $prestige_lvl prodiges_skills.__variable__
scoreboard players operation $chance prodiges_skills.__variable__ *= 5 prodiges_skills.__int__
execute if score $get prodiges_skills.__variable__ < $chance prodiges_skills.__variable__ run function prodiges_skills:__private__/anonymous/18 with storage prodiges_skills:prodiges_skills Player.OnEvent.taskData