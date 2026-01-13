$data modify storage prodiges_skills:prodiges_skills Player.SpecialItem.give set from storage prodiges_skills:prodiges_skills Config.Shop.specialItems[$(id)]
data modify storage prodiges_skills:prodiges_skills Player.SpecialItem.give.enchantName0 set from storage prodiges_skills:prodiges_skills Player.SpecialItem.give.Enchants[0].name
data modify storage prodiges_skills:prodiges_skills Player.SpecialItem.give.enchantLevel0 set from storage prodiges_skills:prodiges_skills Player.SpecialItem.give.Enchants[0].level
data modify storage prodiges_skills:prodiges_skills Player.SpecialItem.give.enchantName1 set from storage prodiges_skills:prodiges_skills Player.SpecialItem.give.Enchants[1].name
data modify storage prodiges_skills:prodiges_skills Player.SpecialItem.give.enchantLevel1 set from storage prodiges_skills:prodiges_skills Player.SpecialItem.give.Enchants[1].level
function prodiges_skills:player/specialitems/give with storage prodiges_skills:prodiges_skills Player.SpecialItem.give