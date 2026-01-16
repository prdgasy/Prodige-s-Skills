$tag @p remove prodiges_skills.toClaim.$(name).$(lvl_id)
$tellraw @p ["",{"text":"Skills \u2666 ","color":"green","bold":true,"type":"text"},{"text":"You have claimed ","color":"green","type":"text"},{"text":"$(name) ","color":"light_purple","type":"text"},{"text":"$(lvl)","color":"dark_purple","bold":true,"type":"text"},{"text":"!","color":"green","type":"text"}]
$$(command)
$tellraw @p ["",{"text":" "},{"text":"- $(show)","color":"dark_gray","type":"text"}]
$tellraw @p ["",{"text":" "},{"text":"- ","color":"dark_gray","type":"text"},{"text":"+$(point) Skill Points (SP)","color":"gold","type":"text"}]
execute at @p run playsound minecraft:entity.arrow.hit_player ambient @p[tag=prodiges_skills.pref.sound] ~ ~ ~ 1 2