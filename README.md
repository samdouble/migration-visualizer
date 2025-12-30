# Migration Visualizer

[![CI](https://github.com/samdouble/migration-visualizer/actions/workflows/checks.yml/badge.svg)](https://github.com/samdouble/migration-visualizer/actions/workflows/checks.yml)
[![npm version](https://img.shields.io/npm/v/migration-visualizer.svg?style=flat)](https://www.npmjs.org/package/migration-visualizer)
[![Downloads](https://img.shields.io/npm/dm/migration-visualizer.svg?style=flat)](https://www.npmjs.org/package/migration-visualizer)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/migration-visualizer)
[![Coverage Status](https://coveralls.io/repos/samdouble/migration-visualizer/badge.svg?branch=master&service=github)](https://coveralls.io/github/samdouble/migration-visualizer?branch=master)

[![Node.js](https://img.shields.io/badge/Node.js-6DA55F?logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)](https://www.typescriptlang.org/)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=fff)](https://www.mysql.com/)
[![Postgres](https://img.shields.io/badge/Postgres-%23316192.svg?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![SQLite](https://img.shields.io/badge/SQLite-%2307405e.svg?logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Jest](https://img.shields.io/badge/Jest-C21325?logo=jest&logoColor=fff)](https://jestjs.io/)

A migration visualizer for Knex.js

## Usage

### Installation

```bash
npm install -g migration-visualizer
```

```bash
npx migration-visualizer visualize --changed path/to/migration1.ts,path/to/migration2.ts
```

### CLI


### GitHub Action


## Features

### Supported ORMs

- Knex.js

### Supported Databases

- MySQL
- PostgreSQL
- SQLite

### Supported Output Formats

- Mermaid

## Development

### Testing

Simply run the following command to run the tests:

```bash
npm run test
```

For now, the PostgreSQL tests are only run in the CI. It would be nice to be able to run them locally as well, but I couldn't find a way to set up simply a PostgreSQL server (`pg-mem` currently does not support migrations and a few other important features needed in this project).
