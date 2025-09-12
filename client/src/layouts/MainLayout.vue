<template>
  <div class="main-layout">
    <Toolbar>
      <template #start>
        <div class="flex items-center gap-2">
          <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" style="width: 32px; height: 32px" />
        </div>
      </template>

      <template #center>
        <IconField>
          <InputIcon>
            <i class="pi pi-search" />
          </InputIcon>
          <InputText placeholder="Search" />
        </IconField>
      </template>

    </Toolbar>

        <Splitter class="splitter-container" style="border: none; border-radius: 0;" :gutter-size="0">
      <SplitterPanel class="main-left-panel" :size="25" :minSize="10">
        <Splitter layout="horizontal" style="height: 100%; border: none;" :gutter-size="0">
          <SplitterPanel class="servers-panel flex items-center justify-center" :size="25">
            <p>Servers</p>
          </SplitterPanel>
          <SplitterPanel class="flex items-center justify-center" :size="75">
            <p>Channels</p>
          </SplitterPanel>
        </Splitter>
      </SplitterPanel>

      <SplitterPanel :size="75">
        <slot />
      </SplitterPanel>
    </Splitter>
  </div>
</template>

<script setup>
</script>

<style>
.main-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}







</style>
