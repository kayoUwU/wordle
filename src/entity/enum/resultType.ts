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

    const ResultAnimation: { [key in Status]: string  } = {
        [Status.WRONG]: '',
        [Status.WRONG_POSITION]: '',
        [Status.CORRET]: '',
        [Status.INVALID]: 'invalid',
        [Status.NONE]: '',
    };
}