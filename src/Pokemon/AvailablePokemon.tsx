import type {PokemonProps} from "../types/types.ts";
import "./pokedex_lyout.css"

const AvailablePokemon: React.FC<PokemonProps> = ({
    pokemons
}) => {
    return (
        <div className="background">
            <div className="BG_pokeball"></div>
            <div className="BG_list"></div>
            <div className="selector"></div>

            {
            pokemons.map((pokemon) => {
                return (
                    <div>
                        {pokemon.id}
                    </div>
                )
            })
        }
        </div>
    )
}

export default AvailablePokemon;