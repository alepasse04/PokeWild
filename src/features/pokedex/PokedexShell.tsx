import PokedexScreen from './PokedexScreen';
import PokedexControls from './PokedexControls';
import './pokedex.styles.css';

interface PokedexShellProps {
  onClose: () => void;
}

const PokedexShell = ({ onClose }: PokedexShellProps) => {
  return (
    <div className="pokedex-shell">
      <div className="pokedex-top">
        <PokedexScreen />
      </div>
      <div className="pokedex-bottom">
        <PokedexControls onClose={onClose} />
      </div>
    </div>
  );
};

export default PokedexShell;
