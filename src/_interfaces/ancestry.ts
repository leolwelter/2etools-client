import {ContentSource, Trait} from './spell';

export const DefaultShownColumns = ['name', 'traits', 'source',
  'hitPoints', 'size', 'speed', 'abilityBoosts', 'abilityFlaws', 'languages', 'senses'];

export const CreatureSizes = ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'];

export class Ancestry {
  id: number;
  url: string;
  name: string;

  traits: Trait[];
  source: ContentSource;
  description: {
    header: string,
    text: string
  }[];
  hitPoints: number;
  size: string;
  speed: string;
  abilityBoosts: string[];
  abilityFlaws: string[];
  languages: string[];
  senses: {
    name: string;
    text: string;
  }[];
  extras: {
    header: string,
    text: string;
  }[];

  constructor(object ?: Ancestry | undefined) {
    if (object) {
      Object.assign(this, object);
    } else {
      this.id = 1;
      this.url = 'https://2e.aonprd.com/Ancestries.aspx?ID=1';
      this.name = '';
      this.traits = [];
      this.source = {book: 'Core Rulebook', page: 0, homebrew: false};
      this.description = [];
      this.hitPoints = 8;
      this.size = '';
      this.speed = '25 feet';
      this.abilityBoosts = [];
      this.abilityFlaws = [];
      this.languages = [];
      this.senses = [];
      this.extras = [];
    }
  }
}
