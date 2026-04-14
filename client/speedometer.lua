local logger = require 'shared.logger'

local isActive = false
local lastFuelUpdate = 0
local alertThread = nil

local function playSound(file)
    KRS_HUD.message("playSound", file)
end

local function setVisible(bool)
    KRS_HUD.message('setShowSpeedometer', bool)
end

local function updateUI(data)
    KRS_HUD.message('updateSpeedometer', data)
end

local function startSeatbeltAlert()
    if not Config.Speedometer.seatbelt.enabled or not Config.Speedometer.seatbelt.sound then return end
    if alertThread then return end

    alertThread = CreateThread(function()
        while isActive and not (LocalPlayer.state.seatbelt or false) do
            playSound("SeatbeltAlertSound.mp3")
            Wait(1000)
        end
        alertThread = nil
    end)
end

local function getFuel(vehicle)
    local now = GetGameTimer()

    if now - lastFuelUpdate > 3000 then
        lastFuelUpdate = now

        if GetResourceState('krs_fuel') == 'started' then
            return exports['krs_fuel']:GetFuel(vehicle)
        elseif GetResourceState('cdn-fuel') == 'started' then
            return exports['cdn-fuel']:GetFuel(vehicle)
        elseif GetResourceState('ox_fuel') == 'started' then
            return Entity(vehicle).state.fuel or 100
        else
            return GetVehicleFuelLevel(vehicle)
        end
    end

    return nil
end

local function startSpeedometer(vehicle)
    if isActive then return end
    if not vehicle or vehicle == 0 or IsThisModelABicycle(vehicle) then return end

    isActive = true

    if Config.Debug then
        logger.info('Speedometer started')
    end

    setVisible(true)
    DisplayRadar(true)

    if Config.Speedometer.seatbelt.enabled and Config.Speedometer.seatbelt.sound then
        if LocalPlayer.state.seatbelt then
            playSound("SeatbeltOnSound.mp3")
        else
            playSound("SeatbeltOffSound.mp3")
            startSeatbeltAlert()
        end
    end

    CreateThread(function()
        local SLEEP = 1000

        while isActive do
            Wait(SLEEP)

            local veh = cache.vehicle
            if not veh then
                isActive = false
                break
            end

            local speed = GetEntitySpeed(veh)
            local isMPH = Config.Speedometer.unit == "MPH"
            local mult = isMPH and 2.236936 or 3.6
            local speedValue = math.floor(speed * mult + 0.5)

            if speed > 1.0 then
                SLEEP = 150
            else
                SLEEP = 800
            end

            local seatbelt = LocalPlayer.state.seatbelt or false

            updateUI({
                speed = speedValue,
                fuel = getFuel(veh),
                gear = GetVehicleCurrentGear(veh),
                engineOn = GetIsVehicleEngineRunning(veh),
                engineHealth = math.floor(GetVehicleEngineHealth(veh)),
                seatbeltOn = seatbelt,
                unit = isMPH and "MPH" or "KM/H"
            })

            if Config.Speedometer.seatbelt.enabled and Config.Speedometer.seatbelt.sound then
                if not seatbelt then
                    startSeatbeltAlert()
                end
            end
        end
    end)
end

local function stopSpeedometer()
    if not isActive then return end

    isActive = false

    if Config.Debug then
        logger.info('Speedometer stopped')
    end

    setVisible(false)
    DisplayRadar(false)

    if Config.Speedometer.seatbelt.enabled then
        LocalPlayer.state:set('seatbelt', false, true)
    end
end

RegisterNetEvent('QBCore:Client:VehicleInfo', function(data)
    if not data or not data.event then return end

    if data.event == 'Entered' then
        startSpeedometer(data.vehicle)
    elseif data.event == 'Left' then
        stopSpeedometer()
    end
end)

lib.onCache('vehicle', function(vehicle)
    if vehicle then
        startSpeedometer(vehicle)
    else
        stopSpeedometer()
    end
end)

CreateThread(function()
    Wait(1000)

    local veh = cache.vehicle
    if veh and veh ~= 0 then
        startSpeedometer(veh)
    end
end)