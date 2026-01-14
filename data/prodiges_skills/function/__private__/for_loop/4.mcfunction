execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Progress.data.slot int 1 run scoreboard players get $slot skills.__variable__
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Progress.data.lvlTest int 1 run scoreboard players get $lvlStart skills.__variable__
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Progress.data.lvlTestRoman int 1 run scoreboard players get $lvlStart skills.__variable__
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Progress.data int 1 run data modify storage prodiges_skills:prodiges_skills romanConverter.number set from storage prodiges_skills:prodiges_skills Menu.Pages.Progress.data
function prodiges_skills:__private__/anonymous/50 with storage prodiges_skills:prodiges_skills romanConverter
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Progress.data.lvlClaimTest int 1 run scoreboard players get $lvlStart skills.__variable__
scoreboard players set $toClaim skills.__variable__ 0
function prodiges_skills:__private__/anonymous/51 with storage prodiges_skills:prodiges_skills Menu.Pages.Progress.data
scoreboard players operation $mod skills.__variable__ = $lvlStart skills.__variable__
scoreboard players operation $mod skills.__variable__ %= 10 skills.__int__
scoreboard players set __if_else__ skills.__variable__ 0
execute if score $mod skills.__variable__ matches 0 run function prodiges_skills:__private__/if_else/37
execute if score __if_else__ skills.__variable__ matches 0 run function prodiges_skills:__private__/if_else/40
function prodiges_skills:menu/pages/progress/setitems with storage prodiges_skills:prodiges_skills Menu.Pages.Progress.data
scoreboard players add $slot skills.__variable__ 1
execute if score $slot skills.__variable__ matches ..7 run function prodiges_skills:__private__/for_loop/4