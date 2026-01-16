$scoreboard players operation $lvl prodiges_skills.__variable__ = @p prodiges_skills.$(name).lvl
scoreboard players set __if_else__ prodiges_skills.__variable__ 0
execute if score $lvl prodiges_skills.__variable__ < $lvlstart prodiges_skills.__variable__ run function prodiges_skills:__private__/if_else/58
execute if score __if_else__ prodiges_skills.__variable__ matches 0 run function prodiges_skills:__private__/if_else/64