import TopBar from '../components/TopBar.jsx';

export default function DefaultPage({Page = null}) {
    return (
        <div className='container mt-5'>
            <TopBar />
            {Page && <Page />}
        </div>
    );
}