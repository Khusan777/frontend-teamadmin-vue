import noPhoto from '../../assets/svg/noPhoto.svg';

export default function useUserAvatar() {
  const getUserImage = (user, $event = null) => {
    const imageUrl = `${process.env.VUE_APP_BACKEND_API}/client/employee-avatar/${user}`;
    return $event ? ($event.target.src = noPhoto) : imageUrl;
  };
  const getUserResizedImage = (user, $event = null) => {
    const imageUrl = `${process.env.VUE_APP_BACKEND_API}/client/employee-avatar/${user}?resized=true`;
    return $event ? ($event.target.src = noPhoto) : imageUrl;
  };
  return { getUserImage, getUserResizedImage };
}
