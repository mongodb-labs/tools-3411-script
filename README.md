# TOOLS-3411 Detection Script

## Summary

[TOOLS-3411](https://jira.mongodb.org/browse/TOOLS-3411) is an issue where `mongodump` can randomly change the order of collection option keys. View pipelines and schema validators are the only collection options sensitive to field ordering. Depending on the specific contents of the view or validator options, these alterations could change the result set returned by a view or change which documents are accepted by a validator. Not all view pipelines or schema validations are affected by key reordering. Please see [TOOLS-3411](https://jira.mongodb.org/browse/TOOLS-3411)
for more information on this issue.

We cannot detect if a reordering occurred in a backup taken with `mongodump`, we can only detect if a view pipeline or schema validator could be susceptible to reordering.

This repository contains a script that will output a list of views or collections that could potentially be affected by TOOLS-3411. There is a script to check collections on live clusters and a script to check collection definitions in local dumps.

If you find that a view pipeline or schema validator could be susceptible to the issue, you will need to audit it to check whether it is correct. More information on how to audit and fix susceptible view pipelines or schema validators is available in [TOOLS-3411](https://jira.mongodb.org/browse/TOOLS-3411). 

## Prerequisites

The following dependencies are required to run the scripts in this repository:

- [mongosh](https://www.mongodb.com/docs/mongodb-shell/install/) for running the tool against an
  active cluster.
- [node.js (20.11.0 or later) and npm (10.2.4 or later)](https://nodejs.org/en/download) for running
  the tools against a local dump.


## Quick Start

This tool can be run against active MongoDB clusters or against local dumps. After ensuring you have the proper prerequisites installed, follow these instructions to get started.

### Running Against an Active Cluster

#### Downloading

Navigate to the file [here](https://raw.githubusercontent.com/mongodb-labs/tools-3411-script/main/dist/detect_for_active_cluster.js) in your browser and right click and "Save As..."

Alternatively, you can run the following command to download the file with `curl`:
```
curl -f -O "https://raw.githubusercontent.com/mongodb-labs/tools-3411-script/main/dist/detect_for_active_cluster.js"
```

#### Running

Run the downloaded file against your cluster via the following command, changing your MongoDB connection string as necessary:
```
mongosh "mongodb://localhost:27017" -f detect_for_active_cluster.js
```

The script will run [`listDatabases`](https://www.mongodb.com/docs/manual/reference/command/listDatabases/) and [`db.getCollectionInfos()`](https://www.mongodb.com/docs/manual/reference/method/db.getCollectionInfos/) to find all views and all collections with validators. This should have minimal performance impact on live clusters. Users with the [`readAnyDatabase`](https://www.mongodb.com/docs/manual/reference/built-in-roles/#mongodb-authrole-readAnyDatabase) role will have sufficient permissions to run the script. If you need to create a custom user or role, check the documentation on [managing users and roles](https://www.mongodb.com/docs/manual/tutorial/manage-users-and-roles/).

The script will then output view pipelines and validators which it couldn't confirm are safe, if any. These view pipelines and validators could be susceptible to the issue, so you will need to audit them to check whether they are correct.

### Running Against a Local Dump

#### Download

Navigate to the file [here](https://raw.githubusercontent.com/mongodb-labs/tools-3411-script/main/dist/detect_for_local_dump.js) in your browser and right click and "Save As..."

Alternatively, you can run the following command to download the file with `curl`:
```
curl -f -O "https://raw.githubusercontent.com/mongodb-labs/tools-3411-script/main/dist/detect_for_local_dump.js"
```

#### Running

You can run the downloaded file with `node`. Set your dump type (either `directory` or `archive`) using the `DUMP_TYPE` environment variable. Set the path to your dump directory or archive using the `DUMP_PATH` environment variable. 

The tool can also run with dumps created with `mongodump`'s `--gzip` option. For `directory` dumps, each metadata file inside the directory must have a file name that end in `.metadata.json.gz` if the data is gzipped. For `archive` dumps, the archive file name must end in `.gz` if the data is gzipped.

The script will read collection options from the dump provided. The script will then output view pipelines and validators which it couldn't confirm are safe, if any. These view pipelines and validators could be susceptible to the issue, so you will need to audit them to check whether they are correct.

#### Unix

Running with a directory:

```
DUMP_TYPE=directory DUMP_PATH=dump node detect_for_local_dump.js
```

Running with an archive created by `mongodump --archive`:

```
DUMP_TYPE=archive DUMP_PATH=archive.out node detect_for_local_dump.js
```

#### Windows

Running with a directory:

```
set "DUMP_TYPE=directory" && set "DUMP_PATH=dump" && node detect_for_local_dump.js
```

Running with an archive created by `mongodump --archive`:

```
set "DUMP_TYPE=archive" && set "DUMP_PATH=archive.out" && node detect_for_local_dump.js
```

## Output

If your cluster or dump does not contain any view pipelines or validators which could be susceptible to TOOLS-3411, then you will see output similar to this:

```
----- Summary -----
Your cluster or dump is not affected by TOOLS-3411. The 31 collections inspected 
contained no view pipelines or validators that are sensitive to field ordering.
```

If your cluster or dump does contain view pipelines or validators which could be susceptible to TOOLS-3411, then you will see output similar to this:

```
----- Views to audit -----
test_db.view6
[
  {
    "$group": {
      "_id": "$x",
      "z": {
        "$topN": {
          "n": 5,
          "sortBy": {
            "x": 1,
            "y": 1
          },
          "output": "$x"
        }
      }
    }
  },
  {
    "$sort": {
      "x": 1
    }
  }
]
db2.view3
[
  {
    "$unionWith": {
      "coll": "coll2",
      "pipeline": [
        {
          "$sort": {
            "x": 1,
            "y": 1
          }
        }
      ]
    }
  }
]
----- Validators to audit -----
db2.collection10
{
  "x": {
    "x": 1,
    "y": 1,
  }
}
----- Summary -----
Your cluster or dump may be affected by TOOLS-3411. 3 collections (2 views and 1 validator) 
of the 31 collections inspected could not be automatically analyzed for field order sensitivity. 
Collections that may be affected are listed above. Please manually audit these collections in 
accordance with the guidelines here: https://jira.mongodb.org/browse/TOOLS-3411
```

The tool first lists view pipelines that should be audited. It will show the view name and the pipeline definition. The tool then lists collections with schema validation that should be audited. It will show the collection name and the validator.

If you just want a list of namespaces which should be audited without outputting the view pipelines or schema validators, set the environment variable `VERBOSITY=collectionNameOnly` when running the command.

## Options

This tool accepts options in the form of environment variables. They can be provided to either
`mongosh` or `node` by prefixing the commands like this:

#### Unix

```
VAR1=foo VAR2=bar mongosh "mongodb://localhost:27017" -f detect_for_active_cluster.js
```

or

```
VAR1=foo VAR2=bar node detect_for_local_dump.js
```

#### Windows

```
set "VAR1=foo" && set "VAR2=bar" && mongosh "mongodb://localhost:27017" -f detect_for_active_cluster.js
```

or

```
set "VAR1=foo" && set "VAR2=bar" && node detect_for_local_dump.js
```

The following list of options can be provided to both `mongosh` for active clusters and `node` for
local dumps:

| Environment Variable | Possible Values              | Description                                                                                                                                                                                                                                                                |
| -------------------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `VERBOSITY`          | `full`, `collectionNameOnly` | Whether to output full JSON descriptions and a summary of potential issues, or only the names of collections with potential issues (default: `full`). To fully suppress all output with `collectionNameOnly` for active clusters, run `mongosh` with the `--quiet` option. |

The following list of options can only be provided to `node` for local dumps:

| Environment Variable | Possible Values        | Description                                                                          |
| -------------------- | ---------------------- | ------------------------------------------------------------------------------------ |
| `DUMP_TYPE`          | `directory`, `archive` | Whether the dump data is a directory dump or an archive dump (default: `directory`). |
| `DUMP_PATH`          | \<path to dump\>       | The file path to the desired `directory` or `archive`.                               |


## Building

Clone the repo with the following command:

```
git clone https://github.com/mongodb-labs/tools-3411-script.git
```

Building the scripts in this repository is only necessary if there have been changes made to the
source files. The built scripts can already be found in the `dist/` directory.

If you have just cloned the `tools-3411-script` repository for the first time and would
like to build the scripts, you must first install all node.js dependencies by running:

```
cd tools-3411-script
npm install
```

To build the `detect_for_active_cluster.js` script that runs against **active MongoDB clusters**, run:

```
npm run build-active-cluster
```

To build the `detect_for_local_dump.js` script that runs against **local dumps**, run:

```
npm run build-local-dump
```

## Contributing

Report any bugs, improvements, or new feature requests at https://jira.mongodb.org/browse/TOOLS.

## License

[Apache 2.0](LICENSE)