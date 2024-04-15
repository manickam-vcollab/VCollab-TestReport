import { Routes, Route } from 'react-router-dom';
import Home from './Tabels/TestReport';
import Result from './Tabels/TestResult';
import ImageCompare from './Tabels/ImageCompare';

const App = () => {
 return (
    <>
       <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/result" element={<Result />} />
          <Route path="/compare" element={<ImageCompare />} />
       </Routes>
    </>
 );
};

export default App;

