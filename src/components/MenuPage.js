import { useLocation, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Authapi from '../Authapi';
import righticon from './img/righticon.png';
import plushicon from './img/plush.png';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import ls from 'local-storage';
const MenuPage = () => {
    const location = useLocation();
    const { menuName } = useParams();
    const [currentMenu, setCurrentMenu] = useState('');
    const [topbardata, setTopbardata] = useState([]);
    const [status, setStatus] = useState([]);
    const [titles, setTitles] = useState([]);
    const [description, setDescription] = useState([]);
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    const cardTextStyle = {
        display: 'flex',
        alignItems: 'center',
        margin: '0',
        fontSize: "medium",
    };

    const cardTextImageStyle = {
        marginRight: '10px',
    };

    // console.log(status);

    useEffect(() => {
        const menuTitle = location.state?.menuName ||
            menuName.split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');

        setCurrentMenu(menuTitle);
    }, [location, menuName]);

    useEffect(() => {
        fetchData();
    }, [currentMenu]);

    const fetchData = async () => {
        try {
            const response = await Authapi.dynamicpageget(currentMenu);
            // console.log(response)
            if (response.status === true) {
                // ls()
                setTopbardata(response.post_store || []);
                setStatus(response.page);

                const dynamicTitles = response.post_store.flatMap(post =>
                    Object.keys(post.data)
                        .filter(key => key.startsWith('title'))
                        .map(key => post.data[key])
                );

                setTitles(dynamicTitles);

                const dynamicDescriptions = response.post_store.flatMap(post =>
                    Object.keys(post.data)
                        .filter(key => key.startsWith('description'))
                        .map(key => post.data[key])
                );

                setDescription(dynamicDescriptions);
            } else {
                console.error('Invalid response structure:', response);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleInputChange = (event, index) => {
        const { value } = event.target;
        const newErrors = { ...errors };

        if (value) {
            newErrors[`label${index}`] = "";
        }

        setErrors(newErrors);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const newErrors = {};
        const formData = {};

        topbardata.forEach((item, index) => {
            const value = document.querySelector(`[name="field${index}"]`).value;
            formData[`field${index}`] = value;

            if (!value) {
                newErrors[`label${index}`] = "This field is required";
            } else {
                newErrors[`label${index}`] = "";
            }
        });

        if (Object.values(newErrors).some(error => error)) {
            setErrors(newErrors);
            // console.log(newErrors);
        } else {
            try {
                const response = await Authapi.contactdatapost(formData);
                if (response && response.status === true) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'Form submitted successfully!',
                        background: '#f8f9fa',
                        showConfirmButton: true,
                        confirmButtonText: 'OK'
                    }).then(() => {
                        const form = document.getElementById('contactForm');
                        if (form) {
                            form.reset();
                        }
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Failed to submit form. Please try again!',
                        background: '#f8f9fa',
                        showConfirmButton: true,
                        confirmButtonText: 'OK'
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'An error occurred while submitting the form.',
                    background: '#f8f9fa',
                    showConfirmButton: true,
                    confirmButtonText: 'OK'
                });
            }
        }
    };

    return (
        <>
            {currentMenu === 'About Us' && status.page_status === 1 && topbardata.length > 0 ? (
                <section className="page-section" id="package_section">
                    <div className="container type-1">
                        <div className="row">
                            <div className="col-12">
                                <div className="sec-8-heading">
                                    <h1 className="text-center mb-4" id='About-us'>{currentMenu}</h1>
                                </div>
                            </div>
                        </div>

                        <div className="row" style={{ marginBottom: "6%" }}>
                            <div className="col-md-3">
                                <div className="content-box">
                                    {titles.map((title, index) => (
                                        <div key={index}>
                                            <h5 className="title-sm">{title}</h5>
                                            <p></p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="col-md-9">
                                <div className="content-box">
                                    {Array.isArray(description) ? (
                                        description.map((descItem, index) => (
                                            <p key={index}>{descItem}</p>
                                        ))
                                    ) : (
                                        <p>{description}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            ) : currentMenu === 'About Us' && status.page_status === 0 ? (
                <div className="text-center"> 404 Page Not Found</div>
            ) : null}

            {currentMenu === 'Our Products' && status.page_status === 1 && topbardata.length > 0 ? (
                <section className="packages-sec" id="package_section">
                    <div className="container mt-2 mb-5">
                        <div className="row">
                            <div className="col-12 waste-management-service-title ">
                                <h4>{status.page_description}</h4>
                            </div>
                        </div>
                        <div className="row mt-5">
                            {topbardata.map((card, index) => {
                                const hasContent = card.data.title1 || card.data.cardtext1 || card.data.cardtext2 || card.data.cardtext3 || card.data.cardtext4 || card.data.cardtext5 || card.data.cardtextlight1 || card.data.montlyfeetext || card.data.montlyfeecardtext1 || card.data.montlyfeecardtext2;

                                if (!hasContent) return null;

                                return (
                                    <div className={`col-lg-4`} id={`card${index + 1}`} key={card.id}>
                                        <div className={`card-liner-card-${index + 1}`} id='card-liner-card'></div>
                                        <div className={`card${index + 1} card `}>
                                            {card.data.title1 && <span className='medaltype'>{card.data.title1}</span>}
                                            <div className={`card${index + 1}-text`}>
                                                {[card.data.cardtext1, card.data.cardtext2, card.data.cardtext3, card.data.cardtext4, card.data.cardtext5].map((text, i) => (
                                                    text && (
                                                        <p style={cardTextStyle} key={i} className='cardtext'>
                                                            <img src={righticon} className={`card${index + 1}righticon`} alt={`Icon ${i + 1}`} style={cardTextImageStyle} />
                                                            {text}
                                                        </p>
                                                    )
                                                ))}
                                                {card.data.cardtext1 || card.data.cardtext2 || card.data.cardtext3 || card.data.cardtext4 || card.data.cardtext5 ? <div className="card-liner-inside"></div> : null}
                                            </div>
                                            <div className={`card${index + 1}-sec-2-text`}>
                                                {card.data.cardtextlight1 && (
                                                    <p style={cardTextStyle}>
                                                        <img src={plushicon} className={`card${index + 1}plushicon`} alt="Add On Icon" style={cardTextImageStyle} />
                                                        {card.data.cardtextlight1}
                                                    </p>
                                                )}
                                                {card.data.cardtextlight1 ? <div className="card-liner-inside-2"></div> : null}
                                                <div className={`card-${index + 1}-sec-3`}>
                                                    {card.data.montlyfeetext && <p className={`card${index + 1}-sec-3-text1`}>{card.data.montlyfeetext}</p>}
                                                    {[card.data.montlyfeecardtext1, card.data.montlyfeecardtext2].map((text, i) => (
                                                        text && (
                                                            <p className={`card${index + 1}-sec-3-text`} key={i}>
                                                                <img src={plushicon} className={`card${index + 1}plushicon`} alt={`Icon ${i + 1}`} style={cardTextImageStyle} />
                                                                {text}
                                                            </p>
                                                        )
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {/* {console.log(ls("data").about_us)}s */}
                        {ls("data").about_us.page_status === 1 && (
                            <div className="row">
                                <div className="col-12 mt-5">
                                    <button type="button" onClick={() => navigate("/menu/contact-us")} className="btn sky-blue-btn">Contact Us</button>
                                </div>
                            </div>
                        )}

                    </div>
                </section >
            ) : currentMenu === 'Our Products' && status.page_status === 0 ? (
                <div className="text-center"> 404 Page Not Found</div>
            ) : null}

            {
                currentMenu === 'Contact Us' && status.page_status === 1 && topbardata.length > 0 ? (
                    <section className="lets-talk-sec" id="package_section">
                        <div className="container" id="sec-10">
                            <div className="row">
                                <div className="col-12">
                                    <div className="sec-8-heading">
                                        <h1 className="text-center mb-4">{currentMenu}</h1>
                                    </div>
                                </div>
                            </div>
                            <div className='contactusswction'>
                                <form id="contactForm">
                                    <div className='row'>
                                        {topbardata.map((item, index) => (
                                            <div className='col-12' key={index}>
                                                <h4 className="letstallktitle">{item.data.title}</h4>
                                                <div className="inputgroup">
                                                    {item.data.description}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="row">
                                        {topbardata.map((item, index) => (
                                            <div className='col-md-6' key={index}>
                                                <div className="inputgroup">
                                                    <label>{item.data.label}</label>
                                                    {item.data.label === "Tell us what you need" ? (
                                                        <textarea
                                                            className='form-control'
                                                            name={`field${index}`}
                                                            rows="4"
                                                            onChange={(e) => handleInputChange(e, index)}
                                                        />
                                                    ) : (
                                                        <input
                                                            className='form-control'
                                                            name={`field${index}`}
                                                            type={item.data.type}
                                                            onChange={(e) => handleInputChange(e, index)}
                                                        />
                                                    )}
                                                    {errors[`label${index}`] && <span style={{ color: 'red' }}>{errors[`label${index}`]}</span>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="row mt-3">
                                        <div className="col-12">
                                            <button type="submit" onClick={handleSubmit} className="btn w-auto sky-blue-btn-sendmeasge">Send my message</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </section>
                ) : currentMenu === 'Contact Us' && status.page_status === 0 ? (
                    <div className="text-center"> 404 Page Not Found</div>
                ) : null
            }
        </>
    );
};

export default MenuPage;
