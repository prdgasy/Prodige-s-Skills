scoreboard players operation $points prodiges_skills.__variable__ = @p PPoints
$scoreboard players set $cost prodiges_skills.__variable__ $(cost)
execute store result score $leninv prodiges_skills.__variable__ run data get entity @p Inventory
scoreboard players set __if_else__ prodiges_skills.__variable__ 0
execute if score $points prodiges_skills.__variable__ < $cost prodiges_skills.__variable__ run function prodiges_skills:__private__/if_else/90
execute if score __if_else__ prodiges_skills.__variable__ matches 0 run function prodiges_skills:__private__/if_else/93