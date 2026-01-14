playsound minecraft:item.armor.equip_iron ambient @p[tag=prodiges_skills.pref.sound] ~ ~ ~ 2 1
function prodiges_skills:gui/pagetoscore {pageName:ItemShop}
execute store result score @s prodiges_skills.page run data get storage prodiges_skills:prodiges_skills Gui.pageToScore.index
function prodiges_skills:gui/click
scoreboard players set __if_else__ skills.__variable__ 1