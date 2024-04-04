import { memo, useMemo } from "react";
import styles from "./keyboard.module.css";
import { Keybroad, DEFAULT_KEY } from "@/entity/keyCode";

function Keyboard({
  onKeyDown,
  keybroadData,
}: {
  onKeyDown: (key: string) => void;
  keybroadData:Keybroad.DataType
}) {
  const keyboard = useMemo(
    () =>
    DEFAULT_KEY.map((row, index) => {
        return (
          <div key={index} className={styles.keyboard_row}>
            {row.map((item) => {
              return (
                <button
                  key={item}
                  onClick={() => {
                    onKeyDown(item);
                  }}
                  className={keybroadData[item]?.className}
                  style={keybroadData[item]?.style}
                  hidden={keybroadData[item]?.hidden}
                >
                  {item}
                </button>
              );
            })}
          </div>
        );
      }),
    [keybroadData, onKeyDown]
  );
  return <div className={styles.keyboard}>{keyboard}</div>;
}

export default memo(Keyboard);
