# Cipola

Next.js App Router, React/TypeScript strict, CSS Modules, Motion, Three.js, React Three Fiber e Drei. Fonte Manrope (SIL Open Font License), hospedada localmente via `@fontsource-variable/manrope`.

```sh
npm install
npm run dev
npm run lint
npm run typecheck
npm run test
npm run build
```

## Conteúdo e publicação

- `src/lib/site.ts`: dados empresariais ainda não fornecidos. Não há histórico, equipe, endereço ou estatísticas inventados.
- `src/lib/data.ts`: os 11 materiais fornecidos pelo cliente, as obras do portfólio e pontos de entrada para CMS. As obras vêm das fotos enviadas pelo cliente (convertidas para `public/images/projetos/<slug>.webp`); o nome da pedra segue o nome original de cada arquivo. Confirmar fornecedor/variedade de Mármore Branco, Branco Stelar e Ônix Cristal.
- `public/textures/sources.json`: fontes públicas das amostras, baixadas com autorização do cliente. Validar autorização de reutilização comercial ou substituir por imagens próprias/licenciadas antes da publicação. Ônix usa referência de ônix translúcido, sem afirmar correspondência exata à variedade Cristal.
- `public/images`: ambientes ilustrativos gerados por IA, identificados no site. `public/images/projetos` guarda as fotos reais das obras.
- Mapas PBR opcionais `normal` e `roughness` podem ser informados no material. Texturas com escala de referência de 1,8 m; ajustar UV/escala às fotografias reais. Dimensões da chapa são ilustrativas, não especificação comercial.
- `/materiais`: galeria editorial com busca e filtros; `/materiais/[slug]`: pedra com carregamento automático, controles por gesto e teclado, informação comercial e orçamento.
- A galeria só recebe imagens concluídas pelo Higgsfield. As rotas e componentes de ambientes em WebGL foram removidos. `/visualizador` redireciona para `/materiais`.
- As amostras públicas têm resolução variável; mapas físicos medidos de normal/roughness ainda não foram fornecidos. Apenas a pedra usa WebGL, com material físico, carregamento automático e fallback estático.

Copie `.env.example` para `.env.local` se precisar sobrescrever algum dado. Importe o repositório na Vercel com preset Next.js e Node 22+. Configure as mesmas variáveis no painel e execute um envio real antes de ativar o formulário.

## SEO

- Domínio canônico: `https://www.cipolamarmoraria.com.br` (`site.url`, sobrescrito por `NEXT_PUBLIC_SITE_URL`). Só a produção é indexada: deploys de preview da Vercel e `NEXT_PUBLIC_NOINDEX=1` geram `noindex`, `robots.txt` com `Disallow: /` e sitemap vazio.
- `src/lib/site.ts`: nome, endereço, telefones, área atendida, horário (`openingHours`), Instagram e `sameAs`. Manter igual ao Perfil da Empresa no Google.
- `src/lib/seo.ts`: metadados por página (`pageMetadata`) e JSON-LD com `@id` fixos (empresa, site, páginas, trilhas, serviços).
- `/robots.txt`, `/sitemap.xml` e `/llms.txt` são gerados a partir de `data.ts`, então pedras e obras novas entram sozinhas.
- Verificação do Search Console e do Bing: `GOOGLE_SITE_VERIFICATION` e `BING_SITE_VERIFICATION` no painel da Vercel, seguidas de novo deploy. GA4 usa `NEXT_PUBLIC_GA_ID` e só carrega após o consentimento de cookies.

O formulário valida no cliente e servidor. Sem `QUOTE_WEBHOOK_URL`, apenas salva um briefing local, sem envio. Com um webhook HTTPS configurado, faz POST JSON autenticado opcionalmente por `QUOTE_WEBHOOK_TOKEN`; exibe confirmação somente após resposta 2xx. Configure no receptor retenção, controle de abuso e entrega ao atendimento. Nenhum formulário é salvo em banco pelo site. Complete a página de privacidade com identificação empresarial, canal responsável e retenção antes de habilitar o envio público.

## Imagens geradas

### Higgsfield — aplicações por material

Geração feita somente em desenvolvimento, por `scripts/generate-material-images.mjs`. O site nunca chama a Higgsfield: as imagens aprovadas viram arquivos estáticos em `public/images/materiais/<slug>/<ambiente>.webp`, listados em `src/content/material-images.json` e exibidos por `next/image` em `/materiais/[slug]`. Ambientes sem imagem aprovada não aparecem na galeria.

- Modelo: Marketing Studio Image 2.5 Flare (`POST /marketing-studio/image/flare`), 2k, 3:2, quality high. Status por `/requests/{id}/status`; referências locais enviadas por `/files/generate-upload-url`.
- Chave em `HF_CREDENTIALS` (`<id>:<secret>`) no `.env.local`, ignorado pelo Git; nunca é exibida nem gravada em disco.
- Consistência: cada ambiente tem um *master* com pedra cinza neutra (prompts em `scripts/higgsfield/presets.mjs`). Cada material é uma edição desse master junto com a fotografia real da pedra.
- Fidelidade: `scripts/higgsfield/references.json` bloqueia materiais sem referência aprovada (`approved`) e sem descrição.
- Cada comando pago envia uma única geração e exige `--yes`. A `Idempotency-Key` é salva antes do envio, então um timeout é reenviado sem nova cobrança. Estado, originais e revisões ficam em `data/image-generation/` (ignorado pelo Git).

```sh
node scripts/generate-material-images.mjs check                       # autenticação e referências (gratuito)
node scripts/generate-material-images.mjs master cozinha --yes        # pago
node scripts/generate-material-images.mjs approve master cozinha
node scripts/generate-material-images.mjs generate preto-sao-gabriel cozinha --yes   # pago
node scripts/generate-material-images.mjs approve preto-sao-gabriel cozinha          # publica
node scripts/generate-material-images.mjs poll|reject <slug|master> <ambiente>
```

Estado atual: 44 imagens publicadas (11 materiais × 4 ambientes), todas geradas no Gemini (app web), porque a conta Higgsfield está sem créditos. Os prompts são os mesmos: `prompt <slug|master> <ambiente>` imprime o texto, e a imagem baixada entra pelo mesmo fluxo de revisão com `import <slug|master> <ambiente> <arquivo> --source "Gemini ..."` antes de ser publicada com `approve`. Para um material, anexe no Gemini o master original (`data/image-generation/originals/`) como imagem 1 e a textura real como imagem 2. O registro guarda o modelo, a referência e o master de cada imagem. Resultados com zoom, reflexo de pessoas/câmera ou pedra fora das superfícies previstas foram rejeitados e refeitos. Para materiais com veios (mármore, ônix), use `pattern: "veined"` em `references.json`; para o travertino, `pattern: "mottled"`.

### Imagens editoriais anteriores

Ferramenta integrada Imagegen. Prompts: cozinha editorial brasileira com ilha monolítica de quartzito claro, madeira escura e luz natural; banheiro com bancada de travertino, marcenaria e luz lateral; textura ortogonal de quartzito marfim com veios dourados. Destinos: `public/images/cozinha.png`, `public/images/banheiro.png`, `public/textures/areia-source.png`. Os prompts completos estão em `ASSETS.md`.
