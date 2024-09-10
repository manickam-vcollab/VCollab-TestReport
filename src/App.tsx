import { Routes, Route,Navigate } from 'react-router-dom';
import TestReport from './Tabels/TestReport';
import TestResult from './Tabels/TestResult';
import ImageCompare from './Tabels/ImageCompare';
import FileUpload from './Tabels/FileUpload';
import Dashboard from'./Tabels/Index';

const App = () => {
 return (
    <>
       <Routes>
          <Route path="/" element={<Navigate to="/index" replace />} />
          <Route path="/index" element={<Dashboard />}/>
          <Route path="/test_report" element={<TestReport />} />
          <Route path="/result" element={<TestResult />} />
          <Route path="/image_compare" element={<ImageCompare />} />
          <Route path="/upload" element={<FileUpload />} />
       </Routes>
    </>
 );
};

export default App;

