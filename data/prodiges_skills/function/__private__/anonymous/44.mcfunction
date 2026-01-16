$scoreboard players set @s prodiges_skills.Menu.index $(index)
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Main.index int 1 run scoreboard players get @s prodiges_skills.Menu.index
function prodiges_skills:__private__/anonymous/42 with storage prodiges_skills:prodiges_skills Menu.Pages.Main
function prodiges_skills:__private__/anonymous/43 with storage prodiges_skills:prodiges_skills Menu.Pages.Main
scoreboard players set __if_else__ prodiges_skills.__variable__ 0
execute if score $lvl prodiges_skills.__variable__ matches ..21 run function prodiges_skills:__private__/if_else/27
execute if score __if_else__ prodiges_skills.__variable__ matches 0 run function prodiges_skills:__private__/if_else/33
say switched to page progress
function prodiges_skills:gui/pagetoscore {pageName:progress}
execute store result score @s prodiges_skills.page run data get storage prodiges_skills:prodiges_skills Gui.pageToScore.index
function prodiges_skills:gui/click
scoreboard players set $break prodiges_skills.__variable__ 1