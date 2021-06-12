export type SpinnerIconProps = React.SVGProps<SVGSVGElement>;

export const SpinnerIcon = (props: SpinnerIconProps) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            {...props}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M12 22C6.5 22 2 17.5 2 12S6.5 2 12 2s10 4.5 10 10"
            />
        </svg>
    );
};
