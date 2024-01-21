export type Platforms = "android" | "ios" | "all";
export type BuildType = "local" | "cloud";
export interface BuildConfiguration {
    platform: Platforms;
    type: BuildType;
    profile: string;
}
export interface Configuration {
    checks?: {
        typecheck?: boolean;
        typecheckCommand?: string;
        continueOnFailure?: boolean;
        ignoreGitIgnore?: boolean;
    };
    builds?: {
        forceCopy?: boolean;
        baseFolder?: string;
        folder?: string | {
            env?: string;
        };
    };
    default?: BuildConfiguration;
    eas?: {
        file?: string;
    };
}
//# sourceMappingURL=types.d.ts.map