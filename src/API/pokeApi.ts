/**
 *
 * Questo modulo gestisce tutte le chiamate API verso PokéAPI (https://pokeapi.co/).
 * Implementa un sistema di caricamento *ottimizzato* che:
 * 1. Carica prima i primi 9 Pokémon per una risposta immediata
 * 2. Carica il resto in background in batch da 100
 * 3. Usa delay tra i batch per evitare rate limiting
 */

import type {Ability, Pokemon, PokemonType, FavoritePokemonData, SaveFavoriteResponse } from "../types/pokemons.ts";


/**
 * Recupera tutti i Pokémon disponibili (721 - prime 6 generazioni, scelta mia arbitraria perchè le generazioni successive non mi piacciono).
 *
 * La funzione è ottimizzata per le performance:
 * - Prima fase: carica i primi 9 Pokémon e aggiorna la UI immediatamente
 * - Seconda fase: carica i restanti 712 Pokémon in background
 *
 * @param setPokemons - Funzione setState di React per aggiornare la lista Pokémon
 *
 * @example
 * // Nel componente React:
 * useEffect(() => {
 *   fetchPokemons(setAvailablePokemons);
 * }, []);
 */
export const fetchPokemons = async (setPokemons: (pokemons: Pokemon[] | ((prev: Pokemon[]) => Pokemon[])) => void) => {
    const apiUrl = 'https://pokeapi.co/api/v2';
    const batchSize = 100;
    const totalPokemons = 721;
    try {
        const firstBatchResponse = await fetch(`${apiUrl}/pokemon?limit=9&offset=0`);
        if (!firstBatchResponse.ok) {
            throw new Error('Network response was not ok for first batch');
        }
        const firstBatchData = await firstBatchResponse.json();
        const firstPokemonList = firstBatchData.results;

        const firstUpdatedPokemonList = await Promise.all(
            firstPokemonList.map(async (pokemon: Pokemon) => {
                const res = await fetch(pokemon.url);
                if(!res.ok){
                    throw new Error(`Network response was not ok for ${pokemon.name}`);
                }
                const pokemonData = await res.json();

                const types = pokemonData.types.map(({ type }: PokemonType) => type.name);

                const abilities = pokemonData.abilities.map(({ ability }: Ability) => ability.name);
                const { sprites } = pokemonData;
                const image = sprites.front_default;

                const id = pokemonData.id;

                return {...pokemon, id, types, abilities, image};
            })
        );

        setPokemons(firstUpdatedPokemonList);

        const restBatches = [];
        for (let i = 9; i < totalPokemons; i += batchSize) {
            const limit = Math.min(batchSize, totalPokemons - i);
            const offset = i;
            restBatches.push({ limit, offset });
        }

        const restResults = [];
        for (const { limit, offset } of restBatches) {
            const response = await fetch(`${apiUrl}/pokemon?limit=${limit}&offset=${offset}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            restResults.push(data.results);
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        const restPokemonList = restResults.flat();

        const restUpdatedPokemonList = await Promise.all(
            restPokemonList.map(async (pokemon) => {
                const res = await fetch(pokemon.url);
                if(!res.ok){
                    throw new Error(`Network response was not ok for ${pokemon.name}`);
                }
                const pokemonData = await res.json();

                const types = pokemonData.types.map(({ type }: PokemonType) => type.name);

                const abilities = pokemonData.abilities.map(({ ability }: Ability) => ability.name);
                const { sprites } = pokemonData;
                const image = sprites.front_default;

                const id = pokemonData.id;

                return {...pokemon, id, types, abilities, image};
            })
        );

        setPokemons(prev => [...prev, ...restUpdatedPokemonList]);
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }

}

/**
 * Recupera la descrizione di un singolo Pokémon dalla sua caratteristica.
 *
 * Usa l'endpoint /characteristic/{id} che restituisce una descrizione
 * basata sulle statistiche del Pokémon. La descrizione viene filtrata
 * per restituire solo la versione in inglese.
 *
 * @param id - L'ID del Pokémon (1-721)
 * @returns Promise con oggetto contenente la descrizione in inglese
 * @throws Error se la chiamata API fallisce
 *
 * @example
 * // Con React Query:
 * const { data } = useQuery({
 *   queryKey: ['pokemonDetails', pokemonId],
 *   queryFn: () => getPokemonDescription(pokemonId)
 * });
 */
export const getPokemonDescription = async (id: number): Promise<{ description: string }> => {
    const apiUrl = 'https://pokeapi.co/api/v2';
    try {
        // Fetch characteristic for characteristic description
        console.log(id);
        const Res = await fetch(`${apiUrl}/characteristic/${id}`);
        const Data = await Res.json();
        const Description = Data.descriptions.find((desc: { language: { name: string }; description: string }) => desc.language.name === 'en')?.description || 'No description available.';

        return { description: Description };
    } catch (error) {
        console.error('Error fetching Pokemon details:', error);
        throw error;
    }

}

/**
 * Salva un Pokémon come preferito tramite chiamata POST mockup.
 *
 * Utilizza JSONPlaceholder come mock API per simulare il salvataggio.
 *
 * @param pokemonId - ID del Pokémon da salvare
 * @param pokemonName - Nome del Pokémon
 * @returns Promise con i dati del Pokemon salvato (incluso l'ID generato)
 * @throws Error se la chiamata POST fallisce
 *
 * @example
 * // Salva Pikachu come preferito:
 * const saved = await saveFavoritePokemon(25, 'pikachu');
 * console.log(`Salvato con ID: ${saved.id}`);
 */
export const saveFavoritePokemon = async (
    pokemonId: number,
    pokemonName: string
): Promise<SaveFavoriteResponse> => {
    const mockApiUrl = 'https://jsonplaceholder.typicode.com/posts';

    const favoriteData: FavoritePokemonData = {
        pokemonId: pokemonId,
        pokemonName: pokemonName,
        savedAt: new Date().toISOString(),
        userId: 1 // Mock user ID
    };

    try {
        const response = await fetch(mockApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(favoriteData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();


        return {
            id: data.id,
            pokemonId: favoriteData.pokemonId,
            pokemonName: favoriteData.pokemonName,
            savedAt: favoriteData.savedAt,
            userId: favoriteData.userId
        };
    } catch (error) {
        console.error('Error saving favorite Pokemon:', error);
        throw error;
    }
};


import type { BattlePokemon, BattleMove } from "../types/pokemons.ts";

/**
 * Recupera i dati di battaglia per un Pokémon.
 * Include stats, mosse e sprite front/back.
 *
 * @param pokemonId - ID del Pokémon
 * @param weakenFactor - Fattore per indebolire il Pokémon (default 1.0, usa 0.8 per opponent)
 * @returns Promise con BattlePokemon
 */
export const getBattlePokemon = async (
    pokemonId: number,
    weakenFactor: number = 1.0
): Promise<BattlePokemon> => {
    const apiUrl = 'https://pokeapi.co/api/v2';

    try {
        // Fetch Pokemon data
        const pokemonRes = await fetch(`${apiUrl}/pokemon/${pokemonId}`);
        if (!pokemonRes.ok) throw new Error(`Failed to fetch Pokemon ${pokemonId}`);
        const pokemonData = await pokemonRes.json();

        // Extract stats
        const stats = pokemonData.stats.reduce((acc: Record<string, number>, stat: { base_stat: number; stat: { name: string } }) => {
            acc[stat.stat.name] = Math.floor(stat.base_stat * weakenFactor);
            return acc;
        }, {});

        // Get moves (random 2-4 damaging moves)
        const allMoves = pokemonData.moves.slice(0, 20);
        const movesPromises = allMoves
            .slice(0, 4)
            .map(async (m: { move: { url: string } }) => {
                try {
                    const moveRes = await fetch(m.move.url);
                    if (!moveRes.ok) return null;
                    const moveData = await moveRes.json();

                    if (moveData.power && moveData.power > 0) {
                        return {
                            name: moveData.name.replace('-', ' '),
                            power: moveData.power,
                            type: moveData.type.name,
                            accuracy: moveData.accuracy || 100
                        } as BattleMove;
                    }
                    return null;
                } catch {
                    return null;
                }
            });

        const movesResults = await Promise.all(movesPromises);
        let moves = movesResults.filter((m): m is BattleMove => m !== null);

        if (moves.length < 2) {
            const defaultMoves: BattleMove[] = [
                { name: 'tackle', power: 40, type: 'normal', accuracy: 100 },
                { name: 'scratch', power: 40, type: 'normal', accuracy: 100 }
            ];
            moves = [...moves, ...defaultMoves].slice(0, 2);
        }

        const baseHp = stats['hp'] || 50;
        const maxHp = Math.floor(baseHp * 2 + 100);

        return {
            id: pokemonData.id,
            name: pokemonData.name,
            image: pokemonData.sprites.front_default,
            imageBack: pokemonData.sprites.back_default,
            maxHp: maxHp,
            currentHp: maxHp,
            attack: stats['attack'] || 50,
            defense: stats['defense'] || 50,
            speed: stats['speed'] || 50,
            moves: moves.slice(0, 4),
            types: pokemonData.types.map((t: { type: { name: string } }) => t.type.name)
        };
    } catch (error) {
        console.error('Error fetching battle Pokemon:', error);
        throw error;
    }
};

/**
 * Ottiene un Pokémon avversario random, leggermente più debole del giocatore.
 */
export const getRandomOpponent = async (
    playerPokemonId: number,
    maxId: number = 151
): Promise<BattlePokemon> => {
    let opponentId: number;
    do {
        opponentId = Math.floor(Math.random() * maxId) + 1;
    } while (opponentId === playerPokemonId);

    return getBattlePokemon(opponentId, 0.8);
};
