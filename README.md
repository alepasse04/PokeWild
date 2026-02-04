# PokeWild - Pokédex Web Application

> Un'applicazione web interattiva che ricrea l'esperienza del Pokédex classico dei giochi Pokémon, con un design ispirato a Pokémon Emerald.

**Versione:** 0.1.0  
**Stack:** React + TypeScript + Vite  
**Autore:** Alessandro Passerini  
**Data:** Febbraio 2026

---

## Descrizione del Progetto

PokeWild è una Single Page Application (SPA) che simula un Pokédex digitale. L'interfaccia grafica è stata progettata per ricordare il look retrò dei giochi Pokémon della serie Game Boy Advance, con animazioni di apertura, musica di sottofondo e navigazione tramite D-pad virtuale o tastiera.

L'applicazione recupera i dati dei Pokémon dalla [PokéAPI](https://pokeapi.co/), un'API RESTful gratuita che fornisce informazioni su tutti i 721 Pokémon delle prime 6 generazioni.

---

## ✅ Checklist Requisiti Progetto

### Requisiti Minimi
| Requisito | Stato | Implementazione |
|-----------|-------|-----------------|
| Struttura base (`components/`, `pages/`) | ✅ | `src/components/`, `src/Pages/`, `src/Pages/SubWiews/` |
| Routing con almeno 2 pagine | ✅ | `/pokedex` (lista/dettagli) e `/*` (404) |
| TypeScript base (interfacce, props tipizzate) | ✅ | `src/types/pokemons.ts` con interfacce Pokemon, Ability, etc. |
| Chiamata API GET con React Query | ✅ | `useQuery` in `PokedexDetails.tsx` e `PageNotFound.tsx` |
| Visualizzazione dati ottenuti | ✅ | Lista Pokemon, dettagli, descrizioni |

### Requisiti Avanzati

#### Struttura del Progetto
| Requisito | Stato | Implementazione |
|-----------|-------|-----------------|
| Componenti riutilizzabili | ✅ | `ImgPokemon.tsx`, `PokemonName.tsx` in `components/PokeItems/` |
| Tipi di dato separati per argomento | ✅ | `src/types/pokemons.ts` (Pokemon, Ability, PokemonType, etc.) |

#### Chiamate API Avanzate
| Requisito | Stato | Implementazione |
|-----------|-------|-----------------|
| Chiamata con async/await | ✅ | `fetchPokemons()` in `pokeApi.ts` |
| Chiamata con React Query | ✅ | `useQuery` per descrizioni e messaggi 404 |
| Almeno 2 chiamate API diverse | ✅ | PokéAPI + No as a Service |
| Chiamata POST | ✅ | `saveFavoritePokemon()` con `useMutation` |
| Gestione errori per ogni chiamata | ✅ | try/catch + onError handlers |

#### Routing Avanzato
| Requisito | Stato | Implementazione |
|-----------|-------|-----------------|
| Pagine con parametri dinamici | ✅ | `/pokedex/*` con viste dinamiche |
| Navigazione con passaggio dati non da URL | ✅ | Props `current`, `setCurrent`, `pokemons` tra componenti |
| Pagina 404 | ✅ | `PageNotFound.tsx` con messaggio API divertente |

#### TypeScript Avanzato
| Requisito | Stato | Implementazione |
|-----------|-------|-----------------|
| Interfacce multiple | ✅ | Pokemon, Ability, PokemonType, PokemonProps, etc. |
| Alias dei tipi | ✅ | `PokemonId`, `PokemonName`, `ApiUrl`, `SpriteUrl` |
| Union Types | ✅ | `PokemonTypeName`, `LoadingState`, `PokedexView` |
| Intersection Types | ✅ | `PokemonSelectionProps = PokemonProps & {...}` |
| Generics | ✅ | `ApiResponse<T>`, `AsyncState<T>`, `ApiListResponse<T>` |

