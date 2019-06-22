import React from 'react';
import { inject, observer } from 'mobx-react';
import DspStore from '../state/DspStore';
import { formatAsset } from 'app/shared/eos';
import { DAPP_SYMBOL } from 'app/shared/eos/constants';
import {
  TableHeader,
  TableHeading,
  TableContent,
  TableRow,
  TableColumn,
  TableWrapper,
  BigHeading,
} from './TableStyles';

type Props = {
  dspStore?: DspStore;
};


const columnWidths = [5, 25, 25, 25, 20];

class ServiceTable extends React.Component<Props> {
  componentDidMount() {
    this.props.dspStore!.fetchDsps();
  }

  render() {
    const dspStore = this.props.dspStore!;

    return (
      <TableWrapper>
        <BigHeading>Services</BigHeading>
        <TableHeader columnWidths={columnWidths}>
          <TableHeading>#</TableHeading>
          <TableHeading>Service</TableHeading>
          <TableHeading>Total Staked</TableHeading>
          <TableHeading>Percentage Staked</TableHeading>
          <TableHeading>Users</TableHeading>
        </TableHeader>
        <TableContent>
          {dspStore.sortedFilteredServices.map((p, index) => (
            <TableRow columnWidths={columnWidths} key={p.service}>
              <TableColumn>{index + 1}</TableColumn>
              <TableColumn>{p.service}</TableColumn>
              <TableColumn>
                {formatAsset(
                  { amount: p.totalStaked, symbol: DAPP_SYMBOL },
                  { withSymbol: false, separateThousands: true },
                )}
              </TableColumn>
              <TableColumn>{`${(p.percentageStaked * 100).toFixed(2)}%`}</TableColumn>
              <TableColumn>{p.users}</TableColumn>
            </TableRow>
          ))}
        </TableContent>
      </TableWrapper>
    );
  }
}

export default inject('dspStore')(observer(ServiceTable));
