<script>
  export let message = '';
  export let show = false;
  export let type = 'error';

  $: if (show) {
    setTimeout(() => {
      show = false;
    }, 3000);
  }
</script>

{#if show}
  <div
    class="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg shadow-lg text-sm
    {type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}"
    role="alert"
  >
    {message}
  </div>
{/if} 