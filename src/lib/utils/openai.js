import OpenAI from 'openai';
import { logToSupabase, LogType, LogCode } from './supabase.js';

export const openai = new OpenAI({
	apiKey: import.meta.env.VITE_OPENAI_API_KEY,
	dangerouslyAllowBrowser: true
});

/**
 * 오디오 파일을 텍스트로 변환하는 함수
 * @param {Blob} audioBlob - 변환할 오디오 Blob 데이터
 * @returns {Promise<string>} 변환된 텍스트
 */
export const transcribeAudio = async (audioBlob) => {
	try {
		// 오디오 MIME 타입에 따른 파일 확장자 매핑
		const mimeToExt = {
			'audio/webm': 'webm',
			'audio/mp4': 'm4a',
			'audio/mpeg': 'mp3',
			'audio/ogg': 'ogg',
			'audio/wav': 'wav'
		};

		// MIME 타입에서 기본 타입만 추출 (예: "audio/webm;codecs=opus" -> "audio/webm")
		const baseType = audioBlob.type.split(';')[0];
		// MIME 타입에 해당하는 확장자를 가져오거나, 기본값으로 'webm' 사용
		const extension = mimeToExt[baseType] || 'webm';

		// iOS 기기 여부 확인
		const isIOS = /iPad|iPhone|iPod/i.test(navigator.userAgent);
		// iOS에서 audio/mp4인 경우 m4a 확장자 사용, 그 외에는 기본 확장자 사용
		const finalExtension = isIOS && baseType === 'audio/mp4' ? 'm4a' : extension;

		// Blob 데이터로 File 객체 생성
		const audioFile = new File([audioBlob], `audio.${finalExtension}`, {
			type: baseType
		});

		// OpenAI Whisper API를 사용하여 음성을 텍스트로 변환
		const response = await openai.audio.transcriptions.create({
			file: audioFile,
			model: 'whisper-1',
			language: 'ko'
		});

		return response.text;
	} catch (error) {
		// 오류 발생 시 Supabase에 로그 기록
		await logToSupabase(
			LogType.ERROR,
			LogCode.OPENAI_TRANSCRIBE,
			`변환 오류: ${error.message}, MIME: ${audioBlob.type}`
		);
		throw new Error('음성을 텍스트로 변환하는 중 오류가 발생했습니다.');
	}
};

export const modifyTextWithGPT = async (originalText, instruction) => {
	try {
		const response = await openai.chat.completions.create({
			model: "gpt-4o-mini",
			messages: [
				{
					role: "system",
					content: "사용자가 요청한 방식대로 텍스트를 수정합니다. 수정된 결과만을 반환하며, 설명이나 부가적인 멘트는 포함하지 않습니다."
				},
				{
					role: "user",
					content: `원본 텍스트: "${originalText}"\n수정 요청: "${instruction}"`
				}
			],
			temperature: 0.7,
		});

		return response.choices[0].message.content;
	} catch (error) {
		await logToSupabase(LogType.ERROR, LogCode.GPT_MODIFY, `GPT 수정 오류: ${error.message}`);
		throw new Error('텍스트 수정 중 오류가 발생했습니다.');
	}
};
