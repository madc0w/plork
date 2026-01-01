$domain="plork"
$token="4ab6199a-89fc-49ae-bba8-f2507318483e"
Invoke-WebRequest "https://www.duckdns.org/update?domains=$domain&token=$token&ip=" | Out-Null
