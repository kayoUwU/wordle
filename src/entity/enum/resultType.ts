export namespace ResultType {
    export enum Status {
        WRONG,
        WRONG_POSITION,
        CORRET,
        INVALID,
        NONE,
    };

    export function fromOrdinal(i:number){
        switch(i){
            case 0:
                return Status.WRONG;
            case 1:
                return Status.WRONG_POSITION;
            case 2:
                return Status.CORRET;
            default:
                return Status.NONE;
        }
    }

    export function toScore(i:Status){
        switch(i){
            case Status.WRONG:
                return 0;
            case Status.WRONG_POSITION:
                return 1;
            case Status.CORRET:
                return 2;
            default:
                return -1;
        }
    }

    export function compare(aStatus?:Status, bStatus?:Status){
        const a = aStatus!==undefined? toScore(aStatus) : -1;
        const b = bStatus!==undefined? toScore(bStatus) : -1;
        if(a>b){
            return 1;
        }
        if(a<b){
            return -1;
        }
        return 0;
    }

    const ResultStyle: { [key in Status]: React.CSSProperties  } = {
        [Status.WRONG]: {backgroundColor:'var(--grey-color)'},
        [Status.WRONG_POSITION]: {backgroundColor:'var(--yellow-color)'},
        [Status.CORRET]: {backgroundColor:'var(--green-color)'},
        [Status.INVALID]: {backgroundColor:'var(--red-color)'},
        [Status.NONE]: {},
    };
    
    export function toStyle(status: keyof typeof ResultStyle) {
        return ResultStyle[status];
    }
}