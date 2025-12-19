"use client";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { containWordList, endWordList, wordList } from "../utils/wordList";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const RemainedTime = styled.div`
  font-size: 20px;
  margin-bottom: 12px;
`;

// 정답 시 애니메이션 추가
const AnswerQuestion = styled.input<{ isCorrect?: boolean }>`
  font-size: 24px;
  padding: 12px;
  margin-top: 24px;
  outline: none;
`;

const KeyWordDiv = styled.div`
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 24px;
`;

const CurrentScore = styled.div`
  font-size: 20px;
  margin-top: 12px;
`;

const RestartButton = styled.button`
  padding: 12px 8px;
  font-size: 17px;
  cursor: pointer;
`;

export default function Game() {
  // 게임 시간 설정 (ms)
  const TIMER = {
    oneSecond: 1000,
    initialDelay: 3000, // 3초 후에 입력창 등장
    playDuration: 10000, // 10초간 입력 허용
  };

  type Phase = "countdown" | "playing" | "result";
  const [phase, setPhase] = useState<Phase>("countdown");
  const [inputValue, setInputValue] = useState<string>("");
  const [score, setScore] = useState<number>(0);
  const [targetIndex, setTargetIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(TIMER.playDuration);

  const inputText = useRef<HTMLInputElement>(null);

  useEffect(() => {
    switch (phase) {
      case "countdown":
        setTimeout(() => {
          setPhase("playing");
          setTargetIndex(Math.floor(Math.random() * TARGETS.length));
        }, TIMER.initialDelay);
        break;
      case "playing":
        // 우선 input으로 포커싱(useRef로)
        if (inputText.current) {
          inputText.current?.focus();
        }

        // 계속 반복되다가 시간이 다 되면 결과 화면으로 전환
        const interval = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= TIMER.oneSecond) {
              clearInterval(interval);
              setPhase("result");
              return 0;
            }
            return prev - TIMER.oneSecond;
          });
        }, TIMER.oneSecond);

        break;
      case "result":
        // 결과 처리 로직 (점수 계산 등)
        break;
      default:
        break;
    }
  }, [phase]);

  const TARGETS: (keyof typeof wordList)[] = Object.keys(
    wordList
  ) as (keyof typeof wordList)[]; // 랜덤으로 선택할 대상 리스트

  const usedWords = useRef<Set<string>>(new Set());

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // 입력값 검증 로직
      if (inputValue === "") return;

      setInputValue("");

      // 이미 동일한 단어를 맞췄다면 점수 증가하지 않도록 처리
      if (!usedWords.current.has(inputValue)) {
        usedWords.current.add(inputValue);
        if (wordList[TARGETS[targetIndex]].includes(inputValue)) {
          setScore(score + 1);
        }
      }
    }
  };

  return (
    <Container>
      {phase === "countdown" ? (
        <div>게임이 {TIMER.initialDelay / 1000}초 후에 시작됩니다...</div>
      ) : phase === "playing" ? (
        <>
          <KeyWordDiv>
            {(containWordList as any)[TARGETS[targetIndex]] ? (
              <>{TARGETS[targetIndex]}을 포함하는 단어는?</>
            ) : (endWordList as any)[TARGETS[targetIndex]] ? (
              <>
                끝음절에 <b>{TARGETS[targetIndex]}</b>로 끝나는 단어는?
              </>
            ) : (
              <>{TARGETS[targetIndex]} 관련 단어를 찾을 수 없습니다.</>
            )}
          </KeyWordDiv>
          <RemainedTime>남은 시간: {timeLeft / TIMER.oneSecond}초</RemainedTime>
          <CurrentScore>점수: {score}</CurrentScore>
          <AnswerQuestion
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            ref={inputText}
          />
        </>
      ) : phase === "result" ? (
        <>
          <div>
            게임 종료! 당신의 어휘 점수는 <b>{score}</b>/
            {wordList[TARGETS[targetIndex]].length}점입니다.
          </div>
          <RestartButton onClick={() => window.location.reload()}>
            다시 시작
          </RestartButton>
        </>
      ) : (
        <div>잠시 후 게임이 시작됩니다...</div>
      )}
    </Container>
  );
}
