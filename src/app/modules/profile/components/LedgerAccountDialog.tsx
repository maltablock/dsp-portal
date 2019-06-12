import React from 'react';
import styled from 'styled-components';
import { observable, action, computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import { DiscoveryData } from 'eos-transit/lib';

import DialogItem from 'app/modules/dialogs/state/DialogItem';
import ProfileStore from '../state/ProfileStore';
import MenuSimple from 'app/shared/components/MenuSimple';

import {
  DialogContainer,
  DialogCard as _DialogCard,
  SubmitButton
} from 'app/modules/dialogs/components/DialogComponents';


const DialogCard = styled(_DialogCard)`
  width: 600px;

  > * {
    margin: 0;
  }
  * {
    text-align: left;
  }
`;

const Title = styled.div`
  font-size: 22px;
  font-weight: 600;
  margin: 0 auto;
`;

const Label = styled.div`
  font-size: 14px;
  padding: 8px;
  margin: 16px 0 8px;
`;

const ButtonsWrapper = styled.div`
  margin: 40px auto 0;
`;


type Props = {
  dialog: DialogItem<{ discoveryData: DiscoveryData }>,
}


@observer
class LedgerAccountDialog extends React.Component<Props> {
  @observable keyIndex = 0;
  @observable accountIndex = 0;

  @action selectKeyIndex = idx => {
    // reset account index when keyIndex is changed
    this.accountIndex = 0;
    this.keyIndex = idx;
  }

  @action selectAccountIndex = idx => {
    this.accountIndex = idx;
  }

  @computed get selectedKey() {
    return this.props.dialog.data.discoveryData.keyToAccountMap[this.keyIndex];
  }

  @computed get selectedAccount() {
    return this.selectedKey.accounts[this.accountIndex];
  }

  @computed get isValid() {
    return Boolean(this.selectedKey && this.selectedAccount);
  }

  @action handleSubmit = () => {
    const { account, authorization } = this.selectedAccount;
    this.props.dialog.submit({ account, authorization })
  }

  render() {
    const { dialog } = this.props;
    const { discoveryData } = dialog.data;

    const keyObj = discoveryData.keyToAccountMap[this.keyIndex];
    const accountObj = keyObj.accounts[this.accountIndex]

    return (
      <DialogContainer>
        <DialogCard>
          <Title>Select Ledger account</Title>

          <Label>Select Key</Label>
          <MenuSimple
            text={keyObj ? keyObj.key : 'Select key...'}
            options={discoveryData.keyToAccountMap.map((k, idx) => ({
              content: k.key,
              isActive: k.key === keyObj.key,
              onClick: () => this.selectKeyIndex(idx)
            }))}
          />

          <Label>Select Account</Label>
          <MenuSimple
            text={accountObj ? accountObj.account : 'No accounts found for this key'}
            options={keyObj.accounts.map((a, idx) => ({
              content: a.account,
              isActive: idx === this.accountIndex,
              onClick: () => this.selectAccountIndex(idx)
            }))}
          />

          <ButtonsWrapper>
            <SubmitButton
              onClick={this.handleSubmit}
              disabled={!this.isValid}
            >
              Continue
            </SubmitButton>
          </ButtonsWrapper>
        </DialogCard>
      </DialogContainer>
    )
  }
}

export default LedgerAccountDialog;
