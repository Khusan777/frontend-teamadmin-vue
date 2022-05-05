import { useRoute, useRouter } from 'vue-router';

export default function useRouterReplace() {
  const router = useRouter();
  const route = useRoute();

  const setRouter = (query, pageQuery = {}) => {
    return router.push({
      name: route.name,
      query: {
        ...route.query,
        ...query.value,
        ...pageQuery,
      },
    });
  };

  return { setRouter };
}
