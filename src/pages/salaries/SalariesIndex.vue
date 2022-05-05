<script>
  export default {
    beforeRouteEnter(to, from, next) {
      if (!to.query.tab) return next({ path: to.path, query: { tab: 'actual' } });
      next();
    },
  };
</script>

<script setup>
  import { useRoute } from 'vue-router';
  import { computed, defineAsyncComponent } from 'vue';
  const HistorySalaries = defineAsyncComponent(() => import('~/components/salaries/HistorySalaries.vue'));
  const AtTabs = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtTabs/AtTabs.js'));
  const ScheduleSalaries = defineAsyncComponent(() => import('~/components/salaries/ScheduleSalaries.vue'));
  const route = useRoute();
  const tabComponents = computed(() => ({
    actual: {
      component: HistorySalaries,
    },
    scheduled: {
      component: ScheduleSalaries,
    },
  }));
</script>

<template>
  <div class="-m-6 mb-4">
    <div class="w-full bg-alpha">
      <div class="flex items-center p-4 border-b">
        <h1 class="text-2xl font-bold px-3">Зарплаты</h1>
      </div>
    </div>
  </div>
  <div class="mt-4 mb-6">
    <AtTabs
      :items="[
        { title: 'История зарплаты', value: 'actual', icon: 'home', exact: true },
        { title: 'Запланированная зарплата', value: 'scheduled', icon: 'clipboardList' },
      ]"
      :model-value="$route.query.tab"
      @update:model-value="$router.push({ path: $route.path, query: { tab: $event } })"
    />
  </div>
  <keep-alive>
    <component :is="tabComponents[route.query.tab]?.component || tabComponents.actual.component"></component>
  </keep-alive>
</template>

<style scoped></style>
