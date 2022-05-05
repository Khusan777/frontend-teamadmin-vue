<template>
  <div
    v-if="
      -20 < differencePercentMetrics(current_gitlab_events_count, previous_gitlab_events_count) &&
      differencePercentMetrics(current_gitlab_events_count, previous_gitlab_events_count) < 20
    "
  >
    <p class="text-black whitespace-nowrap items-center flex">
      {{ current_gitlab_events_count || 0 }}
      <span
        v-if="differenceEventCount(current_gitlab_events_count, previous_gitlab_events_count) > 0"
        class="text-black items-center flex"
        ><arrow-up-icon class="w-4 h-4 text-black-600"></arrow-up-icon
        >{{ differenceEventCount(current_gitlab_events_count, previous_gitlab_events_count) || 0 }}</span
      >
      <span
        v-if="differenceEventCount(current_gitlab_events_count, previous_gitlab_events_count) < 0"
        class="text-black items-center flex"
        ><arrow-down-icon class="w-4 h-4 text-black"></arrow-down-icon
        >{{ differenceEventCount(current_gitlab_events_count, previous_gitlab_events_count) || 0 }}</span
      >
    </p>
    <p class="text-gray-400 text-sm whitespace-nowrap">пред. неделя: {{ previous_gitlab_events_count || 0 }}</p>
  </div>

  <div
    v-else-if="
      -40 < differencePercentMetrics(current_gitlab_events_count, previous_gitlab_events_count) &&
      differencePercentMetrics(current_gitlab_events_count, previous_gitlab_events_count) < -20
    "
  >
    <p class="whitespace-nowrap items-center flex">
      {{ current_gitlab_events_count || 0 }}
      <span
        v-if="differenceEventCount(current_gitlab_events_count, previous_gitlab_events_count) > 0"
        class="text-orange-600 items-center flex"
        ><arrow-up-icon class="w-4 h-4 text-orange-600"></arrow-up-icon
        >{{ differenceEventCount(current_gitlab_events_count, previous_gitlab_events_count) || 0 }}</span
      >
      <span
        v-if="differenceEventCount(current_gitlab_events_count, previous_gitlab_events_count) < 0"
        class="text-orange-600 items-center flex"
        ><arrow-down-icon class="w-4 h-4 text-orange-600"></arrow-down-icon
        >{{ differenceEventCount(current_gitlab_events_count, previous_gitlab_events_count) || 0 }}</span
      >
    </p>
    <p class="text-gray-400 text-sm whitespace-nowrap">пред. неделя: {{ previous_gitlab_events_count || 0 }}</p>
  </div>

  <div v-else-if="differencePercentMetrics(current_gitlab_events_count, previous_gitlab_events_count) > 20">
    <p class="whitespace-nowrap items-center flex">
      {{ current_gitlab_events_count || 0 }}
      <span
        v-if="differenceEventCount(current_gitlab_events_count, previous_gitlab_events_count) > 0"
        class="text-green-600 items-center flex"
        ><arrow-up-icon class="w-4 h-4 text-green"></arrow-up-icon
        >{{ differenceEventCount(current_gitlab_events_count, previous_gitlab_events_count) || 0 }}</span
      >
      <span
        v-if="differenceEventCount(current_gitlab_events_count, previous_gitlab_events_count) < 0"
        class="text-green items-center flex"
        ><arrow-down-icon class="w-4 h-4 text-green-600"></arrow-down-icon
        >{{ differenceEventCount(current_gitlab_events_count, previous_gitlab_events_count) || 0 }}</span
      >
    </p>
    <p class="text-gray-400 text-sm whitespace-nowrap">пред. неделя: {{ previous_gitlab_events_count || 0 }}</p>
  </div>

  <div v-else>
    <p class="whitespace-nowrap items-center flex">
      {{ current_gitlab_events_count || 0 }}
      <span
        v-if="differenceEventCount(current_gitlab_events_count, previous_gitlab_events_count) > 0"
        class="text-red-600 items-center flex"
        ><arrow-up-icon class="w-4 h-4 text-red-600"></arrow-up-icon
        >{{ differenceEventCount(current_gitlab_events_count, previous_gitlab_events_count) || 0 }}</span
      >
      <span
        v-if="differenceEventCount(current_gitlab_events_count, previous_gitlab_events_count) < 0"
        class="text-red-600 items-center flex"
        ><arrow-down-icon class="w-4 h-4 text-red-600"></arrow-down-icon
        >{{ differenceEventCount(current_gitlab_events_count, previous_gitlab_events_count) || 0 }}</span
      >
    </p>
    <p class="text-gray-400 text-sm whitespace-nowrap">пред. неделя: {{ previous_gitlab_events_count || 0 }}</p>
  </div>
</template>

<script>
  import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/vue/solid';
  import {differencePercentMetrics,differenceEventCount} from "~/utils/hooks/calculateMetricEvent";
  export default {
    name: 'GitlabMetric',
    components: {
      ArrowDownIcon,
      ArrowUpIcon,
    },
    props: {
      current_gitlab_events_count: Number,
      previous_gitlab_events_count: Number,
    },
    setup(props) {
      return {
        differencePercentMetrics,
        differenceEventCount,
        props,
      };
    },
  };
</script>

<style scoped></style>
