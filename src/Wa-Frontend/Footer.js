import { Link } from "react-router-dom";
// import wastefooterlogo from '../Images/wasteAccountfooterlogo.png'
import { useEffect, useState } from 'react';
import Authapi from '../Authapi';


const Footer = () => {

    const [topbardata, setTopbardata] = useState({});
    const [statu, setStatus] = useState([]);
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await Authapi.Footerpageget();
            if (response.status === true) {
                setTopbardata(response.post_store[0].data || {});
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
                <footer id="footer-section">
                    <section className="page-section" id="footer">
                        <div className="container-fluid" id="containerfooter">
                            <div className="row">
                                <div className="col-md-12" id="waste-white">
                                    <img src={topbardata.footerlogo} alt="" id="waste-white" />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="get-touch">
                                        <span>{topbardata.title1}</span>
                                        <p></p>

                                        <p className="contactno">{topbardata.footercontact}

                                        </p>
                                        <p className="footeremail"> {topbardata.footergmail}</p>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="address-waste">
                                        <p style={{ fontWeight: "500" }}>{topbardata.title2}</p>
                                        <p style={{ fontWeight: "100", marginTop: "-3%" }}>
                                            {topbardata.description}
                                            {/* Filwood Green Business Park<br />
                                        l Filwood Park Lane <br />
                                        Bristol<br />
                                        BS4 1 ET*/}
                                        </p>
                                    </div>

                                </div>
                                <div className="col-md-4">
                                    <div className="mts">
                                        {/* <div class="vl"></div> */}
                                        <span>{topbardata.title3}</span><br />

                                        <Link className="mail-link" href="#" > > {topbardata.mailtitle1} </Link><br />
                                        <Link className="mail-link" href="#" > > {topbardata.mailtitle2}</Link><br />
                                        <Link className="mail-link" href="#" > > {topbardata.mailtitle3} </Link><br />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* hr line  */}
                        <div className="topbarline"></div>
                        {/* hr line end */}
                    </section>
                    <section className="page-section" id="copyright_section">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-12">
                                    <p style={{
                                        margin: "3%",
                                        margintop: "5%",
                                        fontWeight: "lighter"
                                    }}>{topbardata.lowerfootertitle}
                                        {/* <strong style={{ fontWeight: "600", color: "gray" }}>MTS Group</strong> */}
                                    </p>
                                    <p>
                                        <span className="orange-text">{topbardata.lowerfooterdescription}</span>
                                        {/* <span className="green-text">{topbardata.lowerfooterdescription}</span> */}
                                    </p>
                                    <div className='PartoftheMTSGroup'>
                                        <p>{topbardata.lowerfooteraddress}</p>
                                        <p>{topbardata.lowerfootercopyright}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </footer>
            ) : ("")
            }
        </>
    );
};

export default Footer;
