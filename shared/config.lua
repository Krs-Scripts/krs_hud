---@class WeaponStressConfig
---@field weapons table<number, number>

Config = {}

Config.Debug = false 


Config.Speedometer = {
    unit = "KMH",
    seatbelt = {
        enabled = true,
        sound = false,
    }
}

Config.InfoPlayer = {
    enabled = true,
    serverName = "SERVER NAME",
    subName = "ROLEPLAY",
    logo = "nui://krs_hud/web/images/logo.png",
    updateInterval = 1000, 
    money = {
        useCash = true,
        useBank = true,
        useBlackMoney = true,
        cashItem = "money",
        blackMoneyItem = "black_money",
    },
    bank = {
        enabled = true,
        refreshInterval = 5000 
    },
    job = {
        fallback = "Unemployed"
    }
}

Config.WeaponStress = {
    weapons = {
        [`WEAPON_PISTOL`] = 2,
        [`WEAPON_COMBATPISTOL`] = 2,
        [`WEAPON_CARBINERIFLE`] = 3,
        [`WEAPON_ASSAULTRIFLE`] = 3,
        [`WEAPON_SNIPERRIFLE`] = 5,
    },
    chance = 70,     
    cooldown = 800,   
}

return Config