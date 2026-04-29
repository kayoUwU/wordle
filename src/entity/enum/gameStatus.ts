export namespace GameStatus {
  export const enum Status {
    NO_SOLUTION,
    IN_PROGRESS,
    TOBE_SUBMIT,
    INVALID, //not in dictionary
    WIN,
    LOSS,
  }

  type GameStatusRenderProp = {
    text: string | undefined;
    className: string | undefined;
  };
  export function getGameStatusRenderProp(
    gameStatus: Status
  ): GameStatusRenderProp {
    switch (gameStatus) {
      case Status.NO_SOLUTION:
        return { text: "No Solution For the date!" , className: "fadeIn" };
      case Status.INVALID:
        return { text: "Invalid Word!", className: "fadeIn" };
      case Status.WIN:
        return { text: "Great! You Guess The Word!", className: "fadeFromTop" };
      case Status.LOSS:
        return {
          text: "You may try again by pressing F5.",
          className: "fadeIn",
        };
      default:
        return { text: undefined, className: undefined };
    }
  }

  export function isDone(gameStatus: GameStatus.Status) {
    return (
      gameStatus === GameStatus.Status.WIN ||
      gameStatus === GameStatus.Status.LOSS
    );
  }
}
