<script>
  import { Button } from "$lib/components/ui/button";
  import { Mic } from "lucide-svelte";

  export let recording = false;

  function handleClick() {
    recording = !recording;
  }
</script>

<Button
  variant="outline"
  size="icon"
  class="relative w-24 h-24 md:w-32 md:h-32 rounded-full transition-all duration-300 
    shadow-lg hover:shadow-xl active:scale-95 
    {recording ? 'bg-red-500 hover:bg-red-600 border-red-600' : 'bg-primary hover:bg-primary/90'}
    before:absolute before:inset-0 before:rounded-full before:animate-ping 
    before:bg-primary/10 before:opacity-75 before:scale-150"
  on:click={handleClick}
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