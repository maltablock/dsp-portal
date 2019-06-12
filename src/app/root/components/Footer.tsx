import React from 'react';
import styled from 'styled-components';
import { ReactComponent as Telegram } from 'app/shared/assets/logo-telegram.svg';
import { ReactComponent as Facebook } from 'app/shared/assets/logo-facebook.svg';
import { ReactComponent as Medium } from 'app/shared/assets/logo-medium.svg';
import { ReactComponent as Twitter } from 'app/shared/assets/logo-twitter.svg';
import { ReactComponent as Mail } from 'app/shared/assets/contact.svg';
import { ReactComponent as LiquidAppsLogo } from 'app/shared/assets/logo-liquidapps.svg';

const MOBILE_WIDTH = 671;

const FooterWrapper = styled.section`
  width: 100%;
  background-color: #1b222f;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 60px 0;
  margin-top: 40px;

  @media only screen and (max-width: ${MOBILE_WIDTH}px) {
    flex-direction: column;
  }
`;

const AirHodlSection = styled.div`
  order: 0;
  @media only screen and (max-width: ${MOBILE_WIDTH}px) {
    order: 0;
  }
`;

const MaltaBlockSection = styled.div`
  order: 1;
  @media only screen and (max-width: ${MOBILE_WIDTH}px) {
    margin-top: 40px;
    order: 2;
  }
`;

const LiquidAppsSection = styled.div`
  order: 2;
  @media only screen and (max-width: ${MOBILE_WIDTH}px) {
    margin-top: 40px;
    order: 1;
  }
`;

const SectionHeading = styled.div`
  color: #a1a8b3;
  font-family: Montserrat;
  font-size: 14px;
  font-weight: 600;
  line-height: 18px;
  text-align: center;
  margin-bottom: 18px;
`;

const StyledLink = styled.a`
  color: #414dff;
  font-family: Montserrat;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
`;

const BigHeading = styled.div`
  color: #ffffff;
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 40px;
`;

const SocialBar = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;

  & > * {
    margin: 0 20px;
  }
`;

const PolicyBar = styled.div`
  margin-top: 40px;
  color: #a1a8b3;
  font-family: Montserrat;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  justify-content: center;

  a,
  a:visited {
    text-decoration: none;
    color: #a1a8b3;
  }

  span {
    white-space: pre;
  }
`;

const Footer = () => {
  return (
    <FooterWrapper>
      <AirHodlSection>
        <SectionHeading>Air-HODL</SectionHeading>
        <StyledLink href="https://liquidapps.io/air-hodl" target="_blank" rel="noopener noreferrer">
          liquidapps.io/air-hodl
        </StyledLink>
      </AirHodlSection>
      <MaltaBlockSection>
        <SectionHeading>DSP Portal</SectionHeading>
        <BigHeading>MaltaBlock.org</BigHeading>
        <SocialBar>
          <Mail />
          <Twitter />
          <Telegram />
          <Medium />
          <Facebook />
        </SocialBar>
        <PolicyBar>
          <a href="#">
            Terms of Service
          </a>
          <span>{`   |   `}</span>
          <a href="#">
            Privacy Policy
          </a>
        </PolicyBar>
      </MaltaBlockSection>
      <LiquidAppsSection>
        <SectionHeading>DAPP Network</SectionHeading>
        <a href="https://liquidapps.io" target="_blank" rel="noopener noreferrer">
          <LiquidAppsLogo width={195} height={30} />
        </a>
      </LiquidAppsSection>
    </FooterWrapper>
  );
};

export default Footer;
