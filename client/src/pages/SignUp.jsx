import { useContext, useState, useRef, useEffect } from 'react';
import AppContext from '../context/AppContext.jsx';
import usePageLoader from '../context/usePageLoader.jsx';
import useApiRequests from '../services/useApiRequests.jsx';
import ErrorHandler from '../services/ErrorHandler.jsx';
import Settings from '../services/Settings.js';

export default function LoginView() {
    const { loadLoginPage, loadHomePage } = usePageLoader();
    const { post, get } = useApiRequests();
    const { setErrorHandlerList, setCredentials } = useContext(AppContext);

    const handleErrors = ErrorHandler();

    const [form, setForm] = useState({ handle: '', email: '', password: '', admin: false });
    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (e.target.name === 'handle') emailRef.current?.focus();
            if (e.target.name === 'email') passwordRef.current?.focus();
        }
    };

    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        post('/profils', form).then((data) => {
            if (data.error) {
                handleErrors(data.error);
            } else if (data.credentials) {
                setCredentials(data.credentials);
                loadHomePage();
            } else if (Settings.debug()) {
                console.warn('unknown or empty data return;');
                console.group('data');
                console.log(data);
                console.groupEnd();
            }
            setLoading(false);
        });
    };

    const [passwordLength, setPasswordLength] = useState(12);
    
    const generatePassword = () => {
        if (!passwordLength || passwordLength < 4) return; // basic sanity check

        setLoading(true);
        get(`/motdepasse/${passwordLength}`).then((data) => {
            if (data.error) {
                handleErrors(data.error);
            } else if (data.password) {
                setForm(prev => ({ ...prev, 'password': data.password }));
                passwordRef.current?.focus();
                passwordRef.current?.select(); 
            } else if (Settings.debug()) {
                console.warn('unknown or empty data return;');
                console.group('data');
                console.log(data);
                console.groupEnd();
            }
            setLoading(false);
        });
    };


    const [validationHandleFeedback, setValidationHandleFeedback] = useState(null);
    const [validationEmailFeedback, setValidationEmailFeedback] = useState(null);
    const [validationPasswordFeedback, setValidationPasswordFeedback] = useState(null);
    const [validationAdminFeedback, setValidationAdminFeedback] = useState(null);

    const signUpErrorHandler = {
        targets: ['handle', 'email', 'password', 'admin'],
        handle: (error) => {
            if (error.target === 'handle') setValidationHandleFeedback(error.message);
            if (error.target === 'email') setValidationEmailFeedback(error.message);
            if (error.target === 'password') setValidationPasswordFeedback(error.message);
            if (error.target === 'admin') setValidationAdminFeedback(error.message);
        },
    };

    useEffect(() => {
        setErrorHandlerList((prev) => [...prev, signUpErrorHandler]);
        return () => {
            setErrorHandlerList((prev) => prev.filter((handler) => handler !== signUpErrorHandler));
        };
    }, []);

    return (
        <div className="container">
            <div className="row justify-content-center mt-5">
                <div className="col-12 col-sm-10">
                    <h3 className="mb-4 text-center">Connexion</h3>

                    <form onSubmit={handleSubmit}>
                        <div className="input-group has-validation mb-3">
                            <input
                                type="text"
                                className="form-control"
                                id="handle"
                                name="handle"
                                value={form.handle}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                placeholder="Nom d'utilisateur"
                                aria-describedby="validationHandleFeedback"
                                required
                            />
                        </div>
                        <div id="validationHandleFeedback" className="invalid-feedback d-block">
                            {validationHandleFeedback}
                        </div>

                        <div className="input-group has-validation mb-3">
                            <input
                                type="email"
                                className="form-control"
                                ref={emailRef}
                                id="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                placeholder="Adresse email"
                                aria-describedby="validationEmailFeedback"
                                required
                            />
                        </div>
                        <div id="validationEmailFeedback" className="invalid-feedback d-block">
                            {validationEmailFeedback}
                        </div>

                        <div className="input-group has-validation mb-3">
                            <input
                                type="text"
                                className="form-control"
                                ref={passwordRef}
                                id="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                placeholder="Mot de passe"
                                aria-describedby="validationPasswordFeedback"
                                required
                            />
                            <input
                                type="number"
                                min="4"
                                max="64"
                                className="form-control"
                                style={{ maxWidth: '100px' }}
                                value={passwordLength}
                                onChange={(e) => setPasswordLength(parseInt(e.target.value) || 0)}
                                title="Longueur du mot de passe"
                            />
                            <button className="btn btn-success" type="button" onClick={generatePassword} disabled={loading}>
                                Générer
                            </button>
                        </div>
                        <div id="validationPasswordFeedback" className="invalid-feedback d-block">
                            {validationPasswordFeedback}
                        </div>

                        <div className="form-check d-flex align-items-center mb-3" style={{ height: '38px' }}>
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="admin"
                                name="admin"
                                checked={form.admin}
                                onChange={handleChange}
                                aria-describedby="validationAdminFeedback"
                            />
                            <label className="form-check-label ms-2" htmlFor="admin">
                                Compte admin
                            </label>
                        </div>
                        <div id="validationAdminFeedback" className="invalid-feedback d-block">
                            {validationAdminFeedback}
                        </div>

                        <button type="submit" className="btn btn-primary w-100 mb-3" disabled={loading}>
                            {loading ? (
                                <>
                                    Inscription en cours...
                                    <span className="spinner-border spinner-border-sm ms-2" role="status" aria-hidden="true"></span>
                                </>
                            ) : (
                                <>
                                    S'inscrire
                                    <i className="ms-1 bi bi-person-add"></i>
                                </>
                            )}
                        </button>
                        <button type="button" className="btn btn-secondary w-100" onClick={loadLoginPage}>
                            Déja un compte ?
                            <i className="ms-1 bi bi-person-check"></i>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
