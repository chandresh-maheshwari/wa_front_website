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
            // console.log(response.page.post_store[0].data)
            if (response.status === true) {
                setTopbardata(response.page.post_store[0].data || {})
                // console.log(response.post_store[0].data)
                setStatus(response.page)
            } else {
                console.error('Invalid response structure:', response);
            }
        } catch (error) {
            console.log(error)

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

                                    <Link to={topbardata.Logolike}><img src={topbardata.Logoimage} className="wa-logo" alt="wa-logo" /></Link>
                                </div>
                            </div>
                            <div className='col-sm-6'>
                                <div className='toptext'>
                                    <div className='topcontent'>
                                        <p className='partoflife'> {topbardata.Title}</p> <p className='mtsgroup' style={{ color: "rgb(173, 173, 173);" }}>{topbardata.Discussion}</p>
                                    </div>
                                </div>
                                <img src={topbardata.Sidelogoimage} alt="mts-logo" className='mts-logo' />
                                {/* {console.log(topbardata)} */}
                            </div>
                        </div>
                    </div>
                    <div class="topbarline"></div>
                </div>
            ) : ("")
            }
        </>
    );
};

export default TopNav;