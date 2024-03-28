"use client";

import { memo, useCallback, useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";
import { Word } from "@/entity/word";
import { validateReq } from "@/lib/query";
import Keyboard from "./components/keyboard";
import { getKeyObject } from "@/lib/keyCode";

const WORDLE_LEN = 5;
const WORDLE_MAX_GUESS_NO = 6;
const WORLDE_ARRAY_SIZE = WORDLE_LEN * WORDLE_MAX_GUESS_NO;
const KEY_COLOR_OBJ = getKeyObject();

function Home() {
  const [wordle, setWordle] = useState<Word[]>(
    new Array(WORLDE_ARRAY_SIZE).fill(new Word())
  );
  const [currentGuessRow, setCurrentGuessRow] = useState<number>(0);
  const [currentPosition, setCurrentPosition] = useState<number>(0);
  const start = useMemo(() => {
    return WORDLE_LEN * currentGuessRow;
  }, [currentGuessRow]);
  const end = useMemo(() => {
    return WORDLE_LEN * currentGuessRow + WORDLE_LEN - 1;
  }, [currentGuessRow]);
  const [keyStatus, setKeyStatus] = useState(KEY_COLOR_OBJ);
  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const [isDone, setIsDone] = useState<boolean>(false);

  const canSumbit = useCallback(() => {
    if (currentPosition === end + 1 && !isDone) {
      return true;
    }
    return false;
  }, [currentPosition, end, isDone]);

  const onSubmit = useCallback(() => {
    if (canSumbit()) {
      setIsWaiting(true);
      // valid word
      validateReq(wordle.slice(start, end + 1).toString()).then((result) => {
        if (!result.isvalidword) {
          return;
        }
        for (let i = start, j = 0; i <= end; i++, j++) {
          if (j >= result.score.length) {
            break;
          }
          const item: Word = new Word();
          item.clone(wordle[i]);
          item.result = result.score[j];
          wordle[i] = item;
          keyStatus[item.text.toUpperCase()] = item.result;
        }
        setWordle([...wordle]);
        setKeyStatus({ ...keyStatus });

        if (currentGuessRow >= WORDLE_MAX_GUESS_NO - 1) {
          //resuit
          setIsDone(true);
        } else {
          // next word
          setCurrentGuessRow((item) => item + 1);
        }
        setIsWaiting(false);
      });
    }
  }, [canSumbit, currentGuessRow, end, keyStatus, start, wordle]);

  const onKeyDown = useCallback(
    (key: string) => {
      if (isWaiting) {
        return;
      }
      if (/^[a-zA-Z]$/.test(key)) {
        //input
        if (currentPosition <= end) {
          const item: Word = new Word();
          item.clone(wordle[currentPosition]);
          item.text = key;
          wordle[currentPosition] = item;
          setWordle([...wordle]);
          setCurrentPosition((item) => item + 1);
        }
      } else if (key === "Backspace") {
        //back 1 word
        if (currentPosition !== start) {
          const position = currentPosition - 1;
          const item: Word = new Word();
          item.clone(wordle[position]);
          item.text = "";
          wordle[position] = item;
          setWordle([...wordle]);
          setCurrentPosition(position);
        }
      } else if (key === "Enter") {
        //submit
        onSubmit();
      }
    },
    [currentPosition, end, isWaiting, onSubmit, start, wordle]
  );

  const handleKeyDownEvent = useCallback(
    (e: KeyboardEvent) => {
      onKeyDown(e.key);
    },
    [onKeyDown]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDownEvent);
    return () => {
      window.removeEventListener("keydown", handleKeyDownEvent);
    };
  }, [handleKeyDownEvent]);

  const wordleBox = useMemo(() => {
    return wordle.map((item, index) => {
      return (
        <div key={index} style={item.style} className={Math.trunc(index/WORDLE_LEN) === currentGuessRow && !isDone? styles.active : undefined}>
          {item.text}
        </div>
      );
    });
  }, [currentGuessRow, isDone, wordle]);

  return (
    <main>
      <div className={styles.title}>Wordle</div>
      <div className={styles.wordle_area}>{wordleBox}</div>
      <Keyboard onKeyDown={onKeyDown} keyStatus={keyStatus} />
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
