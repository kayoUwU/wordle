import { LegalContentType } from "@/entity/enum/legalContentType";

export type ModalContentInput = {
  title?: string;
  content: JSX.Element;
};

// markdown to html
export const tipsModalContent: ModalContentInput = {
  title: "How to play",
  content: (
    <div>
      <p>
        This game follow the rule of{" "}
        <a href="https://www.nytimes.com/games/wordle/index.html">Wordle</a>.
      </p>
      <ul>
        <li>
          you can choose different source of answer and by date. If there is no
          answer, <code>No Solution For the date!</code> will be shown.
          <ul>
            <li>
              <code>Demo</code>: 7 fixed answers that circulate through the
              week week day.
            </li>
            <li>
              <a href="https://wordlehints.co.uk/wordle-past-answers/api/">
                Wordle Hints API
              </a>{" "}
              is used in souce type <code>Wordle Hints Latest</code> and{" "}
              <code>Wordle Hints</code>.
              <ul>
                <li>
                  <code>Wordle Hints Latest</code>: the latest available Wordle
                  answer from Wordle Hints API.
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
              . However, there is no offical doc, so it is not gurantee to get
              the answer.
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
              <span style={{ color: "var(--green-color)" }}>Green</span>: the
              character is in the answer, and it is in the correct position.
            </li>
            <li>
              <span style={{ color: "var(--yellow-color)" }}>Yellow</span>: the
              character is in the answer, but it is in the wrong position.
            </li>
            <li>
              <span style={{ color: "var(--grey-color)" }}>Grey</span>: the
              character isn&#39;t in the answer.
            </li>
          </ul>
        </li>
        <li>
          Once you have guessed the answer, a rainbow effect will be shown{" "}
        </li>
      </ul>
    </div>
  ),
};

export const legalContent: { [key in LegalContentType]: ModalContentInput } = {
  [LegalContentType.TERMS]: {
    title: "Terms and Conditions",
    content: (
      <>
        This website was created as a
        <strong>personal design portfolio project</strong>. We provide no
        guarantees regarding service uptime or word accuracy.
        <br />
        <br />
        Wordle is a trademark of The New York Times Company. The UI design
        and code are original works and are not affiliated with, endorsed by, or
        representative of The New York Times Company or any other trademarked
        entities.
      </>
    ),
  },
  [LegalContentType.PRIVACY]: {
    title: "Privacy Policy",
    content: (
      <>
        We do not store personal data. To validate your gameplay, your
        guesses input are proxied through our server to a
        <strong>third-party Dictionary API</strong>. Standard server logs
        may be kept by our hosting provider for security purposes.
      </>
    ),
  },
  [LegalContentType.DATA]: {
    title: "Data Source",
    content: (
      <>
        <p>
          This project retrieves data from the following sources via a
          server-side proxy:
        </p>
        <ul>
          <li>
            <strong>Answer:</strong>
            <a href="https://wordlehints.co.uk/wordle-past-answers/api/">
              Wordle Hints API
            </a>
            
            <a href="https://www.nytimes.com/games/wordle/index.html">Wordle</a>
          </li>
          <li>
            <strong>Word Definitions:</strong>
            <a href="https://freedictionaryapi.com/api/v1/">
              Free Dictionary API
            </a>
          </li>
        </ul>
        <p>
          All answer and word definitions are provided &quot;as-is&quot; by
          these third-party api (except certain sample answers created by the
          developer for demonstration purposes). Details of where the
          source is used is in &quot;How to Play&quot;(i.e. the ? icon). This
          website acts as a technical proxy to deliver this third-party content
          to the interface.
        </p>
      </>
    ),
  },
};