#### Qualità del Codice
| Requisito | Stato | Implementazione |
|-----------|-------|-----------------|
| Leggibilità e pulizia | ✅ | Codice ben organizzato e formattato |
| Naming convention | ✅ | PascalCase componenti, camelCase funzioni |
| Documentazione del codice | ✅ | JSDoc comments in tutti i file principali |

#### UI/UX
| Requisito | Stato | Implementazione |
|-----------|-------|-----------------|
| Progettazione dell'app | ✅ | Design ispirato a Pokemon Emerald |
| Componenti grafici | ✅ | Pokédex shell, bottoni, D-pad, schermi |
| Routing | ✅ | React Router con navigazione fluida |
| Chiamate API | ✅ | Caricamento ottimizzato con feedback visivo |
| Flusso dei dati | ✅ | Props drilling + state lifting |

### Task Extra
| Requisito | Stato | Implementazione |
|-----------|-------|-----------------|
| Ottimizzazione chiamate API | ✅ | Batch loading, rate limiting, caching React Query |
| Gestione cache | ✅ | React Query con `queryKey` per caching automatico |

---

## ✨ Funzionalità Principali

- **Lista Pokémon** - Visualizza una lista scorrevole di tutti i 721 Pokémon
- **Dettagli Pokémon** - Mostra informazioni dettagliate: tipo, abilità e descrizione
- **Sistema di Battaglia** - Combattimento a turni 1v1 contro un Pokémon selvatico
- **Salva Preferiti** - Possibilità di salvare Pokemon come preferiti (chiamata POST)
- **Navigazione intuitiva** - Usa il D-pad a schermo o le frecce direzionali della tastiera
- **Selezione rapida** - Digita l'ID del Pokémon (es. 025 per Pikachu) per saltare direttamente
- **Musica di sottofondo** - Toggle per riprodurre/stoppare la colonna sonora Pokémon
- **Animazione di avvio** - Animazione iniziale in stile retrò all'apertura del Pokédex
- **Pagina 404 divertente** - Pagina di errore con messaggi casuali dall'API "No as a Service"
- **Design responsive (circa)** - Supporto per desktop, tablet e mobile (portrait e landscape)

---

## Struttura del Progetto

```
src/
├── API/                          # Logica per le chiamate API
│   ├── naas.ts                   # GET: API "No as a Service" per messaggi 404
│   └── pokeApi.ts                # GET + POST: API PokéAPI + salvataggio preferiti
│
├── assets/                       # Risorse statiche (immagini, font, audio)
│   ├── fonts/                    # Font pixel-style
│   ├── icons/                    # Icone dell'interfaccia
│   ├── souds/                    # File audio (PokemonSong.mp3)
│   ├── sprites/                  # Sprite dei Pokémon
│   └── Graphics/                 # Sfondi e elementi UI
│
├── components/                   # Componenti riutilizzabili
│   └── PokeItems/                # Componenti per visualizzare i Pokémon
│       ├── ImgPokemon.tsx        # Mostra lo sprite del Pokémon
│       └── PokemonName.tsx       # Mostra ID e nome del Pokémon
│
├── Pages/                        # Pagine principali dell'app
│   ├── PageNotFound/             # Pagina 404
│   │   ├── PageNotFound.tsx      # Componente con chiamata GET a NAAS
│   │   └── PageNotFound.css
│   │
│   ├── Pokedex/                  # Pagina principale del Pokédex
│   │   ├── Pokedex.tsx           # Componente contenitore principale
│   │   └── pokedex.css           # Stili del Pokédex
│   │
│   └── SubWiews/                 # Sotto-viste del Pokédex
│       ├── PokedexScreen/        # Vista lista Pokémon
│       │   ├── PokedexScreen.tsx
│       │   └── pokedexScreen.css
│       │
│       ├── PokedexDetails/       # Vista dettagli Pokémon
│       │   ├── PokedexDetails.tsx # GET descrizione + POST preferiti
│       │   └── pokedexDetails.css
│       │
│       └── BattleScreen/         # Sistema di combattimento
│           ├── BattleScreen.tsx  # Logica battaglia a turni
│           └── battleScreen.css
│
├── styles/                       # Stili globali e icone
│   └── tabler-icons.min.css      # Libreria icone Tabler
│
├── types/                        # Definizioni TypeScript
│   └── pokemons.ts               # Interfacce, Type Alias, Union, Generics
│
├── main.tsx                      # Entry point dell'applicazione
└── index.css                     # Stili globali base
```

