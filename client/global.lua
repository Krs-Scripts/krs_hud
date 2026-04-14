local logger = require 'shared.logger'

KRS_HUD = {}

local hudState = true
local hudInitialized = false

---@param action string
---@param data any
KRS_HUD.message = function(action, data)
    SendNUIMessage({
        action = action,
        data = data,
    })
end

---@param state boolean?
KRS_HUD.toggle = function(state)
    if state == nil then
        hudState = not hudState
    else
        hudState = state
    end

    logger.debug("(KRS_HUD:toggle) HUD state:", hudState)
    KRS_HUD.message("setVisible", hudState)
end

exports("toggleHud", function(state)
    KRS_HUD.toggle(state)
end)

RegisterCommand('hud', function()
    KRS_HUD.toggle()
    logger.info("Comando /hud eseguito")
end, false)

---@param state boolean
function globalHud(state)
    if hudInitialized == state then return end
    hudInitialized = state

    logger.info('HUD visibility changed:', state)

    SetNuiFocus(false, false)

    KRS_HUD.message('setVisible', state)
    KRS_HUD.message('setShowStatus', state)
    KRS_HUD.message('setShowInfoPlayer', state)
end

function startHUD()
    logger.info('startHUD executed')

    CreateThread(function()
        Wait(300)
        globalHud(true)
    end)
end