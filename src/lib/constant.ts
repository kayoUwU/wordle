export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const LOGO = BASE_PATH.concat("/icon-320.webp");
export const WEB_ICON = BASE_PATH.concat("/favicon.ico");

export const IS_DISABLE_SERVER_API: boolean = process.env.NEXT_PUBLIC_USE_EXPORT === 'true';

export const ANIMATION_MS = 300;

export const DEV_MODE_SEARCH = "?DEV=KAYOUWU";
export const WORDLE_LEN = 5;
export const DEMO_WORD_LIST = ["hello", "world", "color", "stone", "train","white","black"];

export const CSS_ROOT_NAME = ":root";
export const CSS_MAX_COL_PROP_NAME = "--max-column";
export const CSS_MAX_ROW_PROP_NAME = "--max-row";

export const WORDLE_HINT_OLDEST_DATE = "2021-06-19";
export const NY_TIMES_OLDEST_DATE = "2021-06-19";