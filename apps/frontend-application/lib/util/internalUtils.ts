import { Status } from "../types";

export const convertFixTypeScriptErrorStatus = (value: string): Status | undefined => {
    return Object.values(Status).includes(value as Status) ? (value as Status) : undefined;
}
