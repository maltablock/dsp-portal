import { createGlobalStyle } from 'styled-components';
import theme from 'styled-theming';

const GlobalStyles = createGlobalStyle`
  body {
    padding: 0;
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    color: ${theme('mode', {
      light: '#333',
      dark: '#fff',
    })};
  }

  * {
    font-family: Montserrat, sans-serif;
    box-sizing: border-box;
    transition: color, background-color, background, border-color 0.2s ease;
  }
`;

export default GlobalStyles;
