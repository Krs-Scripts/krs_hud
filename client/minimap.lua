local logger = require 'shared.logger'

DisableComponentHud = {
    { name = "WANTED_STARS",         index = 1 },
    { name = "WEAPON_ICON",          index = 2 },
    { name = "CASH",                 index = 3 },
    { name = "MP_CASH",              index = 4 },
    { name = "MP_MESSAGE",           index = 5 },
    { name = "VEHICLE_NAME",         index = 6 },
    { name = "AREA_NAME",            index = 7 },
    { name = "VEHICLE_CLASS",        index = 8 },
    { name = "STREET_NAME",          index = 9 },
    { name = "HELP_TEXT",            index = 10 },
    { name = "FLOATING_HELP_TEXT_1", index = 11 },
    { name = "FLOATING_HELP_TEXT_2", index = 12 },
    { name = "CASH_CHANGE",          index = 13 },
    { name = "SUBTITLE_TEXT",        index = 15 },
    { name = "SAVING_GAME",          index = 17 },
    { name = "GAME_STREAM",          index = 18 },
    { name = "W_WHEEL",              index = 19 },
    { name = "W_WHEEL_STATS",        index = 20 },
    { name = "HUD_COMPONENTS",       index = 21 },
}

local minimapInitialized = false

local function bigmapFromActive()
    logger.debug('(bigmapFromActive) started')

    local timeout = 0
    while timeout < 10000 do
        SetBigmapActive(false, false)
        SetRadarZoom(1100)
        timeout += 1000
        Wait(1000)
    end

    logger.debug('(bigmapFromActive) finished')
end

---@param state boolean
function loadMinimap(state)
    logger.info('Loading minimap, state:', state)

    if minimapInitialized then return end

    for _, component in ipairs(DisableComponentHud) do
        if component.index then
            SetHudComponentPosition(component.index, 999999.0, 999999.0)
        end
    end

    DisplayRadar(finalState)

    local defaultAspectRatio = 1920 / 1080
    local resolutionX, resolutionY = GetActiveScreenResolution()
    local aspectRatio = resolutionX / resolutionY
    local minimapOffset = 0

    if aspectRatio > defaultAspectRatio then
        minimapOffset = ((defaultAspectRatio - aspectRatio) / 3.6) - 0.008
    end

    if not lib.requestStreamedTextureDict("squaremap", 10000) then
        logger.error("Errore critico: Impossibile caricare 'squaremap'")
        return
    end

    SetMinimapClipType(0)
    AddReplaceTexture("platform:/textures/graphics", "radarmasksm", "squaremap", "radarmasksm")
    AddReplaceTexture("platform:/textures/graphics", "radarmask1g", "squaremap", "radarmasksm")

    SetMinimapComponentPosition("minimap", "L", "B", 0.0 + minimapOffset, -0.057, 0.1638, 0.183)
    SetMinimapComponentPosition("minimap_mask", "L", "B", 0.0 + minimapOffset, -0.01, 0.128, 0.20)
    SetMinimapComponentPosition("minimap_blur", "L", "B", -0.01 + minimapOffset, 0.015, 0.262, 0.300)

    SetBlipAlpha(GetNorthRadarBlip(), 0)

    SetRadarBigmapEnabled(true, false)
    Wait(50)
    SetRadarBigmapEnabled(false, false)

    CreateThread(bigmapFromActive)

    minimapInitialized = true
    logger.info('Minimap caricata e inizializzata correttamente')
end