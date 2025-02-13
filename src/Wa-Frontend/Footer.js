import { Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import Authapi from '../Authapi';
const currentYear = new Date().getFullYear();


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
                // console.log(response.page)
                // console.log(response.page.post_store[0].data);
                setTopbardata(response.page.post_store[0].data|| {});
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
                                    <img src={topbardata.Footerlogo} alt="" id="waste-white" />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-4">
                                        {/* {console.log(topbardata.Top_footer_part_1?.Footercontact)} */}
                                    <div className="get-touch">
                                        <span>{topbardata.Top_footer_part_1?.Title1}</span>
                                        {/* <span>{topbardata.Title1}</span> */}
                                        <p></p>

                                        <p className="contactno">{topbardata.Top_footer_part_1?.Footercontact}

                                        </p>
                                        <p className="footeremail"> {topbardata.Top_footer_part_1?.Footergmail}</p>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="address-waste">
                                        <p style={{ fontWeight: "500" }}>{topbardata.Top_footer_part_2?.Title2}</p>
                                        <p style={{ fontWeight: "100", marginTop: "-3%",width:"167px",margin:"auto" }}>
                                            {topbardata.Top_footer_part_2?.Description}
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
                                        <span>{topbardata.Top_Footer_Part_3?.title3}</span><br />

                                        <Link className="mail-link" to={topbardata.Top_footer_part_3?.Maillink1} > > {topbardata.Top_footer_part_3?.Mailtitle1} </Link><br />
                                        <Link className="mail-link" to={topbardata.Top_footer_part_3?.Maillink2}> >  {topbardata.Top_footer_part_3?.Mailtitle2}</Link><br />
                                        <Link className="mail-link" to={topbardata.Top_footer_part_3?.Maillink3} > > {topbardata.Top_footer_part_3?.Mailtitle3} </Link><br />
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
                                    }}>{topbardata.Bottom_footer?.Lowerfootertitle}
                                        {/* <strong style={{ fontWeight: "600", color: "gray" }}>MTS Group</strong> */}
                                    </p>
                                    <p>
                                        <span className="orange-text">{topbardata.Bottom_footer?.Lowerfooterdescription}</span>
                                        {/* <span className="green-text">{topbardata.lowerfooterdescription}</span> */}
                                    </p>
                                    <div className='PartoftheMTSGroup'>
                                        {/* <p>{topbardata.Lowerfooteraddress}</p>
                                        <p>{topbardata.Lowerfootercopyright}</p> */}
                                        <p>Copyright @{currentYear} All rights reserved. Terms & Conditions</p>

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
