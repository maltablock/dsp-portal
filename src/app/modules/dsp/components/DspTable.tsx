import React from 'react';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';
import DspStore from '../state/DspStore';
import { formatAsset } from 'app/shared/eos';
import { DAPP_SYMBOL } from 'app/shared/eos/constants';

const MOBILE_WIDTH = 671;

const DspWrapper = styled.div`
  background: linear-gradient(320deg, rgba(24, 24, 36, 1) 0%, rgba(40, 46, 61, 1) 100%);
  padding: 16px;
  border-radius: 8px;
`;

const BigHeading = styled.div`
  color: #ffffff;
  font-size: 22px;
  font-weight: 600;
  text-align: center;
  margin: 20px 0 40px 0;
`;

const TableHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;

  & > * {
    flex: none;
  }
  & > * {
    width: calc(90% / 4);
  }

  & > *:nth-child(1), & > *:nth-child(5) {
    width: 5%;
  }
`;

const TableHeading = styled.div`
  font-weight: 600;
  font-size: 18px;
  text-align: center;

  @media (max-width: ${MOBILE_WIDTH}px) {
    font-size: 15px;
  }
`;

const TableContent = styled.ol`
  list-style: none;
  padding-left: 0;
`;

const TableRow = styled(TableHeader)`
  margin: 0;
  padding: 8px 0;
  text-indent: 0;
  list-style-type: 0;

  &:nth-child(odd) {
    background-color: #263040;
  }

  &:hover {
    background-color: #414DFF
  }
`;

const TableColumn = styled.div`
  font-size: 16px;
  text-align: center;

  @media (max-width: ${MOBILE_WIDTH}px) {
    font-size: 12px;
  }
`;

type Props = {
  dspStore?: DspStore;
};

class DspTable extends React.Component<Props> {
  componentDidMount() {
    this.props.dspStore!.fetchDsps();
  }

  render() {
    const dspStore = this.props.dspStore!;

    return (
      <DspWrapper>
        <BigHeading>DSPs</BigHeading>
        <TableHeader>
          <TableHeading>#</TableHeading>
          <TableHeading>Provider</TableHeading>
          <TableHeading>Total Staked</TableHeading>
          <TableHeading>Percentage Staked</TableHeading>
          <TableHeading>Users</TableHeading>
          <TableHeading>Daily Reward</TableHeading>
        </TableHeader>
        <TableContent>
          {dspStore.sortedDsps.map((p, index) => (
            <TableRow key={p.provider}>
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
      </DspWrapper>
    );
  }
}

export default inject('dspStore')(observer(DspTable));
