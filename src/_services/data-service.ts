import {Spell} from "../_interfaces/spell";
import {config} from "../_config/environment.local";
import localForage from 'localforage';
import {Ancestry} from "../_interfaces/ancestry";
import {Creature} from "../_interfaces/creature";
import {Trait} from "../_interfaces/trait";
import {RollCommand} from "../Roller/RollingTray";
import {BestiaryLine} from "../_interfaces/system";
import {GlobalContextValues} from "../App";

const axios = require('axios').default;

export default class DataService {
    static async getSpells(): Promise<Spell[]> {
        try {
            const response = await axios.get(`${config.apiUrl}/spells`);

            // cache result in offline db
            localForage.setItem<Spell[]>('spells', response.data).then(succ => {
                console.log(`cached ${succ.length} resources`);
            }).catch(err => {
                console.warn(`error caching resource: ${err}`);
            })
            return response.data;
        } catch (error) {
            console.log('serving cached resource');
            return localForage.getItem<Spell[]>('spells');
        }
    }

    static async getAncestries(): Promise<Ancestry[]> {
        try {
            const response = await axios.get(`${config.apiUrl}/ancestries`);

            // cache result in offline db
            localForage.setItem<Ancestry[]>('ancestries', response.data).then(succ => {
                console.log(`cached ${succ.length} resources`);
            }).catch(err => {
                console.warn(`error caching resource: ${err}`);
            })
            return response.data;
        } catch (error) {
            console.log('serving cached resource');
            return localForage.getItem<Ancestry[]>('ancestries');
        }
    }

    static async getCreatures(): Promise<Creature[]> {
        try {
            const response = await axios.get(`${config.apiUrl}/creatures`);

            // cache result in offline db
            localForage.setItem<Creature[]>('creatures', response.data).then(succ => {
                console.log(`cached ${succ.length} resources`);
            }).catch(err => {
                console.warn(`error caching resource: ${err}`);
            })
            return response.data;
        } catch (error) {
            console.log('serving cached resource');
            return localForage.getItem<Creature[]>('creatures');
        }
    }

    static async getTraits(): Promise<Trait[]> {
        try {
            const response = await axios.get(`${config.apiUrl}/traits`);

            // cache result in offline db
            localForage.setItem<Trait[]>('traits', response.data).then(succ => {
                console.log(`cached ${succ.length} resources`);
            }).catch(err => {
                console.warn(`error caching resource: ${err}`);
            })
            return response.data;
        } catch (error) {
            console.log('serving cached resource');
            return localForage.getItem<Trait[]>('traits');
        }
    }

    static async getRollHistory() {
        return localForage.getItem<RollCommand[]>('rollHistory');
    }

    static async setRollHistory(h: RollCommand[], context: GlobalContextValues, setContext: (c: GlobalContextValues) => any) {
        setContext({
            pinnedMonsters: context.pinnedMonsters,
            rollHistory: h,
            isRollingTrayOpen: context.isRollingTrayOpen
        })
        return localForage.setItem<RollCommand[]>('rollHistory', h);
    }

    static async getPinnedMonsters() {
        return localForage.getItem<BestiaryLine[]>('pinnedMonsters');
    }

    static async setPinnedMonsters(h: BestiaryLine[], context: GlobalContextValues, setContext: (c: GlobalContextValues) => any) {
        setContext({
            pinnedMonsters: h,
            rollHistory: context.rollHistory,
            isRollingTrayOpen: context.isRollingTrayOpen
        });
        return localForage.setItem<BestiaryLine[]>('pinnedMonsters', h);
    }

}
