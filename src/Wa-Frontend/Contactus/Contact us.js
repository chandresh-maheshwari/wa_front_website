const Contact = () => {

    return (
        <>
            {/* lets talk section */}
            <section className="lets-talk-sec" id="package_section">
                <div className="container" id="sec-10">
                    <div className="row ">
                        <div className="col-12">
                            <div>
                                <h4 className="letstallktitle"><b>Let’s talk</b></h4>
                                <p>Tell us what you need and let's start your journey to simplifying your waste.</p>
                            </div>
                        </div>
                    </div>
                    <form action="">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="inputgroup">
                                    <label for="">Name</label>
                                    <input type="text"  className="form-control" name="name" id="name" />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="inputgroup">
                                    <label for="">Email</label>
                                    <input type="email" className="form-control"name="email" id="email" />
                                </div>
                            </div>
                            <div className="col-md-8">
                                <div className="inputgroup">
                                    <label for="">Tell us what you need</label>
                                    <textarea name="address"  className="form-control"cols="30" rows="5"></textarea>
                                </div>
                            </div>
                        </div>
                    </form>
                    <div className="row mt-3 ">
                        <div className="col-12">
                            <button type="submit" className="btn w-auto sky-blue-btn-sendmeasge">Send my message</button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};


export default Contact;