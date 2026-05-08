export interface GetNYTimesDailyWordReq {
    dateStr: string
};

export const GetNYTimesDailyWordSearchParams = {
    dateStr: "dateStr"
}

export interface GetWordleHintsReq {
    dateStr?: string | null,
    isLatest: boolean
}

export const GetWordleHintsSearchParams = {
    dateStr: "dateStr",
    isLatest: "isLatest"
}