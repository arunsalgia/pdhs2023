import React, { useState, useContext, useEffect } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import axios from "axios";
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";

import globalStyles from "assets/globalStyles";

import { isMobile, encrypt, getMemberName} from "views/functions.js"
import {setTab} from "CustomComponents/CricDreamTabs.js"
import { VsLogo, ValidComp } from 'CustomComponents/CustomComponents.js'; 

import VsButton from "CustomComponents/VsButton";


export default function LandingPage() {
  const gClasses = globalStyles();

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
  
  return (
	<div style={{backgroundColor: '#FFFFFF'}} >
  <br />
  <br />
  <Grid  key="LandingPage" container align="center">
		<Grid item xs={6} sm={6} md={6} lg={6} align="center" >	
      <br />
      <br />
      <br />
      <Typography component="h1" variant="h5" align="center">Pratapgarh Rajasthan Welfare Samiti</Typography>
      <br />
      <br />
      <VsButton name="Get Started" onClick={handleGetStarted} />
    </Grid>
		<Grid item xs={6} sm={6} md={6} lg={6} >	
      <img src={`${process.env.PUBLIC_URL}/image/LANDINGPAGE.JPG`} />
    </Grid>
  </Grid>
	</div>
  );
}
