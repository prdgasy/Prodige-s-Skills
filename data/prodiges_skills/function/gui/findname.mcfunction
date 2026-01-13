$data modify storage prodiges_skills:prodiges_skills Gui.pageToScore.name set value $(page)
data modify storage prodiges_skills:skills.__storage__ currentObject set from storage Gui.pageToScore name
execute store success score __bool_result__0 skills.__variable__ run data modify storage prodiges_skills:skills.__storage__ currentObject set from storage Gui.pageToScore pageNameToCompare
execute if score __bool_result__0 skills.__variable__ matches 0 store result storage prodiges_skills:prodiges_skills Gui.pageToScore.index int 1 run scoreboard players get $index skills.__variable__
scoreboard players add $index skills.__variable__ 1