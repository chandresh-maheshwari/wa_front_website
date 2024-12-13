import { Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import Authapi from '../Authapi';

const TopNav = () => {
    const [topbardata, setTopbardata] = useState({});
    const [statu, setStatus] = useState([]);
    useEffect(() => {
        fetchData();    
    }, []);

    const fetchData = async () => {
        try {
            const response = await Authapi.Toppageget();
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
        <>
            {statu.status === 1 ? (
                <div className="Topnav">
                    <div className="container">
                        <div className="row">
                            <div className='col-sm-6'>
                                <div className='frontlogo'>

                                    <Link to={topbardata.logolike}><img src={topbardata.logo} className="wa-logo" alt="wa-logo" /></Link>
                                </div>
                            </div>
                            <div className='col-sm-6'>
                                <div className='toptext'>
                                    <div className='topcontent'>
                                        <p className='partoflife'> {topbardata.title}</p> <p className='mtsgroup' style={{ color: "rgb(173, 173, 173);" }}>{topbardata.discussion}</p>
                                    </div>
                                </div>
                                <img src={topbardata.sidelogo} alt="mts-logo" className='mts-logo' />
                            </div>
                        </div>
                    </div>
                </div>
            ) : ("")
            }
        </>
    );
};

export default TopNav;