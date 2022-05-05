<template>
  <div
    v-if="
      -20 < differencePercentMetrics(current_office_activity_minutes, previous_office_activity_minutes) &&
      differencePercentMetrics(current_office_activity_minutes, previous_office_activity_minutes) < 20
    "
  >
    <p class="text-black whitespace-nowrap items-center flex">
      {{ convertMinsToHrsMins(current_office_activity_minutes) || 0 }}
      <span
        v-if="differenceEventCount(current_office_activity_minutes, previous_office_activity_minutes) > 0"
        class="text-black items-center flex"
        ><arrow-up-icon class="w-4 h-4 text-black-600"></arrow-up-icon
        >{{ differenceWifiHours(current_office_activity_minutes, previous_office_activity_minutes) || 0 }}</span
      >
      <span
        v-if="differenceEventCount(current_office_activity_minutes, previous_office_activity_minutes) < 0"
        class="text-black items-center flex"
        ><arrow-down-icon class="w-4 h-4 text-black"></arrow-down-icon
        >{{ differenceWifiHours(current_office_activity_minutes, previous_office_activity_minutes) || 0 }}</span
      >
    </p>
    <p class="text-gray-400 text-sm whitespace-nowrap">
      пред. неделя: {{ convertMinsToHrsMins(previous_office_activity_minutes) || 0 }}
    </p>
  </div>

  <div
    v-else-if="
      -40 < differencePercentMetrics(current_office_activity_minutes, previous_office_activity_minutes) &&
      differencePercentMetrics(current_office_activity_minutes, previous_office_activity_minutes) < -20
    "
  >
    <p class="whitespace-nowrap items-center flex">
      {{ convertMinsToHrsMins(current_office_activity_minutes) || 0 }}
      <span
        v-if="differenceEventCount(current_office_activity_minutes, previous_office_activity_minutes) > 0"
        class="text-orange-600 items-center flex"
        ><arrow-up-icon class="w-4 h-4 text-orange-600"></arrow-up-icon
        >{{ differenceWifiHours(current_office_activity_minutes, previous_office_activity_minutes) || 0 }}</span
      >
      <span
        v-if="differenceEventCount(current_office_activity_minutes, previous_office_activity_minutes) < 0"
        class="text-orange-600 items-center flex"
        ><arrow-down-icon class="w-4 h-4 text-orange-600"></arrow-down-icon
        >{{ differenceWifiHours(current_office_activity_minutes, previous_office_activity_minutes) || 0 }}</span
      >
    </p>
    <p class="text-gray-400 text-sm whitespace-nowrap">
      пред. неделя: {{ convertMinsToHrsMins(previous_office_activity_minutes) || 0 }}
    </p>
  </div>

  <div v-else-if="differencePercentMetrics(current_office_activity_minutes, previous_office_activity_minutes) > 20">
    <p class="whitespace-nowrap items-center flex">
      {{ convertMinsToHrsMins(current_office_activity_minutes) || 0 }}
      <span
        v-if="differenceEventCount(current_office_activity_minutes, previous_office_activity_minutes) > 0"
        class="text-green-600 items-center flex"
        ><arrow-up-icon class="w-4 h-4 text-green"></arrow-up-icon
        >{{ differenceWifiHours(current_office_activity_minutes, previous_office_activity_minutes) || 0 }}</span
      >
      <span
        v-if="differenceEventCount(current_office_activity_minutes, previous_office_activity_minutes) < 0"
        class="text-green items-center flex"
        ><arrow-down-icon class="w-4 h-4 text-green-600"></arrow-down-icon
        >{{ differenceWifiHours(current_office_activity_minutes, previous_office_activity_minutes) || 0 }}</span
      >
    </p>
    <p class="text-gray-400 text-sm whitespace-nowrap">
      пред. неделя: {{ convertMinsToHrsMins(previous_office_activity_minutes) || 0 }}
    </p>
  </div>

  <div v-else>
    <p class="whitespace-nowrap items-center flex">
      {{ convertMinsToHrsMins(current_office_activity_minutes) || 0 }}
      <span
        v-if="differenceEventCount(current_office_activity_minutes, previous_office_activity_minutes) > 0"
        class="text-red-600 items-center flex"
        ><arrow-up-icon class="w-4 h-4 text-red-600"></arrow-up-icon
        >{{ differenceWifiHours(current_office_activity_minutes, previous_office_activity_minutes) || 0 }}</span
      >
      <span
        v-if="differenceEventCount(current_office_activity_minutes, previous_office_activity_minutes) < 0"
        class="text-red-600 items-center flex"
        ><arrow-down-icon class="w-4 h-4 text-red-600"></arrow-down-icon
        >{{ differenceWifiHours(current_office_activity_minutes, previous_office_activity_minutes) || 0 }}</span
      >
    </p>
    <p class="text-gray-400 text-sm whitespace-nowrap">
      пред. неделя: {{ convertMinsToHrsMins(previous_office_activity_minutes) || 0 }}
    </p>
  </div>
</template>

<script>
  import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/vue/solid';
  import { differencePercentMetrics, differenceEventCount } from '~/utils/hooks/calculateMetricEvent';
  import { convertMinsToHrsMins } from '~/utils/filters/dateFilters';
  import { ref } from 'vue';

  export default {
    name: 'OfficeMetric',
    components: {
      ArrowDownIcon,
      ArrowUpIcon,
    },
    props: {
      current_office_activity_minutes: Number,
      previous_office_activity_minutes: Number,
    },
    setup(props) {
      let totalPoint = ref(null);

      const differenceWifiHours = (current_issues_count, previous_issues_count) => {
        totalPoint.value = current_issues_count - previous_issues_count;
        return convertMinsToHrsMins(Math.abs(totalPoint.value));
      };
      return {
        convertMinsToHrsMins,
        differenceWifiHours,
        differencePercentMetrics,
        differenceEventCount,
        props,
      };
    },
  };
</script>

<style scoped></style>
