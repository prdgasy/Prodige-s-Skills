scoreboard objectives add skills.__variable__ dummy
scoreboard objectives add skills.__int__ dummy
scoreboard players set 2 skills.__int__ 2
scoreboard players set 100 skills.__int__ 100
scoreboard players set 5 skills.__int__ 5
scoreboard players set 4 skills.__int__ 4
scoreboard players set 10 skills.__int__ 10
scoreboard players set 12 skills.__int__ 12
scoreboard players set 15 skills.__int__ 15
scoreboard players set 21 skills.__int__ 21
scoreboard objectives add prodiges_skills.id dummy
scoreboard objectives add prodiges_skills.page dummy
scoreboard objectives add Skills trigger
forceload add 930005 930005
setblock 930005 0 930005 yellow_shulker_box
data modify storage prodiges_skills:prodiges_skills Gui.Pages set value ["main","progress","boosters","skills","tasks","itemshop","prestige","preferences","shop","tasks"]
data modify storage prodiges_skills:prodiges_skills Gui.PagesNumber set value 10
data modify storage prodiges_skills:prodiges_skills exploitFilter.Objects set value ["sand","gravel","clay","dirt","coarse_dirt","podzol","mud","rooted_dirt","grass_block","mycelium","soul_sand","soul_soil","stone","granite","andesite","diorite","tuff","deepslate","sandstone","red_sandstone","dripstone_block","calcite","blackstone","basalt","netherrack","end_stone","sculk","sculk_vein","sculk_catalyst","sculk_shrieker","sculk_sensor","coal_ore","deepslate_coal_ore","iron_ore","deepslate_iron_ore","copper_ore","deepslate_copper_ore","gold_ore","deepslate_gold_ore","redstone_ore","deepslate_redstone_ore","lapis_ore","deepslate_lapis_ore","diamond_ore","deepslate_diamond_ore","emerald_ore","deepslate_emerald_ore","nether_quartz_ore","nether_gold_ore","ancient_debris","wheat","carrot","potato","beetroot","melon","pumpkin","sweet_berry_bush","mushroom","cocoa_beans","melon_slice","apple","oak_log","birch_log","spruce_log","jungle_log","acacia_log","dark_oak_log","crimson_stem","warped_stem"]
function prodiges_skills:exploitfilter/createscore
function prodiges_skills:config/skills
function prodiges_skills:config/rewards
function prodiges_skills:config/specialitems
function prodiges_skills:config/crate
data modify storage prodiges_skills:prodiges_skills romanConverter.Numbers set value {0:"§c-",1:"I",2:"II",3:"III",4:"IV",5:"V",6:"VI",7:"VII",8:"VIII",9:"IX",10:"X",11:"XI",12:"XII",13:"XIII",14:"XIV",15:"XV",16:"XVI",17:"XVII",18:"XVIII",19:"XIX",20:"XX",21:"XXI",22:"XXII",23:"XXIII",24:"XXIV",25:"XXV",26:"XXVI",27:"XXVII",28:"XXVIII",29:"XXIX",30:"XXX",31:"XXXI",32:"XXXII",33:"XXXIII",34:"XXXIV",35:"XXXV",36:"XXXVI",37:"XXXVII",38:"XXXVIII",39:"XXXIX",40:"XL",41:"XLI",42:"XLII",43:"XLIII",44:"XLIV",45:"XLV",46:"XLVI",47:"XLVII",48:"XLVIII",49:"XLIX",50:"L",51:"LI",52:"LII",53:"LIII",54:"LIV",55:"LV",56:"LVI",57:"LVII",58:"LVIII",59:"LIX",60:"LX",61:"LXI",62:"LXII",63:"LXIII",64:"LXIV",65:"LXV",66:"LXVI",67:"LXVII",68:"LXVIII",69:"LXIX",70:"LXX",71:"LXXI",72:"LXXII",73:"LXXIII",74:"LXXIV",75:"LXXV",76:"LXXVI",77:"LXXVII",78:"LXXVIII",79:"LXXIX",80:"LXXX",81:"LXXXI",82:"LXXXII",83:"LXXXIII",84:"LXXXIV",85:"LXXXV",86:"LXXXVI",87:"LXXXVII",88:"LXXXVIII",89:"LXXXIX",90:"XC",91:"XCI",92:"XCII",93:"XCIII",94:"XCIV",95:"XCV",96:"XCVI",97:"XCVII",98:"XCVIII",99:"XCIX",100:"C"}
function prodiges_skills:player/schedule/wait1s
function prodiges_skills:player/schedule/wait5s
function prodiges_skills:player/schedule/wait10s
function prodiges_skills:player/schedule/wait1m
scoreboard objectives add prodiges_skills.booster.1.power dummy
scoreboard objectives add prodiges_skills.booster.1.duration dummy
scoreboard objectives add prodiges_skills.booster.2.power dummy
scoreboard objectives add prodiges_skills.booster.2.duration dummy
scoreboard objectives add prodiges_skills.crate.cooldown dummy
say Loaded