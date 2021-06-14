import { FC, SVGProps } from "react";
import { Link, LinkProps } from "react-router-dom";
import { CalculatorIcon } from "../icons/CalculatorIcon";
import { KeyboardIcon } from "../icons/KeyboardIcon";
import { LightningIcon } from "../icons/LightningIcon";
import { classnames } from "../utils";

type GameLinkProps = LinkProps & {
    text: string;
    icon?: FC<SVGProps<SVGSVGElement>>;
};

const GameLink = ({
    text,
    icon: Icon,
    className,
    children,
    ...props
}: GameLinkProps) => (
    <Link
        className={classnames(
            "flex flex-col items-center p-6 bg-primary-600 rounded-xl shadow-sm text-5xl text-primary-400 transition-all duration-300 transform hover:text-secondary hover:-translate-y-1.5",
            className
        )}
        {...props}
    >
        {Icon && <Icon className="w-24" />}
        <div className="text-center">{text}</div>
    </Link>
);

export const GamesList = () => (
    <div className="flex items-center justify-center w-full h-full">
        <div className="grid grid-cols-2 gap-10">
            <GameLink
                to="/reaction-time"
                text="Reaction Time"
                icon={LightningIcon}
            />
            <GameLink to="/type-speed" text="Type Speed" icon={KeyboardIcon} />
            <GameLink
                to="/number-memory"
                text="Number Memory"
                icon={CalculatorIcon}
            />
            <GameLink to="/visual-memory" text="Visual Memory" />
        </div>
    </div>
);
