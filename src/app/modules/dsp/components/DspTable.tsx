import React from 'react';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';
import DspStore from '../state/DspStore';
import { formatAsset } from 'app/shared/eos';
import { DAPP_SYMBOL } from 'app/shared/eos/constants';
import { TableHeader, TableHeading, TableContent, TableRow, TableColumn, TableWrapper, BigHeading } from './TableStyles';

type Props = {
  dspStore?: DspStore;
};


const columnWidths = [5, 22.5, 22.5, 22.5, 5, 22.5];

class DspTable extends React.Component<Props> {
  componentDidMount() {
    this.props.dspStore!.fetchDsps();
  }

  render() {
    const dspStore = this.props.dspStore!;

    return (
      <TableWrapper>
        <BigHeading>DSPs</BigHeading>

        <TableContent>
          <TableHeader columnWidths={columnWidths}>
            <TableHeading>#</TableHeading>
            <TableHeading>Provider</TableHeading>
            <TableHeading>Total Staked</TableHeading>
            <TableHeading>Percentage Staked</TableHeading>
            <TableHeading>Users</TableHeading>
            <TableHeading>Daily Reward</TableHeading>
          </TableHeader>

          {dspStore.sortedDsps.map((p, index) => (
            <TableRow columnWidths={columnWidths} key={p.provider}>
              <TableColumn>{index + 1}</TableColumn>
              <TableColumn>{p.provider}</TableColumn>
              <TableColumn>
                {formatAsset(
                  { amount: p.totalStaked, symbol: DAPP_SYMBOL },
                  { withSymbol: false, separateThousands: true },
                )}
              </TableColumn>
              <TableColumn>{`${(p.percentageStaked * 100).toFixed(2)}%`}</TableColumn>
              <TableColumn>{p.users}</TableColumn>
              <TableColumn>
                {formatAsset(
                  { amount: p.dailyReward, symbol: DAPP_SYMBOL },
                  { withSymbol: false, separateThousands: true },
                )}
              </TableColumn>
            </TableRow>
          ))}
        </TableContent>
      </TableWrapper>
    );
  }
}

export default inject('dspStore')(observer(DspTable));
