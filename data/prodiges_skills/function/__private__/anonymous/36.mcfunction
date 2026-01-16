$clear @s stone_pickaxe[custom_data={prodiges_skills:{power:$(power),type_int:$(type_int)b,type:$(type),duration:$(duration),booster_color:$(booster_color)}}] 1
$scoreboard players set @s skills.booster.$(type_int).duration $(duration)
$scoreboard players set @s skills.booster.$(type_int).power $(power)
$tellraw @p [{text:"§a§lSkills ♦ §aYou enabled a"},{text:" [x$(power) $(type) Booster] §afor §7$(duration) minutes§a.",color:"$(booster_color)"}]
playsound entity.player.levelup ambient @s ~ ~ ~ 1 2