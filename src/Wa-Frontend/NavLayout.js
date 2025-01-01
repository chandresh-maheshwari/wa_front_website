import { Outlet, Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import Authapi from '../Authapi';

const Navlayout = () => {
    // const navigate = useNavigate();

    const [topbardata, setTopbardata] = useState([]);
    const [statu, setStatus] = useState([]);
    const [buttonData, setButtonData] = useState({});
    const [pagegetnav, setPagegetnav] = useState({});
    // console.log(buttonData)

    const allowedPageNames = Array.isArray(pagegetnav)
        ? pagegetnav.map(item => item.page_name)
        : [];

    useEffect(() => {
        fetchData();
        hardik()
    }, []);

    const hardik = async () => {
        const response = await Authapi.Alldynamicpagegetnav();
        if (response.status === true) {
            setPagegetnav(response.data)
        }
    }
    // console.log(pagegetnav)

    const fetchData = async () => {
        try {
            const response = await Authapi.Navbarpageget();
            // console.log(response)zz
            if (response.status === true) {
                const data = response.page.post_store[0].data || {};
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
                    if (key.startsWith('Button')) {
                        // console.log(key)
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
                // console.log(menuData)
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


        return allowedPageNames
            .map((item, index) => {


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
                                to={`/menu/${item.replace(/\s+/g, '-').toLowerCase()}`}
                                state={{ menuName: item }}
                            >
                                {item}
                            </Link>
                        </li>
                    </div>
                );
            });
    };

    const renderButtons = () => {
        const showContactButton = allowedPageNames.includes('Contact Us');

        return Object.entries(buttonData).map(([buttonNum, data]) => {
            // console.log(data)
            if (data.buttontitle === 'Contact Us' && !showContactButton) {
                return null;
            }

            return (
                <button
                    key={buttonNum}
                    type="button"
                    className="btn btn-outline-light"
                    onClick={() => data.Buttonlink ? window.location.href = data.Buttonlink : null}
                    id={`button${buttonNum}`}
                    style={{
                        backgroundColor: data.Buttonbackgroundcolor || '',
                        color: data.Buttontextcolor || '',
                        marginLeft: '10px'
                    }}
                >
                    {data.Buttontitle}
                </button>
            );
        });
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






