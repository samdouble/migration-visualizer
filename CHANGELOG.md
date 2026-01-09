# Changelog

## [1.0.0](https://github.com/samdouble/migration-visualizer/compare/v0.4.0...v1.0.0) (2026-01-09)


### ⚠ BREAKING CHANGES

* rename --orm option with --query-builder

### Features

* **mermaid:** show added tables with colors ([061b39b](https://github.com/samdouble/migration-visualizer/commit/061b39b60743252801fc4dd649f8a3376c0a6301))
* rename --orm option with --query-builder ([a2535e6](https://github.com/samdouble/migration-visualizer/commit/a2535e6b22c064791a11ce3958789f4c704ebb15))


### Bug Fixes

* **mermaid:** improve indentation ([62f4e5e](https://github.com/samdouble/migration-visualizer/commit/62f4e5e249e89f6195eaefed312a174c60d9d636))

## [0.4.0](https://github.com/samdouble/migration-visualizer/compare/v0.3.0...v0.4.0) (2026-01-02)


### Features

* **kysely:** added ORM ([8d02fc0](https://github.com/samdouble/migration-visualizer/commit/8d02fc0691997e4f0285cb95e74d03b1ae85dad7))

## [0.3.0](https://github.com/samdouble/migration-visualizer/compare/v0.2.0...v0.3.0) (2025-12-30)


### Features

* **mermaid:** added foreign key mention in column information ([21d984c](https://github.com/samdouble/migration-visualizer/commit/21d984c16d47e5e950973e31c760cec23c5584ff))
* **mermaid:** added support for column description ([70e6826](https://github.com/samdouble/migration-visualizer/commit/70e682601645ff739a1df3689f417096daac6276))
* **mermaid:** added support for foreign keys ([8243681](https://github.com/samdouble/migration-visualizer/commit/8243681b3a8b4be2b82b113623976225d216bedf))
* **mermaid:** added support for unique keys ([d373ac1](https://github.com/samdouble/migration-visualizer/commit/d373ac1c1c7b3aa3dc56ad391cfb63c224350039))
* **mermaid:** introduce colors ([de42814](https://github.com/samdouble/migration-visualizer/commit/de428149433e6d0f3bd6c84427768c1a7459394a))
* **postgresql:** added connector ([580ea74](https://github.com/samdouble/migration-visualizer/commit/580ea74973255060de8a846f08cb53b0a075ee99))
* run migrations in two passes to get before and after states ([6abb4da](https://github.com/samdouble/migration-visualizer/commit/6abb4da5f7f73c3f861fd4bc98abe19d63cfe08f))


### Bug Fixes

* have the CLI return the correct version number ([674d99d](https://github.com/samdouble/migration-visualizer/commit/674d99d577963eaa0e57bee5ddf6f07b0ab09a0e))

## [0.2.0](https://github.com/samdouble/migration-visualizer/compare/v0.1.0...v0.2.0) (2025-12-29)


### Features

* **mermaid:** created ConnectorFactory and feed tables to mermaid visualizer ([3dd5b37](https://github.com/samdouble/migration-visualizer/commit/3dd5b37860b3d2d2fcf21d8a9724d4a9c6b2e978))

## 0.1.0 (2025-12-29)


### Features

* added a very basic CLI to accompany the library ([554d611](https://github.com/samdouble/migration-visualizer/commit/554d61148a2c6a4f2e497af9a0cc2aec61886718))
* added visualize command to link the mermaid visualizer to the CLI ([dd47ef4](https://github.com/samdouble/migration-visualizer/commit/dd47ef4eb6bf1d7d24bfedd39876ae3893778f7a))
* **mermaid:** added very basic Mermaid visualizer ([71f3b09](https://github.com/samdouble/migration-visualizer/commit/71f3b09e4474c97ab1b97a10f5ef41f58479ace6))
* **mysql:** added connector ([bdbd5af](https://github.com/samdouble/migration-visualizer/commit/bdbd5af1fd94e919b37ebba0435015e6abab475d))
* **sqlite:** get tables and columns information ([4d52ee4](https://github.com/samdouble/migration-visualizer/commit/4d52ee412e205b82e6068538408aede17686ade3))


### Miscellaneous Chores

* release 0.1.0 ([25f6fdd](https://github.com/samdouble/migration-visualizer/commit/25f6fddbd97e4e80a305e694a1c9205f73202036))
