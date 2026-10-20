# Proveniência dos ativos

## Referências fornecidas

Logo atual: utilizada como referência para o símbolo vetorial de quatro losangos e o nome Cipola. A versão original não foi alterada. O mockup fornecido guiou a atmosfera, sem ser incorporado como tela do site.

## Fotografias e textura geradas

Ferramenta: Imagegen integrada. Os três resultados foram copiados para o projeto. Não representam obras reais da empresa.

`public/images/cozinha.png`

> Use case: photorealistic-natural. Asset type: wide cinematic hero photograph for Brazilian natural stone fabrication company Cipola. Generate one highly realistic architectural editorial photograph, landscape 3:2. An understated luxurious contemporary Brazilian kitchen, giant honed warm ivory quartzite monolithic waterfall island in the foreground center-right, clearly visible mineral veining in cream, taupe and amber; matching back counter backsplash. Dark walnut full-height cabinetry across left background, textured warm plaster, one dark bronze faucet, restrained branches in dark ceramic vase, two fine walnut stools. Large window at right overlooks tropical garden in soft late afternoon sunlight. Wide camera at countertop level showing the whole island, beautiful precise thick mitred stone edges, natural atmospheric shadows, tactile stone and wood. Left third of frame darker wood and negative space suitable for overlay headline. Warm restrained colors, editorial architectural magazine quality, realistic, tasteful, dramatic but not orange. No people, no text, no logo, no watermarks. Image is illustrative demonstration, not a photo of an actual completed company project.

`public/images/banheiro.png`

> Use case: photorealistic-natural. Asset type: editorial architectural demonstration image for natural stone company website. One landscape photo 3:2 of a quiet premium Brazilian bathroom. Sculptural floating rectangular double vanity made of warm light travertine, precisely cut monolithic stone integral basin, bronze wall mounted faucet, warm beige plaster walls, tall mirror and dark walnut door on left, single tiny branch in ceramic vase, daylight from large side window, warm nuanced shadows, foreground shows tactile honed stone textures and excellent edge fabrication. Architectural magazine photograph, realistic restrained natural materials, no people, no text, no logos.

`public/textures/areia-source.png` e versão JPEG de mesmo conteúdo `areia.jpg`

> Use case: product-mockup. Asset type: physically based rendering color texture for a 3D stone slab; single square 1:1 image. Straight-on orthographic extreme-close photograph of a flat warm ivory Brazilian quartzite surface, elegant delicate flowing long diagonal taupe and golden-brown veins, subtle translucent crystalline mineral layers, soft cream and beige background, naturally irregular fine detail. Entire frame is the seamless stone surface, completely flat evenly lit diffuse illumination, no shadows, no perspective, no borders, no objects, no text. Realistic photographic high-resolution texture, restrained and luxurious. This is a demonstrative texture and not any named commercial product.

## Materiais da seleção Cipola

Os 11 nomes foram fornecidos pelo cliente. As imagens públicas foram utilizadas por solicitação expressa dele. Originais e páginas de referência registrados em `public/textures/sources.json`. Fontes: Kenny Granitos Prime, Shazam Mármores e Sabagram. As imagens são referências de padrão, não fotografias do estoque da Cipola.

Em 2026-10-19 entraram mais 5 pedras, com os nomes vindos das fotos de obras do cliente: Quartzo Calacata, Quartzo Calacata Gold e Café Imperial (Shazam Mármores), Travertino Romano (Kenny Granitos Prime) e Nanoglass (Sardep Marmoraria). O Travertino anterior passou a se chamar Travertino Nacional. As simulações em ambientes dessas 5 pedras seguem o mesmo fluxo (Gemini app, edição dos masters, importadas pelo script); em 2026-10-20 as 9 que faltavam (Café Imperial na área gourmet, Travertino Romano e Nanoglass nos 4 ambientes) foram geradas no Gemini 3.1 Pro com o mesmo fluxo. Para o Nanoglass, a frase sobre grãos do prompt padrão foi trocada por uma nota de superfície branca uniforme, e todos os prompts pediram explicitamente 2528 × 1696 px, porque o modelo devolveu 16:9 na primeira tentativa. A referência do Nanoglass usada na geração é um recorte da foto da Nero Mármores (`scripts/higgsfield/references/nanoglass-crop.jpg`), porque a amostra do catálogo tem só 300 px de altura. A Pedra Ametista, usada na obra do bar, não está no catálogo porque não foi encontrada uma referência pública da chapa.

## Fotos da família (página Sobre)

Fotografias reais enviadas pelo cliente em 2026-10-19, copiadas sem edição para `public/images/sobre/`: `familia-cipola.jpg` (abertura da página), `joaquim-cipola.jpg` (retrato do fundador) e `joaquim-e-rafael.jpg` (Joaquim e Rafael juntos). Cada moldura usa a proporção nativa da foto. Em 2026-10-20 entraram três fotos reais do galpão, também sem edição: `ponte-de-corte.jpg` (maquinário), `corte-de-bancada.jpg` (produção) e `recorte-de-cuba.jpg`, que ocupa o lugar da antiga moldura de acabamento. Ainda faltam a foto antiga de origem e a da obra de alto padrão.

## Presets de ambientes

Os 44 renders geométricos anteriores continuam arquivados em `test-results/archived-presets/`, fora da pasta pública. As aplicações em ambientes são simulações fotorrealistas estáticas registradas em `src/content/material-images.json` (modelo, referência real da pedra, master da composição). Publicadas: 64 imagens em `public/images/materiais/<slug>/<ambiente>.webp` (16 materiais × cozinha, banheiro, lavabo e área gourmet). Todas foram geradas no Gemini (app web) como edição do master de cada ambiente, com a textura real da pedra (`public/textures/`) como referência. Para a Santa Cecília foi usado um recorte sem as setas de carrossel da foto original (`scripts/higgsfield/references/santa-cecilia-crop.jpg`). São simulações ilustrativas, identificadas no site. Limitações: as referências têm entre 400 e 966 px, a do Quartzo Branco é quase toda branca e a do Ônix Cristal é de um ônix translúcido sem confirmação da variedade. Prompts em `scripts/higgsfield/presets.mjs`; originais em `data/image-generation/` (fora do Git).

## Fonte

Manrope, distribuída pelo pacote `@fontsource-variable/manrope` sob SIL Open Font License 1.1. A licença acompanha o pacote em `node_modules/@fontsource-variable/manrope/LICENSE`.
