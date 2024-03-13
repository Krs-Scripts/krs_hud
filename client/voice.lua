

AddEventHandler("onResourceStart", function(resourceName)
    if not resourceName == "krs_hud" then
        return
    end
    Wait(1000)
    SendNUIMessage({ message = "update_voice", livellovoce = 1 })
    SetRadarZoom(1200)
end)

AddEventHandler("pma-voice:setTalkingMode", function(val)
    SendNUIMessage({ message = "update_voice", livellovoce = val})
    lib.notify({
        id = 'some_identifier',
        title = 'Notifica Voice',
        description = 'Range impostato a ' .. tostring(val) .. ' metri',
        position = 'top',
        style = {
            backgroundColor = '#141517',
            color = '#C1C2C5',
            ['.description'] = {
              color = '#909296'
            }
        },
        icon = 'fa-solid fa-microphone',
        iconColor = '#F8F9FA'
    })
end)