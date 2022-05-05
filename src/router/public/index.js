export const publicRoutes = [
  {
    path: '/auth',
    name: 'auth',
    component: () => import('~/layouts/auth/AuthLayout'),
    children: [
      {
        path: '/',
        name: 'auth.login',
        component: () => import('~/pages/auth/AuthPage'),
        meta: { public: true, title: 'Авторизация' },
      },
    ],
  },
];
