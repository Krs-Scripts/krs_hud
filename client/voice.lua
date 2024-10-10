local VoiceSystem = {
    service = Config.VoiceSystem,
    voiceCon = nil,
    voiceDisc = nil,
    isTalking = false,
    isSilent = true,
    mode = nil,
}

function Voice()
    local self = VoiceSystem
    print(VoiceSystem)

    if self.service == 'pma-voice' then
        self.voiceCon = MumbleIsConnected()
        self.isTalking = NetworkIsPlayerTalking(cache.playerId)
    elseif self.service == 'saltychat' and self.voiceCon > 0 then
        self.isTalking = NetworkIsPlayerTalking(cache.playerId)
    end

    if (self.service == 'pma-voice' and self.voiceCon) or (self.service == 'saltychat' and self.voiceCon > 0) then
        if self.isTalking then
            self.isSilent = false
        elseif not self.isSilent then
            self.isSilent = true
        end
        self.voiceDisc = false
    elseif not self.voiceDisc then
        self.isSilent = nil
        self.voiceDisc = true
    end

    if self.service == 'pma-voice' then
        AddEventHandler('pma-voice:setTalkingMode', function(mode)
            self.mode = mode
        end)
    elseif self.service == 'saltychat' then
        AddEventHandler('SaltyChat_TalkStateChanged', function(_isTalking)
            self.isTalking = _isTalking
        end)
        AddEventHandler('SaltyChat_VoiceRangeChanged', function(range, index, count)
            self.mode = index
        end)
    end

    return self
end
