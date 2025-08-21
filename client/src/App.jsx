import { useContext, useState, useEffect} from 'react';

import Popup from './components/Popup.jsx';

import Page from './context/Page.jsx';
import AppContext from './context/AppContext.jsx';
import usePageLoader from './context/usePageLoader.jsx';

import DefaultPage from './pages/Default.jsx';
import LoginPage from './pages/LoginView.jsx';
import SignUpPage from './pages/SignUp.jsx';
//import DocumentationPage from './pages/Documentation.jsx';
import UserViewPage from './pages/UserView.jsx';
//import UserModifyPage from './pages/UserModify.jsx';
//import UserListPage from './pages/UserList.jsx';

export default function App() {
    const [popups, setPopups] = useState([]);

    const {
        messageList, setMessageList, 
        setErrorHandlerList, page
    } = useContext(AppContext);

    const messagePopup = (message) => (
        <Popup 
        message={message} 
        type="info" 
        onClose={() => setPopups(popups => popups.slice(0, -1))}
        />
    );

    // shift any new messages to the popups
    useEffect(() => {
        if (messageList.length > 0) {
            setPopups(popups => [...popups, ...messageList.map(messagePopup)]);
            setMessageList([]);
        }
    }, [messageList, setMessageList])

    const errorPopup = (error) => (
        <Popup 
        message={error.message} 
        type="danger" 
        onClose={() => setPopups(popups => popups.slice(0, -1))}
        />
    );

    // add root error handler
    useEffect(() => {
        setErrorHandlerList([
            {
                targets: [
                    'handle', 
                    'email',
                    'admin',
                    'identifier',
                    'length',
                    'principal',
                    'credential',
                    'login',
                    'server',
                    'unknown'
                ],
                handle: (error) => {
                    setPopups(popups => [...popups, errorPopup(error)]);
                }
            }
        ]);
    }, []);

    const { loadHomePage } = usePageLoader();

    const LastPopup = (popups.length > 0) ? popups[popups.length - 1] : null;

    // set initial page as Home. 
    useEffect(() => {
        loadHomePage();
    }, []); 


    let PageView;
    switch (page) {
        case Page.LOGIN: 
            PageView = <LoginPage/>; 
            break;
        case Page.SIGNUP: 
            PageView = <SignUpPage/>; 
            break;
        //case Page.DOC: PageView = <DocumentationPage/>; break;
        case Page.VIEW: 
            PageView = <UserViewPage/>; 
            break;
        //case Page.MODIFY: PageView = <UserModifyPage/>; break;
        //case Page.LIST: PageView = <UserListPage/>; break;
        case Page.DEFAULT: 
        default:
            PageView = <DefaultPage/>;
    }

    return (
        <>
            {LastPopup}
            {PageView}
        </>
    );
}