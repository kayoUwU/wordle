import { GameStatus } from "@/entity/enum/gameStatus";
import { Keybroad, KeyCode } from "@/entity/keyCode";
import { Wordle, WordleItem } from "@/entity/wordle";
import { useCallback, useState } from "react";
import { validateReq } from "./query";
import { ResultType } from "@/entity/enum/resultType";
import { ANIMATION_MS, CSS_MAX_COL_PROP_NAME, CSS_MAX_ROW_PROP_NAME, CSS_ROOT_NAME, DEV_MODE_SEARCH } from "./constant";
import { MODE, ModeType } from "@/entity/enum/modeType";

// Change Style
function getUpdatedKeyObj(
  newGameStatus: GameStatus.Status,
  currentTransitionDelay?: number | undefined
): Keybroad.DataType {
  if (newGameStatus === GameStatus.Status.TOBE_SUBMIT) {
    const Enter = new KeyCode();
    Enter.text = "Enter";
    Enter.css = { backgroundColor: "var(--blue-color)" };
    return { Enter };
  } else if (newGameStatus === GameStatus.Status.INVALID) {
    const Backspace = new KeyCode();
    Backspace.text = "Backspace";
    Backspace.css = { backgroundColor: "var(--blue-color)" };
    return { Backspace };
  } else if (newGameStatus === GameStatus.Status.LOSS) {
    const F5 = new KeyCode();
    F5.text = "F5";
    F5.hidden = false;
    F5.className = "flexfadeIn";
    F5.css = { animationDelay: `${currentTransitionDelay || 0}ms` };
    return { F5 };
  }
  return {};
}

// Reset Style
function getResetUpdatedKeyObj(
  oldGameStatus: GameStatus.Status
): Keybroad.DataType {
  if (oldGameStatus === GameStatus.Status.TOBE_SUBMIT) {
    const Enter = new KeyCode();
    Enter.text = "Enter";
    Enter.css = undefined;
    return { Enter };
  } else if (oldGameStatus === GameStatus.Status.INVALID) {
    const Backspace = new KeyCode();
    Backspace.text = "Backspace";
    Backspace.css = undefined;
    return { Backspace };
  } else if (oldGameStatus === GameStatus.Status.LOSS) {
    const F5 = new KeyCode(true);
    F5.text = "F5";
    F5.hidden = true;
    F5.className = "";
    F5.css = undefined;
    return { F5 };
  }
  return {};
}

