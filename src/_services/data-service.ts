import {Spell} from "../_interfaces/spell";
import {config} from "../_config/environment.local";
const axios = require('axios').default;

export default class DataService {

    public static async getSpells(): Promise<Spell[]> {
        try {
            const response = await axios.get(`${config.apiUrl}/spells`);
            console.log(response);
            return response.data;
        } catch (error) {
            console.error(error);
            return error;
        }
    }
}
