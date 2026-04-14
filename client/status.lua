local logger = require 'shared.logger'

local isHudActive = false

local function buildStatus(state)
    isHudActive = state

    CreateThread(function()
        local lastUpdate = 0

        while isHudActive do
            local now = GetGameTimer()

            if now - lastUpdate >= 1000 then
                lastUpdate = now

                local ped = cache.ped
                local playerId = cache.playerId

                local health = math.max(0, GetEntityHealth(ped) - 100)
                local armor = GetPedArmour(ped)
                local stamina = 100 - GetPlayerSprintStaminaRemaining(playerId)

                local oxygen = 0
                local underwater = IsPedSwimmingUnderWater(ped)

                if underwater then
                    local oxygenRaw = GetPlayerUnderwaterTimeRemaining(playerId) * 10
                    oxygen = math.floor(math.max(0, oxygenRaw))
                end

                local inVehicle = cache.vehicle and cache.vehicle ~= 0
                local isJumping = IsPedJumping(ped)

                local hunger = LocalPlayer.state.hunger or 100
                local thirst = LocalPlayer.state.thirst or 100
                local stress = LocalPlayer.state.stress or 0

                local civic = GetCivic and tostring(GetCivic()) or "N/A"

                KRS_HUD.message('updateStatus', {
                    health = health,
                    armor = armor,
                    stamina = stamina,
                    oxygen = oxygen,
                    isUnderwater = underwater,
                    inVehicle = inVehicle,
                    isJumping = isJumping,
                    hunger = hunger,
                    thirst = thirst,
                    stress = stress,
                    civId = civic
                })
            end

            Wait(500)
        end
    end)
end

CreateThread(function()
    local lastShot = 0

    while true do
        local ped = cache.ped

        if IsPedShooting(ped) then
            local now = GetGameTimer()

            if now - lastShot > Config.WeaponStress.cooldown then
                lastShot = now

                local weapon = GetSelectedPedWeapon(ped)

                print('[HUD] Shooting with weapon hash:', weapon)

                local roll = math.random(100)

                if roll <= Config.WeaponStress.chance then
                    TriggerServerEvent('hud:server:addStress', {
                        weapon = weapon
                    })
                end
            end

            Wait(5) 
        else
            Wait(250) 
        end
    end
end)

CreateThread(function()
    Wait(1000)
    buildStatus(true)
end)