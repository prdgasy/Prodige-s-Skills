scoreboard players operation $points skills.__variable__ = @p PPoints
$scoreboard players set $cost prodiges_skills.__variable__ $(cost)
execute store result score $leninv skills.__variable__ run return run data get entity @p Inventory
scoreboard players set __if_else__ skills.__variable__ 0
execute if score $points skills.__variable__ < $cost skills.__variable__ run function prodiges_skills:__private__/if_else/90
execute if score __if_else__ skills.__variable__ matches 0 run function prodiges_skills:__private__/if_else/93