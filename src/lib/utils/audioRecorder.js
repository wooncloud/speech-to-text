import { logToSupabase, LogType, LogCode } from './supabase.js';

export class AudioRecorder {
  constructor() {
    this.mediaRecorder = null;
    this.audioChunks = [];
  }

  /**
   * 브라우저가 지원하는 오디오 MIME 타입을 반환합니다.
   */
  getSupportedMimeType() {
    // iOS에서는 audio/mp4만 안정적으로 지원
    if (navigator.userAgent.includes("iPhone") || navigator.userAgent.includes("iPad")) {
      return 'audio/mp4';
    }

    // 다른 브라우저는 우선순위대로 체크
    const types = ['audio/mp4', 'audio/webm;codecs=opus'];
    return types.find(type => MediaRecorder.isTypeSupported(type)) || 'audio/mp4';
  }

  async start() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          channelCount: 1
        }
      });

      const mimeType = this.getSupportedMimeType();
      this.mediaRecorder = new MediaRecorder(stream, { mimeType });
      this.audioChunks = [];

      this.mediaRecorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) this.audioChunks.push(event.data);
      });

      this.mediaRecorder.start(100);
    } catch (error) {
      await logToSupabase(LogType.ERROR, LogCode.AUDIO_PERMISSION, `마이크 오류: ${error.message}`);
      throw new Error('마이크 사용을 허용해주세요.');
    }
  }

  stop() {
    return new Promise((resolve) => {
      this.mediaRecorder.addEventListener('stop', () => {
        const audioBlob = new Blob(this.audioChunks, { type: this.mediaRecorder.mimeType });
        this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
        resolve(audioBlob);
      });
      this.mediaRecorder.stop();
    });
  }
} 