# Preliminary uncommitted smoke run

This verdict was collected during recovery work before the runtime commit. The supplied commit field is the baseline parent `05f77a3`, not a claim that those uncommitted runtime changes exist in that parent. The final committed-build verdict lives in `production/recovery/jam/`. This first smoke run passed the official thresholds but missed the stricter internal five-second readiness target; the loader and renderer bundle were improved afterward.
