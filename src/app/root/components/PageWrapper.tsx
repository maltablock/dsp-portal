import React from 'react';
import styled from 'styled-components';
import theme from 'styled-theming';

import { lightDarkValues } from 'app/shared/styles/utils';
import pageBg from 'app/shared/assets/page_bg.jpg';

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${lightDarkValues('#fff', '#10131f')};
  /* background: url(${pageBg}) no-repeat top center; */
  /* background-size: contain; */

  body * {
    color: ${lightDarkValues('#333', '#fff')}
  }
`;

export default PageWrapper;
