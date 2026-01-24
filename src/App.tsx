// App.tsx
import { useState } from "react";
import "./styles.css";

export default function App() {
    const [isOpen, setIsOpen] = useState(false);
    const [screen, setScreen] = useState<"home" | "list" | "detail">("home");

    return (
        <div className="app">
            <div className={`pokedex ${isOpen ? "open" : "closed"}`}>
                <div className="lid" onClick={() => setIsOpen(true)} />

                <div className="body">
                    <header className="top-bar">
                        <div className="camera" />
                        <div className="status-leds">
                            <span className="led green" />
                            <span className="led yellow" />
                            <span className="led red" />
                        </div>
                    </header>

                    <main className="screen-frame">
                        <div className="screen">
                            {screen === "home" && <div>HOME</div>}
                            {screen === "list" && <div>LIST</div>}
                            {screen === "detail" && <div>DETAIL</div>}
                        </div>
                    </main>

                    <aside className="side-controls">
                        <button onClick={() => setScreen("home")}>PC</button>
                        <button onClick={() => setScreen("list")}>LOTTA</button>
                        <button onClick={() => setScreen("detail")}>POKEDEX</button>
                    </aside>

                    <footer className="dpad">
                        <div className="up" />
                        <div className="left" />
                        <div className="center" />
                        <div className="right" />
                        <div className="down" />
                    </footer>
                </div>
            </div>
        </div>
    );
}

