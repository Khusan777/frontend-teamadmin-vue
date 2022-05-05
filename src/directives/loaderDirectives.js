import noPhoto from '~/assets/svg/noPhoto.svg';
import loaderGif from '~/assets/img/loaderGif.gif';

export default {
  beforeMount(el, binding) {
    const { value } = binding;
    const loader = loaderGif;
    const noImage = noPhoto;
    const img = new Image();
    let loading = loader;
    let error = noImage;
    let original = el.src;

    if (value instanceof Object) {
      loading = value.imageLoader || loader;
      error = value.noImage || noImage;
    }
    img.src = original;
    el.src = loading;
    img.onload = () => {
      el.src = original;
    };
    img.onerror = () => {
      el.src = error;
    };
  },
};
