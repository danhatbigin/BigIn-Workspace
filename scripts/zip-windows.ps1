$releaseRoot=[System.IO.Path]::GetFullPath($env:BIGIN_PACKAGE_ROOT)
$sourcePath=[System.IO.Path]::GetFullPath($env:BIGIN_PACKAGE_SOURCE)
$destination=[System.IO.Path]::GetFullPath($env:BIGIN_PACKAGE_ZIP)
if ([System.IO.Path]::GetDirectoryName($sourcePath) -ne $releaseRoot -or $destination -ne ($sourcePath+'.zip')) { throw 'Invalid release archive paths.' }
if (Test-Path -LiteralPath $destination -PathType Leaf) { Remove-Item -LiteralPath $destination }
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($sourcePath,$destination,[System.IO.Compression.CompressionLevel]::Optimal,$true)
