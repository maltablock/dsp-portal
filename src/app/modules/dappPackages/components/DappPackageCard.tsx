import React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';

import checkboxChecked from 'app/shared/icons/checkbox_checked.svg';
import checkboxUnchecked from 'app/shared/icons/checkbox_unchecked.svg';
import cronIcon from 'app/shared/icons/cron.svg';
import ifpIcon from 'app/shared/icons/ifp.svg';
import oracleIcon from 'app/shared/icons/oracle.svg';

import DappPackage from '../state/DappPackage';
import Input from 'app/shared/components/Input';
import Button from 'app/shared/components/Button';
import { DappPackageStore } from '..';

const MOBILE_WIDTH = 671;

const CardWrapper = styled.div<any>`
  display: inline-flex;
  flex-direction: column;
  position: relative;
  width: 304px;
  padding: 24px 16px;
  margin: 16px;
  border-radius: 8px;
  background: linear-gradient(320deg, rgba(24,24,36,1) 0%, rgba(40,46,61,1) 100%);
  cursor: ${props => props.isSelected ? 'default' : 'pointer'};

  opacity: ${props => props.isHidden ? 0.1 : 1};
  margin-bottom: ${props => props.isSelected ? -120 : 16}px;
  z-index: ${props => props.isSelected ? 1 : 'auto'};

  transition: opacity 0.2s ease;

  @media (max-width: ${MOBILE_WIDTH}px) {
    width: calc(100% - 32px);
  }
`;

const TitleAndCheckboxWrapper = styled.div<any>`
  display: flex;
  margin-bottom: 12px;
  cursor: pointer;
`;

const Title = styled.div`
  font-size: 18px;
  font-family: Montserrat-Bold;
`;

const Checkbox = styled.img`
  margin-left: auto;
`;

const ServiceIconAndNameWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 14px;
`;

const ServiceIcon = styled.img``;

const ServiceName = styled.div`
  color: ${props => props.color};
  margin-left: 8px;
`;

const DetailsWrapper = styled.div`
  font-size: 14px;
`;

const DetailsRow = styled.div`
  display: flex;
  margin-bottom: 2px;
`;

const DetailsLabel = styled.div``;

const DetailsValue = styled.div`
  margin-left: auto;
  color: ${props => props.color};
`;

const AmountInputWrapper = styled.div`
  margin: 24px 0 4px;
`;

const ProviderWrapper = styled.div`
  display: flex;
  margin-top: 16px;
  align-items: center;
`;

const ProviderIcon = styled.div<any>`
  background-image: url(${props => props.iconUrl});
  background-position: top center;
  background-size: cover;
  background-color: #171322;
  width: 48px;
  height: 48px;
  border-radius: 50%;
`;

const ProviderName = styled.div`
  margin-left: 16px;
  opacity: 0.5;
`;

const StakeButtonWrapper = styled.div`
  margin-top: 24px;
`;

const StakeButton = styled(Button)`
  width: 100%;
  background: linear-gradient(0deg, rgb(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.25) 100%), #5826FF;
`;

const iconByService = {
  cronservices: cronIcon,
  oracleservic: oracleIcon,
  ipfsservice1: ifpIcon,
  default: ifpIcon,
};

const colorByService = {
  cronservices: '#45D3C2',
  oracleservic: '#FC4A71',
  ipfsservice1: '#7D69FF',
  default: '#7D69FF',
};

type Props = {
  dappPackage: DappPackage
  store: DappPackageStore
}

const DappPackageCard = ({ dappPackage, store }: Props) => {
  const p = dappPackage;
  const serviceIcon = iconByService[p.data.service] || iconByService.default;
  const serviceColor = colorByService[p.data.service] || colorByService.default;
  const minStakeAmountNoSymbol = p.data.min_stake_quantity.split(` `)[0]

  return (
    <CardWrapper
      onClick={p.handleSelect}
      isSelected={p.isSelected}
      isHidden={p.isHidden}
    >
      <TitleAndCheckboxWrapper
        isSelected={p.isSelected}
        onClick={p.handleDeselect}
      >
        <Title>
          {p.data.package_id.toUpperCase()}
        </Title>

        <Checkbox src={p.isSelected ? checkboxChecked : checkboxUnchecked} />
      </TitleAndCheckboxWrapper>

      <ServiceIconAndNameWrapper>
        <ServiceIcon src={serviceIcon} />
        <ServiceName color={serviceColor}>
          {p.data.service}
        </ServiceName>
      </ServiceIconAndNameWrapper>

      <DetailsWrapper>
        {
          [
            { label: 'Quota', value: p.data.quota },
            { label: 'Min Stake', value: p.data.min_stake_quantity },
            { label: 'Unstake time', value: p.unstakeTimeText }
          ].map(({ label, value }) =>
            <DetailsRow key={label}>
              <DetailsLabel>{label}</DetailsLabel>
              <DetailsValue color={serviceColor}>{value}</DetailsValue>
            </DetailsRow>
          )
        }
      </DetailsWrapper>

      {
        p.isSelected &&
        <AmountInputWrapper>
          <Input
            value={store.stakeValue}
            onChange={store.handleStakeValueChange}
            placeholder={`Stake Amount ${minStakeAmountNoSymbol}`}
            label="DAPP"
            autoFocus
          />
        </AmountInputWrapper>
      }

      <ProviderWrapper>
        <ProviderIcon iconUrl={p.data.icon} />
        <ProviderName>{p.data.provider}</ProviderName>
      </ProviderWrapper>

      {
        p.isSelected &&
        <StakeButtonWrapper>
          <StakeButton
            disabled={!store.stakeValueValid}
            color={serviceColor}
            onClick={store.handleStakeButtonClick}
          >
            Stake
          </StakeButton>
        </StakeButtonWrapper>
      }
    </CardWrapper>
  )
}

export default observer(DappPackageCard);
