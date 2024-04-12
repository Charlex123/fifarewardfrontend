export interface Events {
    time: {
        elapsed: number;
        extra: null;
        },
    team: {
        id: number;
        name: string;
        logo: string;
        },
    player: {
        id: number;
        name: string;
        },
    assist: {
        id: number;
        name: string;
        },
    type: string;
    detail: string;
    comments: string;
        
}
