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
