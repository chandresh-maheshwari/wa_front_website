import { useLocation, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
// import Authapi from './Authapi';
import Authapi from '../Authapi';

const MenuPage = () => {
    const location = useLocation();
    const { menuName } = useParams();
    const [currentMenu, setCurrentMenu] = useState('');
    const [topbardata, setTopbardata] = useState({});
    const [statu, setStatus] = useState([]);

    useEffect(() => {
        const menuTitle = location.state?.menuName ||
            menuName.split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        setCurrentMenu(menuTitle);

    }, [location, menuName]);

    useEffect(() => {
        fetchData();
    }, [currentMenu]);
    console.log(topbardata)
    const fetchData = async () => {
        try {
            const response = await Authapi.dynamicpageget(currentMenu);
            if (response.status === true) {
                setTopbardata(response.post_store[0].data || {})
                setStatus(response.page)
            } else {
                console.error('Invalid response structure:', response);
            }
        } catch (error) {
            console.log(error)
            alert(error)
        }
    };

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">{currentMenu}</h1>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Welcome to {currentMenu}</h5>
                            <p className="card-text">
                                This is the content for {currentMenu}.
                                The layout remains the same but the content updates
                                based on which menu item was clicked.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MenuPage; 