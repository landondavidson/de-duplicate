# de-duplicate

de-duplicate is an implementation of a code challenge to find and remove duplicates in a set

## Getting Started

To install:
$ yarn build
$ node dist/src/index.js

## Command line options

```
$ node dist/src/index.js --help
Usage: de-duplicate [options]

Options:
  -V, --version                   output the version number
  -d, --debug                     output extra debugging
  -i, --in <inputFile>            JSON input file to de-duplicate
  -o, --out <outputFile>          path and name of the result JSON
  -a, --array-key <key>           the name of the property containing the array
  -k, --detection-keys <keys...>  specify properties in the array objects to use to detect duplicates.  The order of the keys is significant as the keys will be evaluated in order passed in
  -r, --resolution-key <key>      specify the property that will be used to resolve duplicate conflicts
  -t, --take-last                 option that allows for when a duplicate is detected and there is no resolution to resolve the duplicate by taking the last element in the array other wise the
                                  first element will be used
  -e, --encoding <type>           the encoding used for input file (default: "utf-8")
  -s, --silent                    disable user interface for automated systems
  -h, --help                      display help for command
```

## User Interface

The user interface will walk you through the setup pulling data in to give intelligent options

```
$ node dist/src/index.js
? Select a file to eliminate duplicate records
    → dist/
    → node_modules/
      package.json
    ↓ src/
      ↓ __tests__/
        ▶ leads.json
          results.json
          test-data-array.json
          test-data-object.json
        templates/
(Move up and down to reveal more choices)

? Select a file to eliminate duplicate records ~/de-duplicate/src/__tests__/leads.json
? Select the array property to de-duplicate (Use arrow keys)
❯ leads

? Select the array property to de-duplicate leads
? Select the 1st property to use to determine a duplicate record (order does matter in resolving conficts) (Use arrow ke
ys)
❯ _id
  email
  firstName
  lastName
  address
  entryDate

? Select the 1st property to use to determine a duplicate record (order does matter in resolving conficts) _id
? Select the 2nd property to use to determine a duplicate record (order does matter in resolving conficts) (Use arrow ke
ys)
  Done selecting properties
❯ email
  firstName
  lastName
  address
  entryDate

? Select the 2nd property to use to determine a duplicate record (order does matter in resolving conficts) email
? Select the 3rd property to use to determine a duplicate record (order does matter in resolving conficts) (Use arrow ke
ys)
❯ Done selecting properties
  firstName
  lastName
  address
  entryDate
```

## Report

Along with the result json that is created with the removed duplicates. A report of the work done is also available

```
? Would you like to see the report Yes
```

![Report](https://github.com/landondavidson/de-duplicate/blob/main/report.png?raw=true)

## To Do

-   Implement debug mode with winston
-   Deploy package to npm
