import spellIcon from "../_assets/spells.svg";
import creatureIcon from "../_assets/creatures.svg";
import equipmentIcon from "../_assets/equipment.svg";
import ancestryIcon from "../_assets/ancestries.svg";
import deitiesIcon from "../_assets/deities.svg";
import domainsIcon from "../_assets/domains.svg";
import conditionsIcon from "../_assets/conditions.svg";
import traitsIcon from "../_assets/traits.svg";

export interface TopLink {
    label: string;
    link: string;
    icon: string;
}

export const toplinks: TopLink[] = [
    {
        'label': 'Spells',
        'link': '/spells',
        'icon': spellIcon
    },
    {
        label: 'Creatures',
        link: '/creatures',
        icon: creatureIcon
    },
    {
        label: 'Equipment',
        link: '/equipment',
        icon: equipmentIcon
    },
    {
        label: 'Ancestries',
        link: '/ancestries',
        icon: ancestryIcon
    },
    {
        label: 'Deities',
        link: '/deities',
        icon: deitiesIcon
    },
    {
        label: 'Domains',
        link: '/domains',
        icon: domainsIcon
    },
    {
        label: 'Conditions',
        link: '/conditions',
        icon: conditionsIcon
    },
    {
        label: 'Traits',
        link: '/traits',
        icon: traitsIcon
    }
];
