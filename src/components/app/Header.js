import { h } from 'vue';

const Header = () => {
  return h(
    'header',
    null,
    h('div', { class: 'max-w-7xl py-4 ' }, h('h1', { class: 'text-3xl font-bold text-gray-900' }, 'Сотрудники'))
  );
};

export default Header;
