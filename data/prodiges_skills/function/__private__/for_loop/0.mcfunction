execute store result storage prodiges_skills:prodiges_skills Arrays.forEach.index int 1 run scoreboard players get $forEach.index skills.__variable__
$data modify storage prodiges_skills:prodiges_skills Arrays.forEach.page set from storage prodiges_skills:prodiges_skills Gui.Pages[$(index)]
function prodiges_skills:gui/findname with storage prodiges_skills:prodiges_skills Arrays.forEach
scoreboard players add $forEach.index skills.__variable__ 1
execute if score $forEach.index skills.__variable__ < $forEach.length skills.__variable__ run function prodiges_skills:__private__/for_loop/0