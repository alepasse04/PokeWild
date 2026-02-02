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

