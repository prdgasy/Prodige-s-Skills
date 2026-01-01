scoreboard objectives add __variable__ dummy
say hello
scoreboard players set $a __variable__ 0
tellraw @a {"score":{"name":"$a","objective":"__variable__"}}