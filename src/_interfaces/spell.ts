import {Source, Trait} from "./trait";


export class Spell {
  id: number;
  url: string;
  name: string;
  level: number;
  spellType: string;
  traits: Trait[];
  source: Source;
  traditions: string[];
  cast: string;
  requirements: string;
  cost: string;
  actions: number[];
  components: string[];
  range: string;
  targets: string;
  trigger: string;
  area: string;
  savingThrow: string;
  duration: string;
  isSustained: boolean;
  description: string;
  heightened: { level: string, description: string }[];
  criticalSuccess: string;
  success: string;
  criticalFailure: string;
  failure: string;


  static compareBySource(c1: Spell, c2: Spell): number {
    if (c1.source.book < c2.source.book)
      return -1;
    else if (c1.source.book > c2.source.book)
      return 1;
    else
      return c1.source.page < c2.source.page ? -1 : 1;
  }

  static compareByCast(c1: Spell, c2: Spell): number {
    const times = ['0', '4', '1', '2', '3','12', '123', '1 minute', '10 minutes', '1 hour'];
    let c1Index, c2Index;
    if (c1.cast && c1.actions?.length === 0) c1Index = times.indexOf(c1.cast)
    else if (c1.actions?.length > 0) c1Index = times.indexOf(c1.actions.join(''))
    else c1Index = 999;
    if (c2.cast && c2.actions?.length === 0) c2Index = times.indexOf(c2.cast)
    else if (c2.actions?.length > 0) c2Index = times.indexOf(c2.actions.join(''))
    else c2Index = 999;
    return c1Index < c2Index ? -1 : 1;
  }

  constructor(spell?: object) {
    if (spell) {
      Object.assign(this, spell);
    } else {
      this.actions = [];
      this.area = '';
      this.cast = '';
      this.requirements = '';
      this.cost = '';
      this.components = [];
      this.criticalFailure = '';
      this.criticalSuccess = '';
      this.description = '';
      this.duration = '';
      this.failure = '';
      this.heightened = [];
      this.id = 0;
      this.isSustained = false;
      this.level = 0;
      this.name = '';
      this.range = '';
      this.savingThrow = '';
      this.source = {book: '', page: 0, homebrew: false};
      this.spellType = '';
      this.success = '';
      this.targets = '';
      this.traditions = [];
      this.traits = [];
      this.trigger = '';
      this.url = '';
    }
  }
}
