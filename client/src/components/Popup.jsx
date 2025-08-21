
export default function Popup({message, type, onClose}) {
    return (
        <div className="toast show p-0 bg-transparent border-0 position-fixed top-0 end-0 m-3" role="alert" aria-live="assertive" aria-atomic="true" style={{ zIndex: 1080 }}>
            <div className={`alert alert-${type}  m-0 d-flex justify-content-between align-items-center w-100`} role="alert">
                <p>{message}</p>
                <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close" onClick={onClose}></button>
            </div>
        </div>
    )
}