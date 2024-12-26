<script>
  export let message = '';
  export let type = 'error';
  let show = false;

  /**
   * 알림을 표시하고 3초 후 자동으로 숨깁니다.
   */
  export function showAlert() {
    show = true;
    setTimeout(() => {
      show = false;
    }, 3000);
  }
</script>

{#if show}
  <div
    class="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg shadow-lg text-sm break-keep
    {type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}"
    role="alert"
  >
    {message}
  </div>
{/if} 