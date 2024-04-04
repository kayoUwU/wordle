import { WordleItem } from "@/entity/wordle";
import { memo, useMemo } from "react";
import styles from "./wordleBoard.module.css"

function WordleBoard({
  wordleArr,
  isWin,
  animationDelay,
}:{
  wordleArr:WordleItem[],
  isWin:boolean,
  animationDelay:number
}) {
  const wordleRows = useMemo(() => {
    return wordleArr.map((item, index) => {
      return (
        <div
          key={item.key || index}
          style={item.style}
          className={`${styles.word} ${item.isActiveRow?styles.active:''} ${item.isActiveWord?styles.active_word:''}  ${item.className}`}
        >
          {item.text}
        </div>
      );
    });
  }, [wordleArr]);

  return (
    <div className={styles.wordle_area}>
      {isWin && (
        <div
          className={`${styles.wordle_area_win} fadeIn`}
          style={{
            animationDelay: `${animationDelay}ms`,
          }}
        >
          <div
            className="rainbow"
            style={{
              animationDelay: `${animationDelay}ms`,
            }}
          ></div>
        </div>
      )}

      {wordleRows}
    </div>
  );
}

export default memo(WordleBoard);
