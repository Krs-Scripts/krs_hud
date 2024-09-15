AddEventHandler('esx:playerLoaded', function()
    local shouldShow = true
    local action = 'setVisibleMenu'

    SetNuiFocus(false, false)
    SendNUIMessage({ action = action, data = shouldShow })
    updateMap()
end)

AddEventHandler('esx:onPlayerSpawn', function()
    updateMap()
end)

local swimming = false
local underwater = false

AddEventHandler('esx_status:onTick', function(data)
    local hunger, thirst
    local oxygen = 100

    for i = 1, #data do
        local status = data[i]
        if status.name == 'thirst' then
            thirst = math.floor(status.percent)
        elseif status.name == 'hunger' then
            hunger = math.floor(status.percent)
        end
    end

    swimming = IsPedSwimming(cache.ped)
    underwater = IsPedSwimmingUnderWater(cache.ped)

    if underwater then
        oxygen = GetPlayerUnderwaterTimeRemaining(cache.playerId) * 10
    end

    SendNUIMessage({
        action = 'update_hud',
        health = math.ceil(GetEntityHealth(cache.ped) - 100),
        armor = math.ceil(GetPedArmour(cache.ped)),
        thirst = thirst,
        hunger = hunger,
        stress = stress,
        stamina = GetPlayerStamina(cache.playerId),
        oxygen = oxygen,
        active = swimming,
        isTalking = Voice().isTalking,
        microphone = Voice().mode,
    })
end)

function updateMap()
    -- Dichiarazioni delle variabili locali
    local x = -0.025
    local y = -0.040
    local w = 0.16
    local h = 0.20

    -- Caricamento della texture del minimap
    RequestStreamedTextureDict("circlemap", false)
    while not HasStreamedTextureDictLoaded("circlemap") do
        Wait(100)
    end

    lib.notify({
        title = 'Notification title',
        description = 'Square Map Loading...',
        type = 'info',
        position = 'top',
        style = {
            backgroundColor = '#141517',
            color = '#C1C2C5',
            ['.description'] = {
                color = '#909296'
            }
        },
        icon = 'fa-solid fa-spinner',
        iconColor = '#F8F9FA'
    })

    -- Impostazione del tipo di ritaglio per il minimap
    SetMinimapClipType(1)

    -- Sostituzione della texture del minimap
    AddReplaceTexture("platform:/textures/graphics", "radarmasksm", "circlemap", "radarmasksm")

    -- Impostazioni di posizione del minimap e dei suoi componenti
    SetMinimapComponentPosition('minimap', 'L', 'B', 0.0, y, w, h)
    SetMinimapComponentPosition('minimap_mask', 'L', 'B', x + 0.17, y + 0.09, 0.072, 0.162)
    SetMinimapComponentPosition('minimap_blur', 'L', 'B', -0.025, -0.065, 0.19, 0.22)

    -- Nascondere il blip del nord e disabilitare il bigmap
    SetBlipAlpha(GetNorthRadarBlip(), 0)
    SetRadarBigmapEnabled(true, false)
    Wait(50)
    SetRadarBigmapEnabled(false, false)

    lib.notify({
        title = 'Notification title',
        description = 'Square Map Has Loaded!',
        type = 'success',
        position = 'top',
        style = {
            backgroundColor = '#141517',
            color = '#C1C2C5',
            ['.description'] = {
                color = '#909296'
            }
        },
        icon = 'fa-solid fa-check',
        iconColor = '#28a745'
    })
end

function MainLoop()
    while true do
        SetRadarBigmapEnabled(false, false)
        SetRadarZoom(1000)
        Wait(500)
    end
end

CreateThread(MainLoop)
