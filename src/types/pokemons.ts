/**
 *
 * Definizioni TypeScript per i tipi di dati relativi ai Pokémon.
 * Queste interfacce rispecchiano la struttura dei dati restituiti dalla PokéAPI
 * e vengono utilizzate in tutta l'applicazione per garantire type safety.
 */

/** Alias per l'ID di un Pokémon (numero da 1 a 721) */
export type PokemonId = number;

/** Alias per il nome di un Pokémon */
export type PokemonName = string;

/** Alias per URL delle risorse API */
export type ApiUrl = string;

/** Alias per URL delle immagini sprite */
export type SpriteUrl = string;


/** Tipi di Pokémon disponibili (prima generazione) */
export type PokemonTypeName =
    | 'normal' | 'fire' | 'water' | 'electric' | 'grass' | 'ice'
    | 'fighting' | 'poison' | 'ground' | 'flying' | 'psychic' | 'bug'
    | 'rock' | 'ghost' | 'dragon' | 'dark' | 'steel' | 'fairy';

/** Stato di caricamento per le chiamate API */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/** Viste disponibili nel Pokédex */
export type PokedexView = 'screen' | 'details' | 'battle';

/** Mossa di un Pokémon per il combattimento */
export interface BattleMove {
    name: string;
    power: number;
    type: string;
    accuracy: number;
}

/** Pokémon in battaglia con stats di combattimento */
export interface BattlePokemon {
    id: PokemonId;
    name: PokemonName;
    image: SpriteUrl;
    imageBack?: SpriteUrl;
    maxHp: number;
    currentHp: number;
    attack: number;
    defense: number;
    speed: number;
    moves: BattleMove[];
    types: string[];
}

/** Stato del turno di battaglia */
export type BattleTurn = 'player' | 'opponent' | 'ended';

/** Messaggio di log della battaglia */
export interface BattleLog {
    message: string;
    type: 'attack' | 'damage' | 'info' | 'victory' | 'defeat';
}



/** Struttura di un'abilità come restituita dall'API */
export interface Ability {
    ability: {
        name: string;
    }
}

/** Struttura di un tipo Pokémon come restituito dall'API */
export interface PokemonType {
    type: {
        id: number;
        name: PokemonTypeName | string;
    }
}

/** Risposta base dell'API per liste paginate */
export interface ApiListResponse<T> {
    count: number;
    next: ApiUrl | null;
    previous: ApiUrl | null;
    results: T[];
}

/** Elemento base della lista Pokémon dall'API */
export interface PokemonListItem {
    name: PokemonName;
    url: ApiUrl;
}


/**
 * Rappresentazione di un Pokémon nell'applicazione.
 * Combina dati dalla lista base e dai dettagli individuali.
 */
export interface Pokemon {
    /** ID univoco del Pokémon (1-721) */
    id: PokemonId;
    /** Nome del Pokémon in minuscolo (es. "pikachu") */
    name: PokemonName;
    /** Array dei tipi (es. ["electric"]) */
    types: string[];
    /** Array delle abilità (es. ["static", "lightning-rod"]) */
    abilities: string[];
    /** URL dello sprite front_default */
    image: SpriteUrl;
    /** Descrizione opzionale dalla caratteristica */
    description?: string;
    /** URL per recuperare i dettagli completi */
    url: ApiUrl;
}

/** Dettagli estesi di un Pokémon (per la vista details) */
export interface PokemonDetails extends Pokemon {
    height: number;
    weight: number;
    baseExperience: number;
    stats: PokemonStat[];
}

/** Statistica base di un Pokémon */
export interface PokemonStat {
    baseStat: number;
    statName: string;
}


/** Props per componenti che gestiscono selezione Pokémon */
export type PokemonSelectionProps = PokemonProps & {
    current: number;
    setCurrent: (index: number) => void;
};



/**
 * Wrapper generico per risposte API con gestione errori.
 * Può contenere dati di successo O un errore, mai entrambi.
 *
 * @template T - Tipo dei dati in caso di successo
 */
export type ApiResponse<T> =
    | { success: true; data: T; error: null }
    | { success: false; data: null; error: string };

/**
 * Stato generico per operazioni asincrone.
 * Utile per gestire loading states in modo type-safe.
 *
 * @template T - Tipo dei dati caricati
 */
export interface AsyncState<T> {
    data: T | null;
    status: LoadingState;
    error: string | null;
}

/**
 * Helper per creare uno stato di successo.
 * @template T - Tipo dei dati
 */
export function createSuccessResponse<T>(data: T): ApiResponse<T> {
    return { success: true, data, error: null };
}

/**
 * Helper per creare uno stato di errore.
 * @template T - Tipo dei dati (per type inference)
 */
export function createErrorResponse<T>(error: string): ApiResponse<T> {
    return { success: false, data: null, error };
}



/** Props per componenti che ricevono la lista dei Pokémon */
export interface PokemonProps {
    pokemons: Pokemon[];
}

/** Props per componenti che mostrano un singolo Pokémon */
export interface PokemonItemProps {
    pokemon: Pokemon;
}

/** Props per il componente PokemonName */
export interface PokemonNameProps {
    id: PokemonId;
    name: PokemonName;
}

/** Props per il componente ImgPokemon */
export interface ImgPokemonProps {
    image: SpriteUrl;
    alt?: string;
}


/**
 * Interfaccia per i dati del Pokemon preferito da salvare.
 */
export interface FavoritePokemonData {
    pokemonId: number;
    pokemonName: string;
    savedAt: string;
    userId: number;
}

/**
 * Interfaccia per la risposta del salvataggio.
 */
export interface SaveFavoriteResponse {
    id: number;
    pokemonId: number;
    pokemonName: string;
    savedAt: string;
    userId: number;
}