"use client";
import { useRouter } from "next/navigation";
import styled from "styled-components";

const Container = styled.div`
  width: 100vw;
  height: 100vh;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 48px;
  margin-bottom: 24px;
`;

const StartButton = styled.button`
  padding: 12px 24px;
  font-size: 24px;
  cursor: pointer;
`;

export default function Home() {
  const router = useRouter();

  const startGame = () => {
    router.push("/game");
  };

  return (
    <Container>
      <Title>연상 어휘 게임</Title>
      <StartButton onClick={startGame}>시작하기</StartButton>
    </Container>
  );
}
