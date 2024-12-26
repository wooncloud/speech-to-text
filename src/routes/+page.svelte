<script>
  import RecordButton from "$lib/components/RecordButton.svelte";
  import { Textarea } from "$lib/components/ui/textarea";
  import { Card } from "$lib/components/ui/card";
  import Alert from "$lib/components/Alert.svelte";
  
  let recording = false;
  let isProcessing = false;
  let transcribedText = "";
  let showAlert = false;
  let alertMessage = "";

  /**
   * OpenAI로부터 받은 텍스트를 화면에 표시합니다.
   * @param {CustomEvent} event - transcribed 이벤트 객체
   */
  function handleTranscribed(event) {
    transcribedText = event.detail.text;
  }

  /**
   * 오류 발생 시 알림 메시지를 표시합니다.
   * @param {CustomEvent} event - error 이벤트 객체
   */
  function handleError(event) {
    alertMessage = event.detail.message;
    showAlert = true;
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

  $: statusMessage = getStatusMessage();
</script>

<Alert message={alertMessage} show={showAlert} type="error" />

<div class="min-h-[100dvh] flex flex-col p-4 gap-6 bg-gradient-to-b from-background to-muted">
  <header class="text-center py-4">
    <h1 class="text-2xl font-bold text-primary">Speech to Text</h1>
    <p class="text-sm text-muted-foreground mt-1">말씀하신 내용을 텍스트로 변환해드립니다</p>
  </header>

  <main class="flex-1 w-full max-w-2xl mx-auto flex flex-col gap-6">
    <Card class="flex-1 p-4 shadow-lg flex flex-col">
      <Textarea
        placeholder="음성이 여기에 텍스트로 변환됩니다..."
        class="flex-1 min-h-[200px] text-base md:text-lg resize-none focus-visible:ring-0 border-none"
        value={transcribedText}
        readonly
      />
    </Card>

    <div class="flex flex-col items-center gap-4 pb-safe">
      <RecordButton 
        bind:recording 
        bind:isProcessing
        on:transcribed={handleTranscribed}
        on:error={handleError}
      />
      <p class="text-sm text-muted-foreground">
        {statusMessage}
      </p>
    </div>
  </main>
</div>

<style>
  :global(body) {
    overscroll-behavior: none;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }
</style>
