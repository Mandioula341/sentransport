import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Carte.css';

// Corriger les icones Leaflet (bug webpack)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Icone par defaut (arrets normaux)
const iconDefaut = new L.Icon.Default();

// Icone pour l'arret le plus proche (Exercice 1)
const iconArretProche = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  className: 'marker-arret-proche'
});

// Icone pour la position de l'utilisateur
const iconUtilisateur = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  className: 'marker-utilisateur'
});

// Calculer la distance entre 2 points GPS (km)
function calculerDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Composant enfant pour recentrer la carte (Exercice 2)
function BoutonCentrer({ position }) {
  const map = useMap();

  const centrer = () => {
    if (position) {
      map.setView(position, 15);
    }
  };

  return (
    <button className="btn-centrer" onClick={centrer}>
      📍 Centrer sur ma position
    </button>
  );
}

function Carte() {
  const [arrets, setArrets] = useState([]);
  const [positionUtilisateur, setPositionUtilisateur] = useState(null);
  const [arretsProches, setArretsProches] = useState([]);
  const DAKAR = [14.6928, -17.4467];

  // Charger les arrets depuis Flask
  useEffect(() => {
    fetch("http://localhost:5000/arrets")
      .then(r => r.json())
      .then(data => setArrets(data))
      .catch(err => console.error("Erreur arrets:", err));
  }, []);

  // Geolocalisation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          setPositionUtilisateur([
            pos.coords.latitude,
            pos.coords.longitude
          ]);
        },
        () => console.log("Geolocation refusee")
      );
    }
  }, []);

  // Trouver les 3 arrets les plus proches (Exercice 3)
  useEffect(() => {
    if (positionUtilisateur && arrets.length > 0) {
      const arretsAvecDistance = arrets.map(a => ({
        ...a,
        distance: calculerDistance(
          positionUtilisateur[0],
          positionUtilisateur[1],
          a.lat,
          a.lon
        )
      }));

      const trois_plus_proches = arretsAvecDistance
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 3);

      setArretsProches(trois_plus_proches);
    }
  }, [positionUtilisateur, arrets]);

  return (
    <div className="carte-container">
      <h2>Carte des arrets</h2>

      {arretsProches.length > 0 && (
        <div className="liste-arrets-proches">
          <h3>Arrets les plus proches</h3>
          <ol>
            {arretsProches.map(a => (
              <li key={a.id}>
                <strong>{a.nom}</strong> — {a.distance.toFixed(1)} km
              </li>
            ))}
          </ol>
        </div>
      )}

      <MapContainer center={DAKAR} zoom={12} className="carte">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {positionUtilisateur && <BoutonCentrer position={positionUtilisateur} />}

        {arrets.map(a => (
            <Marker
                key={a.id}
                position={[a.lat, a.lon]}
                icon={arretsProches.some(ap => ap.id === a.id) ? iconArretProche : iconDefaut}
            >
            <Popup>
                <strong>{a.nom}</strong>
                <br />
                Lignes : {a.lignes.join(", ")}
            </Popup>
            </Marker>
        ))}

        {positionUtilisateur && (
          <Marker position={positionUtilisateur} icon={iconUtilisateur}>
            <Popup>Vous etes ici</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}

export default Carte;