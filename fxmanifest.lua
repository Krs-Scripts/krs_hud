fx_version 'cerulean'
game 'gta5'
lua54 'yes'
name "krs_hud"
description "React + Mantine"
author "Krs Scripts - karos7804"
version "1.0.0"

shared_scripts {
    '@ox_lib/init.lua',
    '@qbx_core/modules/lib.lua',
    'shared/logger.lua',
    'shared/config.lua'
}

client_scripts {
    '@qbx_core/modules/playerdata.lua',
    'client/global.lua',  
    'client/civic.lua',  
    'client/minimap.lua',
    'client/init.lua',
    'client/status.lua',
    'client/speedometer.lua',
    'client/info.lua'
}

server_scripts {
    'server/main.lua'
}

ui_page "web/build/index.html"

files {
    "web/build/index.html",
    "web/build/**/*",
    "web/images/*.png",
    "web/sound/*.mp3"
}