local logger = require 'shared.logger'

if not Config.InfoPlayer.enabled then return end

local last = {}
local serverBank = 0

---@param prox table
---@return string
local function getVoiceLevel(prox)
    if not prox then return "Unknown" end

    if prox.mode then
        if prox.mode == "whisper" then
            return "Close"
        elseif prox.mode == "normal" then
            return "Medium"
        elseif prox.mode == "shout" then
            return "Far"
        end

        return prox.mode
    end

    local distance = prox.distance or 0

    if distance <= 3.0 then
        return "Close"
    elseif distance <= 8.0 then
        return "Medium"
    else
        return "Far"
    end
end

---@param data table
local function sendInfo(data)
    if last.money == data.money and
       last.bank == data.bank and
       last.blackMoney == data.blackMoney and
       last.jobName == data.jobName and
       last.micActive == data.micActive and
       last.voiceLevel == data.voiceLevel then
        return
    end

    last = data

    KRS_HUD.message('updateInfoPlayer', data)
end

local function getMoney()
    local cash, black = 0, 0

    if Config.InfoPlayer.money.useCash then
        local count = exports.ox_inventory:Search('count', Config.InfoPlayer.money.cashItem)
        cash = count or 0
    end

    if Config.InfoPlayer.money.useBlackMoney then
        local count = exports.ox_inventory:Search('count', Config.InfoPlayer.money.blackMoneyItem)
        black = count or 0
    end

    return cash, black
end

if Config.InfoPlayer.bank.enabled and Config.InfoPlayer.money.useBank then
    CreateThread(function()
        while true do
            TriggerServerEvent('hud:server:requestPlayerInfo')
            Wait(Config.InfoPlayer.bank.refreshInterval)
        end
    end)
end

CreateThread(function()
    while true do
        Wait(Config.InfoPlayer.updateInterval)

        local PlayerData = QBX.PlayerData
        local jobName = Config.InfoPlayer.job.fallback

        if PlayerData and PlayerData.job then
            jobName = PlayerData.job.label or PlayerData.job.name or jobName
        end

        local cash, black = getMoney()
        local prox = LocalPlayer.state['proximity']

        local data = {
            playerId = GetPlayerServerId(cache.playerId),
            micActive = NetworkIsPlayerTalking(cache.playerId),
            talking = NetworkIsPlayerTalking(cache.playerId),
            voiceLevel = getVoiceLevel(prox),
            jobName = jobName,
            serverName = Config.InfoPlayer.serverName,
            subName = Config.InfoPlayer.subName,
            logo = Config.InfoPlayer.logo,
            money = Config.InfoPlayer.money.useCash and cash or 0,
            bank = (Config.InfoPlayer.money.useBank and Config.InfoPlayer.bank.enabled) and serverBank or 0,
            blackMoney = Config.InfoPlayer.money.useBlackMoney and black or 0
        }

        sendInfo(data)
    end
end)

RegisterNetEvent('hud:client:setPlayerInfo', function(data)
    if not data then return end
    if data.bank ~= nil then 
        serverBank = data.bank
        last.bank = nil 
    end
end)

RegisterNetEvent('qbx_core:client:onJobUpdate', function(job)
    last.jobName = nil
end)