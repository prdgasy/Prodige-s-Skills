execute if score $lvlstart prodiges_skills.__variable__ matches 101.. run return 0
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Progress.data.slot int 1 run scoreboard players get $slot prodiges_skills.__variable__
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Progress.data.lvl int 1 run scoreboard players get $lvlstart prodiges_skills.__variable__
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Progress.data.lvl int 1 run data modify storage prodiges_skills:prodiges_skills romanConverter.number set from storage prodiges_skills:prodiges_skills Menu.Pages.Progress.data.lvl
function prodiges_skills:__private__/anonymous/77 with storage prodiges_skills:prodiges_skills romanConverter
scoreboard players set $claimed prodiges_skills.__variable__ 0
function prodiges_skills:__private__/anonymous/78 with storage prodiges_skills:prodiges_skills Menu.Pages.Progress.data
scoreboard players operation $mod prodiges_skills.__variable__ = $lvlstart prodiges_skills.__variable__
scoreboard players operation $mod prodiges_skills.__variable__ %= 10 prodiges_skills.__int__
scoreboard players set __if_else__ prodiges_skills.__variable__ 0
execute if score $mod prodiges_skills.__variable__ matches 0 run function prodiges_skills:__private__/if_else/69
execute if score __if_else__ prodiges_skills.__variable__ matches 0 run function prodiges_skills:__private__/if_else/72
function prodiges_skills:menu/pages/progress/clicklevel with storage prodiges_skills:prodiges_skills Menu.Pages.Progress.data
scoreboard players add $lvlstart prodiges_skills.__variable__ 1
scoreboard players add $slot prodiges_skills.__variable__ 1
execute if score $slot prodiges_skills.__variable__ matches ..16 run function prodiges_skills:__private__/for_loop/9