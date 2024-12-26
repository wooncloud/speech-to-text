import { logToSupabase, LogType, LogCode } from './supabase.js';

export class AudioRecorder {
  constructor() {
    this.mediaRecorder = null;
    this.audioChunks = [];
  }

  /**
   * iOS 기기인지 확인합니다.
   * @returns {boolean}
   */
  isIOS() {
    return [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod'
    ].includes(navigator.platform)
    || (navigator.userAgent.includes("Mac") && "ontouchend" in document);
  }

  /**
   * 브라우저가 지원하는 오디오 MIME 타입을 반환합니다.
   * @returns {string} 지원되는 오디오 MIME 타입
   */
  getSupportedMimeType() {
    // iOS의 경우 audio/mp4 강제 사용
    if (this.isIOS()) {
      return 'audio/mp4';
    }

    // 다른 브라우저의 경우 우선순위대로 체크
    const mimeTypes = [
      'audio/mp4',
      'audio/webm;codecs=opus',
      'audio/ogg;codecs=opus'
    ];

    for (const type of mimeTypes) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }

    return 'audio/mp4';
  }

  /**
   * 마이크 접근이 가능한지 확인합니다.
   * @returns {boolean} 마이크 접근 가능 여부
   */
  checkMediaDevicesSupport() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      // 구형 브라우저 지원
      navigator.mediaDevices = {};
      navigator.mediaDevices.getUserMedia = function(constraints) {
        const getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        
        if (!getUserMedia) {
          return Promise.reject(new Error('현재 브라우저에서는 음성 녹음을 지원하지 않습니다.'));
        }

        return new Promise((resolve, reject) => {
          getUserMedia.call(navigator, constraints, resolve, reject);
        });
      };
    }
    return true;
  }

  /**
   * 마이크 권한을 확인하고 필요한 경우 요청합니다.
   * @returns {Promise<MediaStream>} 마이크 스트림
   */
  async requestMicrophonePermission() {
    try {
      this.checkMediaDevicesSupport();

      if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
        throw new Error('음성 녹음은 HTTPS 환경에서만 가능합니다.');
      }

      if (navigator.permissions && navigator.permissions.query) {
        const permissionStatus = await navigator.permissions.query({ name: 'microphone' });
        if (permissionStatus.state === 'denied') {
          throw new Error('마이크 사용이 차단되어 있습니다. 브라우저 설정에서 권한을 허용해주세요.');
        }
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100,        // 샘플레이트 지정
          channelCount: 1           // 모노 녹음
        }
      });

      return stream;
    } catch (error) {
      if (error.name === 'NotAllowedError') {
        throw new Error('마이크 사용을 허용해주세요.');
      }
      throw error;
    }
  }

  async start() {
    try {
      const stream = await this.requestMicrophonePermission();
      const mimeType = this.getSupportedMimeType();

      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 128000
      });
      
      this.audioChunks = [];

      this.mediaRecorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      });

      // 더 작은 청크로 데이터 수집
      this.mediaRecorder.start(100);
      
    } catch (error) {
      await logToSupabase(
        LogType.ERROR,
        LogCode.AUDIO_PERMISSION,
        `마이크 오류: ${error.message}`
      );
      throw error;
    }
  }

  stop() {
    return new Promise((resolve) => {
      this.mediaRecorder.addEventListener('stop', () => {
        const audioBlob = new Blob(this.audioChunks, { 
          type: 'audio/mp4' // 항상 mp4로 통일
        });
        this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
        resolve(audioBlob);
      });
      
      this.mediaRecorder.stop();
    });
  }
} 