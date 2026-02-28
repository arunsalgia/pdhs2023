import React, { useState, useContext, useEffect } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import axios from "axios";
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";

import globalStyles from "assets/globalStyles";

import { isMobile, encrypt, getMemberName, getWindowDimensions} from "views/functions.js"
import {setTab} from "CustomComponents/CricDreamTabs.js"
import { VsLogo, ValidComp } from 'CustomComponents/CustomComponents.js'; 

import VsButton from "CustomComponents/VsButton";

var maxDim = 0;

export default function LandingPage() {
  const gClasses = globalStyles();
	const	myDim = getWindowDimensions();
	console.log(myDim);
  maxDim = (myDim.width < myDim.height) ? myDim.width : myDim.height;
	console.log(maxDim);
	
  useEffect(() => {
    if (window.sessionStorage.getItem("logout")) {
      sessionStorage.clear();
    }
    if (window.sessionStorage.getItem("uid")) {
      // setUser({ uid: window.localStorage.getItem("uid"), admin: window.localStorage.getItem("admin") })
      // history.push("/admin")
    } else {
      // setShowPage(true)
    }
  });

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
  
	if (maxDim === 0) return;
	//var imgStyle = { max-width: "400px", max-height: "400px" };
	//var imgSizes = `(max-width: ${maxDim}) ${maxDim}, (max-width: ${maxDim}) ${maxDim}`;
	//console.log(imgSizes);
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
}
