"use client";

import {
  CSSProperties,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Image from "next/image";
import styles from "./page.module.css";
import { Word } from "@/entity/word";
import { validateReq } from "@/lib/query";
import Keyboard from "./components/keyboard";
import { KEY_TEXT, getKeyObject } from "@/lib/keyCode";
import { GameStatus } from "@/entity/enum/gameStatus";
import { ResultType } from "@/entity/enum/resultType";
import { LOGO } from "@/lib/constant";

const WORDLE_LEN = 5;
const WORDLE_MAX_GUESS_NO = 6;
const WORLDE_ARRAY_SIZE = WORDLE_LEN * WORDLE_MAX_GUESS_NO;
const getWordleArr = () =>
  Array(WORLDE_ARRAY_SIZE)
    .fill(new Word())
    .map((_, index) => new Word(index.toString()));

function Home() {
  const [wordle, setWordle] = useState<Word[]>(() => getWordleArr());
  const [currentGuessRow, setCurrentGuessRow] = useState<number>(0);
  const [currentPosition, setCurrentPosition] = useState<number>(0);
  const [currentTransitionDelay, setCurrentTransitionDelay] =
    useState<number>(0);
  const start = useMemo(() => {
    return WORDLE_LEN * currentGuessRow;
  }, [currentGuessRow]);
  const end = useMemo(() => {
    return WORDLE_LEN * currentGuessRow + WORDLE_LEN - 1;
  }, [currentGuessRow]);
  const [keyStatus, setKeyStatus] = useState(() => getKeyObject());
  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const [gameStatus, setGameStatus] = useState<GameStatus>(
    GameStatus.IN_PROGRESS
  );
  const isDone =
    gameStatus === GameStatus.WIN || gameStatus === GameStatus.LOSS;

  const keyArr = useMemo(() => {
    const mkeyArr = [...KEY_TEXT];
    if (gameStatus === GameStatus.LOSS) {
      mkeyArr[KEY_TEXT.length - 1] = [...KEY_TEXT[KEY_TEXT.length - 1], "F5"];
    }
    return mkeyArr;
  }, [gameStatus]);

  const retry = useCallback(() => {
    setWordle(getWordleArr());
    setCurrentGuessRow(0);
    setCurrentPosition(0);
    setCurrentTransitionDelay(0);
    setKeyStatus(getKeyObject());
    setIsWaiting(false);
    setGameStatus(GameStatus.IN_PROGRESS);
  }, []);

  const canSumbit = useCallback(() => {
    if (gameStatus === GameStatus.TOBE_SUBMIT) {
      return true;
    }
    return false;
  }, [gameStatus]);

  const onSubmit = useCallback(() => {
    if (canSumbit()) {
      setIsWaiting(true);
      // valid word
      validateReq(
        wordle
          .slice(start, end + 1)
          .map((item) => item.text)
          .join("")
      )
        .then((result) => {
          if (!result) {
            return;
          }
          let win = true;
          let animationDelay = 0;
          const wordleClone = [...wordle];
          const keyClone = { ...keyStatus };
          const timestamp = Date.now();
          for (let i = start, j = 0; i <= end; i++, j++) {
            if (result.isvalidword && j >= result.score.length) {
              break;
            }

            const item: Word = new Word();
            item.clone(wordleClone[i]);

            if (!result.isvalidword) {
              item.result = ResultType.Status.INVALID;
              item.className = "shakeHorizontal";
              //rerun animation
              item.key = `${i}-${timestamp}`;
            } else {
              item.result = result.score[j];
              item.css = { transitionDelay: `${animationDelay}ms` };
              //keep item.key prevent rerender change original color (i.e. not trigger color transition)
              animationDelay += 200;

              // key use the highest score style
              if (
                ResultType.compare(
                  item.result,
                  keyClone[item.text.toUpperCase()]?.result
                ) === 1
              ) {
                keyClone[item.text.toUpperCase()] = item;
              }
            }

            wordleClone[i] = item;
            if (item.result !== ResultType.Status.CORRET) {
              win = false;
            }
          }
          setWordle([...wordleClone]);

          // reset submit key
          if (keyClone.Enter?.css !== undefined) {
            const Enter = new Word();
            Enter.text = "Enter";
            Enter.css = undefined;
            keyClone.Enter = Enter;
          }

          if (result.isvalidword) {
            setCurrentTransitionDelay(animationDelay);

            if (
              win ||
              //no more guess
              currentGuessRow >= WORDLE_MAX_GUESS_NO - 1
            ) {
              //resuit
              const final = win ? GameStatus.WIN : GameStatus.LOSS;
              setGameStatus(final);
            } else {
              // next word
              setGameStatus(GameStatus.IN_PROGRESS);
              setCurrentGuessRow((item) => item + 1);
            }
          } else {
            setGameStatus(GameStatus.INVALID);
          }

          setKeyStatus({ ...keyClone });
        })
        .finally(() => {
          setIsWaiting(false);
        });
    }
  }, [canSumbit, currentGuessRow, end, keyStatus, start, wordle]);

  useEffect(() => {
    if (gameStatus === GameStatus.TOBE_SUBMIT) {
      const Enter = new Word();
      Enter.text = "Enter";
      Enter.css = { backgroundColor: "var(--blue-color)" };
      setKeyStatus((item) => ({ ...item, Enter }));
    } else if (gameStatus === GameStatus.INVALID) {
      const Backspace = new Word();
      Backspace.text = "Backspace";
      Backspace.css = { backgroundColor: "var(--blue-color)" };
      setKeyStatus((item) => ({ ...item, Backspace }));
    } else if (gameStatus === GameStatus.LOSS) {
      const F5 = new Word();
      F5.text = "F5";
      F5.className = "flexfadeIn";
      F5.css = { animationDelay: `${currentTransitionDelay}ms` };
      setKeyStatus((item) => ({ ...item, F5 }));
    }
  }, [currentTransitionDelay, gameStatus]);

  // false = need prevent event
  const onKeyDown = useCallback(
    (key: string) => {
      if (isWaiting) {
        return false;
      }
      //input
      if (gameStatus === GameStatus.IN_PROGRESS && /^[a-zA-Z]$/.test(key)) {
        if (currentPosition === start && wordle[currentPosition].text === "") {
          setCurrentTransitionDelay(0); // reset delay
        }

        const item: Word = new Word();
        item.clone(wordle[currentPosition]);
        item.text = key.toUpperCase();
        item.className = "bounceScale";
        //rerun animation
        item.key = `${currentPosition}-${Date.now()}`;

        wordle[currentPosition] = item;
        setWordle([...wordle]);
        const nextPosition = currentPosition + 1;
        setCurrentPosition(nextPosition);
        if (nextPosition === end + 1) {
          setGameStatus(GameStatus.TOBE_SUBMIT);
        }
        return true;
      } else if (!isDone && key === "Backspace" && currentPosition !== start) {
        //back 1 word
        const position = currentPosition - 1;
        const item: Word = new Word();
        item.clone(wordle[position]);
        item.text = "";
        //reset style
        item.result = ResultType.Status.NONE;

        wordle[position] = item;
        setWordle([...wordle]);
        setCurrentPosition(position);

        //reset key style
        if (gameStatus === GameStatus.TOBE_SUBMIT) {
          const Enter = new Word();
          Enter.text = "Enter";
          Enter.css = undefined;
          setKeyStatus((item) => ({ ...item, Enter }));
          setGameStatus(GameStatus.IN_PROGRESS);
        }
        if (gameStatus === GameStatus.INVALID) {
          const Backspace = new Word();
          Backspace.text = "Backspace";
          Backspace.css = undefined;
          setKeyStatus((item) => ({ ...item, Backspace }));
          setGameStatus(GameStatus.IN_PROGRESS);
        }
        return true;
      } else if (gameStatus === GameStatus.TOBE_SUBMIT && key === "Enter") {
        //submit
        onSubmit();
        return true;
      } else if (key === "F5" && gameStatus === GameStatus.LOSS) {
        retry();
        return true;
      }
      return false;
    },
    [
      currentPosition,
      end,
      gameStatus,
      isDone,
      isWaiting,
      onSubmit,
      retry,
      start,
      wordle,
    ]
  );

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

  const wordleBox = useMemo(() => {
    return wordle.map((item, index) => {
      let extraClassName = "";
      let style: CSSProperties = { ...item.style };
      if (!isDone) {
        //update current row style
        if (Math.trunc(index / WORDLE_LEN) === currentGuessRow) {
          extraClassName = extraClassName.concat(" ", styles.active);
          style.transitionDelay = `${currentTransitionDelay}ms`;
          if (index === currentPosition) {
            extraClassName = extraClassName.concat(" ", styles.active_word);
          }
        }
      }

      return (
        <div
          key={item.key || index}
          style={style}
          className={`${styles.word} ${extraClassName} ${item.className}`}
        >
          {item.text}
        </div>
      );
    });
  }, [
    currentGuessRow,
    currentPosition,
    currentTransitionDelay,
    isDone,
    wordle,
  ]);

  const renderResult = useMemo(() => {
    let text: string | JSX.Element = ".";
    let className = `${styles.result}`;
    let style: CSSProperties = {
      animationDelay: `${currentTransitionDelay}ms`,
    };
    if (gameStatus === GameStatus.INVALID) {
      text = "Invalid Word!";
      className = className.concat(" ", "fadeIn");
    } else if (gameStatus === GameStatus.WIN) {
      text = "Greate! You Guess The Word!";
      className = className.concat(" ", "fadeFromTop");
    } else if (gameStatus === GameStatus.LOSS) {
      text = "You may try again by pressing F5.";
      className = className.concat(" ", "fadeIn");
    }

    return (
      <div className={className} style={style}>
        {text}
      </div>
    );
  }, [currentTransitionDelay, gameStatus]);

  return (
    <main>
      <div className={styles.title}>
        <div>
          <Image src={LOGO} alt="W" height={80} width={80} />
          ordle
        </div>
      </div>
      {renderResult}
      <div className={styles.wordle_area}>
        {gameStatus === GameStatus.WIN && (
          <div
            className={`${styles.wordle_area_win} fadeIn`}
            style={{
              animationDelay: `${currentTransitionDelay}ms`,
            }}
          >
            <div
              className="rainbow"
              style={{
                animationDelay: `${currentTransitionDelay}ms`,
              }}
            ></div>
          </div>
        )}

        {wordleBox}
      </div>
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
