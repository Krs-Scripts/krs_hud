local isSettingMenuOpen = false
local isCinematicActive = false

local function DisableControls()
    DisableControlAction(0, 1, true)  -- Mouse X
    DisableControlAction(0, 2, true)  -- Mouse Y
    DisableControlAction(0, 24, true) -- Attack
    DisableControlAction(0, 25, true) -- Aim
end

local function EnableControls()
    EnableControlAction(0, 1, true)  -- Mouse X
    EnableControlAction(0, 2, true)  -- Mouse Y
    EnableControlAction(0, 24, true) -- Attack
    EnableControlAction(0, 25, true) -- Aim
end

local function closeSettingMenu()
    SetNuiFocus(false, false)
    EnableControls()
    FreezeEntityPosition(cache.ped, false)

    SendNUIMessage({
        action = 'hide_menu'
    })
    isSettingMenuOpen = false
end

local function openSettingMenu()
    SetNuiFocus(true, true)
    SetNuiFocusKeepInput(true)
    FreezeEntityPosition(cache.ped, true)

    SendNUIMessage({
        action = 'show_menu',
        isVisible = true
    })

    SetGameplayCamRelativeHeading(0)
    DisableControls()

    isSettingMenuOpen = true
end

local keybind = lib.addKeybind({
    name = 'openHud',
    description = 'Open Hud Settings',
    defaultKey = 'I',
    onPressed = function(self)
        openSettingMenu()
    end,
})

CreateThread(function()
    while true do
        Wait(0)
        if isSettingMenuOpen then
            DisableControls()
        end
    end
end)

local function openCinematicMenu()
    SetNuiFocus(true, true)
    SendNUIMessage({
        action = "showCinematic",
        isVisible = true
    })
    isCinematicActive = true
end

local function closeCinematicMenu()
    SetNuiFocus(true, true)
    SendNUIMessage({
        action = "hideCinematic"
    })
    isCinematicActive = false
end

RegisterNuiCallback('hide_menu', function(data, cb)
    closeSettingMenu()
    cb('ok')
end)

RegisterNuiCallback('activeCinematic', function(data, cb)
    openCinematicMenu()
    DisplayRadar(false)
    cb('ok')
end)

RegisterNuiCallback('disableCinematic', function(data, cb)
    closeCinematicMenu()
    DisplayRadar(true)
    cb('ok')
end)

RegisterNuiCallback('showRadar', function(data, cb)
    DisplayRadar(true)
    cb('ok')
end)

RegisterNuiCallback('hideRadar', function(data, cb)
    DisplayRadar(false)
    cb('ok')
end)
