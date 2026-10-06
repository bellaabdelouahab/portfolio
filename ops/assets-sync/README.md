# Asset backup (VPS to GitHub)

Uploads from the back office are stored in the Docker volume
`scn4ghxwu7xdj2fpxf8terox-portfolio-uploads` (mounted at `/data/uploads` in the app container).

`sync.sh` runs from cron every 5 minutes on the VPS, copies new files to the `uploads` branch of
bellaabdelouahab/portfolio, and writes `.sync-status.json` in the volume. The back office
(Storage tab) shows that status and can request an immediate run.

Install on the VPS:

```bash
mkdir -p ~/portfolio-sync && cp sync.sh restore.sh ~/portfolio-sync/ && chmod +x ~/portfolio-sync/*.sh
( crontab -l; echo '*/5 * * * * /home/ubuntu/portfolio-sync/sync.sh >> /home/ubuntu/portfolio-sync/sync.log 2>&1' ) | crontab -
```

The sync never deletes from the backup. Restore: `~/portfolio-sync/restore.sh`
(also happens by itself when the volume is empty).
