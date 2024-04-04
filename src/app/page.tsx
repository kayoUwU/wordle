"use client";

import { CSSProperties, memo, useCallback, useEffect, useMemo } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import Keyboard from "./components/keyboard";
import { GameStatus } from "@/entity/enum/gameStatus";
import { LOGO } from "@/lib/constant";
import { useGameManager } from "@/lib/useGameManager";
import WordleBoard from "./components/wordleBoard";

function Home() {
  const {
    wordleArr,
    keybroadData,
    currentTransitionDelay,
    isWaiting,
    gameStatus,
    onKeyDown,
  } = useGameManager();

  const handleKeyDownEvent = useCallback(
    (e: KeyboardEvent) => {
      const isPreventDefault = onKeyDown(e.key);
      if (isPreventDefault) {
        e.preventDefault();
      }
    },
    [onKeyDown]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDownEvent);
    return () => {
      window.removeEventListener("keydown", handleKeyDownEvent);
    };
  }, [handleKeyDownEvent]);

  const renderResult = useMemo(() => {
    let text: string | JSX.Element = ".";
    let className = `${styles.result}`;
    let style: CSSProperties = {
      animationDelay: `${currentTransitionDelay}ms`,
    };
    if (isWaiting) {
      text = "Loading...";
      className = className.concat(" ", "fadeIn");
    } else {
      const gameStatusRenderProp =
        GameStatus.getGameStatusRenderProp(gameStatus);
      text = gameStatusRenderProp.text || '.';
      className = className.concat(" ", gameStatusRenderProp.className|| '');
    }

    return (
      <div className={className} style={style}>
        {text}
      </div>
    );
  }, [currentTransitionDelay, gameStatus, isWaiting]);

  return (
    <main>
      <div className={styles.title}>
        <div>
          <Image
            src={LOGO}
            alt="W"
            height={80}
            width={80}
            className={isWaiting ? "rotate " : undefined}
            priority
          />
          ordle
        </div>
      </div>
      {renderResult}
      <WordleBoard
        wordleArr={wordleArr}
        isWin={gameStatus === GameStatus.Status.WIN}
        animationDelay={currentTransitionDelay}
      />
      <Keyboard onKeyDown={onKeyDown} keybroadData={keybroadData} />
      <a
        href="https://kayouwu.github.io"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.author}
      >
        @Kayou
      </a>
    </main>
  );
}

export default memo(Home);
