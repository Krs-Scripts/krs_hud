fx_version 'cerulean'
game 'gta5'
lua54 'yes'

name 'krs_hud'
author 'karos7804'
version '1.0.1'

shared_scripts {

    '@es_extended/imports.lua',
	'@ox_lib/init.lua',
}

client_scripts {

    'client/*.lua'
}

server_scripts {
    
    'server/*.lua'
}

ui_page 'ui/index.html'

files{
    'ui/style.css',
    'ui/script.js',
    'ui/index.html',
    'ui/logo.png',
    'ui/sounds/*.ogg',
}