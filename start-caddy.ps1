# run from an elevated PowerShell
$NSSM  = "C:\ProgramData\chocolatey\lib\NSSM\tools\nssm.exe"
$CADDY = "C:\ProgramData\chocolatey\bin\caddy.exe"
$CFG   = "C:\ProgramData\chocolatey\lib\caddy\Caddyfile"

# kill any stray caddy and remove old service (ignore errors)
taskkill /IM caddy.exe /F 2>$null
sc.exe stop   Caddy  2>$null
sc.exe delete Caddy  2>$null

# install service via NSSM
& $NSSM install Caddy $CADDY run --config "$CFG"

# run under your account so it can read \\TINYTIM\...
& $NSSM set Caddy ObjectName "PLOTTWIST\mad" "x"

# start after SMB client; auto-start and auto-restart
sc.exe config Caddy depend= LanmanWorkstation
& $NSSM set Caddy Start SERVICE_AUTO_START
& $NSSM set Caddy AppExit Default Restart

# start and show status
& $NSSM start Caddy
& $NSSM status Caddy
