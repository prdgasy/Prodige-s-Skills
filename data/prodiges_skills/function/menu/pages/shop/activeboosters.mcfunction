execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Shop.points int 1 run scoreboard players get @p prodiges_skills.PPoints
data modify storage prodiges_skills:prodiges_skills Menu.Pages.Shop.xpBooster set value '§c-'
scoreboard players operation $xpBoosterDuration prodiges_skills.__variable__ = @p prodiges_skills.xpBooster.duration
execute if score $xpBoosterDuration prodiges_skills.__variable__ matches 2.. run function prodiges_skills:__private__/if_else/81
data modify storage prodiges_skills:prodiges_skills Menu.Pages.Shop.pointBooster set value '§c-'
scoreboard players operation $pointBoosterDuration prodiges_skills.__variable__ = @p prodiges_skills.pointBooster.duration
execute if score $pointBoosterDuration prodiges_skills.__variable__ matches 2.. run function prodiges_skills:__private__/if_else/82
function prodiges_skills:__private__/anonymous/90 with storage prodiges_skills:prodiges_skills Menu.Pages.Shop