scoreboard players operation $points prodiges_skills.__variable__ = @p PPoints
execute store result score $invlen prodiges_skills.__variable__ run data get entity @p Inventory
execute unless data entity @s Items[{Slot:10b}] run function prodiges_skills:__private__/if_else/98
execute unless data entity @s Items[{Slot:11b}] run function prodiges_skills:__private__/if_else/103
execute unless data entity @s Items[{Slot:12b}] run function prodiges_skills:__private__/if_else/108
execute unless data entity @s Items[{Slot:14b}] run function prodiges_skills:__private__/if_else/113
execute unless data entity @s Items[{Slot:15b}] run function prodiges_skills:__private__/if_else/118
execute unless data entity @s Items[{Slot:16b}] run function prodiges_skills:__private__/if_else/123