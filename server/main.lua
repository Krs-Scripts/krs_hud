local logger = require 'shared.logger'
local config = require 'shared.config'

RegisterNetEvent('hud:server:addStress', function(data)
    local src = source

    if type(data) ~= 'table' or type(data.weapon) ~= 'number' then
        logger.warn('Exploit attempt (stress)', src)
        return
    end

    local player = exports.qbx_core:GetPlayer(src)
    if not player then return end

    local weaponHash = data.weapon
    local weaponName = tostring(weaponHash)

    for k, v in pairs(config.WeaponStress.weapons) do
        if k == weaponHash then
            weaponName = k
        end
    end

    print(('[HUD] Player %s used weapon: %s (%s)'):format(src, weaponName, weaponHash))

    local amount = config.WeaponStress.weapons[weaponHash]
    if not amount then 
        print('[HUD] Weapon not configured for stress:', weaponHash)
        return 
    end

    local stress = player.PlayerData.metadata.stress or 0
    local newStress = math.min(100, stress + amount)

    player.Functions.SetMetaData('stress', newStress)

    logger.debug(('Stress updated %s -> %s'):format(stress, newStress))
end)

RegisterNetEvent('hud:server:requestPlayerInfo', function()
    local src = source
    if not src then return end

    logger.debug('[HUD] Request player info from:', src)

    local player = exports.qbx_core:GetPlayer(src)
    if not player then
        logger.warn('[HUD] Player not found:', src)
        return
    end

    local money = player.PlayerData.money or {}

    logger.debug('[HUD] Money data:', money)

    TriggerClientEvent('hud:client:setPlayerInfo', src, {
        bank = money.bank or 0
    })
end)