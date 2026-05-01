"use client";

import {
  ChangeEvent,
  CSSProperties,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import styles from "./page.module.css";
import Keyboard from "./components/keyboard";
import { GameStatus } from "@/entity/enum/gameStatus";
import { LOGO } from "@/lib/constant";
import { useGameManager } from "@/lib/useGameManager";
import WordleBoard from "./components/wordleBoard";
import { MODE } from "@/entity/enum/modeType";
import { WordleSourceFields } from "@/entity/WordleSourceFields";
import { WordleSourceType, WORDLE_SOURCE } from "@/entity/enum/wordleSource";
import TipsModal from "./components/tipsModal";

function Home() {
  const {
    wordleArr,
    keybroadData,
    currentTransitionDelay,
    isWaiting,
    isAnswerLoading,
    gameStatus,
    onKeyDown,
    onChangeMode,
    modeType,
    initializeWordleSourceInput,
    onSubmitWordleSourceInput,
  } = useGameManager();

  const [wordleSourceFields, setWordleSourceFields] =
    useState<WordleSourceFields>(() => initializeWordleSourceInput());

  const wordleSourceMenu = useMemo(
    () =>
      Object.keys(WordleSourceType)
        .filter((key) => !isNaN(Number(key)) && key.trim() !== "")
        .map((value) => (
          <option key={value} value={value}>
            {WORDLE_SOURCE[Number(value) as WordleSourceType].displayName}
          </option>
        )),
    [],
  );

  const [isFocusWordleDateInput, setFocusWordleDateInput] =
    useState<boolean>(false);

  const handleKeyDownEvent = useCallback(
    (e: KeyboardEvent) => {
      const isPreventDefault = onKeyDown(e.key);
      if (isPreventDefault) {
        e.preventDefault();
      }
    },
    [onKeyDown],
  );

  useEffect(() => {
    if (!isFocusWordleDateInput) {
      window.addEventListener("keydown", handleKeyDownEvent);

      // call before the effect re-runs, such as isFocusWordleDateInput = false
      return () => {
        window.removeEventListener("keydown", handleKeyDownEvent);
      };
    }
  }, [handleKeyDownEvent, isFocusWordleDateInput]);

  //change focus for date input
  const onFocusWordleDateInput = useCallback(() => {
    if (!isFocusWordleDateInput) {
      setFocusWordleDateInput(true);
    }
  }, [isFocusWordleDateInput]);

  const onBlurWordleDateInput = useCallback(() => {
    if (isFocusWordleDateInput) {
      setFocusWordleDateInput(false);
    }
  }, [isFocusWordleDateInput]);

  const onChangeWordleSource = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const choice: string = e.target.value;
      if (Object.keys(WordleSourceType).includes(choice)) {
        const newWordleSource: WordleSourceType = Number(choice);

        if (newWordleSource === wordleSourceFields.wordleSourceType) {
          return;
        }

        setWordleSourceFields(
          wordleSourceFields.copy({ wordleSourceType: newWordleSource }),
        );
      } else {
        console.error(
          "onChangeWordleSource: Invalid WordleSourceType:",
          choice,
        );
      }
    },
    [wordleSourceFields],
  );

  const renderResult = useMemo(() => {
    let text: string | JSX.Element = ".";
    let className = `${styles.result}`;
    let style: CSSProperties = {
      animationDelay: `${currentTransitionDelay}ms`,
    };
    if (isWaiting || isAnswerLoading) {
      text = "Loading...";
      className = className.concat(" ", "fadeIn");
    } else {
      const gameStatusRenderProp =
        GameStatus.getGameStatusRenderProp(gameStatus);
      text = gameStatusRenderProp.text || ".";
      className = className.concat(" ", gameStatusRenderProp.className || "");
    }

    return (
      <div className={className} style={style}>
        {text}
      </div>
    );
  }, [currentTransitionDelay, gameStatus, isAnswerLoading, isWaiting]);

  const [isTipsOpen, setIsTipsOpen] = useState(false);

  const tipsDialogRef = useRef<HTMLDialogElement>(null);

  const onShowTipsModal = useCallback(() => {
    if (!isTipsOpen) {
      setIsTipsOpen(true);
      tipsDialogRef.current?.showModal();
    }
  }, [isTipsOpen]);

  const onCloseTipsModal = useCallback(() => {
    if (isTipsOpen) {
      setIsTipsOpen(false);
      tipsDialogRef.current?.close();
    }
  }, [isTipsOpen]);

  return (
    <main>
      <div className={styles.title}>
        <div>
          <Image
            src={LOGO}
            alt="W"
            height={80}
            width={80}
            className={isWaiting || isAnswerLoading ? "rotate " : undefined}
            priority
          />
          ordle
        </div>
        <button onClick={onShowTipsModal} className={styles["tips-button"]}>
          ?
        </button>
      </div>

      <TipsModal
        tipsDialogRef={tipsDialogRef}
        onCloseTipsModal={onCloseTipsModal}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <input
          type="date"
          value={
            WORDLE_SOURCE[wordleSourceFields.wordleSourceType].isDisableDate
              ? ""
              : wordleSourceFields.wordleDate
          }
          placeholder="YYYY-MM-DD"
          disabled={
            WORDLE_SOURCE[wordleSourceFields.wordleSourceType].isDisableDate
          }
          onChange={(e) => {
            if (wordleSourceFields.wordleDate !== e.target.value)
              setWordleSourceFields(
                wordleSourceFields.copy({ wordleDate: e.target.value }),
              );
          }}
          onFocus={() => onFocusWordleDateInput()}
          onBlur={() => onBlurWordleDateInput()}
        />

        <select
          value={wordleSourceFields.wordleSourceType}
          onChange={(e) => onChangeWordleSource(e)}
        >
          {wordleSourceMenu}
        </select>

        <button
          onClick={() => onSubmitWordleSourceInput(wordleSourceFields)}
          style={{ marginLeft: "5px" }}
        >
          Confirm
        </button>

        <button onClick={onChangeMode} style={{ marginLeft: "10px", ... MODE[modeType].resultStyle }}>
          {MODE[modeType].name}
        </button>
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
        &copy; 2024–{new Date().getFullYear()} Kayou W.
      </a>
    </main>
  );
}

export default memo(Home);
