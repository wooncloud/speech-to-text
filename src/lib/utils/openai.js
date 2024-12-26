import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const transcribeAudio = async (audioBlob) => {
  try {
    const audioFile = new File([audioBlob], 'audio.webm', { type: 'audio/webm' });

    const response = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'ko'
    });

    return response.text;
  } catch (error) {
    console.error('음성 변환 중 오류 발생:', error);
    throw new Error('음성을 텍스트로 변환하는 중 오류가 발생했습니다.');
  }
}; 