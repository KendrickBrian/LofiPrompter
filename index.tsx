import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { GoogleGenAI } from "@google/genai";
import { CosmicScene } from "./scene";
import { cn } from "./utils";
import { RainbowButton } from "./rainbow-button";
import { ParticleTextEffect } from "./particle-text-effect";

// --- Components ---

interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
  secondary?: boolean;
}

const Button = ({ onClick, disabled, children, secondary = false }: ButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={cn(
      "w-full px-6 py-3 rounded-xl text-white font-bold text-sm tracking-wider uppercase transition-all duration-300 shadow-lg mt-3 font-mono",
      secondary 
        ? "bg-white/5 border border-white/20 hover:bg-white/10 text-white/80" 
        : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 hover:scale-[1.02] shadow-purple-900/40",
      disabled && "opacity-60 cursor-not-allowed hover:scale-100 hover:shadow-none"
    )}
  >
    {children}
  </button>
);

const App = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [userMood, setUserMood] = useState("");
  const [copied, setCopied] = useState(false);

  // --- Gemini Logic ---

  const generateLoFiPrompt = async () => {
    // API Key is assumed to be pre-configured and valid.

    setLoading(true);
    setCopied(false);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
      
      // Prompt construction
      const moodPart = userMood ? `с настроением "${userMood}"` : "со случайным расслабляющим настроением";
      
      const systemPrompt = `
        Ты — эксперт по Lo-Fi Hip Hop музыке и промпт-инженер для Suno AI.
        Твоя задача: сгенерировать ОДИН идеальный промпт на АНГЛИЙСКОМ языке.
        
        Требования:
        1. Стиль: Lo-Fi Hip Hop.
        2. ${moodPart}.
        3. Укажи инструменты (например: dusty piano, jazzy chords, vinyl crackle, soft kick).
        4. Укажи BPM (обычно 60-85).
        5. Добавь атмосферные детали (rain sounds, coffee shop ambience, nostalgia).
        6. Ответ должен содержать ТОЛЬКО текст промпта, без кавычек и лишних слов.
        7. Длина до 250 символов.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: systemPrompt,
      });

      // Use safe navigation for response.text and default to empty string if undefined.
      setPrompt(response.text?.trim() || "");
    } catch (error) {
      console.error("Error generating prompt:", error);
      setPrompt("Ошибка генерации. Попробуйте еще раз. Возможно, космос сегодня не в духе.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white">
      {/* 3D Background */}
      <CosmicScene />

      {/* Foreground Content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-4">
        
        <div className="w-full max-w-md animate-in fade-in zoom-in duration-700">
          <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-[0_0_50px_rgba(139,92,246,0.15)]">
            <div className="text-center mb-6">
              <div className="mb-2">
                <ParticleTextEffect words={["COSMIC", "LO-FI"]} />
              </div>
              <p className="text-xs text-indigo-200/60 font-mono tracking-widest uppercase">
                Suno AI Prompt Generator
              </p>
            </div>

            <div className="space-y-6">
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Ваше настроение (напр. 'Космическая тоска')"
                  value={userMood}
                  onChange={(e) => setUserMood(e.target.value)}
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white font-sans placeholder-white/20 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all text-center"
                />
                <div className="absolute inset-0 rounded-xl bg-purple-500/10 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500 blur-lg -z-10"></div>
              </div>

              <RainbowButton 
                onClick={generateLoFiPrompt} 
                disabled={loading}
                className="w-full h-14 font-mono uppercase tracking-widest text-sm shadow-2xl shadow-purple-900/40"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}/>
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}/>
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}/>
                  </span>
                ) : "Сгенерировать Вайб"}
              </RainbowButton>
            </div>

            {prompt && (
              <div className="mt-8 animate-in slide-in-from-bottom-4 fade-in duration-500">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl opacity-20 blur"></div>
                  <div className="relative bg-black/60 p-5 rounded-xl border border-white/10">
                    <p className="font-mono text-sm text-gray-300 leading-relaxed break-words">
                      {prompt}
                    </p>
                  </div>
                </div>
                <Button onClick={copyToClipboard} secondary>
                  {copied ? "Скопировано!" : "Копировать"}
                </Button>
              </div>
            )}
          </div>
          
          <div className="mt-6 text-center opacity-30 text-[10px] font-mono tracking-[0.2em] hover:opacity-60 transition-opacity cursor-default">
            Made With LOVE
          </div>
        </div>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(<App />);