---

## Componenti Principali

### `main.tsx`
Il punto di ingresso dell'applicazione. Configura:
- **React Router** per la navigazione tra pagine
- **React Query** per la gestione delle chiamate API con caching
- Le due route principali: `/pokedex` e `/*` (404)

### `Pokedex.tsx`
Il cuore dell'applicazione. Gestisce:
- **Stato dei Pokémon** - Lista completa caricata dall'API
- **Pokémon corrente** - Indice del Pokémon selezionato
- **Vista corrente** - Alterna tra `screen` (lista) e `details` (dettagli)
- **Audio** - Riproduzione della musica di sottofondo
- **Navigazione da tastiera** - Frecce su/giù per scorrere la lista

### `PokedexScreen.tsx`
La vista principale che mostra:
- **Sprite** del Pokémon precedente, corrente e successivo
- **Lista nomi** con 9 Pokémon visibili alla volta
- **Selezione rapida** tramite digitazione dell'ID

### `PokedexDetails.tsx`
La vista dettagli che mostra:
- **Sprite** del Pokémon selezionato
- **Nome e ID** formattato (es. "025 Pikachu")
- **Tipi** (es. "Electric")
- **Abilità** (es. "Static, Lightning Rod")
- **Descrizione** recuperata dall'API (GET con React Query)
- **Bottone Preferiti** per salvare il Pokemon (POST con useMutation)

### `BattleScreen.tsx`
Il sistema di combattimento a turni:
- **Inizializzazione** - Carica il Pokémon del giocatore e genera un avversario random (leggermente più debole)
- **Sistema a turni** - Alterna tra turno del giocatore e dell'avversario
- **Selezione mosse** - 4 mosse disponibili con potenza e precisione
- **Calcolo danni** - Formula ispirata ai giochi Pokémon originali
- **Barre HP animate** - Feedback visivo sui danni inflitti
- **AI avversario** - Sceglie mosse automaticamente
- **Animazioni** - Effetti shake quando si riceve danno

---

## API Utilizzate

### PokéAPI (`https://pokeapi.co/api/v2`)
| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| GET | `/pokemon?limit={n}&offset={o}` | Lista paginata dei Pokémon |
| GET | `/pokemon/{id}` | Dettagli singolo Pokémon |
| GET | `/characteristic/{id}` | Descrizione del Pokémon |

### No as a Service (`https://naas.isalman.dev`)
| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| GET | `/no` | Messaggio "NO" casuale e divertente |

### JSONPlaceholder (`https://jsonplaceholder.typicode.com`) - Mock API
| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| POST | `/posts` | Simula salvataggio Pokemon preferito |

---

## TypeScript Avanzato

Il file `src/types/pokemons.ts` dimostra l'uso di:

```typescript
// Type Alias
export type PokemonId = number;
export type ApiUrl = string;

// Union Types
export type PokemonTypeName = 'fire' | 'water' | 'grass' | ...;
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Intersection Types
export type PokemonSelectionProps = PokemonProps & { current: number; ... };

// Generics
export type ApiResponse<T> = 
    | { success: true; data: T; error: null }
    | { success: false; data: null; error: string };

export interface AsyncState<T> {
    data: T | null;
    status: LoadingState;
    error: string | null;
}
```

---

## ⚡ Ottimizzazioni Performance

