import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import Home from "./home/Home";
import About from "./About/About";
import Spells from "./Spells/Spells";
import RollingTray from "./Roller/RollingTray";
import Conditions from "./Conditions/Conditions";

export default function App() {
    return (
        <Router>
            <div>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/about" component={About} />
                    <Route path="/spells" component={Spells} />
                    <Route path="/conditions" component={Conditions} />
                    <Redirect path="**" to='/' />
                </Switch>
                <RollingTray/>
            </div>
        </Router>
    );
}
