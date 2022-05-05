<script>
  export default {
    beforeRouteEnter(to, from, next) {
      if (!to.query.tab) return next({ path: to.path, query: { tab: 'oldColleaguesActivity' } });
      next();
    },
  };
</script>

<script setup>
  import { useRoute } from 'vue-router';
  import { computed, defineAsyncComponent } from 'vue';
  const ColleaguesActivity = defineAsyncComponent(() => import('~/components/colleagues/activity/ColleaguesActivity'));
  const OldColleaguesActivity = defineAsyncComponent(() =>
    import('~/components/colleagues/activity/OldColleaguesActivity')
  );
  const AtTabs = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtTabs/AtTabs.js'));
  const route = useRoute();

  const tabComponents = computed(() => ({
    oldColleaguesActivity: {
      component: OldColleaguesActivity,
    },
    newColleaguesActivity: {
      component: ColleaguesActivity,
    },
  }));
</script>

<template>
  <div class="-m-6 mb-4">
    <div class="w-full bg-alpha">
      <div class="flex items-center p-4 border-b">
        <h1 class="text-2xl font-bold px-3">Активность</h1>
      </div>
    </div>
  </div>
  <div class="mt-4 mb-6">
    <AtTabs
      :items="[
        { title: 'Old Activity Page', value: 'oldColleaguesActivity', exact: true },
        { title: 'New Activity Page', value: 'newColleaguesActivity' },
      ]"
      :model-value="$route.query.tab"
      @update:model-value="$router.push({ path: $route.path, query: { tab: $event } })"
    />
  </div>
  <keep-alive>
    <component
      :is="tabComponents[route.query.tab]?.component || tabComponents.oldColleaguesActivity.component"
    ></component>
  </keep-alive>
</template>

<script></script>

<style scoped></style>
