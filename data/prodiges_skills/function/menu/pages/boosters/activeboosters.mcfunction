execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Boosters.points int 1 run scoreboard players get @p prodiges_skills.PPoints
data modify storage prodiges_skills:prodiges_skills Menu.Pages.Boosters.xpBooster set value '§c-'
scoreboard players operation $xpBoosterDuration skills.__variable__ = @p prodiges_skills.xpBooster.duration
execute if score $xpBoosterDuration skills.__variable__ matches 2.. run function prodiges_skills:__private__/if_else/124
data modify storage prodiges_skills:prodiges_skills Menu.Pages.Boosters.pointBooster set value '§c-'
scoreboard players operation $pointBoosterDuration skills.__variable__ = @p prodiges_skills.pointBooster.duration
execute if score $pointBoosterDuration skills.__variable__ matches 2.. run function prodiges_skills:__private__/if_else/125
function prodiges_skills:__private__/anonymous/108 with storage prodiges_skills:prodiges_skills Menu.Pages.Boosters