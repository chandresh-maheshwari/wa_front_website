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
                // console.log(response.page.post_store[0].data);
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
                                    {/* {console.log(topbardata.Top_bar_logo_section?.Logoimage)}     */}
                                    {/* {console.log(topbardata.Top_bar_logo_section?.Logoimage)}    */}
                                    {/* <Link to={topbardata.Top_bar_logo_section?.Logolink}>
                                    <img src={topbardata.Top_bar_logo_section?.Logoimage} className="wa-logo" alt="wa-logo" /></Link> */}
                                    {console.log(topbardata)}                       

                                    <Link to={topbardata?.TopBarLogoSection?.[topbardata?.TopBarLogoSection?.Field_slug_logolink]}>
                                    <img src={topbardata?.TopBarLogoSection?.[topbardata?.TopBarLogoSection?.Field_slug_logoimage]} className="wa-logo" alt="wa-logo" /></Link>
                                </div>
                            </div>
                            <div className='col-sm-6'>
                                <div className='toptext'>
                                    <div className='topcontent'>
                                        {/* <p className='partoflife'> {topbardata.Mts_group_section?.Title}</p> 
                                        <p className='mtsgroup' style={{ color: "rgb(173, 173, 173);" }}>{topbardata.Mts_group_section?.Description}</p> */}
                                        <p className='partoflife'> {topbardata?.MTSGroupSection?.[topbardata?.MTSGroupSection?.Field_slug_title]}</p> 
                                        <p className='mtsgroup' style={{ color: "rgb(173, 173, 173);" }}>{topbardata?.MTSGroupSection?.[topbardata?.MTSGroupSection?.Field_slug_description]}</p>
                                    </div>
                                </div>
                                {/* {console.log(topbardata.Mts_group_section?.Sidelogoimage)}                                 */}
                                <img src={topbardata?.MTSGroupSection?.[topbardata?.MTSGroupSection?.Field_slug_sidelogoimage]} className="mts-logo" alt="mts-logo" />
                                {/* <img src={topbardata.Mts_group_section?.Sidelogoimage} className="mts-logo" alt="mts-logo" /> */}

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