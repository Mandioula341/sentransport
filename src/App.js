import './App.css';
import Header from './Header';
import Footer from './Footer';
import Stat1 from './Statistique1';
import Stat2 from './Statistique2';
import Stat3 from './Statistique3';
function App() {
  return (
    <div className="App">
     <Header />
      <main className="contenu">
       <p>Bienvenue ! Cette application vous aide a trouver
         votre ligne de bus a Dakar.
       </p>

        <h2>Statistiques du réseau DDD</h2>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <Stat1 />
          <Stat2 />
          <Stat3 />
        </div>
      </main>
      
      <Footer />

    </div>
  );
}
export default App;