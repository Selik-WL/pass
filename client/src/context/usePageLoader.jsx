import { useContext} from 'react';

import AppContext from '../context/AppContext.jsx'
import Page from '../context/Page.jsx';

import useApiRequests from '../services/useApiRequests.jsx';
import ErrorHandler from '../services/ErrorHandler.jsx';
import Settings from '../services/Settings.js';

export default function usePageLoader() {
    const {
        userList, setUserList,
        setErrorList,
        setDocList,
        credentials, setCredentials,
        setPage
    } = useContext(AppContext);

    const {
        get
    } = useApiRequests();

    const handleErrors = ErrorHandler();

    const loadDefaultPage = () => setPage(Page.DEFAULT);

    const loadHomePage = () => {
        if (!credentials.userId) {
            loadDefaultPage();
        } else if (credentials.userAdmin) {
            loadListPage();
        } else {
            loadViewPage(credentials.userId);
        }
    }

    const loadLoginPage = () => {
        if (credentials.userId) {
            setCredentials({ userId: null, userAdmin: null, token: null });
            setPage(Page.DEFAULT);
        } else {
            setPage(Page.LOGIN);
        }
    }

    const loadSignUpPage = () => {
        if (credentials.userId) {
                setErrorList(prev=>[...prev, {'target':'login','message':"Vous êtes déjà connecté. Veuillez vous déconnecter pour créer un nouveau compte."}]);
        } else {
            setPage(Page.SIGNUP);
        }
    }

    const loadDocumentationPage = () => {
        get('/doc')
        .then((data) => {
            if (data.error) {
                handleErrors(data.error);
            } else if (data.doc) {
                setDocList(data.doc);
                setPage(Page.DOC);
            } else if (Settings.debug()) {
                console.warn("unknown or empty data return;");
                console.group("data");
                console.log(data);
                console.groupEnd();
            }
        });
    }

    const loadViewPage = (id) => {
        const users = userList.filter(user => user.userId === id);
        if (users.length > 0) {
            setUserList(users);
            setPage(Page.VIEW);
            return;
        }
        get(`/profils/${id}`)
        .then((data) => {
            if (data.error) {
                handleErrors(data.error);
            } else if (data.user) {
                setUserList([data.user[0]]);
                setPage(Page.VIEW);
            } else if (Settings.debug()) {
                console.warn("unknown or empty data return;");
                console.group("data");
                console.log(data);
                console.groupEnd();
            }
        });
    }

    const loadModifyPage = (id) => {
        const users = userList.filter(user => user.userId === id);
        if (users.length > 0) {
            setUserList(users);
            setPage(Page.MODIFY);
            return;
        }
        get(`/profils/${id}`)
        .then((data) => {
            if (data.error) {
                handleErrors(data.error);
            } else if (data.user) {
                setUserList([data.user[0]]);
                setPage(Page.MODIFY);
            } else if (Settings.debug()) {
                console.warn("unknown or empty data return;");
                console.group("data");
                console.log(data);
                console.groupEnd();
            }
        });
    }

    const loadDeletePage = (id) => {
        const users = userList.filter(user => user.userId === id);
        if (users.length > 0) {
            setUserList(users);
            setPage(Page.DELETE);
            return;
        }
        get(`/profils/${id}`)
        .then((data) => {
            if (data.error) {
                handleErrors(data.error);
            } else if (data.user) {
                setUserList([data.user[0]]);
                setPage(Page.DELETE);
            } else if (Settings.debug()) {
                console.warn("unknown or empty data return;");
                console.group("data");
                console.log(data);
                console.groupEnd();
            }
        });
    }

    const loadListPage = () => {
        get(`/profils`)
        .then((data) => {
            if (data.error) {
                handleErrors(data.error);
            } else if (data.user) {
                setUserList(data.user);
                setPage(Page.LIST);
            } else if (Settings.debug()) {
                console.warn("unknown or empty data return;");
                console.group("data");
                console.log(data);
                console.groupEnd();
            }
        });
    }

    return { 
        loadDefaultPage, 
        loadHomePage, 
        loadLoginPage, 
        loadSignUpPage, 
        loadDocumentationPage, 
        loadViewPage, 
        loadModifyPage, 
        loadDeletePage, 
        loadListPage 
    };
}