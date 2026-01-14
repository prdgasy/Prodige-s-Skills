$data modify storage prodiges_skills:prodiges_skills Gui.pageToScore.pageNameToCompare set value $(pageName)
scoreboard players set $index skills.__variable__ 0
execute store result score $forEach.length skills.__variable__ run return run data get storage prodiges_skills:prodiges_skills Gui.Pages
scoreboard players set $forEach.index skills.__variable__ 0
execute if score $forEach.index skills.__variable__ < $forEach.length skills.__variable__ run function prodiges_skills:__private__/for_loop/0