export function useGameManager() {
  const [wordleArr, setWordleArr] = useState<WordleItem[]>(() =>
    Wordle.buildWordleArr()
  );
  const [currentPosition, setCurrentPosition] = useState<number>(0);
  const [currentTransitionDelay, setCurrentTransitionDelay] =
    useState<number>(0);

  const [keybroadData, setKeybroadData] = useState<Keybroad.DataType>(() =>
    Keybroad.buildKeyObject()
  );
  const [gameStatus, setGameStatus] = useState<GameStatus.Status>(
    GameStatus.Status.IN_PROGRESS
  );

  const [isWaiting, setIsWaiting] = useState<boolean>(false);

  const [modeType, setModeType] = useState<ModeType>(ModeType.DEFAULT);

  const updateGameStatus = useCallback(
    (newGameStatus: GameStatus.Status, transitionDelay: number = 0) => {
      if (gameStatus !== newGameStatus) {
        setGameStatus(newGameStatus);

        // setup funciont key
        const updateKeybroadData: Keybroad.DataType = {
          ...getResetUpdatedKeyObj(gameStatus),
          ...getUpdatedKeyObj(newGameStatus, transitionDelay),
        };
        if (Object.keys(updateKeybroadData).length != 0) {
          setKeybroadData((item) => ({ ...item, ...updateKeybroadData }));
        }
      }
    },
    [gameStatus]
  );

  const resetGame = useCallback((modeType:ModeType) => {
    setWordleArr(Wordle.buildWordleArr(modeType));
    setCurrentPosition(0);
    setCurrentTransitionDelay(0);
    setKeybroadData(Keybroad.buildKeyObject());
    updateGameStatus(GameStatus.Status.IN_PROGRESS);
    setIsWaiting(false);
  }, [updateGameStatus]);

  const changeMode = useCallback(()=>{
    if(document){
      let newModeType = modeType;
      if(modeType==ModeType.DEFAULT){
        newModeType = ModeType.HARD;
      } else {
        newModeType = ModeType.DEFAULT;
      }

      setModeType(newModeType);
      resetGame(newModeType);

      const root = document.querySelector(CSS_ROOT_NAME) as HTMLElement;
      if(root){
        const mode = MODE[newModeType];
        root.style.setProperty(CSS_MAX_COL_PROP_NAME,mode.maxCol.toString());
        root.style.setProperty(CSS_MAX_ROW_PROP_NAME,mode.maxRow.toString());
      }
    }
  },[modeType, resetGame]);

  const onSubmit = useCallback(() => {
    if (gameStatus === GameStatus.Status.TOBE_SUBMIT) {
      setIsWaiting(true);
      // valid word
      validateReq(
        Wordle.getCurrentWord({ wordleArr, currentPosition, modeType }),
        window?.location?.search !== DEV_MODE_SEARCH ? false : true
      )
        .then((result) => {
          if (!result) {
            return;
          }
          let win = true;
          let animationDelay = 0;
          const wordleClone = [...wordleArr];
          const keyClone = { ...keybroadData };
          const timestamp = Date.now();
          for (
            let i = Wordle.getStartIndex(currentPosition,modeType), j = 0;
            i < Wordle.getEndIndex(currentPosition,modeType);
            i++, j++
          ) {
            if (result.isvalidword && j >= result.score.length) {
              break;
            }

            const item: WordleItem = new WordleItem().cloneResult(
              wordleClone[i]
            );

            if (!result.isvalidword) {
              item.result = ResultType.Status.INVALID;
              item.className = "shakeHorizontal";
              //rerun animation
              item.key = `${i}-${timestamp}`;
            } else {
              item.result = result.score[j];
              // keep item.key prevent rerender change original color (i.e. not trigger color transition)
              item.css = { transitionDelay: `${animationDelay}ms` };

              // key use the highest score style
              if (
                ResultType.compare(
                  item.result,
                  keyClone[item.text.toUpperCase()]?.result
                ) === 1
              ) {
                const keyItem = new KeyCode()
                  .cloneResult(keyClone[item.text.toUpperCase()])
                  .cloneWordle(item);
                keyItem.css = { transitionDelay: `${animationDelay}ms` };
                keyClone[item.text.toUpperCase()] = keyItem;
              }

              animationDelay += ANIMATION_MS;
              item.toInAcitve();
            }
            
            wordleClone[i] = item;
            if (item.result !== ResultType.Status.CORRET) {
              win = false;
            }
          }

          let newGameStatus: GameStatus.Status = gameStatus;
          if (result.isvalidword) {
            setCurrentTransitionDelay(animationDelay);

            if (
              win ||
              //no more guess
              !Wordle.isHasNextAttempt(currentPosition, modeType)
            ) {
              //result
              const final = win
                ? GameStatus.Status.WIN
                : GameStatus.Status.LOSS;
              newGameStatus = final;
            } else {
              // next word
              newGameStatus = GameStatus.Status.IN_PROGRESS;

              // update next row style
              const nextPosition = currentPosition + 1;
              for (
                let i = Wordle.getStartIndex(nextPosition, modeType);
                i < Wordle.getEndIndex(nextPosition, modeType);
                i++
              ) {
                const item: WordleItem = new WordleItem().cloneResult(
                  wordleClone[i]
                );
                if (i == nextPosition) {
                  item.isActiveWord = true;
                }
                item.isActiveRow = true;
                item.css = { transitionDelay: `${animationDelay}ms` };
                wordleClone[i] = item;
              }
              setCurrentPosition(nextPosition);
            }
          } else {
            newGameStatus = GameStatus.Status.INVALID;
          }

          setWordleArr([...wordleClone]);
          setKeybroadData(keyClone);
          updateGameStatus(newGameStatus, animationDelay);
        })
        .finally(() => {
          setIsWaiting(false);
        });
    }
  }, [currentPosition, gameStatus, keybroadData, modeType, updateGameStatus, wordleArr]);

  // false = need prevent event
  const onKeyDown = useCallback(
    (key: string) => {
      if (isWaiting) {
        return false;
      }
      //input
      if (
        gameStatus === GameStatus.Status.IN_PROGRESS &&
        /^[a-zA-Z]$/.test(key)
      ) {
        if (Wordle.isStartOfNewRow({ wordleArr, currentPosition, modeType })) {
          setCurrentTransitionDelay(0); // reset delay
        }

        const item: WordleItem = new WordleItem().cloneResult(
          wordleArr[currentPosition]
        );
        item.text = key.toUpperCase();
        item.isActiveWord = false;
        item.className = "bounceScale";
        //rerun animation
        item.key = `${currentPosition}-${Date.now()}`;
        wordleArr[currentPosition] = item;

        const nextPosition = currentPosition + 1;
        if (nextPosition === Wordle.getEndIndex(currentPosition, modeType)) {
          updateGameStatus(GameStatus.Status.TOBE_SUBMIT);
        } else {
          // update next word style
          setCurrentPosition(nextPosition);
          const nextItem: WordleItem = new WordleItem().cloneResult(
            wordleArr[nextPosition]
          );
          nextItem.isActiveWord = true;
          wordleArr[nextPosition] = nextItem;
        }
        setWordleArr([...wordleArr]);
        return true;
      } else if (
        !GameStatus.isDone(gameStatus) &&
        key === "Backspace" &&
        currentPosition !== Wordle.getStartIndex(currentPosition, modeType)
      ) {
        let prevPosition = currentPosition - 1;

        if (
          gameStatus === GameStatus.Status.TOBE_SUBMIT ||
          gameStatus === GameStatus.Status.INVALID
        ) {
          updateGameStatus(GameStatus.Status.IN_PROGRESS);
          prevPosition = currentPosition;
        }

        //reset current key style
        const item: WordleItem = new WordleItem().cloneResult(
          wordleArr[currentPosition]
        );
        item.isActiveWord = false;
        wordleArr[currentPosition] = item;

        //back 1 word
        const prevItem: WordleItem = new WordleItem().cloneResult(
          wordleArr[prevPosition]
        );
        prevItem.text = "";
        prevItem.isActiveWord = true;
        //reset style
        prevItem.result = ResultType.Status.NONE;
        wordleArr[prevPosition] = prevItem;

        setWordleArr([...wordleArr]);
        setCurrentPosition(prevPosition);

        return true;
      } else if (
        gameStatus === GameStatus.Status.TOBE_SUBMIT &&
        key === "Enter"
      ) {
        //submit
        onSubmit();
        return true;
      } else if (key === "F5" && gameStatus === GameStatus.Status.LOSS) {
        resetGame(modeType);
        return true;
      }
      return false;
    },
    [currentPosition, gameStatus, isWaiting, modeType, onSubmit, resetGame, updateGameStatus, wordleArr]
  );

  return {
    wordleArr,
    keybroadData,
    currentTransitionDelay,
    isWaiting,
    gameStatus,
    onKeyDown,
    changeMode,
    modeType,
  };
}
