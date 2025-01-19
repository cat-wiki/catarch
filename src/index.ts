import { cli } from "./cli";

export const main = async (...argv: any[]) => {
    await cli(...argv)
}