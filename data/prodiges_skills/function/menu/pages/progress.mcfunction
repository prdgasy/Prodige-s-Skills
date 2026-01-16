function prodiges_skills:menu/masks/gray
item replace entity @s container.0 with arrow[custom_data={prodiges_skills:1b},custom_name={text:"Go Back",color:"gray",italic:false}]
function prodiges_skills:menu/pages/progress/getskillname with storage prodiges_skills:prodiges_skills Menu.Pages.Progress
function prodiges_skills:menu/pages/progress/getdata with storage prodiges_skills:prodiges_skills Menu.Pages.Progress
function prodiges_skills:menu/pages/progress/getscoresandstorages with storage prodiges_skills:prodiges_skills Menu.Pages.Progress
function prodiges_skills:__private__/anonymous/118 with storage prodiges_skills:prodiges_skills Menu.Pages.Progress.data
data modify storage prodiges_skills:prodiges_skills Menu.Pages.Progress.ability set value '§a§l✔'
function prodiges_skills:__private__/anonymous/119 with storage prodiges_skills:prodiges_skills Menu.Pages.Progress
function prodiges_skills:__private__/anonymous/120 with storage prodiges_skills:prodiges_skills Menu.Pages.Progress
function prodiges_skills:menu/pages/progress/setprogresspage
item replace entity @s container.17 with book[custom_data={prodiges_skills:1b},custom_name=["",{text:"Task Rewards",italic:false,color:"#996666"}],lore=[["",{text:"See",italic:false,color:"white"},{text:" ",italic:false,color:"gray"},{text:"XP",italic:false,color:"aqua"},{text:" ",italic:false,color:"gray"},{text:"values for each",italic:false,color:"white"},{text:" ",italic:false,color:"gray"},{text:"Tasks.",italic:false,color:"gold"}],["",{text:"Find out which actions pay off",italic:false,color:"gray"}],["",{text:"the most!",italic:false,color:"gray"}],[""],["",{text:"Click to view!",italic:false,color:"yellow"}]]]