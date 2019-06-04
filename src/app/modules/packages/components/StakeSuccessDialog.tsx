import React from 'react';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';

import BlueGradientCard from 'app/shared/components/BlueGradientCard';
import Button from 'app/shared/components/Button';
import PackageStore, { TransactionStatus } from '../state/PackageStore';

const DialogContainer = styled.div`
  position: fixed;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.7);
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
  packageStore?: PackageStore;
};

const getContent = (packageStore: PackageStore) => {
  const {
    stakeValue,
    selectedDappPackage,
    transactionId,
    transactionError,
    transactionStatus,
  } = packageStore;

  switch (transactionStatus) {
    case TransactionStatus.Pending: {
      return (
        <Content>
          <div>
            Staking <AmountText>{stakeValue} DAPP</AmountText> to
          </div>
          <ContentInfo>
            <HighlightedText>{selectedDappPackage!.data.provider}</HighlightedText>
            for
            <HighlightedText>{selectedDappPackage!.data.package_id}</HighlightedText>
          </ContentInfo>
        </Content>
      );
    }
    case TransactionStatus.Success: {
      return (
        <React.Fragment>
          <Content>
            <div>
              You have staked <AmountText>{stakeValue} DAPP</AmountText> to
            </div>
            <ContentInfo>
              <HighlightedText>{selectedDappPackage!.data.provider}</HighlightedText>
              for
              <HighlightedText>{selectedDappPackage!.data.package_id}</HighlightedText>
            </ContentInfo>
          </Content>

          <Info>See Transaction</Info>

          <HighlightedText2>{transactionId}</HighlightedText2>
        </React.Fragment>
      );
    }
    case TransactionStatus.Failure: {
      return (
        <Content>
          <div>The transaction failed.</div>
          <ContentInfo>
            <HighlightedText>{transactionError}</HighlightedText>
          </ContentInfo>
        </Content>
      );
    }
  }
};

const getTitle = (status: TransactionStatus) => {
  switch (status) {
    case TransactionStatus.Pending: {
      return `Sending transaction ...`;
    }
    case TransactionStatus.Success: {
      return `Transactions Successful`;
    }
    case TransactionStatus.Failure: {
      return `Transaction failed`;
    }
  }
};

const StakeSuccessDialog = ({ packageStore }: Props) => {
  const {
    isStakedDialogVisible,
    closeStakeDialog,
    selectedDappPackage,
  } = packageStore!;

  if (!isStakedDialogVisible || !selectedDappPackage) return null;

  const content = getContent(packageStore!);
  const title = getTitle(packageStore!.transactionStatus);

  return (
    <DialogContainer>
      <DialogCard>
        <Title>{title}</Title>

        {content}

        <ButtonsWrapper>
          <CloseBtn onClick={closeStakeDialog}>Close</CloseBtn>
        </ButtonsWrapper>
      </DialogCard>
    </DialogContainer>
  );
};

export default inject('packageStore')(observer(StakeSuccessDialog));
