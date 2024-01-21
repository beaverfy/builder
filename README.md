# Builder

> 🏗️ Builder for building local &amp; cloud expo apps

Builder beaver is a project manager, it manages your builds but doesn't actually build your app, it uses EAS cloud and EAS local, it has a fancy little UI which makes building your app a little more fun.

But builder beaver can do more than just a fancy UI:

- 🔗 Move build files to a directory (even from WSL to windows)
- ✨ Default options for quick builds
- ⏳ Save time with typechecks

> ⚠️ Builder can only build apps using EAS (cloud or local)

## Getting started

This will install `@beaverfy/builder` using your project's package manager:

```sh
npx expo install @beaverfy/builder
```

## Configuring Builder

Builder beaver can be configured by providing a `builder.yml` file

```yml
builds: # completed builds folder
  forceCopy: true # copy instead of move the file (useful for moving wsl files to windows)
  baseFolder: "" # full base folder (defaults to `process.cwd()`)
  folder: # string or env (defaults to `builder/builds`)
    env: BUILD_FOLDER # any env variable
default: # default build options for quick access
  platform: android # can be `android`, `ios`, or `all`
  type: local # can be `local` (in the terminal) or `cloud` (on eas)
  profile: development # eas.json build profile
checks: # run checks on your project before building to save time
  typecheck: true # if we should run typechecks on your project (defaults to false)
  typecheckCommand: npx tsc --noEmit # custom typecheck command (defaults to `npx tsc --noEmit`)
  continueOnFailure: true # continue to build if typecheck fails (defaults to false)
  ignoreGitIgnore: false # ignore fixing the gitignore (add builder files to .gitignore)
eas: # eas config
  file: eas.json # defaults to eas.json
```
