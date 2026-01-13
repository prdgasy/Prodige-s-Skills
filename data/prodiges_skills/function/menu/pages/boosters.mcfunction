function prodiges_skills:menu/masks/gray
item replace entity @s container.21 with arrow[custom_data={skillsLIB:1b},custom_name='{ "text":"Go Back", "color":"gray", "italic":false } ']
item replace entity @s container.22 with experience_bottle[custom_data={skillsLIB:1b},custom_name='["", { "text":"Boosters", "italic":false, "color":"green" } ]',lore=['[{ "text":"Boosters temporarily ", "italic":false, "color":"white" }, { "text":"increase", "italic":false, "color":"gold" } ]','["", { "text":"your XP or Skill Point", "italic":false, "color":"gold" }, { "text":" gain.", "italic":false, "color":"white" } ]','[{ "text":"Speed up your progressoin!", "italic":false, "color":"gray" } ]'],enchantment_glint_override=true]
item replace entity @s container.23 with barrier[custom_data={skillsLIB:1b},custom_name='{ "text":"Close", "color":"red", "italic":false } ']
function prodiges_skills:menu/pages/shop/activeboosters
function prodiges_skills:menu/pages/boosters/fill