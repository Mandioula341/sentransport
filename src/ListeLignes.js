import LigneBus from './LignesBus';
import './ListeLignes.css';

const ListeLignes = ({ lignes }) => {
  return (
    <div className="liste-lignes">
      {lignes.map((ligne) => (
        <LigneBus 
          key={ligne.id} 
          numero={ligne.numero} 
          depart={ligne.depart} 
          arrivee={ligne.arrivee} 
          arrets={ligne.arrets} 
          couleur={ligne.couleur} 
        />
      ))}
    </div>
  );
};

export default ListeLignes;