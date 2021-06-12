import { Link, LinkProps } from "react-router-dom";
import { classnames } from "../utils";

type GameLinkProps = LinkProps;

const GameLink = ({ className, children, ...props }: GameLinkProps) => (
    <Link
        className={classnames(
            "p-6 bg-primary-600 rounded-xl shadow-sm text-5xl text-primary-400 transition-all duration-300 transform hover:text-secondary hover:-translate-y-1.5",
            className
        )}
        {...props}
    >
        {children}
    </Link>
);

export const GamesList = () => {
    return (
        <div className="flex items-center justify-center w-full h-full">
            <GameLink to="/type-speed">Type Speed</GameLink>
        </div>
    );
};
