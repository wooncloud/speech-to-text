<script>
  import { Button } from "$lib/components/ui/button";
  import { Mic } from "lucide-svelte";
  import { AudioRecorder } from "$lib/utils/audioRecorder";
  import { transcribeAudio } from "$lib/utils/openai";
  import { createEventDispatcher } from "svelte";

  export let recording = false;
  export let isProcessing = false;
  const dispatch = createEventDispatcher();
  let audioRecorder = new AudioRecorder();

  /**
   * 녹음 버튼 클릭 시 실행되는 함수입니다.
   * 녹음 시작/중지 및 음성 인식 처리를 담당합니다.
   */
  async function handleClick() {
    if (isProcessing) return;

    try {
      if (!recording) {
        // 녹음 시작
        await audioRecorder.start();
        recording = true;
      } else {
        // 녹음 중지 및 음성 인식 처리
        recording = false;
        isProcessing = true;
        dispatch('processingStart');
        
        const audioBlob = await audioRecorder.stop();
        const text = await transcribeAudio(audioBlob);
        dispatch('transcribed', { text });
      }
    } catch (error) {
      console.error('Error:', error);
      dispatch('error', { message: error.message });
    } finally {
      isProcessing = false;
      dispatch('processingEnd');
    }
  }
</script>

<Button
  variant="outline"
  size="icon"
  class="relative w-24 h-24 md:w-32 md:h-32 rounded-full transition-all duration-300 
    shadow-lg hover:shadow-xl active:scale-95 
    {recording ? 'bg-red-500 hover:bg-red-600 border-red-600' : 'bg-primary hover:bg-primary/90'}
    {recording && 'before:absolute before:inset-0 before:rounded-full before:animate-ping before:bg-red-500/10 before:opacity-75 before:scale-150'}"
  on:click={handleClick}
  disabled={isProcessing}
>
  <div class="relative z-10">
    <Mic
      class="h-8 w-8 md:h-12 md:w-12 
        {recording ? 'text-white animate-pulse' : 'text-primary-foreground'}"
    />
  </div>
</Button>

<style>
  @keyframes ping {
    75%, 100% {
      transform: scale(1.5);
      opacity: 0;
    }
  }
</style> 