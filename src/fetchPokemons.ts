import type {Pokemontype} from "./types/types.ts";

type Result =
    |{
        data: Pokemontype[];
        error: null;
     }
    |{
        data: null;
        error: Error;
     };

export const fetchPokemons = async (limit = 15): Promise<Result> => {
    try {
        const listResponse = await fetch(
            `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=0`
        );

        const { results } = await listResponse.json();

        const urlList: string[] = results.map(
            (result: { name: string; url: string }) => result.url
        );

        const fetchedResponses = await Promise.all(
            urlList.map((url) => fetch(url))
        );

        const fetchedPokemon = await Promise.all(
            fetchedResponses.map((response) => response.json())
        );

        const formattedPokemon: Pokemontype[] = fetchedPokemon.map((pokemon) => ({
            id: pokemon.id,
            name: pokemon.name,
            imgUrl: pokemon.sprites.front_default,
        }));

        return { data: formattedPokemon, error: null };
    } catch (error) {
        return { data: null, error: error as Error };
    }
};