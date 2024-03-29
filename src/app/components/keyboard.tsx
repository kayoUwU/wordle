import { memo, useMemo } from "react";
import styles from "./keyboard.module.css";
import { KeyObjType } from "@/lib/keyCode";
import { ResultType } from "@/entity/enum/resultType";

function Keyboard({
  onKeyDown,
  keyStatus,
  keyArr
}: {
  onKeyDown: (key: string) => void;
  keyStatus: KeyObjType;
  keyArr : string[][]
}) {
  const keyboard = useMemo(
    () =>
    keyArr.map((row, index) => {
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
      }),
    [keyArr, keyStatus, onKeyDown]
  );
  return <div className={styles.keyboard}>{keyboard}</div>;
}

export default memo(Keyboard);
