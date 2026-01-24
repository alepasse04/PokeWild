import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PokedexShell from './PokedexShell';
import './pokedex.styles.css';

const OpenPokedex = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger animation on mount
    setIsOpen(true);
  }, []);

  const handleClose = () => {
    navigate('/');
  };

  return (
    <div className={`pokedex-open ${isOpen ? 'open' : ''}`}>
      <PokedexShell onClose={handleClose} />
    </div>
  );
};

export default OpenPokedex;
