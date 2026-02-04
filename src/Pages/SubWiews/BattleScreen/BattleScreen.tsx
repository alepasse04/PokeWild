/**
 *
 * Sistema di combattimento Pokémon a turni.
 *
 * Funzionalità:
 * - Combattimento 1v1 tra il Pokémon del giocatore e un avversario random
 * - Sistema a turni con selezione mosse
 * - Barre HP animate
 * - L'avversario è leggermente più debole del giocatore
 * - AI automatica per le mosse dell'avversario
 */
import React, { useState, useEffect, useCallback } from 'react';
import type { Pokemon, BattlePokemon, BattleMove, BattleTurn } from "../../../types/pokemons.ts";
import { getBattlePokemon, getRandomOpponent } from "../../../API/pokeApi.ts";
import "./battleScreen.css";

// Import battle backgrounds
import battleBg from "../../../assets/Graphics/Battlebacks/grass_bg.png";
import battleBase0 from "../../../assets/Graphics/Battlebacks/grass_base0.png";
import battleBase1 from "../../../assets/Graphics/Battlebacks/grass_base1.png";

interface BattleScreenProps {
    playerPokemon: Pokemon;
    onBattleEnd: (won: boolean) => void;
    selectedMoveIndex: number;
    onConfirm: boolean;
    resetConfirm: () => void;
}

