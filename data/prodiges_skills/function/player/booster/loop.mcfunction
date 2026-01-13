scoreboard players set __if_else__ skills.__variable__ 0
execute if score @s prodiges_skills.xpBooster.duration matches 1.. run function prodiges_skills:__private__/if_else/19
execute if score __if_else__ skills.__variable__ matches 0 if score @s prodiges_skills.xpBooster.duration matches 0 run function prodiges_skills:__private__/if_else/20
scoreboard players set __if_else__ skills.__variable__ 0
execute if score @s prodiges_skills.pointBooster.duration matches 1.. run function prodiges_skills:__private__/if_else/21
execute if score __if_else__ skills.__variable__ matches 0 if score @s prodiges_skills.pointBooster.duration matches 0 run function prodiges_skills:__private__/if_else/22