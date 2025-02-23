export const setCookie = (label: string, value: string) => {
  const days = 30;
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = '; expires=' + date.toUTCString();
  document.cookie = `${label}=${value};expires=${expires};path=/`;
};
