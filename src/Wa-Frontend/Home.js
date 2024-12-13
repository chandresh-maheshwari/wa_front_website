import homeimg from '../Images/Rectangle 4.png';
import quoteimage1 from '../Images/Vector (1).png';
import sliderilmg1 from '../Images/Rectangle 36.png';
import sliderilmg3 from '../Images/Rectangle 22.png';
import sliderilmg2 from '../Images/Rectangle 9.png';
import About from './Aboutus/Aboutus';
import Contact from './Contactus/Contact us';
// import buldingimag from '../Images/bulding.png';
import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import OurProducts from './Our Products/OurProducts';
import { useNavigate } from "react-router-dom";


const Home = () => {
    const [isPlaying, setIsPlaying] = useState(true);
    const [sliderRef, setSliderRef] = useState(null);

    useEffect(() => {
        if (sliderRef) {
            if (isPlaying) {
                sliderRef.slickPlay();
            } else {
                sliderRef.slickPause();
            }
        }
    }, [sliderRef, isPlaying]);

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const handleContainerClick = (event) => {
        if (event.target === event.currentTarget) {
            sliderRef.current.slickPause();
        }
    };

    const settings = {
        //   dots: true,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
    };
    
    const navigate = useNavigate();

    const abc=()=>
    {
        navigate("/contact")
    }
    return (
        <>
            <section className="homesection">
                <button onClick={abc}>start</button>
                <div className="container">
                    <div className='home'>
                        <div className='row'>
                            <div className="col-sm-2">
                                <img src={homeimg} alt="homeimg" className='homeimg' />
                            </div>
                            <div className="col-sm-10">
                                <div className='homefont'>
                                    <h4>Mange your waste efficiently,
                                        smoothly and at the best price, for your business and theenvironment</h4>
                                </div>
                                <p className='home-p-font' style={{
                                    Color: "rgb(173, 173, 173)",
                                    maxWidth: "46%",
                                    marginBottom: "27px"
                                }}>Waste Accountant measures and monitors waste from generation to endpoint.</p>
                                <button type="button" className="btn" id="tellmemore">Tell me more</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Treansforming the wast industre section */}

            <section className="page-section" id="transforming_section">
                <div className="container p-5">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="transfo">
                                <h5 className="text-center">Transforming the waste industry for<br />waste producers and receivers</h5>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="row p-5">
                        <div className="col-md-5">
                            <h5 className=" transfotext1 for-waste">FOR WASTE <br />
                                <b>PRODUCERS</b>
                            </h5>
                            <p className="transfotextdes1">
                                Waste Accountant helps you select
                                the  right supplier for your waste
                                stream,  budget and location. And
                                reduced your overall carbon cost,
                                carbon cost</p>
                        </div>
                        <div className="col-md-2 stretch-line">
                            {/* <img src={homeimg} width="60px" class="strech" /> */}
                            <img src={homeimg} width="60px" className="strech" alt="strech" />
                        </div>
                        <div className="col-md-5 ">
                            <h5 className="transfotext2 for-waste ">FOR WASTE <br />
                                <b>RECEIVERS</b>
                            </h5>
                            <p className="transfotextdes2">Once registered, clients will be able
                                to  fi nd pay you directly through
                                Waste  Accountant. And this helps
                                you always get  paid promptly.</p>
                            <br />
                        </div>
                    </div>
                </div>
            </section>

            {/* qutesection */}
            <section className="qute-sec" id="testimonial_section">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="sec-3-text">
                                <img src={quoteimage1} className="quoteimage1" alt="quoteimage1" />
                            </div>
                            <div className="sec-3-text2">
                                <p className="text-light">By regaining control of our waste streams, May
                                    Gurney has started to change the perception of
                                    'waste' into resource  <br />
                                <span className="text-secondary" style={{ fontSize: "small" }}>Innovations Manager, May Gurney</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* medal section */}
            <OurProducts />


            {/* why chose wasted account section */}
            <section className="why_choose_section">
                <div className="container p-5">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="transfo">
                                <h5 className="text-center">Why Choose Waste Accountant</h5>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container type-2 " >
                    <div className="row">
                        <div className="col col-md-6 col-sm-6 col-xs-3">
                            <h5 className=" text-end for-waste">   SIMPLE PAYMENTS

                            </h5>
                            <p className="text-end" style={{ marginTop: "25px" }}>
                                Pay your entire supply chain and your
                                <br />
                                data will sync to your accounts system.</p>
                        </div>
                        <div className="col col-md-6 col-sm-6 col-xs-3">
                            <h5 className="for-waste">ONE SET OF DATA</h5>
                            <p className="text-start" style={{ marginTop: "25px" }}>Collate all your compliance data in once
                                <br />
                                place and use it in any way you choose</p>
                        </div>
                        <div className="col col-md-6 col-sm-6 col-xs-3">
                            <h5 className="text-end for-waste"> CHOOSE YOUR BROKER
                            </h5>
                            <p className="text-end" style={{ marginTop: "25px" }}>
                                Find the right supplier, in the right place at <br /> the right price.</p>
                        </div>
                        <div className="col col-md-6 col-sm-6 col-xs-3">
                            <h5 className="for-waste">TAKE CONTROL</h5>
                            <p className="text-start" style={{ marginTop: "25px" }}>
                                Use our managed service or learn how to <br />control your waste efficiently in house.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* slider section */}

            <section className="why-section" id="logo_section">
                <section className="why-section" id="logo_section">
                    <div className="container" onClick={handlePlayPause}>
                        <div className="sliderconatainer">
                            <h2 className="font-weight-light slider-heading text-center">Who uses Waste Accountant ?</h2>
                            <div className="slider-container">
                                {isPlaying ? '' : ''}
                                <div onClick={handleContainerClick}>
                                    <Slider ref={(slider) => setSliderRef(slider)} {...settings}>
                                        <div><img src={sliderilmg1} className="sliderimages" alt="Logo 1" /></div>
                                        <div><img src={sliderilmg2} className="sliderimages" alt="Logo 2" /></div>
                                        <div><img src={sliderilmg3} className="sliderimages" alt="Logo 3" /></div>
                                    </Slider>
                                </div>
                                <button type="submit" onClick={() => navigate("/OurProducts")} className="btn w-auto blue-btn-Find-out-More">Find out More</button>
                            </div>
                        </div>
                    </div>
                </section>
            </section>

            {/* qutesection2 */}
            <section className="qute-sec" id="testimonial_section">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="sec-3-text">
                                <img src={quoteimage1} className="quoteimage1" alt="quoteimage1" />
                            </div>
                            <div className="sec-3-text2">
                                <p className="text-light"> Waste Accountant has signifi cantly improved EAE
                                    use of Site Waste Management Plan  <br />
                                <span className="text-secondary" style={{ fontSize: "x-small" }}>Environmental Manager,Electricity Alliance East</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* section tell more  */}
            <section className='tellmemore'>
                <div className='container'>

                    <h4 className='tellmemoretitle'>Find out how to simplify your
                        waste and improve environmental
                        protections</h4>

                    <div className="row">
                        <div className="col-12">
                            <button type="submit" className="btn w-auto sky-blue-btn-tellmemore">Tell me more</button>
                        </div>
                    </div>
                </div>
            </section>
            {/* section About  */}
            <About />
            {/* section image  */}
            <section className="imagesection" id="parallaximagesection">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12 p-0">
                            <div className="parallax-img">
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* lets talk section */}
            <Contact />

        </>
    );
};

export default Home;


