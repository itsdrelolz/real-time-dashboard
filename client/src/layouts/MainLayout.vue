<template>
  <div class="main-layout">
    <Toolbar class="custom-toolbar">
      <template #start>
        <Button icon="pi pi-inbox" severity="secondary" text />
        <Button icon="pi pi-question-circle" severity="secondary" text />
        <Button icon="pi pi-user" severity="secondary" text />
      </template>

      <template #end>
        <IconField>
          <InputIcon>
            <i class="pi pi-search" />
          </InputIcon>
          <InputText placeholder="Search" style="width: 100%" />
        </IconField>
      </template>
    </Toolbar>

    <Splitter class="splitter-container" style="border: none; border-radius: 0;" :gutter-size="0">
      <!-- Main left panel, which now contains another splitter -->
      <SplitterPanel class="main-left-panel" :size="25" :minSize="10">
        <Splitter layout="horizontal" style="height: 100%; border: none;" :gutter-size="0">
          <!-- Far-left sidebar (1/4 of the left panel's space) -->
          <SplitterPanel class="servers-panel flex items-center justify-center" :size="25">
            <p>Servers</p>
          </SplitterPanel>
          <!-- Second sidebar (3/4 of the left panel's space) -->
          <SplitterPanel class="flex items-center justify-center" :size="75">
            <p>Channels</p>
          </SplitterPanel>
        </Splitter>
      </SplitterPanel>

      <!-- Main content panel on the right -->
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

.splitter-container {
  flex-grow: 1;
  height: 100%;
}

/* Custom styles for the toolbar */
.custom-toolbar {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  border-bottom: 1px solid var(--p-surface-border, #e5e7eb);
}

.main-left-panel {
  border-right: 1px solid var(--p-surface-border, #e5e7eb);
}

.servers-panel {
  border-right: 1px solid var(--p-surface-border, #e5e7eb);
}
</style>
