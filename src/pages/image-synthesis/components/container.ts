import styled from "@emotion/styled";

export const Container = {
  Root: styled.main`
    height: 100vh;
    width: 100%;
    position: relative;
    background-color: #f5f7fa;
    overflow: hidden;
    font-family: "Roboto", sans-serif;
  `,
  FloatMenu: styled.div`
    position: fixed;
    top: 20px;
    right: 20px;
    width: 320px;
    max-height: calc(100vh - 40px);
    padding: 24px;
    background: #1e293b;
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    color: #ffffff;
    transition: all 0.3s ease-in-out;

    scrollbar-width: thin;
    scrollbar-color: #64748b transparent;

    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #64748b;
      border-radius: 4px;
    }
    &::-webkit-scrollbar-thumb:hover {
      background-color: #94a3b8;
    }

    h6 {
      margin-bottom: 16px;
      color: #38bdf8;
      font-weight: 700;
      font-size: 1rem;
      letter-spacing: 0.5px;
    }

    .menu-section {
      margin-bottom: 16px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    button {
      margin-top: 12px;
      align-self: flex-start;
    }

    @media (max-width: 768px) {
      top: auto;
      bottom: 20px;
      right: 10px;
      width: calc(100% - 20px);
      max-height: 60vh;
      padding: 16px;
      border-radius: 12px;
    }
  `,
};
