import { useState, useEffect } from 'react';
import './App.css';
import Header from './Header';
import Recherche from './Recherche';
import LigneBus from './LignesBus';
import DetailLigne from './DetailLigne';
import Footer from './Footer';
import Carte from './Carte';

// Définition du composant StatReseau
//const StatReseau = ({ lignes }) => {
 // const totalLignes = lignes.length;
 // const totalArrets = lignes.reduce((sum, ligne) => sum + ligne.arrets, 0);
  //const ligneMax = lignes.reduce((prev, current) => 
   // (prev.arrets > current.arrets) ? prev : current
  //);
  //return (
    //<div style={{ display: 'flex', gap: '30px', margin: '20px 0', padding: '15px', background: '#f8f9fa', borderRadius: '8px', fontWeight: 'bold' }}>
      //<div>🚌 Total Lignes : {totalLignes}</div>
      //<div>🛑 Total Arrêts : {totalArrets}</div>
      //<div>🔝 Ligne la plus longue : Ligne {ligneMax.numero}</div>
    //</div>
  //);
//};


const StatReseau = ({ lignes }) => {
  if (lignes.length === 0) return null;

  const totalLignes = lignes.length;
  const totalArrets = lignes.reduce((sum, ligne) => sum + ligne.arrets, 0);
  const ligneMax = lignes.reduce((prev, current) => 
    (prev.arrets > current.arrets) ? prev : current
  );

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
      margin: '25px 0'
    }}>
      {/* Carte 1 : Total Lignes */}
      <div style={{
        background: '#fff',
        padding: '20px',
        borderRadius: '12px',
        border: '1px solid #eef0f2',
        boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
      }}>
        <div style={{ fontSize: '32px', background: '#edf2f7', padding: '12px', borderRadius: '10px' }}>🚌</div>
        <div>
          <div style={{ fontSize: '14px', color: '#64748b', fontWeight: '500', marginBottom: '4px' }}>Total Lignes</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b' }}>{totalLignes}</div>
        </div>
      </div>

      {/* Carte 2 : Total Arrêts */}
      <div style={{
        background: '#fff',
        padding: '20px',
        borderRadius: '12px',
        border: '1px solid #eef0f2',
        boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
      }}>
        <div style={{ fontSize: '32px', background: '#edf2f7', padding: '12px', borderRadius: '10px' }}>🛑</div>
        <div>
          <div style={{ fontSize: '14px', color: '#64748b', fontWeight: '500', marginBottom: '4px' }}>Total Arrêts</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b' }}>{totalArrets}</div>
        </div>
      </div>

      {/* Carte 3 : Ligne la plus longue */}
      <div style={{
        background: '#fff',
        padding: '20px',
        borderRadius: '12px',
        border: '1px solid #eef0f2',
        boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
      }}>
        <div style={{ fontSize: '32px', background: '#edf2f7', padding: '12px', borderRadius: '10px' }}>🔝</div>
        <div>
          <div style={{ fontSize: '14px', color: '#64748b', fontWeight: '500', marginBottom: '4px' }}>Ligne la plus longue</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b' }}>Ligne {ligneMax.numero}</div>
        </div>
      </div>
    </div>
  );
};


