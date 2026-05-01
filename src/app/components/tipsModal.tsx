import { memo, RefObject } from "react";
import styles from "./tipsModal.module.css";

function TipsModal({
  tipsDialogRef,
  onCloseTipsModal,
}: {
  tipsDialogRef: RefObject<HTMLDialogElement>;
  onCloseTipsModal: () => void;
}) {
  return (
    <dialog
      ref={tipsDialogRef}
      onClick={(e) => {
        // Closes if you click the backdrop (outside the white box)
        if (e.target === tipsDialogRef.current) onCloseTipsModal();
      }}
      className={`${styles["tips-dialog"]} slideUp`}
    >
      <div className={styles["tips-dialog-content"]}>
        <div>
          <h1 id="how-to-play">How to play</h1>
          <p>
            This game follow the rule of{" "}
            <a href="https://www.nytimes.com/games/wordle/index.html">Wordle</a>
            .
          </p>
          <ul>
            <li>
              you can choose different source of answer and by date. If there is
              no answer, <code>No Solution For the date!</code> will be shown.
              <ul>
                <li>
                  <a href="https://wordlehints.co.uk/wordle-past-answers/api/">
                    Wordle Hints API
                  </a>{" "}
                  is used in souce type <code>Wordle Hints Latest</code> and{" "}
                  <code>Wordle Hints</code>.
                  <ul>
                    <li>
                      <code>Wordle Hints Latest</code>: the latest available
                      Wordle answer from Wordle Hints API.
                    </li>
                    <li>
                      <code>Wordle Hints</code>: answer of the choosen date
                    </li>
                  </ul>
                </li>
                <li>
                  <code>New York Times</code>: answer from{" "}
                  <a href="https://www.nytimes.com/games/wordle/index.html">
                    Wordle
                  </a>
                  . However, there is no offical doc, so it is not gurantee to
                  get the answer.
                </li>
                <li>
                  <code>Demo</code>: 7 fixed answers that circulate through the
                  week week day.
                </li>
              </ul>
            </li>
            <li>
              <a href="https://freedictionaryapi.com/api/v1/">
                Free Dictionary API
              </a>{" "}
              is used to valid each input guess (i.e. five-letter word).
              <ul>
                <li>you have 6 guesses in normal mode.</li>
                <li>you have 4 guesses in hard mode.</li>
                <li>
                  invalid word will be hightlighted in{" "}
                  <span style={{ color: "var(--red-color)" }}>Red</span>
                </li>
              </ul>
            </li>
            <li>
              After the input is validated, it will be compared with the answer
              character by character. The result of each character will be
              differentiate by color.
              <ul>
                <li>
                  <span style={{ color: "var(--green-color)" }}>Green</span>:
                  the character is in the answer, and it is in the correct
                  position.
                </li>
                <li>
                  <span style={{ color: "var(--yellow-color)" }}>Yellow</span>:
                  the character is in the answer, but it is in the wrong
                  position.
                </li>
                <li>
                  <span style={{ color: "var(--grey-color)" }}>Grey</span>: the
                  character isn&#39;t in the answer.
                </li>
              </ul>
            </li>
            <li>
              Once you have guessed the answer, a rainbow effect will be
              shown{" "}
            </li>
          </ul>
        </div>

        <button onClick={onCloseTipsModal}>Got it!</button>
      </div>
    </dialog>
  );
}

export default memo(TipsModal);
