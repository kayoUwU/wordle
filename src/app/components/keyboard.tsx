import { memo } from "react";
import styles from "./keyboard.module.css";
import { KEY_TEXT, KeyObjType } from "@/lib/keyCode";
import { ResultType } from "@/entity/enum/resultType";

function Keyboard({
  onKeyDown,
  keyStatus,
}: {
  onKeyDown: (key: string) => void;
  keyStatus: KeyObjType;
}) {
  return (
    <div className={styles.keyboard}>
      {KEY_TEXT.map((row, index) => {
        return (
          <div key={index} className={styles.keyboard_row}>
            {row.map((item) => {
              return (
                <div
                  key={item}
                  onClick={() => {
                    onKeyDown(item);
                  }}
                  style={ResultType.toStyle(keyStatus[item])}
                >
                  {item}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default memo(Keyboard);
