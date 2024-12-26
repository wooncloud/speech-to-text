import { logToSupabase, LogType, LogCode } from './supabase.js';

export class AudioRecorder {
  constructor() {
    this.mediaRecorder = null;
    this.audioChunks = [];
  }

  async start() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      this.mediaRecorder.addEventListener('dataavailable', (event) => {
        this.audioChunks.push(event.data);
      });

      this.mediaRecorder.start();
    } catch (error) {
      await logToSupabase(
        LogType.ERROR,
        LogCode.AUDIO_PERMISSION,
        `마이크 권한 오류: ${error.message}`
      );
      throw new Error('마이크 접근 권한이 필요합니다.');
    }
  }

  stop() {
    return new Promise((resolve) => {
      this.mediaRecorder.addEventListener('stop', () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
        resolve(audioBlob);
      });
      
      this.mediaRecorder.stop();
    });
  }
} 