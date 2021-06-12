export const classnames = (
    ...values: (string | boolean | null | undefined)[]
): string => {
    return values
        .filter((value) => typeof value === "string" && value.length > 0)
        .join(" ");
};

export const buildRequestSearchString = (
    values: Record<string, string | number>
): string => {
    const params = new URLSearchParams(values as Record<string, string>);
    return params.toString();
};

export const countWords = (text: string): number => {
    return text.split(" ").filter((word) => word).length;
};