export class Deity {
  source: {
    book: string,
    page: number,
    homebrew: boolean
  };
  name: string;
  alignment: string;
  followerAlignments: string[];
  domains: string[];
  favoredWeapon: string;
  edicts: string[];
  anathema: string[];
  divineFont: string[];
  divineSkill: string;
  clericSpells: {
    level: number,
    name: string
  }[];
  description: {
    header: string,
    text: string
  }[];

  constructor(object?: object) {
    if (object) {
      Object.assign(this, object);
    } else {
      this.name = '';
      this.alignment = '';
      this.followerAlignments = [];
      this.domains = [];
      this.favoredWeapon = '';
      this.edicts = [];
      this.anathema = [];
      this.divineFont = [];
      this.divineSkill = '';
      this.clericSpells = [];
      this.description = [];
    }
  }
}
