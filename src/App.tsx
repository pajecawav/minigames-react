import { Redirect, Route, Switch } from "react-router";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { GamesList } from "./components/GamesList";
import { NumberMemoryGame } from "./games/NumberMemoryGame.tsx";
import { TypeSpeedGame } from "./games/TypeSpeedGame";

export const App = () => {
    return (
        <Router>
            <div className="relative flex w-full h-full max-w-4xl px-4 mx-auto text-primary-500">
                <Switch>
                    <Route exact path="/" component={GamesList} />
                    <Route exact path="/type-speed" component={TypeSpeedGame} />
                    <Route
                        exact
                        path="/number-memory"
                        component={NumberMemoryGame}
                    />
                    <Redirect to="/" />
                </Switch>

                <Link
                    className="absolute font-mono text-5xl transition-colors duration-500 top-4 text-secondary"
                    to="/"
                >
                    minigames
                </Link>
            </div>
        </Router>
    );
};
