import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home'
import PollDetail from './polldetail';
import Vote from './vote'; // Assuming you have a VotePage component
import Createpoll from './createpoll';
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/vote" element={<Vote />} />
                <Route path="/polldetail" element={<PollDetail />} />
                <Route path="/createpoll" element={<Createpoll />} />
            </Routes>
        </Router>
    );
}

export default App;
