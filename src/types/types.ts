export {};

export type Pokemontype = {
    id: number;
    name: string;
    imgUrl: string;
}

export interface Pokemon {
    id: number;
    name: string;
};

export interface PokemonProps {
    pokemons: Pokemon[];
}