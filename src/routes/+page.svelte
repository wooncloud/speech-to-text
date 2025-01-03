<script>
  import RecordButton from "$lib/components/RecordButton.svelte";
  import { Textarea } from "$lib/components/ui/textarea";
  import { Card } from "$lib/components/ui/card";
  import Alert from "$lib/components/Alert.svelte";
  import { logToSupabase, LogType, LogCode } from '$lib/utils/supabase';
  import InstallPWA from "$lib/components/InstallPWA.svelte";
  import ModifyButton from "$lib/components/ModifyButton.svelte";
  import ResetButton from "$lib/components/ResetButton.svelte";
  import { RotateCcw } from "lucide-svelte";
  
  let recording = false;
  let isProcessing = false;
  let transcribedText = "";
  let showAlert = false;
  let alertMessage = "";
  let alertType = "error";
  let alertComponent;
  let modifyRecording = false;
  let modifyProcessing = false;

  /**
   * 텍스트를 클립보드에 복사하고 알림을 표시합니다.
   */
  async function handleTextareaClick() {
    if (!transcribedText) return;
    
    try {
      await navigator.clipboard.writeText(transcribedText);
      alertMessage = "텍스트가 클립보드에 복사되었습니다.";
      alertType = "success";
      alertComponent.showAlert();
    } catch (error) {
      await logToSupabase(
        LogType.ERROR,
        LogCode.CLIPBOARD,
        `클립보드 복사 오류: ${error.message}`
      );
      alertMessage = "텍스트 복사에 실패했습니다.";
      alertType = "error";
      alertComponent.showAlert();
    }
  }

  /**
   * OpenAI로부터 받은 텍스트를 화면에 표시합니다.
   * @param {CustomEvent} event - transcribed 이벤트 객체
   */
  function handleTranscribed(event) {
    transcribedText = transcribedText 
      ? transcribedText + '\n' + event.detail.text
      : event.detail.text;
  }

  /**
   * 텍스트를 초기화합니다.
   */
  function handleReset() {
    transcribedText = "";
  }

  /**
   * 오류 발생 시 알림 메시지를 표시합니다.
   * @param {CustomEvent} event - error 이벤트 객체
   */
  async function handleError(event) {
    await logToSupabase(
      LogType.ERROR,
      LogCode.UNKNOWN,
      `일반 오류: ${event.detail.message}`
    );
    alertMessage = event.detail.message;
    alertType = "error";
    alertComponent.showAlert();
  }

  /**
   * 현재 상태에 따른 안내 메시지를 반환합니다.
   * @returns {string} 상태 메시지
   */
  function getStatusMessage() {
    if (isProcessing) {
      return "받아쓰고 있습니다. 잠시만 기다려 주세요.";
    }
    if (recording) {
      return "말씀해 주세요...";
    }
    return "버튼을 눌러 시작하세요";
  }

  function handleTextModified(event) {
    transcribedText = event.detail.text;
  }

  $: statusMessage = getStatusMessage();
</script>

<Alert 
  bind:this={alertComponent}
  message={alertMessage} 
  type={alertType} 
/>

<div class="min-h-[100dvh] flex flex-col p-4 gap-6 bg-gradient-to-b from-background to-muted">
  <header class="text-center py-4">
    <h1 class="text-2xl font-bold text-primary">Speech to Text</h1>
    <p class="text-sm text-muted-foreground mt-1">말씀하신 내용을 텍스트로 변환해드립니다</p>
  </header>

  <main class="flex-1 w-full max-w-2xl mx-auto flex flex-col gap-6">
    <Card class="flex-1 p-4 shadow-lg flex flex-col group relative">
      <Textarea
        placeholder="음성이 여기에 텍스트로 변환됩니다..."
        class="flex-1 min-h-[200px] text-base md:text-lg resize-none focus-visible:ring-0 border-none cursor-pointer"
        value={transcribedText}
        readonly
        on:click={handleTextareaClick}
      />
      {#if transcribedText}
        <div class="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <p class="bg-background/90 px-3 py-1 rounded-full text-sm shadow-sm">
            터치하여 복사하기
          </p>
        </div>
      {/if}
    </Card>

    <div class="flex flex-col items-center gap-4 pb-safe">
      <div class="flex items-center justify-between w-full max-w-xl px-4">
        <RecordButton 
          bind:recording 
          bind:isProcessing
          on:transcribed={handleTranscribed}
          on:error={handleError}
        />
        <ResetButton
          on:reset={handleReset}
        />
        <ModifyButton
          bind:recording={modifyRecording}
          bind:isProcessing={modifyProcessing}
          originalText={transcribedText}
          on:textModified={handleTextModified}
          on:error={handleError}
        />
      </div>
      <p class="text-sm text-muted-foreground">
        {#if modifyRecording}
          수정 요청 사항을 말씀해주세요...
        {:else if modifyProcessing}
          수정 중입니다...
        {:else}
          {statusMessage}
        {/if}
      </p>
    </div>
  </main>
</div>

<InstallPWA />

<style>
  :global(body) {
    overscroll-behavior: none;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }
</style>
