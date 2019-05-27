import React from 'react'
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';

import BlueGradientCard from 'app/shared/components/BlueGradientCard';
import Button from 'app/shared/components/Button';
import DappPackageStore from '../state/DappPackageStore';

const DialogContainer = styled.div`
  position: fixed;
  z-index: 10;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0,0,0,0.7);
`;

const DialogCard = styled(BlueGradientCard)`
  width: auto;
  height: auto;
  display: flex;
  margin: 200px auto 0;
  padding: 40px 32px;
  > * {
    margin: 0 auto;
  }
`;

const Title = styled.div`
  font-size: 23px;
`;

const Content = styled.div`
  margin-top: 22px;
  text-align: center;
  line-height: 1.6;
`;

const ContentInfo = styled.div`
  margin-top: 4px;
`;

const AmountText = styled.span`
  color: #0b1422;
`;

const HighlightedText = styled.div`
  display: inline-block;
  padding: 2px 8px;
  background-color: #0b1422;
  color: #404efe;
  border-radius: 4px;
  margin: 0 8px;
`;

const HighlightedText2 = styled(HighlightedText)`
  padding: 8px 16px;
  font-size: 14px;
`;

const Info = styled.div`
  font-size: 14px;
  margin: 40px auto 8px;
`;

const ButtonsWrapper = styled.div`
  margin-top: 40px;
`;

const CloseBtn = styled(Button)`
  background: #0b1422;
  padding: 11px 36px;
  font-size: 14px;
`;

type Props = {
  dappPackageStore?: DappPackageStore
}

const StakeSuccessDialog = ({ dappPackageStore }: Props) => {
  const { stakeValue, isStakedDialogVisible, closeStakeDialog, selectedPackage } = dappPackageStore!;

  if (!isStakedDialogVisible || !selectedPackage) return null;

  return (
    <DialogContainer>
      <DialogCard>
        <Title>
          Transactions Successful
        </Title>

        <Content>
          <div>You have staked <AmountText>{stakeValue} DAPP</AmountText> to</div>
          <ContentInfo>
            <HighlightedText>{selectedPackage.data.provider}</HighlightedText>
            for
            <HighlightedText>{selectedPackage.data.package_id}</HighlightedText>
          </ContentInfo>
        </Content>

        <Info>
          See Transaction
        </Info>

        <HighlightedText2>
          a7de1bcd43955b6f0f685d618da7b3f587c2d70ce7868f143df09abc887c2d70ce
        </HighlightedText2>

        <ButtonsWrapper>
          <CloseBtn onClick={closeStakeDialog}>Close</CloseBtn>
        </ButtonsWrapper>
      </DialogCard>
    </DialogContainer>
  )
}

export default inject('dappPackageStore')(observer(StakeSuccessDialog));
