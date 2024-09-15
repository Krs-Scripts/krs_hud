local function ShowSpeedometer(isMetric, speed)
    SendNUIMessage({
        action = "show",
        isMetric = isMetric,
        speed = speed,
    })
end


local function HideSpeedometer()
    SendNUIMessage({
        action = "hide"
    })
end

local function MainThread()
    CreateThread(function()
        while true do
            if cache.vehicle then
                local speed = GetEntitySpeed(cache.vehicle)
                ShowSpeedometer(ShouldUseMetricMeasurements(), speed)
            else
                HideSpeedometer()
            end
            Wait(200)
        end
    end)
end

CreateThread(MainThread)