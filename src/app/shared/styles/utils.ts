import theme from 'styled-theming';

export const lightDarkValues = (light, dark) => {
  return theme('mode', { light, dark });
};
