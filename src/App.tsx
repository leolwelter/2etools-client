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

export default function App() {
    return (
        <Router>
            <div>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/about" component={About} />
                    <Route path="/spells" component={Spells} />
                    <Redirect path="**" to='/' />
                </Switch>
            </div>
        </Router>
    );
}
