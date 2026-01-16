scoreboard players set $slot prodiges_skills.__variable__ 11
execute store result score $skillsNumber prodiges_skills.__variable__ run data get storage prodiges_skills:prodiges_skills Gui.SkillsNumber
scoreboard players set $skillIndex prodiges_skills.__variable__ 0
execute if score $skillIndex prodiges_skills.__variable__ < $skillsNumber prodiges_skills.__variable__ run function prodiges_skills:__private__/for_loop/4