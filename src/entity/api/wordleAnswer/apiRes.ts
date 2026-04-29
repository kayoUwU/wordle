

export interface NyTimesWordRes {
    solution: string,
    print_date: string,
    error?: string,
}

export interface wordlerHintsResultItem {
    date: string,
    answer: string,
    error?: string,
};
export interface WordleHintsRes {
    total: number, // not exist = 0
    results: wordlerHintsResultItem[],
    error?: string,
}
