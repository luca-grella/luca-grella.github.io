# luca-grella.github.io

Portfolio personale di **Luca Grella** — Senior Data Engineer @ lastminute.com, ingegnere informatico (Politecnico di Milano), DJ e produttore musicale.

**Sito live:** https://luca-grella.github.io

## Stack

- **Jekyll** (GitHub Pages nativo) con tema custom
- Layout Liquid + Markdown per i contenuti
- Rouge per la syntax highlighting

## Sezioni

| Pagina | Descrizione |
|--------|-------------|
| Home | Benvenuto e link principali |
| My Portfolio | Progetti software, accademici e creativi |
| Certifications | Certificazioni professionali |
| Contacts | Link social e contatti |
| Sports | Attività sportive (karate, ecc.) |
| DJ Teck | Produzione musicale, mix, Spotify/SoundCloud |

## Sviluppo locale

```bash
gem install bundler jekyll
bundle install
bundle exec jekyll serve
# → http://localhost:4000
```

## Deploy

Automatico via GitHub Pages a ogni push su `master`. Nessuna CI esplicita necessaria.
