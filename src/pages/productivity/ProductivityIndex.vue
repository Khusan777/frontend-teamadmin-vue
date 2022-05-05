<script>
  export default {
    beforeRouteEnter(to, from, next) {
      if (!to.query.tab) return next({ path: to.path, query: { tab: 'employeeMetrics' } });
      next();
    },
  };
</script>

<script setup>
  import { useRoute } from 'vue-router';
  import { computed, defineAsyncComponent } from 'vue';
  import AllMetricsIndex from '~/components/productivity/EmployeeDataMetric';
  import ManagerDataMetric from '~/components/productivity/ManagerDataMetric';
  import TeamDataMetric from '~/components/productivity/TeamDataMetric';

  const AtTabs = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtTabs/AtTabs.js'));
  const route = useRoute();
  const tabComponents = computed(() => ({
    employeeMetrics: {
      component: AllMetricsIndex,
    },
    managerMetrics: {
      component: ManagerDataMetric,
    },
    teamMetrics: {
      component: TeamDataMetric,
    },
  }));
</script>

<template>
  <div class="-m-6 mb-4">
    <div class="w-full bg-alpha">
      <div class="flex items-center p-4 border-b">
        <h1 class="text-2xl font-bold px-3">Продуктивность</h1>
      </div>
    </div>
  </div>
  <div class="mt-4 mb-6">
    <AtTabs
      :items="[
        { title: 'Сотрудники', value: 'employeeMetrics' },
        { title: 'Менеджеры', value: 'managerMetrics' },
        { title: 'Команды', value: 'teamMetrics' },
      ]"
      :model-value="$route.query.tab"
      @update:model-value="$router.push({ path: $route.path, query: { tab: $event } })"
    />
  </div>
  <keep-alive>
    <component
      :is="tabComponents[route.query.tab]?.component || tabComponents.employeeMetrics.component"
      v-bind="tabComponents[route.query.tab]?.props || tabComponents.employeeMetrics.props"
    ></component>
  </keep-alive>
</template>

<style scoped></style>
