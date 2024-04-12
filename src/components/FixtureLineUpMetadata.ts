interface startXI {
    player: {
        id: number;
        name: string;
        number: number;
        pos: string;
        grid: string
    }
}

interface substitutes {
    player: {
        id: number;
        name: string;
        number: number;
        pos: string;
        grid: string
    }
}

export interface Lineups {
    team: {
        id: number,
        name: string,
        logo: string,
        colors: {
            player: {
            primary: string,
            number: string,
            border: string
            },
            goalkeeper: {
            primary: string,
            number: string,
            border: string
            }
        }
    },
    formation: string,
    startXI: startXI[],
    substitutes: substitutes[],
    coach: {
        id: number,
        name: string,
        photo: string
    }
}
