import { LegalContentType } from "@/entity/enum/legalContentType";
import styles from "./footer.module.css";
import { legalContent, ModalContentInput } from "./modal/modalContent";
import { memo } from "react";

function Footer({
  onShowModal,
}: {
  onShowModal: (input: ModalContentInput) => void;
}) {
  return (
    <>
      <footer className={styles.footer}>
        <p>
          &copy; 2024–{new Date().getFullYear()} Designed & Developed by&nbsp;
          <a
            href="https://kayouwu.github.io"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.author}
          >
            Kayou W.
          </a>
        </p>

        <div className={styles.linkButtonGroup}>
          {Object.keys(LegalContentType)
            .filter((key) => !isNaN(Number(key)) && key.trim() !== "")
            .map((value) => {
              const t = Number(value) as LegalContentType;
              return (
                <button
                  key={value}
                  onClick={() => onShowModal(legalContent[t])}
                  className={styles.linkButton}
                >
                  {legalContent[t].title}
                </button>
              );
            })}
        </div>
      </footer>
    </>
  );
}

export default memo(Footer);
