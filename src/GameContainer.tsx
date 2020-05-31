import styled from "styled-components";

const GameContainer = styled.div`
  margin: auto;
  padding: 1rem;
  background-color: white;
  box-shadow: 2px 2px 12px 1px rgba(0, 0, 0, 0.43);

  @media (min-width: 600px) {
    padding: 3rem 5rem 3rem 5rem;
  }
`;

export default GameContainer;
