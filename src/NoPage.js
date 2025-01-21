import { useEffect, useState } from 'react';
import Authapi from './Authapi';


const NoPage = () => {
  const [topbardata, setTopbardata] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);


  const fetchData = async () => {
    try {
      const response = await Authapi.notfoundpageget();
      // console.log(response.status === true);
      if (response.status === true) {
        // console.log("Test");
        // console.log(response.page.image);
        // console.log(response.page.image);
        // setTopbardata(response.post_store[0].data);
        setTopbardata(response.page.image);
      } else {
        console.error('Invalid response structure:', response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{
      textAlign: "center",
      margin: "22px auto",
      marginBottom: "76px",
      maxWidth: "600px",
      padding: "20px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      borderRadius: "8px",
      backgroundColor: "#f9f9f9"
    }}>
      {/* <h1 style={{ margin: "20px 0 10px" }}>{topbardata.statuscode}</h1>
      <h1 style={{ margin: "10px 0" }}>{topbardata.statusmessage}</h1> */}
      {/* {console.log(topbardata)} */}
      <img
        src={topbardata}
        alt="No Page"
        style={{
          width: '100%',
          height: 'auto',
          borderRadius: "8px"
        }}
      />
    </div>
  );
};

export default NoPage;