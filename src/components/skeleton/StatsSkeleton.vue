<script setup>
  import { defineAsyncComponent } from 'vue';
  const AtSkeleton = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtSkeleton/AtSkeleton'));
  const AtStats = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtStats/AtStats'));
</script>

<template>
  <at-stats>
    <template #title>
      <at-skeleton type="label" class="mb-1"></at-skeleton>
    </template>
    <template #value>
      <at-skeleton type="input"></at-skeleton>
      <at-skeleton type="input" class="mt-2"></at-skeleton>
    </template>
  </at-stats>
</template>
