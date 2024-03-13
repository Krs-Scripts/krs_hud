
function modalitaCinemaOpen(data) 
    SendNUIMessage({
        type = 'cinema_open',
    })
    SetNuiFocus(true, true)
    SetCursorLocation(0.5, 0.5) 
end

RegisterNUICallback('chiudi', function(data)
    SetNuiFocus(false, false)
end)