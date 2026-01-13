function prodiges_skills:gui/pagetoscore {pageName:Shop}
execute store result score @s __namespace__.page run data get storage prodiges_skills:prodiges_skills Gui.pageToScore.index
function prodiges_skills:gui/click
scoreboard players set __if_else__ skills.__variable__ 1