import { Outlet, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import Authapi from '../Authapi';

const Navlayout = () => {
    const navigate = useNavigate();

    const [topbardata, setTopbardata] = useState([]);
    const [statu, setStatus] = useState([]);
    const [buttonData, setButtonData] = useState({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await Authapi.Navbarpageget();
            if (response.status === true) {
                const data = response.post_store[0].data || {};
                const menuData = Object.entries(data)
                    .filter(([key]) => key.startsWith('menu'))
                    .sort((a, b) => {
                        const numA = parseInt(a[0].replace('menu', ''));
                        const numB = parseInt(b[0].replace('menu', ''));
                        return numA - numB;
                    })
                    .map(([key, value]) => ({ [key]: value }));
                const buttonData = {};
                Object.entries(data).forEach(([key, value]) => {
                    if (key.startsWith('button')) {
                        const buttonNum = key.replace(/[^0-9]/g, '');
                        if (!buttonData[buttonNum]) {
                            buttonData[buttonNum] = {};
                        }
                        const propertyName = key.replace(buttonNum, '');
                        buttonData[buttonNum][propertyName] = value;
                    }
                });
                setTopbardata(menuData);
                setButtonData(buttonData);
                setStatus(response.page)
            } else {
                console.error('Invalid response structure:', response);
            }
        } catch (error) {
            console.log(error);
        }
    };


    const renderMenuItems = () => {
        if (!Array.isArray(topbardata)) {
            return null;
        }

        return topbardata.map((item, index) => {
            const menuKey = Object.keys(item).find(key => key.startsWith('menu'));
            if (!menuKey) return null;

            const menuName = item[menuKey];

            return (
                <div key={index} className="d-flex align-items-center">
                    {index > 0 && (
                        <div className="line">
                            <span>|</span>
                        </div>
                    )}
                    <li className="nav-item">
                        <Link
                            className="nav-link"
                            id="menu-item"
                            to={`/menu/${menuName.replace(/\s+/g, '-').toLowerCase()}`}
                            state={{ menuName: menuName }}
                        >
                            {menuName}
                        </Link>
                    </li>
                </div>
            );
        });
    };

    const renderButtons = () => {
        return Object.entries(buttonData).map(([buttonNum, data]) => (
            <button
                key={buttonNum}
                type="button"
                className="btn btn-outline-light"
                onClick={() => data.buttonlink ? window.location.href = data.buttonlink : null}
                id={`button${buttonNum}`}
                style={{
                    backgroundColor: data.buttonbackgroundcolor || '',
                    color: data.buttontextcolor || '',
                    marginLeft: '10px'
                }}
            >
                {data.buttontitle}
            </button>
        ));
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-white" id="menu">
                <div className="container">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            {renderMenuItems()}
                        </ul>
                        <form className="d-flex">
                            {renderButtons()}
                        </form>
                    </div>
                </div>
            </nav>
            <Outlet />
        </>
    );
};

export default Navlayout;






