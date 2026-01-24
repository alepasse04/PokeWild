import { useNavigate } from 'react-router-dom';
import './pokedex.styles.css';

const ClosedPokedex = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/open');
  };

  return (
    <div className="pokedex-closed" onClick={handleClick}>
      <div className="pokedex-body">
        <div className="pokedex-top">
          <div className="hinge"></div>
        </div>
        <div className="pokedex-bottom">
          <div className="screen-placeholder"></div>
          <div className="buttons">
            <div className="button red"></div>
            <div className="button blue"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClosedPokedex;
