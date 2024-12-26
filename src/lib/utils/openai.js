import OpenAI from 'openai';
import { logToSupabase, LogType, LogCode } from './supabase.js';

export const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const transcribeAudio = async (audioBlob) => {
  try {
    const extension = audioBlob.type === 'audio/mp4' ? 'mp4' : 'webm';
    const audioFile = new File([audioBlob], `audio.${extension}`, { 
      type: audioBlob.type 
    });

    const response = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'ko'
    });

    return response.text;
  } catch (error) {
    await logToSupabase(
      LogType.ERROR,
      LogCode.OPENAI_TRANSCRIBE,
      `OpenAI 음성 변환 오류: ${error.message}`
    );
    throw new Error('음성을 텍스트로 변환하는 중 오류가 발생했습니다.');
  }
}; 