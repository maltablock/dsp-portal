import styled from 'styled-components';
import { lightDarkValues } from 'app/shared/styles/utils';

const MOBILE_WIDTH = 671;

type TableHeaderProps = {
  columnWidths: number[];
};

export const TableHeader = styled.div<TableHeaderProps>`
  display: table-row;

  & > * {
    flex: none;
  }

  ${({ columnWidths }) =>
    columnWidths.map(
      (percentage, index) => `
    & > *:nth-child(${index + 1}) {
    width: ${percentage}%;
  }`,
    )}

  @media (max-width: 600px) {
    & > * {
      width: auto;
    }
  }
`;

export const TableHeading = styled.div`
  font-weight: 600;
  font-size: 12px;
  text-align: center;
  text-transform: uppercase;
  white-space: nowrap;
  padding: 16px 8px;
  display: table-cell;
`;

export const TableContent = styled.ol`
  list-style: none;
  padding: 0;
`;

export const TableRow = styled(TableHeader)`
  display: table-row;
  margin: 0;
  text-indent: 0;
  padding: 16px 0;
  list-style-type: 0;
  width: 100%;

  &:nth-child(even):not(:first-child) {
    background-color: ${lightDarkValues('#f3f5f9', '#263040')};
  }

  /* increase specifiers to overwrite background-color */
  &&&:hover {
    background-color: #414dff;
    color: #fff;
  }
`;

export const TableColumn = styled.div`
  display: table-cell;
  padding: 16px 8px;

  font-size: 14px;
  text-align: center;

  @media (max-width: ${MOBILE_WIDTH}px) {
    font-size: 12px;
  }
`;

export const TableWrapper = styled.div`
  display: table;
  table-layout: fixed;

  background: ${lightDarkValues(
    '#e7ebf2',
    'linear-gradient(320deg, rgba(24, 24, 36, 1) 0%, rgba(40, 46, 61, 1) 100%)',
  )};
  padding: 16px;
  margin-top: 16px;
  border-radius: 8px;

  @media (min-width: ${MOBILE_WIDTH}px) {
    width: 100%;
  }
`;

export const BigHeading = styled.div`
  font-size: 22px;
  font-weight: 600;
  text-align: center;
  margin: 20px 0 40px 0;

  @media (max-width: ${MOBILE_WIDTH}px) {
    text-align: left;
    padding-left: 8px;
  }
`;
