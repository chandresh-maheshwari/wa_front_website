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
        getPostData()
    }, []);

    const getPostData = async () => {
        const response = await Authapi.Alldynamicpagegetnav();
        if (response.status === true) {
            setPagegetnav(response.data)
        }
    }
    // console.log(pagegetnav)

    const fetchData = async () => {
        try {
            const response = await Authapi.Navbarpageget();
            // console.log('Response:', response);
            if (response && response.status === true) {
                const postStore = response.page?.post_store;
                if (postStore && Array.isArray(postStore) && postStore.length > 0) {
                    const firstPost = postStore[0];
                    if (firstPost && firstPost.data) {
                        const data = firstPost.data;
                        // console.log('Data keys:', Object.keys(data)); // Log all keys in the data object
                        
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
                            if (key.toLowerCase().includes('button')) {
                                // console.log(`Found button key: ${key}`); // Log each button-related key
                                const buttonNumMatch = key.match(/\d+/);
                                const buttonNum = buttonNumMatch ? buttonNumMatch[0] : key; // Use key if no number
                                if (!buttonData[buttonNum]) {
                                    buttonData[buttonNum] = {};
                                }
                                // Assuming value is an object with button properties
                                Object.entries(value).forEach(([propKey, propValue]) => {
                                    const propertyName = propKey.replace(/\d+/g, '').replace(/\s+/g, '_').trim();
                                    // console.log(`Processing property: ${propertyName} with value: ${propValue}`);
                                    buttonData[buttonNum][propertyName] = propValue;
                                });
                            }
                        });
                        // console.log('Button Data:', buttonData);
                        setTopbardata(menuData);
                        setButtonData(buttonData);
                        setStatus(response.page);
                    } else {
                        console.error('First post is null or does not contain data:', firstPost);
                    }
                } else {
                    console.error('Post store is empty, null, or not an array:', postStore);
                }
            } else {
                console.error('Invalid response structure or status is false:', response);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
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
            // console.log(data);
            if (data.Buttontitle === 'Contact Us' && !showContactButton) {
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
                    {data.Buttontitle || 'Default Text'}
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






