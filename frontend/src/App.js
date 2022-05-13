import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Login from './components/Register/Login';
import Signup from './components/Register/Signup';
import NotFound from './components/Notfound';
import Bugs from './components/Bug/Bugs';
import Bugsall from './components/Bug/Bugsall';
import Layout from './components/Layout';
import Create from './components/Bug/Create';
import Editbug from './components/Bug/Editbug'
import Getbug from './components/Bug/Getbug';
import Administrator from './components/Administrator';
import Forgotpassword from './components/Register/Forgotpassword';
import Newpassword from './components/Register/Newpassword';
import Createticket from './components/Ticket/Createticket';
import Editticket from './components/Ticket/Editticket';

function App() {
  return (
    <Router>
      <div className='content'>
        <Layout>
          <Routes>
            <Route path ="/" element={<Bugs/>}/>
            <Route exact path ="/all" element={<Bugsall/>}/>
            <Route exact path ="/editbug/:id" element={<Editbug/>}/>
            <Route exact path ="/forgotpassword" element={<Forgotpassword/>} />
            <Route exact path ="/newpassword/:id" element={<Newpassword/>} />
            <Route exact path ="/bugs/:id" element={<Getbug/>}/>
            <Route exact path ="/administrator" element={<Administrator/>} />
            <Route exact path ="/login" element={<Login/>}/>
            <Route exact path ="/signup" element={<Signup/>} />
            <Route exact path ="/create" element={<Create/>} />
            <Route exact path = "/create/ticket/:id" element={<Createticket/>} />
            <Route exact path = "/edit/ticket/:idBug/:idTicket" element={<Editticket/>} />
            <Route  path ="*" element={<NotFound/>} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;
