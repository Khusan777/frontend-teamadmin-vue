<template>
  <div v-if="type === 'card'" class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-4">
    <at-panel v-for="index in count" :key="index" class="text-center">
      <at-skeleton class="mb-2"></at-skeleton>
      <div class="mt-2 flex flex-col justify-center items-center">
        <at-skeleton type="row" class="w-36 h-6 px-auto"></at-skeleton>
        <at-skeleton type="row" class="mt-1 w-40 h-2 px-auto"></at-skeleton>
      </div>
    </at-panel>
  </div>
  <div v-if="type === 'list'" class="px-3 ml-5 w-96">
    <div class="grid grid-cols-1 sm:grid-cols-1">
      <div
        v-for="index in count"
        :key="index"
        class="
          relative
          rounded-lg
          py-5
          flex
          items-center
          space-x-3
          focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500
        "
      >
        <div class="flex-shrink-0">
          <AtSkeleton type="avatar"></AtSkeleton>
        </div>
        <div class="flex-1 min-w-0">
          <span class="absolute inset-0" aria-hidden="true"></span>
          <p class="text-sm font-medium text-gray-900">
            <at-skeleton type="row" class="w-36 h-6 px-auto"></at-skeleton>
          </p>
          <p class="text-sm text-gray-500 truncate">
            <at-skeleton type="row" class="mt-1 w-40 h-2 px-auto"></at-skeleton>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import AtPanel from '~/plugins/aliftech-ui/components/AtPanel/AtPanel';
  import AtSkeleton from '~/plugins/aliftech-ui/components/AtSkeleton/AtSkeleton';

  export default {
    name: 'Skeleton',
    components: { AtPanel, AtSkeleton },
    props: {
      count: { type: Number, default: 1 },
      type: { type: String, default: 'card' },
    },
  };
</script>

<style scoped></style>
