import { useContext, useState, useRef, useEffect  } from 'react';
import AppContext from '../context/AppContext.jsx';
import usePageLoader from '../context/usePageLoader.jsx';

import useApiRequests from '../services/useApiRequests.jsx'
import ErrorHandler from '../services/ErrorHandler.jsx';
import Settings from '../services/Settings.js';

export default function LoginView() {
    const { 
        loadSignUpPage,
        loadHomePage
    } = usePageLoader();
    const {
        post
    } = useApiRequests();
    const {
        setErrorHandlerList,
        setCredentials
    } = useContext(AppContext);

    const handleErrors = ErrorHandler();

    const [form, setForm] = useState({ principal: '', credential: '' });

    const credentialRef = useRef(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && e.target.name === 'principal') {
            credentialRef.current?.focus();
        }
    } 

    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        post('/profils/login',form)
        .then((data) => {
            if (data.error) {
                handleErrors(data.error);
            } else if (data.credentials) {
                setCredentials(data.credentials);
                loadHomePage();
            } else if (Settings.debug()) {
                console.warn("unknown or empty data return;");
                console.group("data");
                console.log(data);
                console.groupEnd();
            }
            setLoading(false);
        });
    };


    const [validationPrincipalFeedback, setValidationPrincipalFeedback] = useState(null);
    const [validationCredentialFeedback, setValidationCredentialFeedback] = useState(null);

    const signUpErrorHandler = {
        targets: ['principal', 'credential'],
        handle: (error) => {
            if (error.target === 'principal')
            setValidationPrincipalFeedback(error.message);
            if (error.target === 'credential')
            setValidationCredentialFeedback(error.message);
        }
    };

    useEffect(() => {
        setErrorHandlerList(prev => [...prev, signUpErrorHandler]);

        return () => {
            setErrorHandlerList(prev => prev.filter(handler => handler !== signUpErrorHandler));
        };
    }, []);

    return (
        <div className='container'>
            <div className="row justify-content-center mt-5">
                <div className="col-12 col-sm-10 ">
                    <h3 className="mb-4 text-center">Connexion</h3>

                    <form onSubmit={handleSubmit}>
                        <div className="input-group has-validation mb-3">
                            <input
                                type="text"
                                className="form-control"
                                id="principal"
                                name="principal"
                                value={form.principal}
                                onChange={handleChange} 
                                onKeyDown={handleKeyDown}
                                placeholder="Adresse email ou nom d'utilisateur"
                                aria-describedby="validationPrincipalFeedback"
                                required
                            />
                            <div id="validationPrincipalFeedback" className="invalid-feedback d-block">
                                {validationPrincipalFeedback}
                            </div>
                        </div>

                        <div className="input-group has-validation mb-3">
                            <input
                                type="password"
                                className="form-control"
                                ref={credentialRef}
                                id="credential"
                                name="credential"
                                value={form.credential}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                placeholder='Mot de passe'
                                aria-describedby="validationCredentialFeedback"
                                required
                            />
                            <div id="validationCredentialFeedback" className="invalid-feedback d-block">
                                {validationCredentialFeedback}
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary w-100 mb-3"disabled={loading}>
                            {loading ? (
                                <>
                                    Connexion en cours...
                                    <span className="spinner-border spinner-border-sm ms-2" role="status" aria-hidden="true"></span>
                                </>
                            ) : (
                                <>
                                    Se connecter
                                    <i className="ms-1 bi bi-person-check"></i>
                                </>
                            )}
                        </button>
                        <button className="btn btn-secondary w-100" onClick={loadSignUpPage}>
                            Pas de compte? 
                            <i className="ms-1 bi bi-person-add"></i>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
