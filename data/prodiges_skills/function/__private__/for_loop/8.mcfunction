execute if score $lvlstart skills.__variable__ matches 101.. run return 0
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Progress.data.slot int 1 run scoreboard players get $slot skills.__variable__
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Progress.data.lvl int 1 run scoreboard players get $lvlstart skills.__variable__
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Progress.data.lvl int 1 run data modify storage prodiges_skills:prodiges_skills romanConverter.number set from storage prodiges_skills:prodiges_skills Menu.Pages.Progress.data.lvl
function prodiges_skills:__private__/anonymous/67 with storage prodiges_skills:prodiges_skills romanConverter
scoreboard players set $claimed skills.__variable__ 0
function prodiges_skills:__private__/anonymous/68 with storage prodiges_skills:prodiges_skills Menu.Pages.Progress.data
scoreboard players operation $mod skills.__variable__ = $lvlstart skills.__variable__
scoreboard players operation $mod skills.__variable__ %= 10 skills.__int__
scoreboard players set __if_else__ skills.__variable__ 0
execute if score $mod skills.__variable__ matches 0 run function prodiges_skills:__private__/if_else/69
execute if score __if_else__ skills.__variable__ matches 0 run function prodiges_skills:__private__/if_else/72
function prodiges_skills:menu/pages/progress/clicklevel with storage prodiges_skills:prodiges_skills Menu.Pages.Progress.data
scoreboard players add $lvlstart skills.__variable__ 1
scoreboard players add $slot skills.__variable__ 1
execute if score $slot skills.__variable__ matches ..16 run function prodiges_skills:__private__/for_loop/8