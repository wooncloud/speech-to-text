<script>
  import { Button } from "$lib/components/ui/button";
  import { Sparkles } from "lucide-svelte";
  import { AudioRecorder } from "$lib/utils/audioRecorder";
  import { transcribeAudio, modifyTextWithGPT } from "$lib/utils/openai";
  import { createEventDispatcher } from "svelte";

  export let recording = false;
  export let isProcessing = false;
  export let originalText = "";
  
  const dispatch = createEventDispatcher();
  let audioRecorder = new AudioRecorder();

  async function handleClick() {
    if (isProcessing || !originalText) return;

    try {
      if (!recording) {
        await audioRecorder.start();
        recording = true;
      } else {
        const audioBlob = await audioRecorder.stop();
        recording = false;
        isProcessing = true;
        
        const instruction = await transcribeAudio(audioBlob);
        const modifiedText = await modifyTextWithGPT(originalText, instruction);
        
        dispatch('textModified', { text: modifiedText });
      }
    } catch (error) {
      console.error('Error:', error);
      dispatch('error', { message: error.message });
    } finally {
      isProcessing = false;
    }
  }
</script>

<Button
  variant="outline"
  size="icon"
  class="relative w-24 h-24 rounded-full transition-all duration-300 
    shadow-lg hover:shadow-xl active:scale-95 
    {recording ? 'bg-green-500 hover:bg-green-600 border-green-600' : 'bg-green-400 hover:bg-green-500/90'}
    {recording && 'before:absolute before:inset-0 before:rounded-full before:animate-ping before:bg-green-500/10 before:opacity-75 before:scale-150'}"
  on:click={handleClick}
  disabled={isProcessing || !originalText}
>
  <div class="relative z-10">
    <Sparkles
      class="h-8 w-8
        {recording ? 'text-white animate-pulse' : 'text-white'}"
    />
  </div>
</Button> 