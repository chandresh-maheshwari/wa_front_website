import { Button } from 'bootstrap';
import plushicon from '../Our Products/Ourproductimages/plush.png';
import righticon from '../Our Products/Ourproductimages/righticon.png';
import { useNavigate } from "react-router-dom";


const OurProducts = () => {

     const navigate = useNavigate();
    const cardTextStyle = {
        display: 'flex',
        alignItems: 'center',
        margin: '0',
        fontSize: "medium"
    };

    const cardTextImageStyle = {
        marginRight: '10px'
    };

    // const redirect = () => {
    //     window.location.href = '/contact'
    //  }

    return (
        <>
            {/* medal section */}
            <section className="packages-sec" id="package_section">
                <div className="container mt-2">
                    <div className="waste-management-service-title">
                        <h4>Our Waste Management Services</h4>
                    </div>
                    <div className="row">
                        <div className="col-lg-4" id="card1">
                            <div className="card-liner"></div>
                            <div className="card1 card">
                                <span className='medaltype'>Bronze</span>
                                <div className="card1-text">
                                    <p style={cardTextStyle}>
                                        <img src={righticon} className="card1righticon" alt="Track Icon" style={cardTextImageStyle} />
                                        Track and manage all waste
                                    </p>                                    
                                    <div className="card-liner-inside"></div>
                                
                                </div>
                                <div className="card1-sec-2-text">
                                    <p style={cardTextStyle}>
                                        <img src={plushicon} className="card1plushicon" alt="Add On Icon" style={cardTextImageStyle} />
                                        Option to add on Gold services
                                    </p>
                                    <div className="card-liner-inside-2"></div>
                                    <p className="card-sec-3-text">Monthly Fee</p>
                                    
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4" id="card2">
                            <div className="card-liner-card-2"></div>
                            <div className="card2 card active">
                                <span className='medaltype'>Silver</span>
                                <div className="card2-text">
                                    <p style={cardTextStyle}>
                                        <img src={righticon} className="card2righticon" alt="Track Icon" style={cardTextImageStyle} />
                                        Track and manage all waste
                                    </p>
                                    <p style={cardTextStyle}>
                                        <img src={righticon} className="card2righticon" alt="Supplier Icon" style={cardTextImageStyle} />
                                        Find and pay all Suppliers
                                    </p>
                                    <div className="card-liner-inside"></div>
                                </div>
                                <div className="card2-sec-2-text">
                                    <p style={cardTextStyle}>
                                        <img src={plushicon} className="card2plushicon" alt="Add On Icon" style={cardTextImageStyle} />
                                        Option to add on Gold services
                                    </p>
                                    <div className="card-liner-inside-2"></div>
                                    <div className="card-2-sec-3">
                                        <p className="card2-sec-3-text1">Monthly Fee</p>
                                        <p className="card2-sec-3-text">
                                            <img src={plushicon} className="card2text2plushicon" alt="Transaction Icon" style={cardTextImageStyle} />
                                            Transaction Fees
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4" id="card3">
                            <div className="card-liner-card-3"></div>
                            <div className="card3 card">
                                <span className='medaltype'>Gold</span>
                                <div className="card3-text">
                                    <p style={cardTextStyle}>
                                        <img src={righticon} className="card3righticon" alt="Track Icon" style={cardTextImageStyle} />
                                        Track and manage all waste
                                    </p>
                                    <p style={cardTextStyle}>
                                        <img src={righticon} className="card3righticon" alt="Supplier Icon" style={cardTextImageStyle} />
                                        Find and pay all Suppliers
                                    </p>

                                    <div className='ptext'>
                                        <h2 className='plus'>Plus</h2>
                                        <p style={cardTextStyle}>
                                            <img src={righticon} className="card3righticon" alt="Consultancy Icon" style={cardTextImageStyle} />
                                            <p> Expert consultancy services</p>
                                        </p>
                                        <p style={cardTextStyle}>
                                            <img src={righticon} className="card3righticon" alt="Brokering Icon" style={cardTextImageStyle} />
                                            Waste brokering assistance
                                        </p>
                                        <p style={cardTextStyle}>
                                            <img src={righticon} className="card3righticon" alt="Transition Icon" style={cardTextImageStyle} />
                                            Support to transition into managing your own waste
                                        </p>
                                        <div className="card-liner-inside"></div>
                                        <div className="card-3-sec-3">
                                            <p className="card3-sec-3-text1">Monthly Fee</p>
                                            <p className="card3-sec-3-text">
                                                <img src={plushicon} className="card3plushicon" alt="Transaction Icon" style={cardTextImageStyle} />
                                                Transaction Fees
                                            </p>
                                            <p className="card3-sec-3-text">
                                                <img src={plushicon} className="card3plushicon" alt="Management Icon" style={cardTextImageStyle} />
                                                Management Fees
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                   

                    {/* <div className="row">
                        <div className="col-12">
                            <button
                                type="button"
                                onClick={redirect}
                               className="btn sky-blue-btn"
                            >
                                Contact Us
                            </button>
                        </div>
                    </div> */}

                </div>
            </section>
        </>
    );
};


export default OurProducts;