Il caricamento dei Pokémon è stato ottimizzato per un'esperienza utente fluida:

1. **Caricamento prioritario** - I primi 9 Pokémon vengono caricati immediatamente
2. **Caricamento in background** - Il resto viene caricato in batch da 100
3. **Rate limiting** - Delay di 100ms tra i batch per evitare di sovraccaricare l'API
4. **Caching React Query** - Le descrizioni vengono cachate per evitare chiamate ripetute
5. **Aggiornamento progressivo** - La UI si aggiorna man mano che i dati arrivano

---

## Controlli

### Pokédex
| Azione | Tastiera | Interfaccia |
|--------|----------|-------------|
| Pokémon precedente | `↑` Freccia Su | D-pad Su |
| Pokémon successivo | `↓` Freccia Giù | D-pad Giù |
| Salta a ID | Digita `001`-`721` | - |
| Apri dettagli | - | Bottone `use` / icona 🔍 |
| Avvia battaglia | `A` o `Enter` | Bottone `A` / icona ⚔️ |
| Torna alla lista | `B` o `Esc` | Bottone `B` |
| Toggle musica | - | Icona Music |
| Salva preferito | - | Bottone ⭐ (in Details) |

### Battaglia
| Azione | Tastiera | Interfaccia |
|--------|----------|-------------|
| Seleziona mossa su | `↑` Freccia Su | D-pad Su    |
| Seleziona mossa giù | `↓` Freccia Giù | D-pad Già   |
| Seleziona mossa sx | `←` Freccia Sinistra | D-pad Sx    |
| Seleziona mossa dx | `→` Freccia Destra | D-pad Dx    |
| Conferma mossa | `A` o `Enter` | Bottone `A` |
| Esci dalla battaglia | `B` o `Esc` | Bottone `B` |

---

## Installazione e Avvio

```bash
# Clona il repository
git clone <repo-url>
cd PokeWild

# Installa le dipendenze
npm install

# Avvia in modalità sviluppo
npm run dev

# Build per produzione
npm run build

# Preview della build
npm run preview
```

---

## Dipendenze Principali

| Pacchetto | Versione | Utilizzo |
|-----------|----------|----------|
| React | 19.2.0 | Framework UI |
| React Router DOM | 7.12.0 | Routing SPA |
| @tanstack/react-query | 5.90.20 | Gestione stato server e caching API |
| Vite | 7.2.4 | Build tool e dev server |
| TypeScript | 5.9.3 | Type safety |

---

## Credenziali / Mock

L'applicazione non richiede credenziali per funzionare:
- **PokéAPI** è un'API pubblica senza autenticazione
- **No as a Service** è un'API pubblica senza autenticazione
- **JSONPlaceholder** è un'API mock pubblica per testare chiamate POST

---

## Note per lo Sviluppo

- Il progetto usa **Vite** per un'esperienza di sviluppo veloce con HMR (Hot Module Replacement)
- **TypeScript** è configurato in modalità strict per massima type safety
- **ESLint** è configurato per React con regole per hooks e refresh
- I **font pixel** sono inclusi in `assets/fonts/` per il look retrò
- Le **icone** usano la libreria [Tabler Icons](https://tabler.io/icons)

---

## Possibili Miglioramenti Futuri

- [ ] Aggiungere filtri per tipo di Pokémon
- [ ] Implementare la ricerca per nome
- [ ] Salvare i Pokémon preferiti in localStorage
- [ ] Aggiungere statistiche base (HP, Attack, Defense, etc.)
- [ ] Supporto per le generazioni 7-9
- [ ] Modalità offline con Service Worker
- [ ] Autenticazione utente
- [ ] Backend reale per i preferiti

---

## Licenza

Questo progetto è stato creato a scopo educativo.  
I dati dei Pokémon sono forniti da [PokéAPI](https://pokeapi.co/).  
Pokémon e tutti i nomi correlati sono marchi di Nintendo/Game Freak.
