$clear @s stone_pickaxe[custom_data={prodiges_skills:{power:$(power),type_int:$(type_int)b,type:$(type),duration:$(duration),booster_color:$(booster_color)}}] 1
$scoreboard players set @s skills.booster.$(type_int).duration $(duration)
$scoreboard players set @s skills.booster.$(type_int).power $(power)
$tellraw @p [{"text":"\u00a7a\u00a7lSkills \u2666 \u00a7aYou enabled a"},{"text":" [x$(power) $(type) Booster] \u00a7afor \u00a77$(duration) minutes\u00a7a.","color":"$(booster_color)"}]
playsound entity.player.levelup ambient @s ~ ~ ~ 1 2