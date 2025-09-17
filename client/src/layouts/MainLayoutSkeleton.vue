<template>
  <div class="main-layout">
    <Toolbar class="custom-toolbar">
      <template #start>
        <Skeleton shape="circle" size="2.5rem" class="mr-2"></Skeleton>
      </template>

      <template #center>
        <Skeleton height="2.5rem" width="20rem"></Skeleton>
      </template>

      <template #end>
        <Skeleton height="2.5rem" width="8rem"></Skeleton>
      </template>
    </Toolbar>

    <Splitter class="splitter-container" style="border: none; border-radius: 0;" :gutter-size="0">
      <SplitterPanel class="main-left-panel" :size="25" :minSize="10">
        <Splitter layout="horizontal" style="height: 100%; border: none;" :gutter-size="0">

          <SplitterPanel class="servers-panel flex flex-col items-center gap-3 p-3" :size="25">
            <Skeleton v-for="i in 4" :key="i" shape="circle" size="3rem"></Skeleton>
          </SplitterPanel>

          <SplitterPanel class="flex flex-col gap-3 p-3" :size="75">
            <Skeleton width="60%" height="1.5rem"></Skeleton>
            <Skeleton width="80%" height="1.5rem"></Skeleton>
            <Skeleton width="50%" height="1.5rem"></Skeleton>
          </SplitterPanel>

        </Splitter>
      </SplitterPanel>

      <SplitterPanel class="p-4" :size="75">
        <div class="flex flex-col gap-4">
          <Skeleton width="40%" height="2rem"></Skeleton>
          <Skeleton height="1rem"></Skeleton>
          <Skeleton height="1rem" width="80%"></Skeleton>
          <Skeleton height="1rem" width="70%"></Skeleton>
        </div>
      </SplitterPanel>
    </Splitter>
  </div>
</template>

<script setup>
import Skeleton from 'primevue/skeleton';
</script>

<style>
.main-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background-color: var(--p-surface-ground, #eff3f8);
}

.splitter-container {
  flex-grow: 1;
  height: 100%;
}

.custom-toolbar {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--p-surface-border, #e5e7eb);
  background-color: var(--p-surface-card, #ffffff);
}

.main-left-panel {
  border-right: 1px solid var(--p-surface-border, #e5e7eb);
}

.servers-panel {
  border-right: 1px solid var(--p-surface-border, #e5e7eb);
  background-color: var(--p-surface-section, #f8f9fa);
}
</style>>
