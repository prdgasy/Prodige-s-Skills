$data modify storage prodiges_skills:prodiges_skills Gui.pageToScore.pageNameToCompare set value $(pageName)
scoreboard players set $index prodiges_skills.__variable__ 0
execute store result score $forEach.length prodiges_skills.__variable__ run data get storage prodiges_skills:prodiges_skills Gui.Pages
scoreboard players set $forEach.index prodiges_skills.__variable__ 0
execute if score $forEach.index prodiges_skills.__variable__ < $forEach.length prodiges_skills.__variable__ run function prodiges_skills:__private__/for_loop/0