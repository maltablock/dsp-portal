import React from 'react';
import styled from 'styled-components';
import { observable, action, computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import { DiscoveryData, DiscoveryAccount } from 'eos-transit/lib';

import { getWallet } from 'app/shared/eos';
import { fetchAccountsForKeyMock } from '../mock-api';

import DialogItem from 'app/modules/dialogs/state/DialogItem';
import ProfileStore from '../state/ProfileStore';
import MenuSimple from 'app/shared/components/MenuSimple';
import { InputElement } from 'app/shared/components/Input';

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

const KeyIndexInput = styled(InputElement)`
  color: #fff;
  background-color: #111520;
  padding: 16px 8px;
`;

const FormButtonsWrapper = styled.div`
  margin: 20px auto 0;
`;

const SubmitButtonsWrapper = styled.div`
  margin: 40px auto 0;
`;


type Props = {
  dialog: DialogItem<{ discoveryData: DiscoveryData }>,
}

type Account = {
  account: string,
  authorization: string,
}


@observer
class LedgerAccountDialog extends React.Component<Props> {
  @observable keyIndex: string = '';
  @observable selectedAccount: Account | null = null;
  @observable isFetching = false;
  @observable accounts: Account[] = [];

  @computed get isFormValid() {
    return Boolean(this.keyIndex && this.selectedAccount);
  }

  @action handleKeyIndexChange = evt => {
    this.keyIndex = evt.target.value;
  }

  @action handleSelectAccount = (account: Account) => {
    this.selectedAccount = account;
  }

  @action fetchAccountsForKey = async () => {
    this.isFetching = true;
    this.accounts = [];
    const keyIndex = Number(this.keyIndex);

    try {
      const data: DiscoveryData = process.env.REACT_APP_USE_DEMO_DATA
        ? await fetchAccountsForKeyMock(keyIndex)
        : await getWallet().discover({ pathIndexList: [keyIndex] });

      const accountsMap = data.keyToAccountMap.find(({ index }) => index === keyIndex);
      if (!accountsMap) throw new Error(`Accounts Map not found for key index: ${keyIndex}`);
      this.accounts = accountsMap.accounts;
    } catch (err) {
      console.error(err);
    }

    this.isFetching = false;
  }

  @action handleSubmit = () => {
    if (!this.selectedAccount) return;
    const { account, authorization } = this.selectedAccount;
    this.props.dialog.submit({ account, authorization })
  }

  render() {
    return (
      <DialogContainer>
        <DialogCard>
          <Title>Select Ledger account</Title>

          <Label>Enter Key Index</Label>
          <KeyIndexInput
            autoFocus
            value={this.keyIndex}
            onChange={this.handleKeyIndexChange}
            disabled={this.isFetching}
            type="number"
          />

          <FormButtonsWrapper>
            <SubmitButton
              onClick={this.fetchAccountsForKey}
              disabled={this.isFetching || !this.keyIndex}
            >
              {this.isFetching ? 'Fetching Accounts...' : 'Fetch Accounts'}
            </SubmitButton>
          </FormButtonsWrapper>

          <Label>Select Account</Label>
          <MenuSimple
            disabled={this.isFetching || !this.accounts.length}
            text={
              this.selectedAccount
              ? this.selectedAccount.account
              : this.accounts.length
                ? 'Select Account...'
                : 'No accounts found'
              }
            options={this.accounts.map((a, idx) => ({
              content: a.account,
              isActive: a === this.selectedAccount,
              onClick: () => this.handleSelectAccount(a)
            }))}
          />

          <SubmitButtonsWrapper>
            <SubmitButton
              onClick={this.handleSubmit}
              disabled={!this.isFormValid}
            >
              Continue
            </SubmitButton>
          </SubmitButtonsWrapper>
        </DialogCard>
      </DialogContainer>
    )
  }
}

export default LedgerAccountDialog;
