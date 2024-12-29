import { logToSupabase, LogType, LogCode } from './supabase.js';

export class AudioRecorder {
	constructor() {
		this.mediaRecorder = null;
		this.audioChunks = [];
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

			this.mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/mp4' });
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
				const audioBlob = new Blob(this.audioChunks, { type: 'audio/mp4' });
				this.mediaRecorder.stream.getTracks().forEach((track) => track.stop());
				this.mediaRecorder.removeEventListener('stop', handleStop);
				resolve(audioBlob);
			};

			this.mediaRecorder.addEventListener('stop', handleStop);
			this.mediaRecorder.stop();
		});
	}
}
