import { useContext, useState, useEffect } from 'react';

import AppContext from '../context/AppContext.jsx'
import usePageLoader from '../context/usePageLoader.jsx';

export default function TopBar() {

    const {
        loadDocumentationPage,
        loadLoginPage
    } = usePageLoader();

    const documentationButton = (
        <div className='float-start btn btn-info' onClick={loadDocumentationPage}>
            <i className="bi bi-file-earmark-text fs-2"></i>
        </div>
    );

    const loginButton = (
        <div className='float-end btn btn-primary' onClick={loadLoginPage}>
            <i className="bi bi-person-circle fs-2"></i>
        </div>
    );

    return (
        <div className='d-flex align-items-start gap-2 bt-3'>
            <div className='clearfix'>
                {documentationButton}
            </div>
            <SearchBar/>
            <div className='clearfix'>
                {loginButton}
            </div>
        </div>
    )
}

function SearchBar() {
    const {
        credentials,
        setErrorHandlerList
    } = useContext(AppContext);

    const {
        loadViewPage
    } = usePageLoader();

    //if (!credentials.userAdmin) return null;
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleSearch = () => {
        if (inputValue.trim() === '') 
            return;
        loadViewPage(inputValue.trim());
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const [validationUserIDFeedback, setValidationUserIDFeedback] = useState(null);

    const topBarErrorHandler = {
        targets: ['identifier'],
        handle: (error) => {
            setValidationUserIDFeedback(error.message);
        }
    };

    useEffect(() => {
        setErrorHandlerList(prev => [...prev, topBarErrorHandler]);

        return () => {
            setErrorHandlerList(prev => prev.filter(handler => handler !== topBarErrorHandler));
        };
    }, []);

    return (
        <div className="input-group has-validation mb-3 ">
            <div className="form-floating">
                <input 
                    type="text" 
                    className={`h-100 form-control bg-transparent transparent-after shadow-none ${validationUserIDFeedback !== null ? 'is-invalid' : ''}`} 
                    id="userID" 
                    placeholder="Entrer l'identifiant d'utilisateur." 
                    name="userID" 
                    value={inputValue} 
                    onChange={handleInputChange} 
                    onKeyDown={handleKeyDown}
                    aria-describedby="validationUserIDFeedback"
                    required
                    style={{
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0
                    }}
                />
                <style>
                    {`
                        label::after {
                            background-color: transparent !important;
                        }
                    `}
                </style>
                <label className="bg-transparent" htmlFor="userID"> Entrer l'identifiant d'utilisateur pour aller au profil correspondant.</label>
            </div>
            <button className="btn btn-primary fs-2" type="button" onClick={handleSearch}>
                <i className="bi bi-search"></i>
            </button>
            {validationUserIDFeedback && (
                <div id="validationUserIDFeedback" className="invalid-feedback d-block">
                    {validationUserIDFeedback}
                </div>
            )}
        </div>
    );
}