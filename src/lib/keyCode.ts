import { ResultType } from "@/entity/enum/resultType";

export const KEY_TEXT = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
  ["Backspace", "Enter"]
];

export type KeyObjType = { [key: string]: ResultType.Status };

export function getKeyObject() {
    const keyObj: KeyObjType = {};
    KEY_TEXT.forEach(row=>{
        row.forEach(item=>{
            keyObj[item] = ResultType.Status.NONE;
        });
    });
    return keyObj;
}