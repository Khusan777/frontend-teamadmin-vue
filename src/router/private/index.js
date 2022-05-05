export const privateRoutes = [
  {
    path: '/',
    name: 'app',
    component: () => import('~/layouts/core/AppLayout'),
    children: [
      {
        path: '/',
        name: 'employees',
        component: () => import('~/pages/colleagues/ColleaguesIndex'),
        meta: { title: 'Сотрудники' },
      },
      {
        path: '/salaries',
        name: 'salaries',
        component: () => import('~/pages/salaries/SalariesIndex'),
        meta: { title: 'Зарплаты' },
      },
      {
        path: '/colleagues/:id',
        name: 'colleagues.detail',
        component: () => import('~/pages/colleagues/ColleagueDetail'),
        meta: { title: 'Страница коллег' },
        props: true,
      },
      {
        path: '/productivity',
        name: 'productivity.index',
        component: () => import('~/pages/productivity/ProductivityIndex'),
        meta: { title: 'Продуктивность' },
      },
      {
        path: '/activity',
        name: 'activity.index',
        component: () => import('~/pages/activity/ActivityIndex'),
        meta: { title: 'Активность' },
      },
      {
        path: '/survey',
        name: 'surveys.index',
        component: () => import('~/pages/surveys/SurveysIndex'),
        meta: { title: 'Опросники' },
      },
      {
        path: '/outbot',
        name: 'outbot.index',
        component: () => import('~/pages/outbot/OutBotIndex'),
        meta: { title: 'OutBot' },
      },
      {
        path: '/surveys/:id',
        name: 'survey.detail',
        component: () => import('~/components/survey/SurveysShowPage'),
        meta: { title: 'Подробности' },
        props: true,
      },
      {
        path: '/not-found',
        name: 'object-not-found',
        component: () => import('~/pages/ObjectNotFound'),
      },
      {
        path: '/:pathMatch(.*)',
        name: 'not-found',
        component: () => import('~/pages/PageNotFound'),
      },
    ],
  },
];
