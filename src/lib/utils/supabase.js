import { createClient } from '@supabase/supabase-js'
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey)

/**
 * 로그 타입 상수
 */
export const LogType = {
  ERROR: 'ERROR',
  WARNING: 'WARNING',
  NORMAL: 'NORMAL',
  DEBUG: 'DEBUG'
}

/**
 * 로그 코드 상수
 */
export const LogCode = {
  AUDIO_RECORD: 'AUDIO_RECORD_ERROR',
  AUDIO_PERMISSION: 'AUDIO_PERMISSION_ERROR',
  OPENAI_TRANSCRIBE: 'OPENAI_TRANSCRIBE_ERROR',
  CLIPBOARD: 'CLIPBOARD_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
}

/**
 * 로그를 수파베이스에 기록합니다.
 */
export async function logToSupabase(type, code, text) {
  try {
    const { error } = await supabase
      .from('stt_logs')
      .insert([{ log_type: type, log_code: code, log_text: text }])

    if (error) {
      console.error('로그 기록 중 오류 발생:', error)
    }
  } catch (error) {
    console.error('수파베이스 로그 기록 실패:', error)
  }
} 