function App() {
  const [lignes, setLignes] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [recherche, setRecherche] = useState("");
  const [ligneSelectionnee, setLigneSelectionnee] = useState(null);

  // --- Exercice 3 : État pour le compteur ---
  const [nbRecherches, setNbRecherches] = useState(0);

  // Fonction pour gérer la saisie et incrémenter le compteur
  const handleChangementRecherche = (valeur) => {
    setRecherche(valeur);
    setNbRecherches(nbRecherches + 1);
  };

  // const lignes = [
  //   { id: 1, numero: "1", depart: "Parcelles Assainies",arrivee: "Plateau", arrets: 14,listeArrets: ["Parcelles U14", "Parcelles U10","Camberene", "Patte d'Oie", "Grand Dakar","Colobane", "Ponty", "Plateau"] },
  //   { id: 2, numero: "7", depart: "Guediawaye",arrivee: "Place Obe", arrets: 18,listeArrets: ["Guediawaye", "Pikine", "Thiaroye","Keur Massar", "Grand Yoff", "Parcelles","Liberte 6", "Place Obe"] },
  //   { id: 3, numero: "15", depart: "Pikine",arrivee: "Medina", arrets: 12,listeArrets: ["Pikine Centre", "Thiaroye Gare","Hann", "Colobane", "Fass", "Medina"] },
  //   { id: 4, numero: "23", depart: "Ouakam",arrivee: "Grand Dakar", arrets: 10,listeArrets: ["Ouakam Village", "Mermoz", "Fann","Point E", "Liberte 5", "Grand Dakar"] },
  //   { id: 5, numero: "8", depart: "Almadies",arrivee: "Colobane", arrets: 16,listeArrets: ["Almadies", "Ngor", "Yoff","Ouest Foire", "Liberte 6", "Colobane"] },
  //   { id: 6, numero: "12", depart: "Yoff",arrivee: "Sandaga", arrets: 11,listeArrets: ["Yoff Village", "Aeroport LSS","Parcelles U17", "Grand Yoff", "HLM", "Sandaga"] },
  // ];

  //  useEffect(() => {
  //   fetch("http://localhost:5000/lignes")
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error("Erreur serveur : " + response.status);
  //       }
  //       return response.json();
  //     })
  //     .then((data) => {
  //       setLignes(data);
  //       setChargement(false);
  //     })
  //     .catch((error) => {
  //       setErreur(error.message);
  //       setChargement(false);
  //     });
  // }, []);

  /*Exercice1 lab5: Extraire le fetch dans une fonction séparée*/
function chargerLignes() {
  setChargement(true);
  setErreur(null);
  fetch("http://localhost:5000/lignes")
    .then(response => {
      if (!response.ok) {
        throw new Error("Erreur serveur : " + response.status);
      }
      return response.json();
    })
    .then(data => {
      setLignes(data);
      setChargement(false);
    })
    .catch(error => {
      setErreur(error.message);
      setChargement(false);
    });
}

// useEffect appelle la même fonction
useEffect(() => {
  chargerLignes();
}, []);

  // Logique de filtrage
  const lignesFiltrees = lignes.filter(l =>
    l.depart.toLowerCase().includes(recherche.toLowerCase()) ||
    l.arrivee.toLowerCase().includes(recherche.toLowerCase()) ||
    l.numero.includes(recherche)
  );

  // Gestion du clic (Toggle) Lab4
  // function handleClickLigne(ligne) {
  //   if (ligneSelectionnee && ligneSelectionnee.id === ligne.id) {
  //     setLigneSelectionnee(null); // Désélectionne si déjà active
  //   } else {
  //     setLigneSelectionnee(ligne); // Sélectionne la ligne
  //   }
  // }

  /*Exercice 3 lab5 : charger les détails via GET /lignes/<id>*/
  function handleClickLigne(ligne) {
    if (ligneSelectionnee && ligneSelectionnee.id === ligne.id) {
      setLigneSelectionnee(null);
      return;
    }

    fetch(`http://localhost:5000/lignes/${ligne.id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error("Ligne introuvable");
        }
        return response.json();
      })
      .then(data => {
        setLigneSelectionnee(data);
      })
      .catch(error => {
        console.error("Erreur chargement détails :", error.message);
      });
  }

  // Ecran de chargement
  if (chargement) {
    return (
      <div className="App">
        <Header />
        <main className="contenu">
          <p className="message-chargement">Chargement des lignes...</p>
        </main>
      </div>
    );
  }

  // Ecran d'erreur
  if (erreur) {
    return (
      <div className="App">
        <Header />
        <main className="contenu">
          <div className="message-erreur">
            <p>Impossible de charger les lignes.</p>
            <p className="erreur-detail">{erreur}</p>
            <p>Vérifiez que le serveur Flask est lancé (python api/app.py).</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="App">
      <Header />
      
      <main className="contenu">

        <StatReseau lignes={lignes}/>

        {/* Exercice 3 lab4: Affichage du compteur*/} 
        <p>Vous avez effectué {nbRecherches} recherche(s)</p>

        <div style={{ display: 'flex', gap: '10px', width: '100%', maxWidth: '600px', alignItems: 'center' }}>
          <Recherche className="recherche-input"
            valeur={recherche} 
            onChange={handleChangementRecherche} 
          />
           {/*Exercice 1 lab5: Bouton Recharger */}
          <button onClick={chargerLignes} className="btn-recharger">
            🔄 Recharger
          </button>

          {/*Exercice 1 lab4: Bouton Efface */}
          <button onClick={() => setRecherche("")} className="btn-effacer">
            Effacer
          </button>
        </div>


        {/* --- Exercice 2 lab4: Message si aucun résultat --- */}
        {lignesFiltrees.length === 0 ? (
          <p className="message-vide">Aucune ligne trouvée</p>
        ) : (
          <>
        <p className="resultat-recherche">
          {lignesFiltrees.length} ligne{lignesFiltrees.length > 1 ? 's' : ''} trouvée{lignesFiltrees.length > 1 ? 's' : ''}
        </p>

        {/* Liste des lignes */}
            {lignesFiltrees.map(ligne => (
              <LigneBus
                key={ligne.id}
                numero={ligne.numero}
                depart={ligne.depart}
                arrivee={ligne.arrivee}
                arrets={ligne.arrets}
                estSelectionnee={ligneSelectionnee?.id === ligne.id}
                onClick={() => handleClickLigne(ligne)}
              />
            ))}
          </>
        )}
        {ligneSelectionnee && <DetailLigne ligne={ligneSelectionnee} />}

        <Carte />
      </main>

      <Footer />
    </div>
  );
}

export default App;
