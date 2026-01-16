execute store result score $invlen prodiges_skills.__variable__ run data get entity @p Inventory
scoreboard players set __if_else__ prodiges_skills.__variable__ 0
execute if score @p skills.crate.cooldown matches 1.. run function prodiges_skills:__private__/if_else/23
execute if score __if_else__ prodiges_skills.__variable__ matches 0 run function prodiges_skills:__private__/if_else/26