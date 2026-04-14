local currResourceName = GetCurrentResourceName()
local template = ("^5[%s] %%s %%s^7"):format(currResourceName)

local jsonOptions = {
    sort_keys = true,
    indent = false 
}

---@param prefix string
---@param forcePrint boolean
local function log(prefix, forcePrint, ...)
    
    local isDebug = true
    if Config and type(Config.Debug) ~= "nil" then
        isDebug = Config.Debug
    end

    if not isDebug and not forcePrint then return end

    local count = select('#', ...)
    if count == 0 then return end

    local args = {}

    for i = 1, count do
        local arg = select(i, ...)

        if type(arg) == "table" then
            local success, result = pcall(json.encode, arg, jsonOptions)
            args[i] = success and result or "[invalid table]"
        else
            args[i] = tostring(arg)
        end
    end

    local message = count == 1 and args[1] or table.concat(args, "\t")

    print(template:format(prefix, message))
end

---@class Logger
local Logger = {}

-- TRUE = Always print (Errors and Warnings)
function Logger.error(...) log("^1[ERROR]", true, ...) end
function Logger.warn(...) log("^3[WARN]", true, ...) end

-- FALSE = Only print if Config.Debug is true (Info, Verbose, Debug)
function Logger.info(...) log("^7[INFO]", false, ...) end
function Logger.verbose(...) log("^4[VERBOSE]", false, ...) end
function Logger.debug(...) log("^6[DEBUG]", false, ...) end

return Logger