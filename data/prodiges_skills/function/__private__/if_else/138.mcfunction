function prodiges_skills:gui/pagetoscore {pageName:Preferences}
execute store result score @s prodiges_skills.page run data get storage prodiges_skills:prodiges_skills Gui.pageToScore.index
function prodiges_skills:gui/click
scoreboard players set __if_else__ skills.__variable__ 1