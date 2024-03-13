local cintura = false

local function ShowSpeedometer(isMetric, speed, rpm, gear, fuel, nos)

    SendNUIMessage({
        action = "show",
        isMetric = isMetric,
        speed = speed,
        rpm = rpm,
        gear = gear,
        fuel = fuel,
        nos = nos,
        cintura = cintura
    })

end

local function HideSpeedometer()

    SendNUIMessage({
        action = "hide"
    })

end

Citizen.CreateThread(function()
    while true do

        if GetIsVehicleEngineRunning(cache.vehicle) then
            Wait(200)
            local speed = GetEntitySpeed(cache.vehicle)
            local rpm = GetVehicleCurrentRpm(cache.vehicle)
            local gear = GetVehicleCurrentGear(cache.vehicle)
            local fuel = GetVehicleFuelLevel(cache.vehicle)

            ShowSpeedometer(ShouldUseMetricMeasurements(), speed, rpm, gear, fuel, nos)

            SetRadarBigmapEnabled(false, false)
            SetRadarZoom(1000)
        else
            HideSpeedometer()
            Wait(1000)
        end
    end
end)


local function UpdateBelt()
        Citizen.CreateThread(function()
            while true do
                Citizen.Wait(2)
                if cintura then
                DisableControlAction(0, 75, true)
            end
        end 
    end)
end

local keybind = lib.addKeybind({
    name = 'cintura',
    description = 'Press K to activate belt',
    defaultKey = 'K',
    onPressed = function()

        if IsPedInAnyVehicle(cache.ped, true) then

            if GetVehicleClass(cache.vehicle) ~= 8
                and GetVehicleClass(cache.vehicle) ~= 13
                and GetVehicleClass(cache.vehicle) ~= 14
                and GetVehicleClass(cache.vehicle) ~= 15
                and GetVehicleClass(cache.vehicle) ~= 16 then

                cintura = not cintura

                -- print("Cintura: " .. tostring(cintura))

                if cintura then
                    UpdateBelt()
                    playSound('buckle', 0.9)
                    lib.notify({
                        id = 'krs_hud_notify',
                        title = 'Krs Hud',
                        description = 'Cintura Abilitata',
                        position = 'bottom',
                        style = {
                            backgroundColor = '#141517',
                            color = '#C1C2C5',
                            ['.description'] = {
                            color = '#909296'
                            }
                        },
                        icon = 'fas fa-compress-alt',
                        iconColor = '#0CA678'
                    })
                elseif not cintura then
                    playSound('unbuckle', 0.9)
                    SetFlyThroughWindscreenParams(16.0, 19.0, 17.0, 2000.0)
                    lib.notify({
                        id = 'krs_hud_notify',
                        title = 'Krs Hud',
                        description = 'Cintura Disabilitata',
                        position = 'bottom',
                        style = {
                            backgroundColor = '#141517',
                            color = '#C1C2C5',
                            ['.description'] = {
                            color = '#909296'
                            }
                        },
                        icon = 'fas fa-compress-alt',
                        iconColor = '#F03E3E'
                    })
                end
            end
        end
    end,
})


function playSound(f, v)

    SendNUIMessage({
        type = 'playSound',
        file = f,
        volume = v
    })

end