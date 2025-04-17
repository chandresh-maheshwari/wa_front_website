import { Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import Authapi from '../Authapi';
const currentYear = new Date().getFullYear();


const Footer = () => {

    const [footerdata, setfooterdata] = useState({});
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
                setfooterdata(response.page.post_store[0].data|| {});
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
                                    {/* {console.log(footerdata)}                        */}
                                    {/* <img src={`http://wa_front.localhost.com/uploads/dynamic_post_store/${footerdata.Footerlogo}`} alt="" id="waste-white" /> */}
                                    {/* <Link to={footerdata.Footerlogolink}>
                                    <img src={footerdata.Footerlogo} alt="" id="waste-white" className="footer-logo" /></Link> */}
                                      <Link to={footerdata?.[footerdata?.Field_slug_footerlogolink]}>
                                      <img src={footerdata?.[footerdata?.Field_slug_footerlogo]} alt="" id="waste-white" className="footer-logo" /></Link>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-4">
                                        {/* {console.log(footerdata.Top_footer_part_1?.Footercontact)} */}
                                    <div className="get-touch">
                                        {/* <span>{footerdata.Top_footer_part_1?.Title1}</span> */}
                                        <span>{footerdata?.TopFooterPart1?.[footerdata?.TopFooterPart1?.Field_slug_title1]}</span>
                                        {/* <span>{footerdata.Title1}</span> */}
                                        <p></p>

                                        {/* <p className="contactno">{footerdata.Top_footer_part_1?.Footercontact} */}
                                        <p className="contactno">{footerdata?.TopFooterPart1?.[footerdata?.TopFooterPart1?.Field_slug_footercontact]}

                                        </p>
                                        <p className="footeremail"> {footerdata?.TopFooterPart1?.[footerdata?.TopFooterPart1?.Field_slug_footergmail]}</p>
                                        {/* <p className="footeremail"> {footerdata.Top_footer_part_1?.Footergmail}</p> */}
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="address-waste">
                                        <p style={{ fontWeight: "500" }}>{footerdata?.TopFooterPart2?.[footerdata?.TopFooterPart2?.Field_slug_title2]}</p>
                                        {/* <p style={{ fontWeight: "500" }}>{footerdata.Top_footer_part_2?.Title2}</p> */}
                                        <p style={{ fontWeight: "100", marginTop: "-3%",width:"167px",margin:"auto" }}>
                                            {footerdata?.TopFooterPart2?.[footerdata?.TopFooterPart2?.Field_slug_description]}
                                            {/* {footerdata.Top_footer_part_2?.Description} */}
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
                                       
                                        <span>{footerdata?.TopFooterPart3?.[footerdata?.TopFooterPart3?.Field_slug_title3]}</span><br />
                                        {/* <span>{footerdata.Top_footer_part_3?.Title3}</span><br /> */}

                                        {/* <Link className="mail-link" to={footerdata.Top_footer_part_3?.Maillink1} > > {footerdata.Top_footer_part_3?.Mailtitle1} </Link><br />
                                        <Link className="mail-link" to={footerdata.Top_footer_part_3?.Maillink2}> >  {footerdata.Top_footer_part_3?.Mailtitle2}</Link><br />
                                        <Link className="mail-link" to={footerdata.Top_footer_part_3?.Maillink3} > > {footerdata.Top_footer_part_3?.Mailtitle3} </Link><br /> */}

                                        <Link className="mail-link" to={footerdata?.TopFooterPart3?.[footerdata?.TopFooterPart3?.Field_slug_maillink1]} > > {footerdata?.TopFooterPart3?.[footerdata?.TopFooterPart3?.Field_slug_mailtitle1]} </Link><br />
                                        <Link className="mail-link" to={footerdata?.TopFooterPart3?.[footerdata?.TopFooterPart3?.Field_slug_maillink2]} > > {footerdata?.TopFooterPart3?.[footerdata?.TopFooterPart3?.Field_slug_mailtitle2]} </Link><br />
                                        <Link className="mail-link" to={footerdata?.TopFooterPart3?.[footerdata?.TopFooterPart3?.Field_slug_maillink3]} > > {footerdata?.TopFooterPart3?.[footerdata?.TopFooterPart3?.Field_slug_mailtitle3]} </Link><br />

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
                                    }}>
                                        {footerdata?.BottomFooter?.[footerdata?.BottomFooter?.Field_slug_lowerfootertitle]}
                                        {/* {footerdata.Bottom_footer?.Lowerfootertitle} */}
                                        {/* <strong style={{ fontWeight: "600", color: "gray" }}>MTS Group</strong> */}
                                    </p>
                                    <p>
                                        <span className="orange-text">{footerdata?.BottomFooter?.[footerdata?.BottomFooter?.Field_slug_lowerfooterdescription]}</span>
                                        {/* <span className="orange-text">{footerdata.Bottom_footer?.Lowerfooterdescription}</span> */}
                                        {/* <span className="green-text">{footerdata.lowerfooterdescription}</span> */}
                                    </p>
                                    <div className='PartoftheMTSGroup'>
                                        {/* <p>{footerdata.Lowerfooteraddress}</p>
                                        <p>{footerdata.Lowerfootercopyright}</p> */}
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
