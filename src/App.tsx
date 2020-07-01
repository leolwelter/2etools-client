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

export interface GlobalContextValues {
    rollHistory: RollCommand[];
    isRollingTrayOpen: boolean;
}

/** values have to be set initially **/
// TODO use proper types
export const AppContext: Context<any> = React.createContext({
    context: { rollHistory: [] },
    setContext: () => {}
});

export default function App() {
    /** set global context from local storage **/
    let [context, setContext] = useState<GlobalContextValues>(
        {
            rollHistory: [],
            isRollingTrayOpen: false
        });
    useEffect(() => {
        DataService.getRollHistory().then(h => setContext({
            rollHistory: h,
            isRollingTrayOpen: false
        }));
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
