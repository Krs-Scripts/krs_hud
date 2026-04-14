import { Box, Group, Stack, Text, Image } from "@mantine/core";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HiFingerPrint } from "react-icons/hi"; 
import { RiVoiceprintLine } from "react-icons/ri"; 
import { FaUserGraduate } from "react-icons/fa"; 
import { BsFillPiggyBankFill } from "react-icons/bs";
import { GiMoneyStack } from "react-icons/gi"; 
import { TbMoneybag } from "react-icons/tb"; 
import { useNuiEvent } from "../hooks/useNuiEvent";

interface InfoProps {
  customColor?: string;
}

export default function InfoPlayer({ customColor = "white" }: InfoProps) {
  const [visible, setVisible] = useState(true);
  const [hasAnimated, setHasAnimated] = useState(false); 

  const [playerId, setPlayerId] = useState("0");
  const [micActive, setMicActive] = useState(false); 
  const [voiceLevel, setVoiceLevel] = useState("Unknown");
  const [talking, setTalking] = useState(false);

  const [jobName, setJobName] = useState("Unemployed");
  const [serverName, setServerName] = useState("SERVER NAME");
  const [subName, setSubName] = useState("ROLEPLAY");
  const [logo, setLogo] = useState<string | null>(null);
  const [money, setMoney] = useState(0); 
  const [bank, setBank] = useState(0); 
  const [blackMoney, setBlackMoney] = useState(0); 

  useEffect(() => {
    if (visible && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [visible]);

  useNuiEvent<boolean>("setShowInfoPlayer", (data) => {
    setVisible(data);
  });

  useNuiEvent("updateInfoPlayer", (data: any) => {
    if (!data) return; 

    setPlayerId(String(data.playerId ?? 0));
    setMicActive(!!data.micActive);
    setVoiceLevel(data.voiceLevel ?? "Unknown");
    setTalking(!!data.talking);
    setJobName(data.jobName ?? "Unemployed");
    setServerName(data.serverName ?? "SERVER NAME");
    setSubName(data.subName ?? "ROLEPLAY");
    setLogo(data.logo ?? null);
    setMoney(data.money ?? 0);
    setBank(data.bank ?? 0);
    setBlackMoney(data.blackMoney ?? 0);
  });

  const boxSpringAnim = {
    type: "spring" as const,
    stiffness: 300,
    damping: 18,
    mass: 1
  };

  const bubbleFont = "'Fredoka', sans-serif";

  const formatMoney = (value: number | string) => {
    const num = typeof value === "string" ? parseFloat(value.replace(/[^0-9.-]+/g, "")) : value;
    if (isNaN(num)) return "0 $";
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + " mld $"; 
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + " mln $"; 
    if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K $"; 
    return num.toString() + " $"; 
  };

  const AnimatedBox = ({ children, delay }: { children: React.ReactNode, delay: number }) => (
    <motion.div
      initial={!hasAnimated ? { scaleX: 0, opacity: 0 } : false}
      animate={{ scaleX: 1, opacity: 1 }}
      transition={!hasAnimated ? { ...boxSpringAnim, delay } : { duration: 0 }}
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.4)", 
        padding: "6px 12px",
        borderRadius: 8, 
        display: "flex",
        alignItems: "center",
        gap: "8px",
        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.4)",
        transformOrigin: "right", 
      }}
    >
      {children}
    </motion.div>
  );

  if (!visible) return null;

  return (
    <Box p={10} style={{ position: "absolute", top: 5, right: 20 }}>
      <Stack gap={10} align="flex-end">

        <Group gap="md" align="center" wrap="nowrap">
          <motion.div
            initial={!hasAnimated ? { opacity: 0, x: 20 } : false}
            animate={{ opacity: 1, x: 0 }}
            transition={!hasAnimated ? { duration: 0.5, delay: 0.1 } : { duration: 0 }}
          >
            <Stack gap={0} align="flex-end">
              <Text c={customColor} fw={900} size="lg" lh={1} style={{ letterSpacing: 0.5, fontFamily: bubbleFont }}>
                {serverName}
              </Text>
              <Text c="#aaaaaa" fw={500} size="sm" lh={1.2} style={{ letterSpacing: 0.5, fontFamily: bubbleFont }}>
                {subName}
              </Text>
            </Stack>
          </motion.div>

          <motion.div
            initial={!hasAnimated ? { scale: 0 } : false}
            animate={{ scale: 1 }}
            transition={!hasAnimated ? { ...boxSpringAnim, delay: 0.2 } : { duration: 0 }}
            style={{
              width: 70,
              height: 70,
              overflow: "hidden",
              borderRadius: 8
            }}
          >
            <img
              src={logo && logo !== "null" ? logo : "nui://krs_hud/web/images/logo.png"}
              alt="Logo"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </motion.div>
        </Group>

        <Group gap="sm" align="center" wrap="nowrap"> 
          <AnimatedBox delay={0}>
            <FaUserGraduate color={customColor} size={16} />
            <Text c="white" fw={800} size="sm" tt="uppercase" style={{ fontFamily: bubbleFont }}>{jobName}</Text>
          </AnimatedBox>

          <AnimatedBox delay={0.1}>
            <HiFingerPrint color={customColor} size={18} />
            <Text c="white" fw={700} size="sm" style={{ fontFamily: bubbleFont }}>{playerId}</Text>
          </AnimatedBox>

          <AnimatedBox delay={0.2}>
            <RiVoiceprintLine 
              color={micActive ? (talking ? "#4ade80" : customColor) : "#555555"} 
              size={18} 
            />
            <Text c="white" fw={700} size="sm" style={{ fontFamily: bubbleFont }}>
              {micActive ? voiceLevel : "OFF"}
            </Text>
          </AnimatedBox>
        </Group>

        <Group gap="sm" align="center" wrap="nowrap"> 
          <AnimatedBox delay={0.3}>
            <GiMoneyStack color={customColor} size={18} />
            <Text c="white" fw={700} size="sm" style={{ fontFamily: bubbleFont }}>{formatMoney(money)}</Text>
          </AnimatedBox>
          <AnimatedBox delay={0.4}>
            <BsFillPiggyBankFill color={customColor} size={18} />
            <Text c="white" fw={700} size="sm" style={{ fontFamily: bubbleFont }}>{formatMoney(bank)}</Text>
          </AnimatedBox>
          <AnimatedBox delay={0.5}>
            <TbMoneybag color={customColor} size={18} />
            <Text c="white" fw={700} size="sm" style={{ fontFamily: bubbleFont }}>{formatMoney(blackMoney)}</Text>
          </AnimatedBox>
        </Group>

      </Stack>
    </Box>
  );
}