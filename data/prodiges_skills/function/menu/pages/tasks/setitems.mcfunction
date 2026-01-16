function prodiges_skills:__private__/anonymous/87 with storage prodiges_skills:prodiges_skills Menu.Pages.Tasks
execute store result score $tabLength prodiges_skills.__variable__ run data get storage prodiges_skills:prodiges_skills Menu.Pages.Tasks.tab
scoreboard players set $index prodiges_skills.__variable__ 0
scoreboard players operation $pageNumber prodiges_skills.__variable__ = $tabLength prodiges_skills.__variable__
scoreboard players operation $pageNumber prodiges_skills.__variable__ /= 21 prodiges_skills.__int__
scoreboard players operation $index prodiges_skills.__variable__ = @s prodiges_skills.Menu.taskPage.page
scoreboard players operation $index prodiges_skills.__variable__ *= 21 prodiges_skills.__int__
function prodiges_skills:menu/pages/tasks/fill