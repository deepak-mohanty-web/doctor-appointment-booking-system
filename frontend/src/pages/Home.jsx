import { useContext } from 'react';
import Banner from '../components/Banner';
import Header from '../components/Header';
import SpecialityMenu from '../components/SpecialityMenu';
import TopDoctor from '../components/TopDoctor';
import { AppContext } from '../context/AppContext';

function Home() {
  const { token } = useContext(AppContext);
  return (
    <div>
      <Header />
      <SpecialityMenu />
      <TopDoctor />
      <Banner />
    </div>
  );
}

export default Home;
