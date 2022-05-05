import { h } from 'vue';

const errorTemplate = error => h('div', { attrs: { class: 'text-xs text-red-500 mt-1' } }, error);

const ValidationErrors = props => {
  return props.errors ? errorTemplate(props.errors) : h('div');
};

ValidationErrors.props = {
  errors: { type: [Array, String], default: () => [] },
};

export default ValidationErrors;
