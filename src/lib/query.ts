import { Result } from "@/entity/result";

export async function validateReq(word:string) {
  return new Result({isvalidword:true,score:[0,1,2,0,1]});
}
