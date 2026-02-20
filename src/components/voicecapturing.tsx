import React, { useRef, useState } from "react";

type State = "idle" | "recording" | "loading" | "playing";

const VoiceRecorder: React.FC = () => {
    const [state, setState] = useState<State>("idle");
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const handleToggle = async () => {
        if (state === "recording") {
            mediaRecorderRef.current?.stop();
            setState("loading");
            return;
        }
        if (state === "loading" || state === "playing") return;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event: BlobEvent) => {
                if (event.data.size > 0) audioChunksRef.current.push(event.data);
            };

            mediaRecorder.onstop = async () => {
                stream.getTracks().forEach((t) => t.stop());
                const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
                const reader = new FileReader();
                reader.readAsDataURL(audioBlob);

                reader.onloadend = async () => {
                    const base64cleanedAudio = (reader.result as string).split(",")[1];
                    try {
                        const response = await fetch("https://nwrsarvam-azd2h8dvb2dsb7d2.centralindia-01.azurewebsites.net/transcribe", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                audio_base64: base64cleanedAudio,
                                request_source: "portal",
                            }),
                        });
                        const data = await response.json();
                        console.log("transcribed data", data);

                        if (data.audio_base64) {
                            setState("playing");
                            const audioSrc = `data:audio/wav;base64,${data.audio_base64}`;
                            const audio = new Audio(audioSrc);
                            audio.onended = () => setState("idle");
                            audio.play().catch((err) => {
                                console.error("Audio playback failed:", err);
                                setState("idle");
                            });
                        } else {
                            setState("idle");
                        }
                    } catch (err) {
                        console.error("Transcription failed:", err);
                        setState("idle");
                    } finally {
                        audioChunksRef.current = [];
                    }
                };
            };

            mediaRecorder.start();
            mediaRecorderRef.current = mediaRecorder;
            setState("recording");
        } catch (err) {
            console.error("Microphone access failed:", err);
        }
    };

    const label =
        state === "idle" ? "Tap to speak" :
            state === "recording" ? "Tap to send" :
                state === "loading" ? "Processing…" :
                    "Playing…";

    return (
        <>
            <style>{`
                /* Recording: expanding rings */
                @keyframes rec-ring {
                    0%   { transform: scale(1);   opacity: 0.6; }
                    100% { transform: scale(2.2); opacity: 0; }
                }
                /* Loading: spinning arc */
                @keyframes spin-arc {
                    to { transform: rotate(360deg); }
                }
                /* Playing: waveform bars */
                @keyframes wave-bar {
                    0%, 100% { transform: scaleY(0.3); }
                    50%      { transform: scaleY(1);   }
                }
                /* Playing: ripple rings */
                @keyframes play-ripple {
                    0%   { transform: scale(1);   opacity: 0.5; }
                    100% { transform: scale(2.6); opacity: 0; }
                }
                /* Idle: gentle breathing */
                @keyframes idle-breath {
                    0%, 100% { transform: scale(1);    box-shadow: 0 4px 24px rgba(59,99,226,0.18); }
                    50%      { transform: scale(1.035); box-shadow: 0 8px 36px rgba(59,99,226,0.32); }
                }
            `}</style>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>

                {/* ── Button wrapper (holds ripple rings + button) ── */}
                <div style={{ position: "relative", width: 120, height: 120, display: "flex", alignItems: "center", justifyContent: "center" }}>

                    {/* Recording rings */}
                    {state === "recording" && [0, 1, 2].map((i) => (
                        <span key={i} style={{
                            position: "absolute",
                            inset: 0,
                            borderRadius: "50%",
                            border: "2px solid #EF4444",
                            animation: `rec-ring 1.6s ease-out ${i * 0.5}s infinite`,
                            pointerEvents: "none",
                        }} />
                    ))}

                    {/* Playing ripple rings */}
                    {state === "playing" && [0, 1].map((i) => (
                        <span key={i} style={{
                            position: "absolute",
                            inset: 0,
                            borderRadius: "50%",
                            border: "2.5px solid #7C3AED",
                            animation: `play-ripple 1.4s ease-out ${i * 0.6}s infinite`,
                            pointerEvents: "none",
                        }} />
                    ))}

                    {/* Main button */}
                    <button
                        onClick={handleToggle}
                        disabled={state === "loading" || state === "playing"}
                        title={label}
                        style={{
                            width: 120,
                            height: 120,
                            borderRadius: "50%",
                            border: "none",
                            cursor: (state === "loading" || state === "playing") ? "not-allowed" : "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            outline: "none",
                            padding: 0,
                            position: "relative",
                            zIndex: 1,
                            transition: "background 0.3s, transform 0.2s",
                            background:
                                state === "idle" ? "linear-gradient(135deg, #3B63E2 0%, #6366F1 100%)" :
                                    state === "recording" ? "linear-gradient(135deg, #EF4444 0%, #F87171 100%)" :
                                        state === "loading" ? "linear-gradient(135deg, #94A3B8 0%, #CBD5E1 100%)" :
                                            "linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)",
                            boxShadow:
                                state === "idle" ? "0 4px 24px rgba(59,99,226,0.35)" :
                                    state === "recording" ? "0 4px 32px rgba(239,68,68,0.45)" :
                                        state === "playing" ? "0 4px 32px rgba(124,58,237,0.45)" :
                                            "none",
                            animation:
                                state === "idle" ? "idle-breath 3s ease-in-out infinite" : "none",
                        }}
                    >
                        {/* Loading spinner */}
                        {state === "loading" && (
                            <span style={{
                                position: "absolute",
                                inset: 8,
                                borderRadius: "50%",
                                border: "4px solid rgba(255,255,255,0.25)",
                                borderTopColor: "#fff",
                                borderRightColor: "#fff",
                                animation: "spin-arc 0.85s linear infinite",
                                pointerEvents: "none",
                            }} />
                        )}

                        {/* Playing: animated waveform bars */}
                        {state === "playing" && (
                            <div style={{ display: "flex", alignItems: "center", gap: 5, height: 44 }}>
                                {[0.8, 1.3, 0.5, 1, 0.7, 1.2, 0.6].map((delay, i) => (
                                    <span key={i} style={{
                                        display: "block",
                                        width: 5,
                                        height: "100%",
                                        borderRadius: 4,
                                        background: "rgba(255,255,255,0.9)",
                                        transformOrigin: "center",
                                        animation: `wave-bar 0.9s ease-in-out ${delay * 0.18}s infinite`,
                                    }} />
                                ))}
                            </div>
                        )}

                        {/* Idle mic icon */}
                        {state === "idle" && (
                            <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
                                <rect x="9" y="2" width="6" height="11" rx="3" fill="white" />
                                <path d="M5 10a7 7 0 0 0 14 0" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                <line x1="12" y1="17" x2="12" y2="21" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                <line x1="8" y1="21" x2="16" y2="21" stroke="white" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        )}

                        {/* Recording stop icon */}
                        {state === "recording" && (
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                                <rect x="6" y="6" width="12" height="12" rx="2.5" fill="white" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Status label */}
                <span style={{
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    color:
                        state === "idle" ? "#64748B" :
                            state === "recording" ? "#EF4444" :
                                state === "loading" ? "#94A3B8" :
                                    "#7C3AED",
                    transition: "color 0.3s",
                }}>
                    {label}
                </span>
            </div>
        </>
    );
};

export default VoiceRecorder;
