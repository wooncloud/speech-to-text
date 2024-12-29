import { logToSupabase, LogType, LogCode } from './supabase.js';

export class AudioRecorder {
	constructor() {
		this.mediaRecorder = null;
		this.audioChunks = [];
	}

	/**
	 * 현재 기기가 iOS인지 확인합니다.
	 */
	isIOS() {
		return /iPad|iPhone|iPod/i.test(navigator.userAgent);
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

			// iOS는 audio/mp4, 다른 브라우저는 audio/webm 사용
			const mimeType = this.isIOS() ? 'audio/mp4' : 'audio/webm';
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
			const handleStop = () => {
				const audioBlob = new Blob(this.audioChunks, { type: this.mediaRecorder.mimeType });
				this.mediaRecorder.stream.getTracks().forEach((track) => track.stop());
				this.mediaRecorder.removeEventListener('stop', handleStop);
				resolve(audioBlob);
			};

			this.mediaRecorder.addEventListener('stop', handleStop);
			this.mediaRecorder.stop();
		});
	}
}
