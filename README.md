# luca-grella.github.io

Portfolio personale di **Luca Grella** — Senior Data Engineer @ lastminute.com, ingegnere informatico (Politecnico di Milano), DJ e produttore musicale.

**Sito live:** https://luca-grella.github.io

## Stack

- **Jekyll** (GitHub Pages nativo) con tema custom
- Layout Liquid + Markdown per i contenuti
- Rouge per la syntax highlighting

## Sezioni

| Pagina | Indirizzo | Descrizione |
|--------|-----------|-------------|
| Pagina principale | `/` | Contacts, Portfolio e Giochi; è anche l'app installabile (`index.html`, `manifest.webmanifest`, `sw.js`, `icons/`) |
| Home del portfolio | `/portfolio/` | Benvenuto e link principali |
| My Portfolio | `/portfolio/works/` | Progetti software, accademici e creativi |
| About Me | `/portfolio/about/` | Chi sono |
| Certifications | `/portfolio/certifications/` | Certificazioni professionali |
| Sports | `/portfolio/sports/` | Attività sportive (karate, ecc.) |
| DJ Teck | `/portfolio/djteck/` | Produzione musicale, mix, Spotify/SoundCloud |
| Contacts | `/contacts/` | Link social e contatti |
| Giochi | `/games/` | I giochi, installabile come app |

I vecchi indirizzi del portfolio (`/aboutme/`, `/myportfolio/`, `/sports/` ecc.) rimandano ai nuovi con `jekyll-redirect-from`.

## Sviluppo locale

```bash
gem install bundler jekyll
bundle install
bundle exec jekyll serve
# → http://localhost:4000
```

## Deploy

Automatico via GitHub Pages a ogni push su `master`. Nessuna CI esplicita necessaria.
