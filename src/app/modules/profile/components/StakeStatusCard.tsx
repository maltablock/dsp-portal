import React from 'react'
import styled from 'styled-components';

import BlueGradientCard from 'app/shared/components/BlueGradientCard';
import Button from 'app/shared/components/Button';
import liquidAppsLogo from 'app/shared/icons/liquidapps_logo.svg';
import { formatAsset } from 'app/shared/eos';
import { DAPP_SYMBOL } from 'app/shared/eos/constants';
import { secondsToTimeObject } from 'app/shared/utils/time';
import { observer } from 'mobx-react';

const MOBILE_WIDTH = 960;

const Wrapper = styled.div<any>`
  width: 100%;
  margin: 8px;
  border-radius: 8px;
  box-shadow: rgba(0,0,0,0.4) 0px 5px 10px 3px;
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
  border-radius: 8px;
  height: 193px;
  width: 100%;
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
  display: flex;
  align-items: center;
`;

const AmountUsd = styled.div`
  margin-top: 2px;
  font-size: 14px;
  opacity: 0.6;
`;

const RemainingTimeWrapper = styled.div`
  background-color: #45D3C2;
  font-size: 13px;
  color: #11141E;
  border-radius: 0 0 8px 8px;
  padding: 16px 16px 8px 24px;
  margin-top: -8px;
  z-index: -1;
`;

type RemainingTimeProps = { remainingTilDate: string };

class RemainingTime extends React.Component<RemainingTimeProps> {
  componentDidMount() {
    setInterval(() => this.forceUpdate(), 1000);
  }
  render() {
    const { remainingTilDate } = this.props;
    const secondsFromNow = Math.floor((new Date(remainingTilDate).getTime() - Date.now()) / 1000);
    const t = secondsToTimeObject(secondsFromNow);

    return (
      <RemainingTimeWrapper>
        {t.days} Days : {t.hours} hr : {t.minutes} min : {t.seconds} sec
      </RemainingTimeWrapper>
    )
  }
}

type CardProps = {
  text: string,
  amount: number,
  amountUsd: number,
  zIndex?: number,
  expanded?: boolean,
  remainingTilDate?: string,
  refreshButton?: any,
  buttonText?: string,
  buttonOnClick?: () => void,
}

const StakeStatusCardComponent = observer(({
  text,
  amount,
  amountUsd,
  remainingTilDate,
  refreshButton = null,
  buttonText,
  buttonOnClick,
}: CardProps) => {
  return (
    <React.Fragment>
      <CardWrapper>
        {
          (buttonText && buttonOnClick)
          ? <StakeButton onClick={buttonOnClick}>{buttonText}</StakeButton>
          : null
        }
        <Logo src={liquidAppsLogo}/>
        <Text>{text}</Text>
        <Amount>
          {formatAsset({ amount, symbol: DAPP_SYMBOL }, { withSymbol: false, separateThousands: true })}
          {refreshButton}
        </Amount>
        <AmountUsd>${amountUsd.toFixed(2)}</AmountUsd>
      </CardWrapper>

      {
        remainingTilDate &&
        <RemainingTime remainingTilDate={remainingTilDate} />
      }
    </React.Fragment>
  )
});

const StakeStatusCard = observer(({ zIndex, expanded, ...props }: CardProps) =>
  <Wrapper zIndex={zIndex} expanded={expanded}>
    <StakeStatusCardComponent {...props} />
  </Wrapper>
);

export default StakeStatusCard;
