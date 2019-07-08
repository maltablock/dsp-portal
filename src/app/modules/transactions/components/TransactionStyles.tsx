import styled from 'styled-components';

const ContentInfo = styled.div`
  margin-top: 4px;
  max-width: 800px;
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
  white-space: pre-wrap;
`;

const HighlightedText2 = styled(HighlightedText)`
  padding: 8px 16px;
  font-size: 14px;
`;

const Info = styled.div`
  font-size: 14px;
  margin: 40px auto 8px;
`;

export {
  ContentInfo,
  HighlightedText,
  HighlightedText2,
  Info,
  AmountText,
}