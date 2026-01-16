$scoreboard players operation $xp prodiges_skills.__variable__ = @p prodiges_skills.$(name).xp
$scoreboard players operation $xpToNext prodiges_skills.__variable__ = @p prodiges_skills.$(name).xpToNext
$scoreboard players operation $lvl prodiges_skills.__variable__ = @p prodiges_skills.$(name).lvl
scoreboard players operation $nextLvl prodiges_skills.__variable__ = $lvl prodiges_skills.__variable__
scoreboard players add $nextLvl prodiges_skills.__variable__ 1
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Progress.data.xp int 1 run scoreboard players get $xp prodiges_skills.__variable__
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Progress.data.xpToNext int 1 run scoreboard players get $xpToNext prodiges_skills.__variable__
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Progress.data.lvlRoman int 1 run scoreboard players get $lvl prodiges_skills.__variable__
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Progress.data.nextLvlRoman int 1 run scoreboard players get $nextLvl prodiges_skills.__variable__
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Progress.data.lvlRoman int 1 run data modify storage prodiges_skills:prodiges_skills romanConverter.number set from storage prodiges_skills:prodiges_skills Menu.Pages.Progress.data.lvlRoman
function prodiges_skills:__private__/anonymous/55 with storage prodiges_skills:prodiges_skills romanConverter
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Progress.data.nextLvlRoman int 1 run data modify storage prodiges_skills:prodiges_skills romanConverter.number set from storage prodiges_skills:prodiges_skills Menu.Pages.Progress.data.nextLvlRoman
function prodiges_skills:__private__/anonymous/56 with storage prodiges_skills:prodiges_skills romanConverter
scoreboard players operation $ratio_100 prodiges_skills.__variable__ = $xp prodiges_skills.__variable__
scoreboard players operation $ratio_100 prodiges_skills.__variable__ *= 100 prodiges_skills.__int__
scoreboard players operation $ratio_100 prodiges_skills.__variable__ /= $xpToNext prodiges_skills.__variable__
scoreboard players operation $ratio_15 prodiges_skills.__variable__ = $xp prodiges_skills.__variable__
scoreboard players operation $ratio_15 prodiges_skills.__variable__ *= 15 prodiges_skills.__int__
scoreboard players operation $ratio_15 prodiges_skills.__variable__ /= $xpToNext prodiges_skills.__variable__
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Progress.data.ratio_100 int 1 run scoreboard players get $ratio_100 prodiges_skills.__variable__
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Progress.data.ratio_15 int 1 run scoreboard players get $ratio_15 prodiges_skills.__variable__
function prodiges_skills:__private__/anonymous/57 with storage prodiges_skills:prodiges_skills Menu.Pages.Progress.data