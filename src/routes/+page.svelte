<script>
  import RecordButton from "$lib/components/RecordButton.svelte";
  import { Textarea } from "$lib/components/ui/textarea";
  import { Card } from "$lib/components/ui/card";
  
  let recording = false;
  let transcribedText = "";
</script>

<div class="min-h-[100dvh] flex flex-col p-4 gap-6 bg-gradient-to-b from-background to-muted">
  <header class="text-center py-4">
    <h1 class="text-2xl font-bold text-primary">Speech to Text</h1>
    <p class="text-sm text-muted-foreground mt-1">말씀하신 내용을 텍스트로 변환해드립니다</p>
  </header>

  <main class="flex-1 w-full max-w-2xl mx-auto flex flex-col gap-6">
    <Card class="flex-1 p-4 shadow-lg">
      <Textarea
        placeholder="음성이 여기에 텍스트로 변환됩니다..."
        class="min-h-[150px] text-base md:text-lg resize-none border-none focus-visible:ring-0"
        value={transcribedText}
        readonly
      />
    </Card>

    <div class="flex flex-col items-center gap-4 pb-safe">
      <RecordButton bind:recording />
      <p class="text-sm text-muted-foreground">
        {recording ? '말씀해 주세요...' : '버튼을 눌러 시작하세요'}
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
