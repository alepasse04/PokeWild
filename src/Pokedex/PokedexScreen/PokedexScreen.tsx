import type {PokemonProps} from "../../types/types.ts";
import PokemonName from "./PokeItems/PokemonName.tsx";
import ImgPokemon from "./PokeItems/ImgPokemon.tsx";
import "./pokedexScreen.css"

const PokedexScreen: React.FC<PokemonProps & { current: number; setCurrent: (index: number) => void }> = ({
    pokemons,
    current,
}) => {

    const prev = pokemons[current - 1];
    const curr = pokemons[current];
    const next = pokemons[current + 1];

    const start = Math.max(0, current - 4);
    const end = Math.min(pokemons.length, current + 5);
    const names = pokemons.slice(start, end);

    return (
        <div className="pokedex">
            <div className="BG_pokeball"></div>
            <div className="BG_list">
                <div className='pkmImg'>
                    {prev && <ImgPokemon image={prev.image} />}
                    {curr && <ImgPokemon image={curr.image} />}
                    {next && <ImgPokemon image={next.image} />}
                </div>

            </div>
            <div className="list">
                <div className="selector"></div>
                <div className="identificatore">
                    {
                        names.map((pokemon, index) => {
                            return (
                                <div className={`pokemonItem ${start + index === current ? 'current' : ''}`} key={pokemon.id}>
                                    <PokemonName id={pokemon.id} name={pokemon.name} />
                                </div>

                            )
                        })
                    }
                </div>

            </div>

        </div>
    )
}

export default PokedexScreen;