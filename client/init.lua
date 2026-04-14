local logger = require 'shared.logger'

local started = false

local function safeStartHUD()
    if started then return end 
    started = true

    logger.info('Starting HUD...')

    startHUD()

    loadMinimap(HUD_VISIBLE)

    exports.qbx_core:Notify('HUD avviato', 'success', 3000)
end

RegisterNetEvent("QBCore:Client:OnPlayerLoaded", function()
    Wait(1000)
    safeStartHUD()
end)

RegisterNetEvent('qbx_core:client:playerLoaded', function()
    Wait(1000)
    safeStartHUD()
end)

AddEventHandler('onResourceStart', function(resourceName)
    if GetCurrentResourceName() ~= resourceName then return end
    Wait(1000)
    safeStartHUD()
end)