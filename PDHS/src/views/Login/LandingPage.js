import React, { useState, useContext, useEffect } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import axios from "axios";
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";
import Box from '@material-ui/core/Box';

import globalStyles from "assets/globalStyles";

//import './ImageGrid.css'; // Import the CSS file

import { isMobile, encrypt, getMemberName, getWindowDimensions} from "views/functions.js"
import {setTab} from "CustomComponents/CricDreamTabs.js"
import { VsLogo, ValidComp } from 'CustomComponents/CustomComponents.js'; 

import VsButton from "CustomComponents/VsButton";

var maxDim = 0;
var maxHeight = 0;
var maxWidth = 0;
var mobileDim = 6;
const ButtonHeight=5;
var butStyle_junk={
      display: 'flex',           // Enable Flexbox
      justifyContent: 'center',  // Center horizontally
      //alignItems: 'center',      // Center vertically
      height: '100vh',           // Set container height to full viewport height
      width: '100vw'             // Ensure full viewport width
    };
    
var butStyle={
      justifyContent: 'center',  // Center horizontally
      height: '10vh',           // Set container height to full viewport height
      width: '100vw'             // Ensure full viewport width
    };
    
    
    
export default function LandingPage() {
   const gClasses = globalStyles();
	const	myDim = getWindowDimensions();

   const [advert, setAdvert] = useState({});
   const [jobDone, setJobDone] = useState(false);
   const [showButton, setShowButton] = useState(false);
   
   
  useEffect(() => {
    async function getInfo() {
       try {
          let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/user/getadvert`;
          console.log(myUrl);
          let response = await axios.get(myUrl); 
          setAdvert(response.data);            
          console.log(response.data);
          
         //console.log(myDim);
         butStyle.height = myDim.height;
         butStyle.width = myDim.width; 
         maxDim = (myDim.width < myDim.height) ? myDim.width : myDim.height;
         console.log(maxDim);
         //butStyle = { position: 'absolute', top: (myDim.height/2-10), left: (myDim.width/2-20) };
         butStyle = { position: 'absolute', top: 20, left: (myDim.width/2-50) };
         maxWidth = ((myDim.width > myDim.height) ? myDim.width/2 : myDim.width) - ButtonHeight;
         maxHeight = ((myDim.width > myDim.height) ? myDim.height/2 : myDim.height/4) - ButtonHeight;
         mobileDim = (myDim.width > myDim.height) ? 6 : 12;
         console.log(maxWidth, maxHeight, mobileDim);
         console.log(butStyle); 
         setJobDone(true);
         const timerId = setTimeout(() => {
            myFunction();
         }, response.data.delay);
       }
       catch (e) {
          console.log("Error");
       }
       
    }    
    getInfo();
  }, []);

   function myFunction() {
      setShowButton(true);
     console.log('Delayed action executed after 3 seconds');
   }

  function setError(msg, isError) {
    setErrorMessage({msg: msg, isError: isError});
  }


	async function handleSubmit(e) {
  e.preventDefault();

	try { 
		let enPassword = password;			//encrypt(password);
		let response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/user/padmavatimata/${userName}/${enPassword}`); 
		setError("", false);
		let userData = response.data.user;
    console.log(userData);
		window.sessionStorage.setItem("hid", userData.hid)
		window.sessionStorage.setItem("mid", userData.mid)
		window.sessionStorage.setItem("memberRec", JSON.stringify(userData));
		window.sessionStorage.setItem("adminRec", JSON.stringify(response.data.admin));
    window.sessionStorage.setItem("userName", getMemberName(userData));

		setTab(process.env.REACT_APP_HOME);
	} catch (err) {
		setError("Invalid Captcha", true);
	}
};


   async function handleSubmitMobile(e) {
  e.preventDefault();
	try { 
		let response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/user/jaijinendra/${userName}`); 
		setError("", false);
    setPassword("");
    setStage("CAPTCHA");
  } catch (err) {
		setError("Error generating captcha", true);
	}
};

  function handleGetStarted() {
    sessionStorage.setItem("prwsLogin", "LOGIN");
    setTab(0);
  }
  
	//if (maxDim === 0) return;
	//var imgStyle = { max-width: "400px", max-height: "400px" };
	//var imgSizes = `(max-width: ${maxDim}) ${maxDim}, (max-width: ${maxDim}) ${maxDim}`;
	//console.log(imgSizes);
  /*
  return (
	<div style={{backgroundColor: '#FFFFFF'}} >
		<br />
	{(myDim.width > myDim.height) &&
		<div>
		<br />
		</div>
	}
  <Grid  key="LandingPage" container align="center">
		<Grid item xs={12} sm={12} md={6} lg={6} >	
      <img width={maxDim} height={maxDim} src={`${process.env.PUBLIC_URL}/image/LANDINGPAGE.JPG`} />
    </Grid>
		<Grid item xs={12} sm={12} md={6} lg={6} align="center" >	
		{(myDim.width > myDim.height) &&
		 <div>
     <br />
		 <br />
		 </div>
		}
      <br />
      <Typography component="h1" variant="h5" align="center">Pratapgarh Rajasthan Welfare Samiti</Typography>
      <br />
      <VsButton name="Get Started" onClick={handleGetStarted} />
		{(myDim.width > myDim.height) &&
			<div>
			<br />
      <br />
			<br />
			</div>
		}
      <br />
			
    </Grid>
  </Grid>
	</div>
  );
  */
  if (!jobDone) return null;
  

  return (
	<div>
   <Grid  key="LandingPage" container align="center">
		<Grid item xs={mobileDim} sm={mobileDim} md={6} lg={6} >	
      <img bordercolor="orange" borderradius={7} border={1} width={maxWidth-5} height={maxHeight-5} src={`${process.env.PUBLIC_URL}/image/${advert.topLeft}`} />
      </Grid>
		<Grid item xs={mobileDim} sm={mobileDim} md={6} lg={6} >	
      <img bordercolor="orange" borderradius={7} border={1} width={maxWidth-5} height={maxHeight-5} src={`${process.env.PUBLIC_URL}/image/${advert.topRight}`} />
      </Grid>
		<Grid item xs={mobileDim} sm={mobileDim} md={6} lg={6} >	
      <img bordercolor="orange" borderradius={7} border={1} width={maxWidth-5} height={maxHeight} src={`${process.env.PUBLIC_URL}/image/${advert.bottomRight}`} />
      </Grid>
		<Grid item xs={mobileDim} sm={mobileDim} md={6} lg={6} >	
      <img bordercolor="orange" borderradius={7} border={1}width={maxWidth-5} height={maxHeight-5} src={`${process.env.PUBLIC_URL}/image/${advert.bottomRight}`} />
      </Grid>
   </Grid>
   {(showButton) &&
   <div style={butStyle} >
       <VsButton name="Get Started" onClick={handleGetStarted} />
   </div>
   }
   </div>

   );

  
}
