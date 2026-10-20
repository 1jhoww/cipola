$ErrorActionPreference = 'Stop'
$catalogUrl = 'https://kennygranitosprime.com.br/materiais/'
$catalogHtml = (Invoke-WebRequest -Uri $catalogUrl -UseBasicParsing).Content
$mapping = @{
 'branco-itaunas' = 'granito-branco-itaunas'; 'branco-dallas' = 'granito-branco-dallas';
 'santa-cecilia' = 'granito-amarelo-santa-cecilia'; 'verde-ubatuba' = 'granito-verde-ubatuba';
 'preto-sao-gabriel' = 'granito-preto-sao-gabriel'; 'preto-absoluto' = 'granito-preto-absoluto';
 'marmore-branco' = 'marmore-branco-nacional-extra'; 'travertino' = 'marmore-travertino'
}
$sources = @()
foreach ($slug in $mapping.Keys) {
 $alt = [regex]::Escape($mapping[$slug])
 $tag = [regex]::Match($catalogHtml, '<img[^>]+alt="' + $alt + '"[^>]*>').Value
 $url = [regex]::Match($tag, 'src="([^"]+)"').Groups[1].Value
 if (!$url) { throw "Missing image: $slug" }
 Invoke-WebRequest -Uri $url -OutFile "public/textures/$slug.jpg"
 $sources += @{ slug=$slug; page=$catalogUrl; image=$url; note='Referência pública; variação de lote e chapa. Confirmar autorização de uso para publicação comercial.' }
}
$additional = @{
 'quartzo-branco'='https://shazammarmores.com.br/wp-content/uploads/2024/02/WhatsApp-Image-2024-02-01-at-19.10.19.jpeg';
 'branco-stelar'='https://shazammarmores.com.br/wp-content/uploads/2024/02/WhatsApp-Image-2024-02-01-at-18.58.05.jpeg';
 'onix-cristal'='https://shazammarmores.com.br/wp-content/uploads/2024/02/WhatsApp-Image-2024-02-01-at-19.20.54.jpeg'
}
foreach ($slug in $additional.Keys) {
 Invoke-WebRequest -Uri $additional[$slug] -OutFile "public/textures/$slug.jpg"
 $sources += @{ slug=$slug; page='https://shazammarmores.com.br/index.php/catalogo/'; image=$additional[$slug]; note=$(if($slug -eq 'onix-cristal'){'Referência de ônix translúcido. Confirmar variedade Ônix Cristal e autorização de uso.'}else{'Referência pública. Confirmar autorização de uso para publicação comercial.'}) }
}
$sources | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath 'public/textures/sources.json' -Encoding utf8
Write-Output "Downloaded $($sources.Count) material references."
