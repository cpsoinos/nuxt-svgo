<template>
  <div class="!h-screen">
    <NNavbar v-model:search="search" rounded-tr="lg">
      <div class="text-xs">
        <span v-if="search" class="op-40"> {{ filtered?.length ?? 0 }} matched </span>
        <span class="op-40"> {{ icons?.length ?? 0 }} icons in total </span>
      </div>
    </NNavbar>

    <div v-if="pending">
      <NLoading />
    </div>

    <div v-else-if="error">
      <NTip n="red6 dark:red5" icon="carbon:warning-alt">
        {{ error }}
      </NTip>
    </div>

    <div v-else>
      <div class="p-4 gap-4" grid="~ cols-1 sm:cols-2 md:cols-3 lg:cols-4">
        <IconCard v-for="icon of filtered" :key="icon.componentName" :icon="icon" />
      </div>
    </div>
  </div>
</template>

<script setup>
  import { onDevtoolsClientConnected } from '@nuxt/devtools-kit/iframe-client'
  import { computed, ref } from 'vue'

  const RPC_NAMESPACE = 'nuxt-svgo-rpc'

  const icons = ref([])
  const search = ref('')
  const error = ref(null)
  const pending = ref(false)
  const filtered = computed(() => {
    return icons.value.filter((icon) => icon.componentName.includes(search.value))
  })

  onDevtoolsClientConnected(async (client) => {
    try {
      const rpc = client.devtools.extendClientRpc(RPC_NAMESPACE, {})

      // Load icons using RPC
      const response = await rpc.listIcons()
      icons.value = response.icons
    } catch (e) {
      console.error('Failed to load icons via RPC:', e)
      error.value = e.message || 'Failed to load icons'
    } finally {
      pending.value = false
    }
  })
</script>
