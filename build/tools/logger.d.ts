/// <reference types="node" />
export declare function createWriteStream(): {
    stream: import("fs").WriteStream;
    fileName: string;
};
export declare class Logger {
    stream: {
        stream: import("fs").WriteStream;
        fileName: string;
    };
    data: string;
    log(message: string): boolean;
    getData(): string;
    get fileName(): string;
}
//# sourceMappingURL=logger.d.ts.map