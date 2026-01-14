$data modify storage prodiges_skills:prodiges_skills Menu.Pages.ItemShop.type set from storage prodiges_skills:prodiges_skills Config.Shop.specialItems[$(index)].type
$data modify storage prodiges_skills:prodiges_skills Menu.Pages.ItemShop.itemName set from storage prodiges_skills:prodiges_skills Config.Shop.specialItems[$(index)].itemName
$data modify storage prodiges_skills:prodiges_skills Menu.Pages.ItemShop.itemRepr set from storage prodiges_skills:prodiges_skills Config.Shop.specialItems[$(index)].itemRepr
$data modify storage prodiges_skills:prodiges_skills Menu.Pages.ItemShop.enchantName0 set from storage prodiges_skills:prodiges_skills Config.Shop.specialItems[$(index)].Enchants[0].name
$data modify storage prodiges_skills:prodiges_skills Menu.Pages.ItemShop.enchantLevel0 set from storage prodiges_skills:prodiges_skills Config.Shop.specialItems[$(index)].Enchants[0].level
$data modify storage prodiges_skills:prodiges_skills Menu.Pages.ItemShop.enchantName1 set from storage prodiges_skills:prodiges_skills Config.Shop.specialItems[$(index)].Enchants[1].name
$data modify storage prodiges_skills:prodiges_skills Menu.Pages.ItemShop.enchantLevel1 set from storage prodiges_skills:prodiges_skills Config.Shop.specialItems[$(index)].Enchants[1].level
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.ItemShop.enchantLevel0 int 1 run data modify storage prodiges_skills:prodiges_skills romanConverter.number set from storage prodiges_skills:prodiges_skills Menu.Pages.ItemShop.enchantLevel0
function prodiges_skills:__private__/anonymous/96 with storage prodiges_skills:prodiges_skills romanConverter
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.ItemShop.enchantLevel1 int 1 run data modify storage prodiges_skills:prodiges_skills romanConverter.number set from storage prodiges_skills:prodiges_skills Menu.Pages.ItemShop.enchantLevel1
function prodiges_skills:__private__/anonymous/97 with storage prodiges_skills:prodiges_skills romanConverter
$data modify storage prodiges_skills:prodiges_skills Menu.Pages.ItemShop.lore1 set from storage prodiges_skills:prodiges_skills Config.Shop.specialItems[$(index)].lore1
$data modify storage prodiges_skills:prodiges_skills Menu.Pages.ItemShop.lore2 set from storage prodiges_skills:prodiges_skills Config.Shop.specialItems[$(index)].lore2
$execute store result score $cost skills.__variable__ run data get storage prodiges_skills:prodiges_skills Config.Shop.specialItems[$(index)].cost
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.ItemShop.cost int 1 run scoreboard players get $cost skills.__variable__
scoreboard players operation $points skills.__variable__ = @p prodiges_skills.PPoints
scoreboard players set __if_else__ skills.__variable__ 0
execute if score $cost skills.__variable__ > $points skills.__variable__ run function prodiges_skills:__private__/if_else/89
execute if score __if_else__ skills.__variable__ matches 0 run data modify storage prodiges_skills:prodiges_skills Menu.Pages.ItemShop.pointsColor set value '§6'