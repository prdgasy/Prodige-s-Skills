playsound minecraft:block.amethyst_block.place ambient @p[tag=prodiges_skills.pref.sound] ~ ~ ~ 1 0
say switched to page shop
function prodiges_skills:gui/pagetoscore {pageName:shop}
execute store result score @s prodiges_skills.page run data get storage prodiges_skills:prodiges_skills Gui.pageToScore.index
function prodiges_skills:gui/click
scoreboard players set __if_else__ prodiges_skills.__variable__ 1