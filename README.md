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
[![npm](https://img.shields.io/badge/npm-CB3837?logo=npm&logoColor=fff)](https://www.npmjs.com/)

# Migration Visualizer

This tool outputs Entity Relationship diagrams for Knex.js and Kysely migrations in Mermaid format.

## Usage

### Installation

```bash
npm install -g migration-visualizer
```

### CLI

```bash
npx migration-visualizer visualize [options]
```

#### Options

| Option | Description | Required |
|--------|-------------|----------|
| `--orm <orm>` | ORM to use (`knex`, `kysely`) | Yes |
| `--changed <files...>` | List of new and updated migration files | No |
| `--output <format>` | Output format (default: `mermaid`) | No |

#### Kysely-specific Options

| Option | Description | Required |
|--------|-------------|----------|
| `--dialect <dialect>` | Database dialect (`sqlite3`, `mysql2`, `pg`) | Yes |
| `--migrations <path>` | Path to migrations directory | Yes |
| `--host <host>` | Database host | No |
| `--port <port>` | Database port | No |
| `--database <database>` | Database name | No |
| `--user <user>` | Database user | No |
| `--password <password>` | Database password | No |
| `--filename <filename>` | Database filename (SQLite) | No |
| `--useNullAsDefault` | Use null as default (SQLite) | No |

#### Examples

##### Knex.js

`migration-visualizer` detects the Knexfile at the root of your project and uses it for configuration.

```bash
npx migration-visualizer visualize --orm knex --changed 20251227000006_create_likes.ts
```

##### Kysely

Since Kysely does not provide a configuration file, you need to provide the dialect, migrations directory, and other connection details.

**With MySQL**:

```bash
npx migration-visualizer visualize \
  --orm kysely \
  --dialect mysql2 \
  --host localhost \
  --port 3306 \
  --database mydb \
  --user root \
  --password secret \
  --migrations ./migrations \
  --changed 20251227000006_create_likes.ts
```

**With PostgreSQL**:

```bash
npx migration-visualizer visualize \
  --orm kysely \
  --dialect pg \
  --host localhost \
  --port 5432 \
  --database mydb \
  --user postgres \
  --password secret \
  --migrations ./migrations \
  --changed 20251227000006_create_likes.ts
```
**With SQLite**:

```bash
npx migration-visualizer visualize \
  --orm kysely \
  --dialect sqlite3 \
  --filename dev.sqlite3 \
  --migrations ./migrations \
  --changed 20251227000006_create_likes.ts
```

### GitHub Action

TODO

## Features

### Supported ORMs

- Knex.js
- Kysely

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
