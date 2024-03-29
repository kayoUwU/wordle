"use client";

import { memo, useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import { Word } from "@/entity/word";
import { validateReq } from "@/lib/query";
import Keyboard from "./components/keyboard";
import { KEY_TEXT, getKeyObject } from "@/lib/keyCode";
import {GameStatus} from "@/entity/enum/gameStatus";
import { ResultType } from "@/entity/enum/resultType";
import { LOGO } from "@/lib/constant";

const WORDLE_LEN = 5;
const WORDLE_MAX_GUESS_NO = 6;
const WORLDE_ARRAY_SIZE = WORDLE_LEN * WORDLE_MAX_GUESS_NO;

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
  const [keyStatus, setKeyStatus] = useState(()=>getKeyObject());
  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.IN_PROGRESS);
  const isDone = gameStatus === GameStatus.WIN || gameStatus === GameStatus.LOSS;

  const keyArr = useMemo(()=>{
    const mkeyArr = [...KEY_TEXT];
    if(gameStatus===GameStatus.LOSS){
      mkeyArr[KEY_TEXT.length-1] = [...KEY_TEXT[KEY_TEXT.length-1],'F5'];
    }
    return mkeyArr;
  },[gameStatus]);

  const retry = useCallback(()=>{
    setWordle(new Array(WORLDE_ARRAY_SIZE).fill(new Word()));
    setCurrentGuessRow(0);
    setCurrentPosition(0);
    setKeyStatus(getKeyObject());
    setGameStatus(GameStatus.IN_PROGRESS);
  },[]);

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
      validateReq(wordle.slice(start, end + 1).map(item=>item.text).join(''))
        .then((result) => {
          if (!result || !result.isvalidword) {
            return;
          }
          let win = true;
          for (let i = start, j = 0; i <= end; i++, j++) {
            if (j >= result.score.length) {
              break;
            }
            const item: Word = new Word();
            item.clone(wordle[i]);
            item.result = result.score[j];
            wordle[i] = item;
            keyStatus[item.text.toUpperCase()] = item.result;
            if(item.result!==ResultType.Status.CORRET){
              win = false;
            }
          }
          setWordle([...wordle]);
          setKeyStatus({ ...keyStatus });

          if (win || 
            //no more guess
            currentGuessRow >= WORDLE_MAX_GUESS_NO - 1 
            ) {
            //resuit
            setGameStatus(win?GameStatus.WIN:GameStatus.LOSS);
          } else {
            // next word
            setCurrentGuessRow((item) => item + 1);
          }
        })
        .finally(() => {
          setIsWaiting(false);
        });
    }
  }, [canSumbit, currentGuessRow, end, keyStatus, start, wordle]);

  // false = need prevent event
  const onKeyDown = useCallback(
    (key: string) => {
      if (isWaiting) {
        return false;
      }
      if (!isDone && /^[a-zA-Z]$/.test(key)) {
        //input
        if (currentPosition <= end) {
          const item: Word = new Word();
          item.clone(wordle[currentPosition]);
          item.text = key;
          wordle[currentPosition] = item;
          setWordle([...wordle]);
          setCurrentPosition((item) => item + 1);
          return true;
        }
      } else if (!isDone && key === "Backspace") {
        //back 1 word
        if (currentPosition !== start) {
          const position = currentPosition - 1;
          const item: Word = new Word();
          item.clone(wordle[position]);
          item.text = "";
          wordle[position] = item;
          setWordle([...wordle]);
          setCurrentPosition(position);
          return true;
        }
      } else if (!isDone &&  key === "Enter") {
        //submit
        onSubmit();
        return true;
      } else if(key === "F5" && gameStatus===GameStatus.LOSS) {
        retry();
        return true;
      }
      return false;
    },
    [currentPosition, end, gameStatus, isDone, isWaiting, onSubmit, retry, start, wordle]
  );

  const handleKeyDownEvent = useCallback(
    (e: KeyboardEvent) => {
      const isPreventDefault = onKeyDown(e.key);
      if(isPreventDefault){
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

  const wordleBox = useMemo(() => {
    return wordle.map((item, index) => {
      return (
        <div
          key={index}
          style={item.style}
          className={
            Math.trunc(index / WORDLE_LEN) === currentGuessRow && !isDone
              ? styles.active
              : undefined
          }
        >
          {item.text}
        </div>
      );
    });
  }, [currentGuessRow, isDone, wordle]);

  const renderResult = useMemo((()=> {
    if(gameStatus === GameStatus.WIN){
      return 'Greate! You Guess The Word!';
    } else if(gameStatus === GameStatus.LOSS) {
      return 'No worry. You may try again by pressing F5';
    }
    else null;
  }),[gameStatus]);

  return (
    <main>
      <div className={styles.title}><Image src={LOGO} alt="W" height={80} width={80}/>ordle</div>
      <div className={styles.wordle_area}>{wordleBox}</div>
      <div>{renderResult}</div>
      <Keyboard onKeyDown={onKeyDown} keyStatus={keyStatus} keyArr={keyArr} />
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
