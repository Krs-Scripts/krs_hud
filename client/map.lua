RegisterNetEvent('esx:playerLoaded')
AddEventHandler('esx:playerLoaded',function()
    SendNUIMessage({ message = "update_voice", livellovoce = 1 })
    SetRadarZoom(1200)
end)

RegisterNetEvent('esx:onPlayerSpawn')
AddEventHandler('esx:onPlayerSpawn', function()
    SetRadarZoom(1200)
end)

CreateThread(function()
    Wait(50)
    local aspettoPredefinito = 1920 / 1080 
    local risoluzioneX, risoluzioneY = GetActiveScreenResolution()
    local proporzioni = risoluzioneX / risoluzioneY
    local minimappa = 0
    if proporzioni > aspettoPredefinito then
        minimappa = ((aspettoPredefinito - proporzioni) / 3.6) - 0.008
    end
    RequestStreamedTextureDict("squaremap", false)
    while not HasStreamedTextureDictLoaded("squaremap") do
        Wait(150)
    end
    SetMinimapClipType(0)
    AddReplaceTexture("platform:/textures/graphics", "radarmasksm", "squaremap", "radarmasksm")
    AddReplaceTexture("platform:/textures/graphics", "radarmask1g", "squaremap", "radarmasksm")

    SetMinimapComponentPosition("minimap", "L", "B", 0.0 + minimappa, -0.047, 0.1538, 0.183)

    SetMinimapComponentPosition("minimap_mask", "L", "B", 0.0 + minimappa, 0.0, 0.128, 0.20)

    SetMinimapComponentPosition('minimap_blur', 'L', 'B', -0.01 + minimappa, 0.010, 0.245, 0.300)
    SetBlipAlpha(GetNorthRadarBlip(), 0)
    SetRadarBigmapEnabled(true, false)
    SetMinimapClipType(0)
    Wait(50)
    SetRadarBigmapEnabled(false, false)
    Wait(1200)
end)
