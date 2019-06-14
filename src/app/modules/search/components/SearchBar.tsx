import React from 'react';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';

import SearchInput from 'app/shared/components/SearchInput';
import Menu from 'app/shared/components/Menu';
import SearchStore from '../state/SearchStore';

const MAX_WIDTH = 976;

const Wrapper = styled.div`
  display: flex;
  align-content: space-between;
  margin: 0 auto;
  width: ${MAX_WIDTH + 16 * 2}px;


  @media (max-width: ${MAX_WIDTH}px) {
    width: calc(100% - 32px);
    margin: 0 16px;
    flex-direction: column;
  }
`;

const ControlsWrapper = styled.div`
  display: flex;
  margin: 16px;
  width: 100%;

  @media (max-width: ${MAX_WIDTH}px) {
    margin: 8px 0;
  }
`;

const MenuWrapper = styled.div`
  width: 100%;

  &:not(:last-child) {
    margin-right: 16px;
  }
`;

type Props = {
  searchStore?: SearchStore;
}

const SearchInputContainer = observer(({ searchStore }: { searchStore: SearchStore }) => {
  const s = searchStore;
  return (
    <SearchInput
      value={s.searchText}
      onChange={s.handleSearchTextChange}
      isClearSearchVisible={s.isClearSearchVisible}
      onClear={s.clearSearchText}
      placeholder="Search Service"
    />
  )
})

const SearchBar = ({ searchStore }: Props) => {
  const {
    filterBy,
    filterByText,
    filterOptions,
    handleFilterByChange,

    sortBy,
    sortByText,
    sortOptions,
    handleSortByChange,
  } = searchStore!;

  if(!['Packages', 'Staked'].includes(searchStore!.selectedTab)) return null

  return (
    <Wrapper>
      <ControlsWrapper>
        <SearchInputContainer searchStore={searchStore!} />
      </ControlsWrapper>

      <ControlsWrapper>
        <MenuWrapper>
          <Menu
            text={filterByText}
            options={
              filterOptions.map(option => ({
                ...option,
                content: option.text,
                isActive: option.value === filterBy,
                onClick: () => handleFilterByChange(option.value)
              }))
            }
          />
        </MenuWrapper>

        <MenuWrapper>
          <Menu
            text={sortByText}
            options={
              sortOptions.map(option => ({
                ...option,
                content: option.text,
                isActive: option.value === sortBy,
                onClick: () => handleSortByChange(option.value)
              }))
            }
          />
        </MenuWrapper>
      </ControlsWrapper>
    </Wrapper>
  )
}

export default inject('searchStore')(observer(SearchBar));
