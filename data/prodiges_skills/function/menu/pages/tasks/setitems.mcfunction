function prodiges_skills:__private__/anonymous/77 with storage prodiges_skills:prodiges_skills Menu.Pages.Tasks
execute store result score $tabLength skills.__variable__ run return run data get storage prodiges_skills:prodiges_skills Menu.Pages.Tasks.tab
scoreboard players set $index skills.__variable__ 0
scoreboard players operation $pageNumber skills.__variable__ = $tabLength skills.__variable__
scoreboard players operation $pageNumber skills.__variable__ /= 21 skills.__int__
scoreboard players operation $index skills.__variable__ = @s prodiges_skills.Menu.taskPage.page
scoreboard players operation $index skills.__variable__ *= 21 skills.__int__
function prodiges_skills:menu/pages/tasks/fill