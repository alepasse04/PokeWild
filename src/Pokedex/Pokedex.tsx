// Pokedex.tsx
import "../pokecord.css";
import AvailablePokemon from "../Pokemon/AvailablePokemon.tsx";

const gigi = [
    {
        id: 2,
        name: "Gigi",
    }
]
export default function Pokedex() {
    return(
        <>
            <div className="cover top"></div>
            <div className="cover bottom">
                <div className="middle"></div>
            </div>
            <header></header>

            <section className="blobs">
                <a href="/server" target="_blank"><img src="/src/assets/Pika3.png" alt=""/></a>
                <a href="https://audicy.xyz" target="_blank"></a>
                <a href="https://verbo.chat" target="_blank"></a>
                <a href="https://translomatic.botcat.dev" target="_blank"></a>
            </section>

            <section className="lights">
                <div></div>
                <div></div>
            </section>

            <section className="main">
                <div className="maintext">
                    <AvailablePokemon pokemons={gigi} />
                </div>
                <section className="decoration">
                    <div className="buttons">
                        <a data-home="Home" href="/"><i className="ti ti-home-2"></i></a>
                        <a data-calculator="Calculator" href="javascript:void(0)"><i
                            className="ti ti-calculator"></i></a>
                        <a data-logout="Logout" href="javascript:void(0)" className="logout disableLogout"><i
                            className="ti ti-power"></i></a>
                    </div>
                    <div className="vents">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </section>
            </section>

            <footer>
                <div className="screen">
                    <p><strong className="time">Thu Jan 22 2026</strong><br/><span className="goto"></span></p>
                </div>
                <nav>
                    <div>
                        <a data-add="Add" href="/add" target="_blank"><i className="ti ti-plus"></i></a>
                        <a data-terms="Terms" href="javascript:void(0)"><i className="ti ti-notes"></i></a>
                    </div>
                    <div>
                        <a data-shop="Shop" href="javascript:void(0)"><i className="ti ti-shopping-cart"></i></a>
                        <a data-guide="Guide" href="https://guide.pokecord.org"><i className="ti ti-code"></i></a>
                    </div>
                </nav>
            </footer>
            <noscript>Please Enable Javascript To Use The Pokedex!</noscript>
            <script src="./utilities/jquery-3.6.3.min.js"></script>
            <script src="./js/index.js"></script>
        </>
    )
        ;
}