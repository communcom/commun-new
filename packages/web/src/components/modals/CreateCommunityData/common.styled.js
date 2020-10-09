import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const Content = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  margin: 0 15px;
`;

export const StepInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;

  & > :not(:last-child) {
    margin-bottom: 15px;
  }
`;

export const StepName = styled.h2`
  font-weight: bold;
  font-size: 18px;
  line-height: 25px;
`;

export const StepDesc = styled.div`
  font-size: 14px;
  line-height: 20px;
  text-align: center;
`;

export const Buttons = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 15px;
  border-top: 1px solid #e2e6e8;
`;
