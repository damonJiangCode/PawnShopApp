# Migration Data

This folder is intentionally untracked by git.

Keep only:

- `source/`: source Access databases, including `superpawnconv.mdb` and `Pictureconv.mdb`
- `scripts/`: repeatable `migrate-*.cjs` scripts
- `reports/`: one `*-migration.md` report per migration subject
- `exports/client-photos/`: exported client photos

When a report or script is updated, replace the old file in place instead of creating dated or duplicate copies.

Start with `reports/migration-status.md` to see the current migration state.
