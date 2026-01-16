$scoreboard objectives add skills.$(name).prestige dummy
$scoreboard objectives add skills.$(name).xp dummy
$scoreboard objectives add skills.$(name).lvl dummy
$scoreboard objectives add skills.$(name).xpToNext dummy
scoreboard players set $taskIndexe prodiges_skills.__variable__ 0
scoreboard players set $exist prodiges_skills.__variable__ 1
execute if score $exist prodiges_skills.__variable__ matches 1.. run function prodiges_skills:__private__/while_loop/0