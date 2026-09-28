import { Link } from 'react-router-dom';
import { useAuth } from './security/AuthComponent';
import './css/HeaderComponent.css';

export default function HeaderComponent() {

    const authContext = useAuth();

    return (

        <header className="border-bottom border-light border-5 mb-5 p-2">
            <div className="headerContainer">
                <div className="row">
                    <nav className="navbar navbar-expand-lg">
                        <a className="navbar-brand ms-2 fs-2 fw-bold text-black" href="https://github.com/nagmanikumar15876">MyProjects</a>
                        <div className="collapse navbar-collapse">
                            <ul className="navbar-nav">
                                {authContext.isAuthenticated && <li className="nav-item fs-5"><Link className="nav-link" to={`/welcome/${authContext.firstName}`}>Home</Link></li>}
                                {authContext.isAuthenticated &&
                                    <li className="nav-item fs-5"><Link className="nav-link" to="/todos">Todos</Link></li>}
                            </ul>
                        </div>
                        <ul className="navbar-nav">
                            {!authContext.isAuthenticated && <li className="nav-item fs-5"><Link className="nav-link" to="/login">Login</Link></li>}
                            {!authContext.isAuthenticated && <li className="nav-item fs-5"><Link className="nav-link" to="/new/user">SignUp</Link></li>}
                            {authContext.isAuthenticated && <li className="nav-item fs-5"><Link className="nav-link" to="/logout" onClick={() => authContext.logout()}>Logout</Link></li>}
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    )
}