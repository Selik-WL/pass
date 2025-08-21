import { createContext, useState } from "react";

import Page from '../context/Page.jsx';

const AppContext = createContext();
export default AppContext;

export function AppContextProvider({ children }) {
    const [userList, setUserList] = useState([]);
    const [errorList, setErrorList] = useState([]);
    const [errorHandlerList, setErrorHandlerList] = useState([]);
    const [messageList, setMessageList] = useState([]);
    const [docList, setDocList] = useState([]);
    const [page, setPage] = useState(Page.DEFAULT);
    const [credentials, setCredentials] = useState({ userId: null, userAdmin: null, token: null });

    return (
        <AppContext.Provider value={{ userList, setUserList, errorList, setErrorList, errorHandlerList, setErrorHandlerList, messageList, setMessageList, docList, setDocList, page, setPage, credentials, setCredentials }}>
            {children}
        </AppContext.Provider>
    );
}