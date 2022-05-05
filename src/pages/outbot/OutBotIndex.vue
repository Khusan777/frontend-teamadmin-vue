<script>
  export default {
    beforeRouteEnter(to, from, next) {
      if (!to.query.tab) return next({ path: to.path, query: { tab: 'AllOutbotCases' } });
      next();
    },
  };
</script>

<script setup>
  import { useRoute } from 'vue-router';
  import { computed, defineAsyncComponent } from 'vue';
  const AllOutBotCases = defineAsyncComponent(() => import('~/components/outbot/AllOutBotCases.vue'));
  const OutBotLateCases = defineAsyncComponent(() => import('~/components/outbot/OutBotLateCases.vue'));
  const OutBotDayOffs = defineAsyncComponent(() => import('~/components/outbot/OutBotDayOffs.vue'));
  const OutBotSelfReasonCases = defineAsyncComponent(() => import('~/components/outbot/OutBotSelfReasonCases.vue'));
  const OutBotRemoteWorkCases = defineAsyncComponent(() => import('~/components/outbot/OutBotRemoteWorkCases.vue'));
  const AtTabs = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtTabs/AtTabs.js'));
  const route = useRoute();
  const tabComponents = computed(() => ({
    AllOutbotCases: {
      component: AllOutBotCases,
    },
    LateCases: {
      component: OutBotLateCases,
    },
    SelfReasonCases: {
      component: OutBotSelfReasonCases,
    },
    DayOffs: {
      component: OutBotDayOffs,
    },
    RemoteWorkCases: {
      component: OutBotRemoteWorkCases,
    },
  }));
</script>

<template>
  <div class="-m-6 mb-4">
    <div class="w-full bg-alpha">
      <div class="flex items-center p-4 border-b">
        <h1 class="text-2xl font-bold px-3">OutBot</h1>
      </div>
    </div>
  </div>
  <div class="mt-4 mb-6">
    <AtTabs
      :items="[
        { title: 'Все кейсы', value: 'AllOutbotCases', exact: true },
        { title: 'Опаздываю', value: 'LateCases' },
        { title: 'Предупреждение', value: 'SelfReasonCases' },
        { title: 'Отпрашивание', value: 'DayOffs' },
        { title: 'Работающие удалённо', value: 'RemoteWorkCases' },
      ]"
      :model-value="$route.query.tab"
      @update:model-value="$router.push({ path: $route.path, query: { tab: $event } })"
    />
  </div>
  <keep-alive>
    <component :is="tabComponents[route.query.tab]?.component || tabComponents.AllOutbotCases.component"></component>
  </keep-alive>
</template>

<style scoped></style>
