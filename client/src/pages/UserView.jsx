import { useContext, useState } from 'react';

import AppContext from '../context/AppContext.jsx';
import usePageLoader from '../context/usePageLoader.jsx';

export default function UserView() {
    const {
        userList,
        credentials
    } = useContext(AppContext);

    const {
        loadListPage,
        loadLoginPage,
        loadModifyPage,
        loadDocumentationPage
    } = usePageLoader();

    const { del } = useApiRequests();

    const [showDeleteToast, setShowDeleteToast] = useState(false);

    const deleteUser = () => (e) => {
            e.preventDefault();
            setLoading(true);
            del('/profils').then((data) => {
                if (data.error) {
                    handleErrors(data.error);
                } else if (data.credentials) {
                    setCredentials(data.credentials);
                    loadHomePage();
                }
                setLoading(false);
            });
        setShowDeleteToast(false);
        loadListPage();
    };

    if (!userList?.length || !credentials) return null; 

    return (
        <div className='container'>
            {showDeleteToast && (
                <div className="toast show p-0 bg-transparent border-0 position-fixed top-0 end-0 m-3" role="alert" aria-live="assertive" aria-atomic="true" style={{ zIndex: 1080 }}>
                    <div className='alert alert-danger m-0 w-100'>
                        <div className="d-flex justify-content-between align-items-start">
                            <div>
                                <strong>Voulez-vous effacer le profil {userList[0].userHandle} ?</strong>
                                <br />
                                Cette action ne peut pas être annulée.
                            </div>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => setShowDeleteToast(false)}
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="mt-3 text-end">
                            <button type="button" className="btn btn-danger" onClick={deleteUser}>
                                <i className="bi bi-trash3 fs-5 me-1"></i> Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className='clearfix mt-5 mb-3'>
                {credentials.userAdmin ? (
                    <button className='float-start btn btn-secondary' onClick={loadListPage}>
                        <i className="bi bi-people fs-2"></i>
                    </button>
                ) : (
                    <button className='float-start btn btn-info' onClick={loadDocumentationPage}>
                        <i className="bi bi-file-earmark-text fs-2"></i>
                    </button>
                )}
                <button className='float-end btn btn-primary' onClick={loadLoginPage}>
                    <i className="bi bi-person-circle fs-2"></i>
                </button>
            </div>

            <div className='row align-items-center'>
                <div className="col d-flex">
                    {credentials.userAdmin && (
                        <div className="me-3 d-flex align-items-center">
                            <span className="badge bg-dark">
                                <i className="bi bi-person-badge fs-2"></i>
                            </span>
                        </div>
                    )}
                    <div>
                        <h3 className="mb-1">{userList[0].userHandle}</h3>
                        <p className="text-muted mb-0">{userList[0].userEmail}</p>
                    </div>
                </div>

                <div className="col-auto d-flex gap-2">
                    <button className='btn btn-warning' onClick={loadModifyPage}>
                        <i className="bi bi-person-gear fs-2"></i>
                    </button>
                    {credentials.userAdmin && (
                        <button className='btn btn-danger' onClick={() => setShowDeleteToast(true)}>
                            <i className="bi bi-person-dash fs-2"></i>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
