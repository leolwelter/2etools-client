import React, {Context, useEffect, useState} from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import Home from "./home/Home";
import Spells from "./Spells/Spells";
import {RollCommand} from "./Roller/RollingTray";
import Conditions from "./Conditions/Conditions";
import Ancestries from "./Ancestries/Ancestries";
import Creatures from "./Creatures/Creatures";
import Traits from "./Traits/Traits";
import DataService from "./_services/data-service";
import {BestiaryLine} from "./_interfaces/system";

export interface GlobalContextValues {
    rollHistory: RollCommand[];
    pinnedMonsters: BestiaryLine[];
    isRollingTrayOpen: boolean;
}

/** values have to be set initially **/
export const AppContext: Context<any> = React.createContext({
    context: {
        rollHistory: [],
        pinnedMonsters: [],
        isRollingTrayOpen: false
    },
    setContext: () => {}
});

export default function App() {
    /** set global context from local storage **/
    let [context, setContext] = useState<GlobalContextValues>(
        {
            rollHistory: [],
            pinnedMonsters: [],
            isRollingTrayOpen: false
        });
    useEffect(() => {
        Promise.all([DataService.getRollHistory(),
            DataService.getPinnedMonsters()]).then(([rh, pm])=> {
            setContext({
                rollHistory: rh || [],
                pinnedMonsters: pm || [],
                isRollingTrayOpen: false
        })});
    }, [])

    return (
        <AppContext.Provider value={{context, setContext}}>
            <Router>
                <div>
                    <Switch>
                        <Route exact path="/" component={Home}/>
                        <Route path="/spells" component={Spells}/>
                        <Route path="/conditions" component={Conditions}/>
                        <Route path="/ancestries" component={Ancestries}/>
                        <Route path="/creatures" component={Creatures}/>
                        <Route path="/traits" component={Traits}/>
                        <Redirect path="**" to='/'/>
                    </Switch>
                </div>
            </Router>
        </AppContext.Provider>

    );
}
