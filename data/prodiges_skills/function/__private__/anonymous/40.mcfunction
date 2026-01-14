execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Main.slot int 1 run scoreboard players get $slot skills.__variable__
function prodiges_skills:menu/pages/main/getskillinfos with storage prodiges_skills:prodiges_skills Menu.Pages.Main
scoreboard players set __if_else__ skills.__variable__ 0
execute if score $lvl skills.__variable__ matches ..99 run function prodiges_skills:__private__/if_else/36
execute if score __if_else__ skills.__variable__ matches 0 run function prodiges_skills:menu/pages/main/setskillitemlvlmax with storage prodiges_skills:prodiges_skills Menu.Pages.Main