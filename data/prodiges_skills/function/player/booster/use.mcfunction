advancement revoke @s only prodiges_skills:booster/use
data modify storage prodiges_skills:prodiges_skills temp.Booster.use set from entity @s SelectedItem.components.minecraft:custom_data.prodiges_skills
execute store result score $type prodiges_skills.__variable__ run data get storage prodiges_skills:prodiges_skills temp.Booster.use.type_int
scoreboard players set __if_else__ prodiges_skills.__variable__ 0
execute if score $type prodiges_skills.__variable__ matches 1 if score @s skills.booster.1.duration matches 2.. run function prodiges_skills:__private__/if_else/16
execute if score __if_else__ prodiges_skills.__variable__ matches 0 run function prodiges_skills:__private__/if_else/18