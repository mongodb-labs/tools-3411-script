# TOOLS-3411

## Summary

TOOLS-3411 is an issue where `mongodump` does not always respect field order for views or
collection validators. This can result in data inconsistencies when using `mongodump`
and `mongorestore` with views or validators. Please see [TOOLS-3411](https://jira.mongodb.org/browse/TOOLS-3411)
for more information on this issue.

This repository contains a tool to determine if your clusters or dumps are affected by TOOLS-3411.
Running it will provide a list of views and validated collections that must be audited.

## Prerequisites

The following dependencies are required to run the scripts in this repository:

- [mongosh](https://www.mongodb.com/docs/mongodb-shell/install/) for running the tool against an
  active cluster
- [node.js (20.11.0 or later) and npm (10.2.4 or later)](https://nodejs.org/en/download) for running
  the tools against a local dump


## Quick Start

This tool can be run against active MongoDB clusters or against local dumps. After ensuring you have the proper prerequisites installed, follow these instructions to get started.

### Running Against an Active Cluster

#### Downloading

To download the nessessary file, either clone this repository or navigate to the file [here](https://raw.githubusercontent.com/mongodb-labs/tools-3411-scripts-public/main/dist/detect_for_active_cluster.js) in your browser and right click and "Save As..."

Alternatively, Linux or OSX users can run the following command:
```
wget "https://raw.githubusercontent.com/mongodb-labs/tools-3411-scripts-public/main/dist/detect_for_active_cluster.js"
```

#### Running

Run the downloaded file against your cluster via the following command, changing your MongoDB connection string as necessary:
```
mongosh "mongodb://localhost:27017" -f detect_for_active_cluster.js
```

### Running Against a Local Dump

#### Download

To download the nessessary file, either clone this repository or navigate to the file [here](https://raw.githubusercontent.com/mongodb-labs/tools-3411-scripts-public/main/dist/detect_for_local_dump.js) in your browser and right click and "Save As..."

Alternatively, Linux or OSX users can run the following command:
```
wget "https://raw.githubusercontent.com/mongodb-labs/tools-3411-scripts-public/main/dist/detect_for_local_dump.js"
```

#### Running

Run the downloaded file via `node`, setting the proper environment variables depending on your dump type (either `directory` or `archive`) and the path to your dump. 

The tool can also run against gzipped dumps. For `directory` dumps, each metadata file inside the directory must
have a file name that end in `.metadata.json.gz` if the data is gzipped. For `archive` dumps, the archive file
name must end in `.gz` if the data is gzipped.

#### Unix

```
DUMP_TYPE=directory DUMP_PATH=dump node detect_for_local_dump.js

DUMP_TYPE=archive DUMP_PATH=archive.out node detect_for_local_dump.js
```

#### Windows

```
set "DUMP_TYPE=directory" && set "DUMP_PATH=dump" && node detect_for_local_dump.js

set "DUMP_TYPE=archive" && set "DUMP_PATH=archive.out" && node detect_for_local_dump.js
```

## Building

Building the scripts in this repository is only necessary if there have been changes made to the
source files. The built scripts can already be found in the `dist/` directory.

If you have just downloaded this `tools-3411-scripts-public` repository for the first time and would
like to build the scripts, you must first install all node.js dependencies by running:

```
cd <download path>/tools-3411-scripts-public
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