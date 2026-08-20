param (
    [Parameter(Mandatory=$true)]
    [string]$GithubUser,

    [Parameter(Mandatory=$true)]
    [string]$Token,

    [Parameter(Mandatory=$true)]
    [string]$Branch,

    [Parameter(Mandatory=$true)]
    [string]$Title,

    [Parameter(Mandatory=$false)]
    [string]$Body = "Pull Request submitted via RescueAI Contributor Helper CLI",

    [Parameter(Mandatory=$false)]
    [string]$TargetRepo = "theadhi/rescue-ai"
)

Write-Host "🚀 Preparing Pull Request for $GithubUser -> $TargetRepo ..." -ForegroundColor Cyan

# Ensure git remote is set
$forkUrl = "https://$Token@github.com/$GithubUser/rescue-ai.git"

Write-Host "Pushing branch $Branch to $GithubUser/rescue-ai ..." -ForegroundColor Yellow
git push $forkUrl $Branch --force

Write-Host "Creating Pull Request on $TargetRepo ..." -ForegroundColor Yellow

$headers = @{
    "Authorization" = "Bearer $Token"
    "Accept"        = "application/vnd.github+json"
    "User-Agent"    = "RescueAI-Contributor-Script"
}

$prBody = @{
    title = $Title
    body  = $Body
    head  = "$GithubUser`:$Branch"
    base  = "main"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "https://api.github.com/repos/$TargetRepo/pulls" -Method Post -Headers $headers -Body $prBody
    Write-Host "✅ Pull Request Created Successfully!" -ForegroundColor Green
    Write-Host "🔗 PR Link: $($response.html_url)" -ForegroundColor Green
} catch {
    Write-Host "❌ Error creating PR:" -ForegroundColor Red
    $_ | Select-Object *
}
