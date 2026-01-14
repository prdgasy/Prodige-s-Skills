scoreboard players set $slot skills.__variable__ 11
execute store result score $pagesNumber skills.__variable__ run data get storage prodiges_skills:prodiges_skills Gui.PagesNumber
scoreboard players set $skillsIndex skills.__variable__ 0
execute if score $skillsIndex skills.__variable__ < $pagesNumber skills.__variable__ run function prodiges_skills:__private__/for_loop/3