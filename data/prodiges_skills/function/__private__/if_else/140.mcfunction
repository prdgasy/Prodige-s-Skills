playsound minecraft:block.amethyst_block.place ambient @p[tag=prodiges_skills.pref.sound] ~ ~ ~ 1 0
function prodiges_skills:gui/pagetoscore {pageName:Boosters}
execute store result score @s prodiges_skills.page run data get storage prodiges_skills:prodiges_skills Gui.pageToScore.index
function prodiges_skills:gui/click
scoreboard players set __if_else__ skills.__variable__ 1