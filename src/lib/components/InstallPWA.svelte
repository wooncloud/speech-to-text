<script>
  import { onMount } from 'svelte';
  import { Button } from "$lib/components/ui/button";
  import { fade, slide } from 'svelte/transition';

  let deferredPrompt;
  let showInstallButton = false;
  let isIOS = false;
  let isStandalone = false;

  onMount(() => {
    isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                   window.navigator.standalone;

    if (isStandalone) return;

    if (isIOS) {
      const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
      showInstallButton = isSafari;
    } else {
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        showInstallButton = true;
      });
    }

    window.addEventListener('appinstalled', () => {
      showInstallButton = false;
      deferredPrompt = null;
    });

    // 5초 후 자동으로 숨기기
    if (showInstallButton) {
      setTimeout(() => {
        showInstallButton = false;
      }, 5000);
    }
  });

  function hideInstallPrompt() {
    showInstallButton = false;
  }

  async function installPWA() {
    if (isIOS) return;
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      showInstallButton = false;
    }
    deferredPrompt = null;
  }
</script>

{#if showInstallButton}
  <div 
    class="fixed top-0 left-0 right-0 p-4 flex justify-center z-50"
    transition:slide|local={{ duration: 300, axis: 'y' }}
    on:click={hideInstallPrompt}
    on:keydown={(e) => e.key === 'Escape' && hideInstallPrompt()}
    role="button"
    tabindex="0"
  >
    <div 
      class="bg-primary text-primary-foreground px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 max-w-sm mx-auto cursor-pointer"
      transition:fade|local={{ duration: 200 }}
    >
      <div class="flex-1">
        {#if isIOS}
          <p class="text-sm font-medium">Safari에서 앱 설치하기</p>
          <p class="text-xs opacity-90">
            공유 버튼을 누른 후 "홈 화면에 추가"를 선택하세요
          </p>
        {:else}
          <p class="text-sm font-medium">앱으로 설치하기</p>
          <p class="text-xs opacity-90">더 나은 사용 경험을 위해 앱으로 설치해보세요</p>
        {/if}
      </div>
      {#if !isIOS}
        <Button 
          variant="secondary" 
          class="shrink-0" 
          on:click={(e) => {
            e.stopPropagation();
            installPWA();
          }}
        >
          설치하기
        </Button>
      {/if}
    </div>
  </div>
{/if}

<style>
  /* iOS에서 터치 하이라이트 제거 */
  div {
    -webkit-tap-highlight-color: transparent;
  }
</style> 