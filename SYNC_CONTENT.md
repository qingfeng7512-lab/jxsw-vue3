# Content Sync Usage

## Default sync

Run in frontend-vue3 directory:

```bash
npm run sync:content
```

This uses:
- Input SQL: ../uldjqoekj4vi_db (1).sql
- Output JSON: public/data/content.json
- Source tag: sql-sync

## Custom sync

Run script with custom arguments:

```bash
node scripts/sync-content-from-sql.mjs <sqlPath> <jsonPath> <sourceTag>
```

Example:

```bash
node scripts/sync-content-from-sql.mjs "../backup/site.sql" "./public/data/content.json" "prod-backup"
```

## Notes

- The app reads public/data/content.json on startup.
- If loading fails, app falls back to local fallback data.
- Footer shows source tag, generated time, and record counts.
