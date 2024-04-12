interface Statistics {
    type: string;
    value: number
}

export interface Team {
    team: {
        id: number;
        name: string;
        logo: string
    }
    statistics: Statistics[]
} 