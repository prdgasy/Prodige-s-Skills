execute store result score $id prodiges_skills.__variable__ run random value 0..21
execute store result storage prodiges_skills:prodiges_skills Player.SpecialItem.id int 1 run scoreboard players get $id prodiges_skills.__variable__
function prodiges_skills:__private__/anonymous/37 with storage prodiges_skills:prodiges_skills Player.SpecialItem
function prodiges_skills:player/specialitems/givefromid with storage prodiges_skills:prodiges_skills Player.SpecialItem