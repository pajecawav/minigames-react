import { Redirect, Route, Switch } from "react-router";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { GamesList } from "./components/GamesList";
import { NumberMemoryGame } from "./games/NumberMemoryGame.tsx";
import { PatternMemoryGame } from "./games/PatternMemoryGame";
import { ReactionTimeGame } from "./games/ReactionTimeGame";
import { TypeSpeedGame } from "./games/TypeSpeedGame";
import { VisualMemoryGame } from "./games/VisualMemoryGame";

export const App = () => {
    return (
        <Router>
            <div className="flex flex-col w-full max-w-4xl min-h-full px-4 pb-6 mx-auto text-primary-500">
                <Link
                    className="mb-10 font-mono text-5xl transition-colors duration-500 text-secondary"
                    to="/"
                >
                    minigames
                </Link>

                <Switch>
                    <Route exact path="/" component={GamesList} />
                    <Route
                        exact
                        path="/reaction-time"
                        component={ReactionTimeGame}
                    />
                    <Route exact path="/type-speed" component={TypeSpeedGame} />
                    <Route
                        exact
                        path="/number-memory"
                        component={NumberMemoryGame}
                    />
                    <Route
                        exact
                        path="/visual-memory"
                        component={VisualMemoryGame}
                    />
                    <Route
                        exact
                        path="/pattern-memory"
                        component={PatternMemoryGame}
                    />
                    <Redirect to="/" />
                </Switch>
            </div>
        </Router>
    );
};
