<script>
  import { Button } from "$lib/components/ui/button";
  import { RotateCcw } from "lucide-svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  function handleClick() {
    dispatch('reset');
  }
</script>

<Button
  variant="outline"
  size="icon"
  class="relative w-12 h-12 rounded-full transition-all duration-300 
    shadow-lg hover:shadow-xl active:scale-95 
    bg-secondary hover:bg-secondary/90 border-secondary/20"
  on:click={handleClick}
>
  <div class="relative z-10">
    <RotateCcw
      class="h-5 w-5 text-muted-foreground"
    />
  </div>
</Button> 