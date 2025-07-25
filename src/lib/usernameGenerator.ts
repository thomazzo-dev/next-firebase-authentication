import { randomUUID } from "crypto";


export const shortId = () => {
    return `${randomUUID().slice(0, 8)}}`;
};