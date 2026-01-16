$scoreboard players operation $lvl prodiges_skills.__variable__ = @p prodiges_skills.$(name).lvl
scoreboard players set $slot prodiges_skills.__variable__ 1
execute if score $slot prodiges_skills.__variable__ matches ..7 run function prodiges_skills:__private__/for_loop/5
scoreboard players set $slot prodiges_skills.__variable__ 10
execute if score $slot prodiges_skills.__variable__ matches ..16 run function prodiges_skills:__private__/for_loop/6
scoreboard players set $slot prodiges_skills.__variable__ 19
execute if score $slot prodiges_skills.__variable__ matches ..25 run function prodiges_skills:__private__/for_loop/7