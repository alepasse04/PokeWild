import './pokedex.styles.css';

interface PokedexControlsProps {
  onClose: () => void;
}

const PokedexControls = ({ onClose }: PokedexControlsProps) => {
  return (
    <div className="pokedex-controls">
      <button className="control-button">Prev</button>
      <button className="control-button">Next</button>
      <button className="control-button">Select</button>
      <button className="control-button" onClick={onClose}>Close</button>
    </div>
  );
};

export default PokedexControls;