const BattleScreen: React.FC<BattleScreenProps> = ({
    playerPokemon,
    onBattleEnd,
    selectedMoveIndex,
    onConfirm,
    resetConfirm
}) => {
    const [player, setPlayer] = useState<BattlePokemon | null>(null);
    const [opponent, setOpponent] = useState<BattlePokemon | null>(null);
    const [turn, setTurn] = useState<BattleTurn>('player');
    const [battleLog, setBattleLog] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [isAnimating, setIsAnimating] = useState(false);

    // Initialize battle
    useEffect(() => {
        const initBattle = async () => {
            setIsLoading(true);
            try {
                const [playerData, opponentData] = await Promise.all([
                    getBattlePokemon(playerPokemon.id, 1.0),
                    getRandomOpponent(playerPokemon.id)
                ]);
                setPlayer(playerData);
                setOpponent(opponentData);
                setBattleLog(`A wild ${opponentData.name.toUpperCase()} appeared!`);
            } catch (error) {
                console.error('Error initializing battle:', error);
                setBattleLog('Error loading battle...');
            }
            setIsLoading(false);
        };

        initBattle();
    }, [playerPokemon.id]);

    // Calculate damage
    const calculateDamage = (attacker: BattlePokemon, defender: BattlePokemon, move: BattleMove): number => {
        // Simplified damage formula inspired by Pokemon games
        const level = 50;
        const power = move.power;
        const attack = attacker.attack;
        const defense = defender.defense;

        // Check accuracy
        if (Math.random() * 100 > move.accuracy) {
            return 0; // Miss
        }

        // Base damage calculation
        const baseDamage = ((2 * level / 5 + 2) * power * (attack / defense)) / 50 + 2;

        // Random modifier (85-100%)
        const randomMod = (Math.random() * 0.15 + 0.85);

        // Critical hit (6.25% chance, 1.5x damage)
        const critMod = Math.random() < 0.0625 ? 1.5 : 1;

        return Math.floor(baseDamage * randomMod * critMod);
    };

    // Execute player move
    const executePlayerMove = useCallback((moveIndex: number) => {
        if (!player || !opponent || turn !== 'player' || isAnimating) return;

        const move = player.moves[moveIndex];
        if (!move) return;

        setIsAnimating(true);

        const damage = calculateDamage(player, opponent, move);
        const newOpponentHp = Math.max(0, opponent.currentHp - damage);

        if (damage === 0) {
            setBattleLog(`${player.name.toUpperCase()} used ${move.name.toUpperCase()}! But it missed!`);
        } else {
            setBattleLog(`${player.name.toUpperCase()} used ${move.name.toUpperCase()}! Dealt ${damage} damage!`);
        }

        setOpponent(prev => prev ? { ...prev, currentHp: newOpponentHp } : null);

        setTimeout(() => {
            if (newOpponentHp <= 0) {
                setBattleLog(`${opponent.name.toUpperCase()} fainted! You win!`);
                setTurn('ended');
                setTimeout(() => onBattleEnd(true), 2000);
            } else {
                setTurn('opponent');
            }
            setIsAnimating(false);
        }, 1500);
    }, [player, opponent, turn, isAnimating, onBattleEnd]);

    // Execute opponent move (AI)
    const executeOpponentMove = useCallback(() => {
        if (!player || !opponent || turn !== 'opponent' || isAnimating) return;

        setIsAnimating(true);

        // AI: Select random move
        const moveIndex = Math.floor(Math.random() * opponent.moves.length);
        const move = opponent.moves[moveIndex];

        const damage = calculateDamage(opponent, player, move);
        const newPlayerHp = Math.max(0, player.currentHp - damage);

        if (damage === 0) {
            setBattleLog(`${opponent.name.toUpperCase()} used ${move.name.toUpperCase()}! But it missed!`);
        } else {
            setBattleLog(`${opponent.name.toUpperCase()} used ${move.name.toUpperCase()}! Dealt ${damage} damage!`);
        }

        setPlayer(prev => prev ? { ...prev, currentHp: newPlayerHp } : null);

        setTimeout(() => {
            if (newPlayerHp <= 0) {
                setBattleLog(`${player.name.toUpperCase()} fainted! You lose...`);
                setTurn('ended');
                setTimeout(() => onBattleEnd(false), 2000);
            } else {
                setTurn('player');
            }
            setIsAnimating(false);
        }, 1500);
    }, [player, opponent, turn, isAnimating, onBattleEnd]);

    // Handle opponent turn
    useEffect(() => {
        if (turn === 'opponent' && !isAnimating) {
            const timer = setTimeout(() => {
                executeOpponentMove();
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [turn, isAnimating, executeOpponentMove]);

    // Handle confirm action from parent
    useEffect(() => {
        if (onConfirm && turn === 'player' && !isAnimating && player) {
            // Use setTimeout to avoid synchronous setState in effect
            const timer = setTimeout(() => {
                executePlayerMove(selectedMoveIndex);
                resetConfirm();
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [onConfirm, turn, isAnimating, player, selectedMoveIndex, executePlayerMove, resetConfirm]);

    // Calculate HP percentage
    const getHpPercentage = (current: number, max: number): number => {
        return Math.max(0, Math.min(100, (current / max) * 100));
    };

    // Get HP bar color based on percentage
    const getHpColor = (percentage: number): string => {
        if (percentage > 50) return '#4caf50';
        if (percentage > 20) return '#ff9800';
        return '#f44336';
    };

    if (isLoading) {
        return (
            <div className="battle-screen loading">
                <p>Preparing battle...</p>
            </div>
        );
    }

    if (!player || !opponent) {
        return (
            <div className="battle-screen error">
                <p>Error loading battle data</p>
            </div>
        );
    }

    const playerHpPercent = getHpPercentage(player.currentHp, player.maxHp);
    const opponentHpPercent = getHpPercentage(opponent.currentHp, opponent.maxHp);

    return (
        <div className="battle-screen">
            {/* Background layers */}
            <div className="battle-bg" style={{ backgroundImage: `url(${battleBg})` }}></div>

            {/* Opponent side */}
            <div className="battle-opponent">
                <div className="pokemon-info opponent-info">
                    <span className="pokemon-name">{opponent.name.toUpperCase()}</span>
                    <div className="hp-bar-container">
                        <div
                            className="hp-bar"
                            style={{
                                width: `${opponentHpPercent}%`,
                                backgroundColor: getHpColor(opponentHpPercent)
                            }}
                        ></div>
                    </div>
                    <span className="hp-text">HP: {opponent.currentHp}/{opponent.maxHp}</span>
                </div>
                <div className="pokemon-sprite opponent-sprite" style={{ backgroundImage: `url(${battleBase1})` }}>
                    <img src={opponent.image} alt={opponent.name} className={isAnimating && turn === 'player' ? 'shake' : ''} />
                </div>
            </div>

            {/* Player side */}
            <div className="battle-player">
                <div className="pokemon-sprite player-sprite" style={{ backgroundImage: `url(${battleBase0})` }}>
                    <img src={player.imageBack || player.image} alt={player.name} className={isAnimating && turn === 'opponent' ? 'shake' : ''} />
                </div>
                <div className="pokemon-info player-info">
                    <span className="pokemon-name">{player.name.toUpperCase()}</span>
                    <div className="hp-bar-container">
                        <div
                            className="hp-bar"
                            style={{
                                width: `${playerHpPercent}%`,
                                backgroundColor: getHpColor(playerHpPercent)
                            }}
                        ></div>
                    </div>
                    <span className="hp-text">HP: {player.currentHp}/{player.maxHp}</span>
                </div>
            </div>

            {/* Battle log */}
            <div className="battle-log">
                <p>{battleLog}</p>
            </div>

            {/* Move selection */}
            {turn === 'player' && !isAnimating && (
                <div className="move-selection">
                    {player.moves.map((move, index) => (
                        <div
                            key={index}
                            className={`move-option ${selectedMoveIndex === index ? 'selected' : ''}`}
                        >
                            <span className="move-name">{move.name}</span>
                            <span className="move-power">PWR: {move.power}</span>
                        </div>
                    ))}
                </div>
            )}

            {turn === 'opponent' && (
                <div className="waiting-message">
                    <p>Opponent is thinking...</p>
                </div>
            )}
        </div>
    );
};

export default BattleScreen;
