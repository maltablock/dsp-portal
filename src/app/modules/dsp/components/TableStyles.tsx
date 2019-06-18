import React from 'react';
import styled from 'styled-components';

const MOBILE_WIDTH = 671;

type TableHeaderProps = {
  columnWidths: number[]
}

export const TableHeader = styled.div<TableHeaderProps>`
  width: 100%;
  display: flex;
  justify-content: space-around;

  & > * {
    flex: none;
  }

  ${({ columnWidths }) => columnWidths.map((percentage, index) => `
    & > *:nth-child(${index + 1}) {
    width: ${percentage}%;
  }`)}
`;

export const TableHeading = styled.div`
  font-weight: 600;
  font-size: 12px;
  text-align: center;
  text-transform: uppercase;
`;

export const TableContent = styled.ol`
  list-style: none;
  padding: 0;
`;

export const TableRow = styled(TableHeader)`
  margin: 0;
  padding: 16px 0;
  text-indent: 0;
  list-style-type: 0;

  &:nth-child(odd) {
    background-color: #263040;
  }

  &:hover {
    background-color: #414DFF
  }
`;

export const TableColumn = styled.div`
  font-size: 14px;
  text-align: center;

  @media (max-width: ${MOBILE_WIDTH}px) {
    font-size: 12px;
  }
`;


export const TableWrapper = styled.div`
  background: linear-gradient(320deg, rgba(24, 24, 36, 1) 0%, rgba(40, 46, 61, 1) 100%);
  padding: 16px;
  margin-top: 16px;
  border-radius: 8px;
`;

export const BigHeading = styled.div`
  color: #ffffff;
  font-size: 22px;
  font-weight: 600;
  text-align: center;
  margin: 20px 0 40px 0;
`;