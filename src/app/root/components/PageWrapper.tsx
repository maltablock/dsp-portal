import React from 'react';
import styled from 'styled-components';
import pageBg from 'app/shared/assets/page_bg.jpg';

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #10131f;
  background: url(${pageBg}) no-repeat top center;
  background-size: contain;
`;

export default PageWrapper;
