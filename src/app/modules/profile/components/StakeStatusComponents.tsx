import React from 'react'
import styled from 'styled-components';

import BlueGradientCard from 'app/shared/components/BlueGradientCard';
import Button from 'app/shared/components/Button';
import liquidAppsLogo from 'app/shared/icons/liquidapps_logo.svg';
import { formatAsset } from 'app/shared/eos';
import { DAPP_SYMBOL } from 'app/shared/eos/constants';
import { secondsToTimeObject } from 'app/shared/utils/time';

const MOBILE_WIDTH = 960;

const Wrapper = styled.div<any>`
  width: 100%;
  margin: 8px;
  transition: margin-bottom 0.5s ease;

  @media (max-width: ${MOBILE_WIDTH}px) {
    z-index: ${props => props.zIndex};

    :not(:last-child) {
      margin-bottom: ${props => props.expanded ? 0 : -150}px;
    }
  }
`;

const CardWrapper = styled(BlueGradientCard)<any>`
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 16px 24px;
  height: 193px;
  width: 100%;
  box-shadow: rgba(0,0,0,0.4) -1px 5px 12px 3px;
`;

const StakeButton = styled(Button)`
  position: absolute;
  top: 16px;
  right: 16px;
  color: #414DFF;
  background-color: #fff;
  padding: 5px 20px;
  font-size: 12px;
`;

const Logo = styled.img`
  width: 40px;
  margin-top: 16px;
`;

const Text = styled.div`
  margin-top: 10px;
  font-size: 18px;
`;

const Amount = styled.div`
  margin-top: 12px;
  font-size: 24px;
`;

const AmountUsd = styled.div`
  margin-top: 2px;
  font-size: 14px;
  opacity: 0.6;
`;

const RemainingTimeBlock = styled.div`
  background-color: #45D3C2;
  font-size: 13px;
  color: #11141E;
  border-radius: 4px;
  padding: 16px 16px 8px 24px;
  margin-top: -8px;
  z-index: -1;
`;

type CardProps = {
  text: string,
  amount: number,
  amountUsd: number,
  zIndex?: number,
  expanded?: boolean,
  remainingTime?: number,
}

export const StakeStatusCard = ({
  text,
  amount,
  amountUsd,
  zIndex,
  expanded,
  remainingTime,
}: CardProps) => {
  return (
    <Wrapper zIndex={zIndex} expanded={expanded}>
      <CardWrapper>
        <StakeButton>Stake</StakeButton>
        <Logo src={liquidAppsLogo}/>
        <Text>{text}</Text>
        <Amount>
          {formatAsset({ amount, symbol: DAPP_SYMBOL }, { withSymbol: false, separateThousands: true })}
        </Amount>
        <AmountUsd>${amountUsd.toFixed(2)}</AmountUsd>
      </CardWrapper>

      {
        !remainingTime ? null : (() => {
          const t = secondsToTimeObject(remainingTime);
          return (
            <RemainingTimeBlock>
              {t.days} Days : {t.hours} hr : {t.minutes} min : {t.seconds} sec
            </RemainingTimeBlock>
          )
        })()
      }
    </Wrapper>
  )
}

export const StakeStatusCardsWrapper = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  margin: 74px auto 97px;
  padding: 0 8px;

  @media (max-width: ${MOBILE_WIDTH}px) {
    flex-direction: column;
    margin: 32px 8px;
    padding: 0;
    width: calc(100% - 32px);
  }

  @media (min-width: 1200px) {
    width: 1200px;
  }
`;

export const ToggleExpandButton = styled.div`
  position: absolute;
  top: 150px;
  right: 16px;
  z-index: 10;
  padding: 8px;
  cursor: pointer;

  @media (min-width: ${MOBILE_WIDTH + 1}px) {
    display: none;
  }
`;
