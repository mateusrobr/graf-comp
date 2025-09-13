import styled from "@emotion/styled";

export const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
  background-color: #0f172a;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  cursor: crosshair;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #1e293b;
  }
`;
