
import React, { useEffect, useState, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import { X, Mic, MicOff, PhoneOff, User, Volume2 } from 'lucide-react';
import { StaffMember } from '../types';

interface VoiceCallProps {
  member: StaffMember;
  onClose: () => void;
  isDarkMode: boolean;
}

// Audio Utils
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

const VoiceCall: React.FC<VoiceCallProps> = ({ member, onClose, isDarkMode }) => {
  const [status, setStatus] = useState<'connecting' | 'active' | 'ended'>('connecting');
  const [transcription, setTranscription] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outAudioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  useEffect(() => {
    const startCall = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        outAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        const sessionPromise = ai.live.connect({
          model: 'gemini-2.5-flash-native-audio-preview-12-2025',
          callbacks: {
            onopen: () => {
              setStatus('active');
              const source = audioContextRef.current!.createMediaStreamSource(stream);
              const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
              
              scriptProcessor.onaudioprocess = (e) => {
                if (isMuted) return;
                const inputData = e.inputBuffer.getChannelData(0);
                const l = inputData.length;
                const int16 = new Int16Array(l);
                for (let i = 0; i < l; i++) {
                  int16[i] = inputData[i] * 32768;
                }
                const pcmBlob: Blob = {
                  data: encode(new Uint8Array(int16.buffer)),
                  mimeType: 'audio/pcm;rate=16000',
                };
                sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
              };
              
              source.connect(scriptProcessor);
              scriptProcessor.connect(audioContextRef.current!.destination);
            },
            onmessage: async (message: LiveServerMessage) => {
              if (message.serverContent?.outputTranscription) {
                setTranscription(prev => prev + message.serverContent!.outputTranscription!.text);
              }
              
              const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
              if (audioData && outAudioContextRef.current) {
                const ctx = outAudioContextRef.current;
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
                const buffer = await decodeAudioData(decode(audioData), ctx, 24000, 1);
                const source = ctx.createBufferSource();
                source.buffer = buffer;
                source.connect(ctx.destination);
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += buffer.duration;
                sourcesRef.current.add(source);
                source.onended = () => sourcesRef.current.delete(source);
              }

              if (message.serverContent?.interrupted) {
                sourcesRef.current.forEach(s => s.stop());
                sourcesRef.current.clear();
                nextStartTimeRef.current = 0;
              }
            },
            onclose: () => setStatus('ended'),
            onerror: (e) => console.error('Call Error:', e)
          },
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: member.role === 'صاحب العمل' ? 'Puck' : 'Kore' } }
            },
            systemInstruction: `أنت الآن الموظف ${member.name} في محل "خياطة وأقمشة مكي الحمداني". تتحدث مع زميل لك في العمل عبر نظام الاتصال الداخلي. أجب بمهنية وودية حول تفاصيل العمل أو القياسات أو حالة الطلبات. لهجتك عراقية مهذبة ومختصرة.`,
            outputAudioTranscription: {}
          }
        });

        sessionRef.current = await sessionPromise;
      } catch (err) {
        console.error('Failed to start call:', err);
        onClose();
      }
    };

    startCall();

    return () => {
      if (sessionRef.current) sessionRef.current.close();
      if (audioContextRef.current) audioContextRef.current.close();
      if (outAudioContextRef.current) outAudioContextRef.current.close();
    };
  }, [member, onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className={`relative max-w-sm w-full p-8 rounded-[3rem] border shadow-2xl flex flex-col items-center gap-8 ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
      }`}>
        <div className="text-center">
          <div className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-black tracking-widest uppercase mb-4">
            {status === 'connecting' ? 'جاري الاتصال...' : 'مكالمة داخلية نشطة'}
          </div>
          <h2 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{member.name}</h2>
          <p className="text-slate-500 font-bold text-sm mt-1">{member.role}</p>
        </div>

        <div className="relative">
          <div className={`w-32 h-32 rounded-full overflow-hidden border-4 flex items-center justify-center relative z-10 ${
            status === 'active' ? 'border-amber-500 animate-pulse' : 'border-slate-200'
          }`}>
            {member.image ? (
              <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-16 h-16 text-slate-300" />
            )}
          </div>
          {status === 'active' && (
            <div className="absolute inset-0 -m-4 bg-amber-500/20 rounded-full animate-ping duration-1000"></div>
          )}
        </div>

        <div className={`w-full p-4 rounded-2xl h-24 overflow-y-auto text-sm text-center font-medium ${
          isDarkMode ? 'bg-slate-800/50 text-slate-400' : 'bg-slate-50 text-slate-600'
        }`}>
          {transcription || "تحدث الآن، المساعد الذكي يستمع..."}
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className={`p-4 rounded-full transition-all ${
              isMuted ? 'bg-red-500 text-white' : (isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600')
            }`}
          >
            {isMuted ? <MicOff /> : <Mic />}
          </button>
          
          <button 
            onClick={onClose}
            className="p-6 bg-red-600 text-white rounded-full shadow-xl shadow-red-600/30 hover:bg-red-700 active:scale-90 transition-all"
          >
            <PhoneOff className="w-8 h-8" />
          </button>

          <div className={`p-4 rounded-full ${isDarkMode ? 'bg-slate-800 text-amber-500' : 'bg-slate-100 text-amber-600'}`}>
            <Volume2 />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceCall;
