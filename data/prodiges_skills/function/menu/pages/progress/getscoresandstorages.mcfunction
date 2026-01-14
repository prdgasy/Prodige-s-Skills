$scoreboard players operation $xp prodiges_skills.__variable__ = @p prodiges_skills.$(name).xp
$scoreboard players operation $xpToNext prodiges_skills.__variable__ = @p prodiges_skills.$(name).xpToNext
$scoreboard players operation $lvl prodiges_skills.__variable__ = @p prodiges_skills.$(name).lvl
scoreboard players operation $nextLvl skills.__variable__ = $lvl skills.__variable__
scoreboard players add $nextLvl skills.__variable__ 1
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Progress.data.xp int 1 run scoreboard players get $xp skills.__variable__
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Progress.data.xpToNext int 1 run scoreboard players get $xpToNext skills.__variable__
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Progress.data.lvlRoman int 1 run scoreboard players get $lvl skills.__variable__
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Progress.data.nextLvlRoman int 1 run scoreboard players get $nextLvl skills.__variable__
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Progress.data.lvlRoman int 1 run data modify storage prodiges_skills:prodiges_skills romanConverter.number set from storage prodiges_skills:prodiges_skills Menu.Pages.Progress.data.lvlRoman
function prodiges_skills:__private__/anonymous/46 with storage prodiges_skills:prodiges_skills romanConverter
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Progress.data.nextLvlRoman int 1 run data modify storage prodiges_skills:prodiges_skills romanConverter.number set from storage prodiges_skills:prodiges_skills Menu.Pages.Progress.data.nextLvlRoman
function prodiges_skills:__private__/anonymous/47 with storage prodiges_skills:prodiges_skills romanConverter
scoreboard players operation $ratio_100 skills.__variable__ = $xp skills.__variable__
scoreboard players operation $ratio_100 skills.__variable__ *= 100 skills.__int__
scoreboard players operation $ratio_100 skills.__variable__ /= $xpToNext skills.__variable__
scoreboard players operation $ratio_15 skills.__variable__ = $xp skills.__variable__
scoreboard players operation $ratio_15 skills.__variable__ *= 15 skills.__int__
scoreboard players operation $ratio_15 skills.__variable__ /= $xpToNext skills.__variable__
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Progress.data.ratio_100 int 1 run scoreboard players get $ratio_100 skills.__variable__
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Progress.data.ratio_15 int 1 run scoreboard players get $ratio_15 skills.__variable__
function prodiges_skills:__private__/anonymous/48 with storage prodiges_skills:prodiges_skills Menu.Pages.Progress.data