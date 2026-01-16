playsound minecraft:item.armor.equip_iron ambient @p[tag=prodiges_skills.pref.sound] ~ ~ ~ 2 1
say switched to page itemshop
function prodiges_skills:gui/pagetoscore {pageName:itemshop}
execute store result score @s prodiges_skills.page run data get storage prodiges_skills:prodiges_skills Gui.pageToScore.index
function prodiges_skills:gui/click
scoreboard players set __if_else__ prodiges_skills.__variable__ 1