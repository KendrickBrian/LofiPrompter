import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { GoogleGenAI } from "@google/genai";
import { CosmicScene } from "./scene";
import { cn } from "./utils";
import { RainbowButton } from "./rainbow-button";
import { ParticleTextEffect } from "./particle-text-effect";
import "./index.css";

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
      "w-full px-6 py-3 rounded-xl text-white font-bold text-sm tracking-wider uppercase transition-all duration-300 shadow-lg mt-3 font-mono relative z-50",
      secondary 
        ? "bg-white/10 border border-white/20 hover:bg-white/20 text-white" 
        : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 hover:scale-[1.02] shadow-purple-900/40",
      disabled && "opacity-60 cursor-not-allowed hover:scale-100 hover:shadow-none"
    )}
    style={{ position: 'relative', zIndex: 50 }}
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
    // API Key is injected via vite.config.ts define
    
    setLoading(true);
    setCopied(false);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
      
      // Prompt construction based on the Expanded Core Formula + Viral Elements
      const inputContext = userMood ? `User Input/Vibe: "${userMood}"` : "User Input: Surprise me with a high-quality viral track idea";
      
      const systemPrompt = `
        You are an elite music producer specializing in Suno AI prompts. 
        Your goal is to generate a concise, professional prompt that follows the "Core Lo-Fi Prompt Formula".

        ${inputContext}

        STRICT FORMULA TO USE:
        [Genre Label], [Mood], [Key Instruments], [Atmosphere/Texture], [Tempo BPM], [Time Signature]

        GUIDELINES FOR GENERATION:

        1. GENRE DIVERSITY (Do not limit to Hip-Hop):
           - Mix it up based on input: "Lo-fi Jazz", "Ambient Lo-fi", "Retro Lo-fi", "Urban Lo-fi Chillout", "Lo-fi Study Beats", "Dreamy Lo-fi", "Cinematic Lo-fi".

        2. TEMPO (BPM) & RHYTHM:
           - For Sleep/Relaxation/Ambient: Use **60-75 BPM**.
           - For Study/Focus/Viral Hits: Use **80-85 BPM**.
           - ALWAYS end with **4/4 Time**.

        3. INSTRUMENTATION (Be Specific & Organic):
           - Piano: "Reflective Piano", "Warm Rhodes", "Uplifting Piano", "Vintage Keys".
           - Guitar: "Peaceful Guitar", "Jazzy Guitar Melodies", "Clean Electric Guitar".
           - Bass: "Smooth Upright Bass", "Deep Sub Bass", "Warm Synth Bass".
           - Drums: "Dusty Boom-bap Drums", "Gentle Percussion", "Minimal Drums", "Loose Pocket Drums".
           - Strings: "Soft Strings", "Ambient Violin", "Cello Decay".

        4. ATMOSPHERE (Crucial):
           - Include ONE specific texture: "Vinyl Crackle", "Tape Hiss", "Subtle Cafe Noise", "Rain Sounds", "City Ambience".

        5. MOOD DESCRIPTORS:
           - Combine 2 contrasting or complementary moods: "Chill & Dreamy", "Melancholic yet Warm", "Nostalgic & Bright".

        6. CONCISENESS:
           - Suno prefers prompts around 200 characters. Be punchy. Use comma separation.

        EXAMPLES OF PERFECT OUTPUTS:
        - "Lo-fi Jazz, Chill & Dreamy, Warm Rhodes, Dusty Boom-bap Drums with Loose Pocket, Smooth Upright Bass, Jazzy Guitar Melodies, Tape Hiss, 82 BPM, 4/4 Time"
        - "Chill Lo-fi Ambient, Warm Synth Pads, Smooth Bass, Ethereal Vocals, Vinyl Crackle, 60 BPM, 4/4 Time"
        - "Urban Lo-fi Chillout, Bright Guitar, Smooth Bass, Subtle Synth, City Ambience, 68 BPM, 4/4 Time"
        - "Lo-fi Study Beats, Focus & Calm, Soft Piano, Minimal Percussion, Rain Sounds, 84 BPM, 4/4 Time"

        OUTPUT FORMAT:
        Return ONLY the English prompt string. No explanations.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: systemPrompt,
      });

      setPrompt(response.text?.trim() || "");
    } catch (error) {
      console.error("Error generating prompt:", error);
      setPrompt("Connection error. Please try again. (Check API Key)");
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
    <div className="relative w-full h-screen overflow-hidden bg-black text-white selection:bg-purple-500/30">
      {/* 3D Background - Z-Index 0 */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <CosmicScene />
      </div>

      {/* Foreground Content - Explicit Z-Index 50 and full width/height */}
      <div className="relative z-50 w-full h-full flex flex-col items-center justify-center p-4 overflow-y-auto">
        
        <div className="w-full max-w-md my-10 relative z-50">
          {/* Glass Card */}
          <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-[0_0_50px_rgba(139,92,246,0.15)] relative z-50">
            <div className="text-center mb-8">
              <div className="mb-4 h-24 flex items-center justify-center overflow-hidden">
                <ParticleTextEffect words={["COSMIC", "LO-FI", "VIBES"]} />
              </div>
              <p className="text-xs text-indigo-200/60 font-mono tracking-widest uppercase mt-2">
                Suno AI Professional Prompt Generator
              </p>
            </div>

            <div className="space-y-6">
              <div className="relative group w-full z-50">
                <input 
                  type="text" 
                  placeholder="Напр: Дождливая ночь в Токио, меланхолия"
                  value={userMood}
                  onChange={(e) => setUserMood(e.target.value)}
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white font-sans placeholder-white/50 focus:outline-none focus:border-purple-500/50 focus:bg-white/15 transition-all text-center text-lg relative z-50"
                  style={{ background: 'rgba(255,255,255,0.1)' }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !loading) {
                      generateLoFiPrompt();
                    }
                  }}
                />
              </div>

              <div className="relative z-50">
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
                  ) : "Сгенерировать Хит"}
                </RainbowButton>
              </div>
            </div>

            {prompt && (
              <div className="mt-8 relative z-50 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl opacity-20 blur"></div>
                  <div className="relative bg-black/80 p-5 rounded-xl border border-white/10">
                    <p className="font-mono text-sm text-gray-300 leading-relaxed break-words text-left">
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
          
          <div className="mt-6 text-center opacity-30 text-[10px] font-mono tracking-[0.2em] hover:opacity-60 transition-opacity cursor-default relative z-50">
            Made with LOVE
          </div>
        </div>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(<App />);