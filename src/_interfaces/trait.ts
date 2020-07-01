export interface Trait {
    id: number;
    name: string;
    groups: string[];
    source: {
        book: string,
        page: number
    };
    description: string;
}

export interface Source {
    book: string;
    page: number;
    homebrew: boolean;
}
