import {Source, Trait} from "./trait";

export const DefaultShownColumns = ['name', 'traits', 'source',
    'hitPoints', 'size', 'speed', 'abilityBoosts', 'abilityFlaws', 'languages', 'senses'];

export const CreatureSizes = ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'];
export const Rarities = ['common', 'uncommon', 'rare', 'unique'];

export interface Action {
    cost: string;
    name: string;
    traits: Trait[];
    description: string[];
}

export interface Header {
    name: string;
    text: string;
    modifier: number;
}

export class Creature {
    id: number = 0;
    rarity: string = 'common';
    name: string = '';
    level: number = 0;
    alignment: string = '';
    traits: Trait[] = [];
    perception: number = 0;
    languages: string[] = [];
    otherCommunication: string[] = [];
    skills: Header[] = [];
    abilityMods: number[] = [];
    items: string[] = [];
    interactionAbilities: Action[] = [];
    source: Source = {book: 'N/A', homebrew: true, page: 69};
    family: string = '';
    ac: number = 0;
    acNotes: string = '';
    fortitude: number = 0;
    fortitudeNotes: string = '';
    reflex: number = 0;
    reflexNotes: string = '';
    will: number = 0;
    willNotes: string = '';
    saveNotes: string = '';
    hitPoints: number = 0;
    hitPointsNotes: string = '';
    regeneration: number = 0;
    deactivatedBy: string = '';
    hardness: number = 0;
    immunities: string[] = [];
    weaknesses: string[] = [];
    resistances: string[] = [];
    automaticAbilities: Action[] = [];
    reactiveAbilities: Action[] = [];
    size: string = '';
    speed: string = '';
    actions: Action[] = [];
    description: string = '';
    senses: string[] = [];
    bestiary: Header[] = [];

    static compareByRarity(c1: Creature, c2: Creature): number {
        return Rarities.indexOf(c1.rarity) < Rarities.indexOf(c2.rarity) ? -1 : 1;
    }

    static compareBySource(c1: Creature, c2: Creature): number {
        if (c1.source.book < c2.source.book)
            return -1;
        else if (c1.source.book > c2.source.book)
            return 1;
        else
            return c1.source.page < c2.source.page ? -1 : 1;
    }

    static compareBySize(c1: Creature, c2: Creature): number {
        return CreatureSizes.indexOf(c1.size) < CreatureSizes.indexOf(c2.size) ? -1 : 1;
    }

    constructor(object ?: Creature | undefined) {
        if (object) {
            Object.assign(this, object);
        }
    }
}
