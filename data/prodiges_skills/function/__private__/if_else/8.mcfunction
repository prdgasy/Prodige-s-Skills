scoreboard players set __logic__0 skills.__variable__ 0
execute if score $mod skills.__variable__ matches 6 run scoreboard players set __logic__0 skills.__variable__ 1
execute unless score __logic__0 skills.__variable__ matches 1 if score $mod skills.__variable__ matches 2 run scoreboard players set __logic__0 skills.__variable__ 1
execute if score __logic__0 skills.__variable__ matches 1 run function prodiges_skills:__private__/if_else/6
execute if score __if_else__ skills.__variable__ matches 0 run function prodiges_skills:__private__/if_else/7