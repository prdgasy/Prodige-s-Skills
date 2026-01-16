function prodiges_skills:menu/pages/main/getskillname
execute store result storage prodiges_skills:prodiges_skills Menu.Pages.Main.slot int 1 run scoreboard players get $slot prodiges_skills.__variable__
function prodiges_skills:menu/pages/main/getskillinfos with storage prodiges_skills:prodiges_skills Menu.Pages.Main
scoreboard players set __if_else__ prodiges_skills.__variable__ 0
execute if score $lvl prodiges_skills.__variable__ matches ..99 run function prodiges_skills:__private__/if_else/36
execute if score __if_else__ prodiges_skills.__variable__ matches 0 run function prodiges_skills:menu/pages/main/setskillitemlvlmax with storage prodiges_skills:prodiges_skills Menu.Pages.Main
scoreboard players add $slot prodiges_skills.__variable__ 1
scoreboard players add $skillIndex prodiges_skills.__variable__ 1
execute if score $skillIndex prodiges_skills.__variable__ < $skillsNumber prodiges_skills.__variable__ run function prodiges_skills:__private__/for_loop/4