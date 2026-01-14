execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Progress.index int 1 run scoreboard players get @s prodiges_skills.Menu.index
$data modify storage prodiges_skills:prodiges_skills Menu.Pages.Progress.name set from storage prodiges_skills:prodiges_skills Consts.Skills.$(name)
function prodiges_skills:__private__/anonymous/49 with storage prodiges_skills:prodiges_skills Menu.Pages.Progress
playsound minecraft:entity.arrow.hit_player ambient @p[tag=prodiges_skills.pref.sound] ~ ~ ~ 1 0