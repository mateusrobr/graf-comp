import styled from "@emotion/styled";

export const Container = {
  Root: styled.main`
    height: 100vh;
    width: 100%;
    position: relative;
  `,
  FloatMenu: styled.div`
    position: fixed;
    top: 0;
    right: 0;
    padding: 16px;
    height: calc(100vh - 32px);
    display: flex;
    flex-direction: column;
  `,
};
