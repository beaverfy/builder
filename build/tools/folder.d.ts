import { Logger } from "./logger";
import { Configuration } from "../types";
export declare function getBuildFromString(str: string): string | null;
export declare function getURLfromString(str: string): string | null;
export declare function moveBuildToFolder(content: string, destFolder: string, log: Logger, forceCopy: boolean): {
    moved: boolean;
    filePath: null;
} | {
    moved: boolean;
    filePath: string;
};
export declare function resolveDestinationFolder(settings: Configuration): string | null | undefined;
//# sourceMappingURL=folder.d.ts.map