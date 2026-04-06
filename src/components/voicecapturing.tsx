import React, { useRef, useState, useEffect } from "react";

type State = "idle" | "recording" | "loading" | "playing" | "paused";

const VoiceRecorder: React.FC = () => {
    const [state, setState] = useState<State>("idle");
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Cleanup audio on unmount
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const handleToggle = async () => {
        if (state === "recording") {
            mediaRecorderRef.current?.stop();
            setState("loading");
            return;
        }

        // If playing or paused, the main button acts as a play/pause toggle
        if (state === "playing") {
            audioRef.current?.pause();
            setState("paused");
            return;
        }
        if (state === "paused") {
            audioRef.current?.play();
            setState("playing");
            return;
        }

        if (state === "loading") return;

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
                        const response = await fetch("http://127.0.0.1:5000/transcribe", {
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
                            audioRef.current = audio;
                            audio.onended = () => {
                                setState("idle");
                                audioRef.current = null;
                            };
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

    const handleStop = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current = null;
        }
        setState("idle");
    };

    const handleReplay = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
            setState("playing");
        }
    };

    const label =
        state === "idle" ? "Tap to speak" :
            state === "recording" ? "Tap to send" :
                state === "loading" ? "Processing…" :
                    state === "playing" ? "Playing…" :
                        "Paused";

    return (
        <>
            <style>{`
                /* Recording: expanding rings */
                @keyframes rec-ring {
                    0%   { transform: scale(1);   opacity: 0.6; }
                    100% { transform: scale(2.2); opacity: 0; }
                }
                /* Loading: bouncing dots */
                @keyframes bounce-dot {
                    0%, 100% { transform: translateY(0); opacity: 0.5; }
                    50%      { transform: translateY(-8px); opacity: 1; }
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
                        disabled={state === "loading"}
                        title={label}
                        style={{
                            width: 120,
                            height: 120,
                            borderRadius: "50%",
                            border: "none",
                            cursor: state === "loading" ? "not-allowed" : "pointer",
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
                                            state === "playing" ? "linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)" :
                                                "linear-gradient(135deg, #6B7280 0%, #9CA3AF 100%)", // Gray for paused
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
                            <div style={{ display: "flex", gap: "6px" }}>
                                {[0, 1, 2].map((i) => (
                                    <span key={i} style={{
                                        width: 12,
                                        height: 12,
                                        borderRadius: "50%",
                                        backgroundColor: "#fff",
                                        animation: `bounce-dot 1s ease-in-out ${i * 0.16}s infinite`,
                                    }} />
                                ))}
                            </div>
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

                        {/* Paused: Pause icon (showing it's ready to resume) */}
                        {state === "paused" && (
                            <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
                                <path d="M8 5v14l11-7z" fill="white" />
                            </svg>
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

                        {/* Overlay Pause icon when playing */}
                        {state === "playing" && (
                            <div style={{ position: "absolute", bottom: 10, right: 10, opacity: 0.8 }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <rect x="6" y="4" width="4" height="16" fill="white" />
                                    <rect x="14" y="4" width="4" height="16" fill="white" />
                                </svg>
                            </div>
                        )}
                    </button>

                    {/* Extra controls (Replay & Stop) */}
                    {(state === "playing" || state === "paused") && (
                        <>
                            {/* Replay Button (Left) */}
                            <button
                                onClick={(e) => { e.stopPropagation(); handleReplay(); }}
                                style={{
                                    position: "absolute",
                                    left: -50,
                                    width: 40,
                                    height: 40,
                                    borderRadius: "50%",
                                    border: "1px solid #E2E8F0",
                                    background: "white",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                    zIndex: 2,
                                }}
                                title="Replay"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                                    <path d="M3 3v5h5" />
                                </svg>
                            </button>

                            {/* Stop Button (Right) */}
                            <button
                                onClick={(e) => { e.stopPropagation(); handleStop(); }}
                                style={{
                                    position: "absolute",
                                    right: -50,
                                    width: 40,
                                    height: 40,
                                    borderRadius: "50%",
                                    border: "1px solid #FEE2E2",
                                    background: "#FEF2F2",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                    zIndex: 2,
                                }}
                                title="Stop"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="#EF4444">
                                    <rect x="6" y="6" width="12" height="12" rx="2" />
                                </svg>
                            </button>
                        </>
                    )}
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
                                    state === "playing" ? "#7C3AED" : "#6B7280",
                    transition: "color 0.3s",
                }}>
                    {label}
                </span>
            </div>
        </>
    );
};

export default VoiceRecorder;
