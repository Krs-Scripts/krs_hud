local hunger = 0
local thirst = 0
local nuotando = false

AddEventHandler('esx_status:onTick', function(data)
    local id = lib.callback.await('krs_hud:check', false, PlayerId()) 

 
    for i = 1, #data do
        if data[i].name == 'hunger' then
            hunger = data[i].val / 10000
        elseif data[i].name == 'thirst' then
            thirst = data[i].val / 10000
        end
    end

    nuotando = IsPedSwimming(cache.ped) 

    SendNUIMessage({
        message = 'update_hud',
        health = math.floor(GetEntityHealth(cache.ped) / 2), 
        hunger = math.floor(hunger),
        thirst = math.floor(thirst),
        armour = GetPedArmour(cache.ped),
        stamina = GetPlayerStamina(PlayerId()),
        oxygen = GetPlayerUnderwaterTimeRemaining(PlayerId()) * 10,
        voice = NetworkIsPlayerTalking(PlayerId()),
        attiva = nuotando,
        id = id,
    })
end)
