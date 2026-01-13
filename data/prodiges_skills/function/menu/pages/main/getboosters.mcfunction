data modify storage prodiges_skills:prodiges_skills Menu.Pages.Main.xpBooster set value '§c-'
scoreboard players operation $xpBoosterDuration skills.__variable__ = @p prodiges_skills.xpBooster.duration
execute if score $xpBoosterDuration skills.__variable__ matches 2.. run function prodiges_skills:__private__/if_else/34
data modify storage prodiges_skills:prodiges_skills Menu.Pages.Main.pointBooster set value '§c-'
scoreboard players operation $pointBoosterDuration skills.__variable__ = @p prodiges_skills.pointBooster.duration
execute if score $pointBoosterDuration skills.__variable__ matches 2.. run function prodiges_skills:__private__/if_else/35