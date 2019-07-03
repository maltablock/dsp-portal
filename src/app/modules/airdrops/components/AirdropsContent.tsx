import React, { useCallback, useEffect, ReactElement } from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';

import AirdropsDescription from './AirdropsDescription';
import AirdropStore from '../state/AirdropStore';
import Button from 'app/shared/components/Button';
import liquidAppsLogo from 'app/shared/icons/liquidapps_logo.svg';
import { formatAsset } from 'app/shared/eos';

const Wrapper = styled.div`
  margin: 0 auto 16px;
  width: ${976 + 16 * 2}px;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (min-width: 672px) and (max-width: 1008px) {
    width: ${640 + 16 * 2}px;
  }

  @media (max-width: 671px) {
    width: 100%;
    overflow-x: auto;
  }
`;

const InfoText = styled.div`
  & > code {
    color: #404efe;
  }
`;

const AirdropsList = styled.ul`
  display: flex;
  justify-items: center;
  align-items: center;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 40px 0 0 0;
  text-indent: 0;
  list-style: none;
  padding-left: 0;

  @media (max-width: 671px) {
    flex-direction: column;
  }
`;

const AirdropWrapper = styled.li`
  text-indent: 0;
  list-style: none;
  padding: 16px;
  margin: 12px;
  height: 246px;
  width: 304px;
  border-radius: 8px;
  background: linear-gradient(152.3deg, #282e3d 0%, #181824 100%);
  box-shadow: 0 0 14px 0 rgba(0, 0, 0, 0.31);
`;

const Heading = styled.div<any>`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: bold;
  line-height: 22px;
  color: #dde0e3;
`;

const TokenIcon = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: 8px;
`;

const SubTitle = styled.div`
  color: #7d69ff;
`;

const DetailsWrapper = styled.div`
  font-size: 14px;
  margin: 9px 0 0 0;
`;

const DetailsRow = styled.div`
  display: flex;
  margin-bottom: 2px;
`;

const DetailsLabel = styled.div``;

const DetailsValue = styled.div`
  margin-left: auto;
  color: #7d69ff;
`;

const ButtonWrapper = styled.div`
  margin-top: 24px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ClaimButton = styled(Button)`
  width: 100%;
  background: linear-gradient(0deg, rgb(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.25) 100%),
    #5826ff;
`;

const ClaimedBadge = styled.div`
  display: inline-block;
  background-color: #414dff;
  border-radius: 11px;
  padding: 4px 24px;
  font-size: 12px;
`;

type Props = {
  airdropStore?: AirdropStore;
};

const AirdropsContent = ({ airdropStore }: Props) => {
  useEffect(() => {
    airdropStore!.init();
  }, [airdropStore]);

  let airdropsList:(ReactElement|null) = null;
  if (airdropStore!.displayAccount) {
    airdropsList = (
      <AirdropsList>
        {airdropStore!.airdrops.map(airdrop => (
          <AirdropWrapper key={`${airdrop.tokenContract}|${airdrop.tokenName}`}>
            <Heading>
              <TokenIcon src={liquidAppsLogo} />
              <Title>{airdrop.tokenName}</Title>
            </Heading>

            <SubTitle>{airdrop.tokenContract}</SubTitle>

            <DetailsWrapper>
              <DetailsRow>
                <DetailsLabel>Balance:</DetailsLabel>
                <DetailsValue>
                  {formatAsset({ amount: airdrop.balance, symbol: airdrop.tokenSymbol })}
                </DetailsValue>
              </DetailsRow>
              <DetailsRow>
                <DetailsLabel>Claim Ends:</DetailsLabel>
                <DetailsValue>{airdrop.endDate}</DetailsValue>
              </DetailsRow>
              <DetailsRow>
                <DetailsLabel>Cost:</DetailsLabel>
                <DetailsValue>{`${airdrop.bytesRequired} bytes`}</DetailsValue>
              </DetailsRow>
            </DetailsWrapper>

              <ButtonWrapper>
                {airdrop.claimed ? (
                  <ClaimedBadge>Claimed</ClaimedBadge>
                ) : (
                  <ClaimButton onClick={airdrop.claim}>
                    Claim
                  </ClaimButton>
                )}
              </ButtonWrapper>
          </AirdropWrapper>
        ))}
      </AirdropsList>
    );
  }
  return (
    <Wrapper>
      <AirdropsDescription />
      {airdropStore!.displayAccount ? (
        <InfoText>
          vAirdrop Balances for: <code>{airdropStore!.displayAccount}</code>
        </InfoText>
      ) : null}
      {airdropsList}
    </Wrapper>
  );
};

export default inject('airdropStore')(observer(AirdropsContent));
