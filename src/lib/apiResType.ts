// dictionaryApi ref: https://freedictionaryapi.com/api/v1#GET/entries/{language}/{word}
export type DictionaryResType = {
    word: string,
    entries: {}[]
};

export type NycWordResType = {
    solution: string,
    print_date: string
}