import React, { useState, useContext, useEffect } from 'react';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
// import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";

//import { makeStyles } from '@material-ui/core/styles';
import globalStyles from "assets/globalStyles";
import Container from '@material-ui/core/Container';

//import { useHistory } from "react-router-dom";
//import { UserContext } from "../../UserContext";
import axios from "axios";
//import { DesktopWindows } from '@material-ui/icons';

import {setTab, setDisplayPage } from "CustomComponents/CricDreamTabs.js"
import { VsLogo, ValidComp } from 'CustomComponents/CustomComponents.js'; 

import VsButton from "CustomComponents/VsButton";
import VsRadio from "CustomComponents/VsRadio";

import {
	isMobile, encrypt, getMemberName, capitalizeFirstLetter,
} from "views/functions";


import {
	PAGELIST,
} from "views/globals.js";

import lodashCloneDeep from 'lodash/cloneDeep';
import lodashUniqBy from "lodash/uniqBy";
import lodashMap from "lodash/map";


import {
	readAllMembers,
} from "views/clientdbfunctions";


//let deviceIsMobile=isMobile();

const LOGINOPTION = {
		mobile:		"Mobile",
		email:		"Email"
};

export default function SignIn() {
  const gClasses = globalStyles();

	const [loginMode, setLoginMode] = useState(LOGINOPTION.mobile);
  const [userMobile, setUserMobile] = useState("");
  const [userEmail, setUserEmail] = useState("");
	const [whereCaptcha, setWhereCaptcha] = useState("");
	
  const [password, setPassword] = useState("");
  const [stage, setStage] = useState("MOBILE");
  const [ errorMessage, setErrorMessage ] = useState({msg: "", isError: false });

	async function getMemberList() {
		await readAllMembers();
	}
	
  useEffect(() => {
		async function getData() {
			getMemberList();
			console.log("Got it");			
		}
		
		if (process.env.REACT_APP_PRWS_DB === "true") {
			getData();
		}
    if (window.localStorage.getItem("logout")) {
      localStorage.clear();
    }
    if (window.localStorage.getItem("uid")) {
      // setUser({ uid: window.localStorage.getItem("uid"), admin: window.localStorage.getItem("admin") })
      // history.push("/admin")
    } else {
      // setShowPage(true)
    }
  }, []);

  function setError(msg, isError) {
    setErrorMessage({msg: msg, isError: isError});
  }


	async function handleSubmitCapta(e) {
  e.preventDefault();

	try { 
		var myData = {
			isMobile:  (loginMode === LOGINOPTION.mobile),
			userName:	 encrypt((loginMode === LOGINOPTION.mobile) ? userMobile : userEmail),
			password:	 password
		};
		myData = encodeURIComponent(JSON.stringify(myData));
		//let enPassword = password;			//encrypt(password);
		//let response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/user/padmavatimata/${userMobile}/${enPassword}`); 
		let response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/user/padmavatimata/${myData}`); 
		setError("", false);
		let userData = response.data.user;
		if (userData) {
			window.sessionStorage.setItem("hid", userData.hid)
			window.sessionStorage.setItem("mid", userData.mid)
			window.sessionStorage.setItem("memberRec", JSON.stringify(userData));
			window.sessionStorage.setItem("userMobile", getMemberName(userData, false, false));
			window.sessionStorage.setItem("firstName", userData.firstName );	
		}
		else {
			window.sessionStorage.setItem("hid", "0")
			window.sessionStorage.setItem("mid", "0")
			window.sessionStorage.setItem("memberRec", "{}");
			window.sessionStorage.setItem("userMobile", "Guest");
			window.sessionStorage.setItem("firstName","Guest");				
		}
		window.sessionStorage.setItem("prwsLogin", response.data.userName);
		window.sessionStorage.setItem("isMember", response.data.isMember);
		if (response.data.admin)
			window.sessionStorage.setItem("adminRec", JSON.stringify(response.data.admin));
		else
			window.sessionStorage.setItem("adminRec", "");

		setTab(process.env.REACT_APP_DASH);
	} catch (err) {
		setError("Invalid Captcha", true);
	}
};


async function handleSubmitMobile(e) {
	console.log(userMobile, userEmail);
  e.preventDefault();
	var myData = {
		isMobile:  (loginMode === LOGINOPTION.mobile),
		userName:	 encrypt((loginMode === LOGINOPTION.mobile) ? userMobile : userEmail)
	};
  myData = encodeURIComponent(JSON.stringify(myData));
	try { 
		let response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/user/jaijinendra/${myData}`); 
		setError("", false);
		setWhereCaptcha(response.data.msg);
    setPassword("");
    setStage("CAPTCHA");
  } catch (err) {
		setError("Error generating captcha", true);
	}
};


  return (
	<div style={{backgroundColor: '#FFFFFF'}} >
	<Container align="center" component="main" maxWidth="xs">
	<CssBaseline />
	<br />
	<div align="center">
	<VsLogo />
	</div>
  <Typography component="h1" variant="h5" align="center">Sign in</Typography>
  <br />
  {(stage === "MOBILE") &&
  	<ValidatorForm align="center" className={gClasses.form} onSubmit={handleSubmitMobile}>
		<Grid className={gClasses.noPadding} key="LOGINOPTION" container align="center">
		<Grid item xs={4} sm={4} md={4} lg={4} >
			<Typography style={{marginTop: "10px"  }} className={gClasses.title}>Sign In using</Typography>
		</Grid>
		<Grid item xs={4} sm={4} md={4} lg={4} >
			<VsRadio align="center" label={LOGINOPTION.mobile} checked={loginMode === LOGINOPTION.mobile} onClick={() => setLoginMode(LOGINOPTION.mobile) } />
		</Grid>
		<Grid item xs={4} sm={4} md={4} lg={4} >
			<VsRadio align="center" label={LOGINOPTION.email} checked={loginMode === LOGINOPTION.email} onClick={() => setLoginMode(LOGINOPTION.email) } />
		</Grid>
		</Grid>	
		<br />
		{(loginMode === LOGINOPTION.mobile) &&
    <TextValidator fullWidth  variant="outlined" required className={gClasses.vgSpacing}
      label="Mobile" type="text"
      value={userMobile} 
      onChange={(event) => { setUserMobile(event.target.value) }}
      validators={['minNumber:1000000000', 'maxNumber:9999999999']}
      errorMessages={['Only Indian mobile number supported', 'Only Indian mobile number supported']}
    />
		}
		{(loginMode !== LOGINOPTION.mobile) &&
    <TextValidator fullWidth  variant="outlined" required className={gClasses.vgSpacing}
      label="Email" type="email"
      value={userEmail} 
      onChange={(event) => { setUserEmail(event.target.value) }}
    />
		}
		<Grid className={gClasses.noPadding} key="SUBMITMOBILE" container align="center">
		<Grid item xs={2} sm={2} md={4} lg={4} />	
		<Grid item xs={8} sm={8} md={4} lg={4} >	
      <br />
			<VsButton type="submit" name="Continue" />
		</Grid>
		<Grid item xs={2} sm={2} md={4} lg={4} />	
		</Grid>	
    </ValidatorForm>	
  }
  {(stage === "CAPTCHA") &&
    <ValidatorForm align="center" className={gClasses.form} onSubmit={handleSubmitCapta}>
    <Typography align="left" className={gClasses.message16Blue}>{whereCaptcha}</Typography>
    <TextValidator fullWidth  variant="outlined" required className={gClasses.vgSpacing}
      label="OTP" type="text"
      value={password} 
      onChange={(event) => { setPassword(event.target.value) }}
      validators={['noSpecialCharacters']}
      errorMessages={['Special characters not permitted']}
    />
    <Typography className={(errorMessage.isError) ? gClasses.error : gClasses.nonerror} align="left">{errorMessage.msg}</Typography>
    <ValidComp />
    <br />
		<Grid className={gClasses.noPadding} key="SUBMITCAPTCHA" container align="center" alignItems="center">
		<Grid item xs={5} sm={5} md={5} lg={5} >	
    <VsButton type="submit" name="Login" />
		</Grid>
		<Grid item xs={2} sm={2} md={2} lg={2} />
		<Grid item xs={5} sm={5} md={5} lg={5} >	
    <VsButton name="Back" onClick={() => setStage("MOBILE") } />
		</Grid>
		</Grid>	
		<ValidComp />
    </ValidatorForm>	
  }
  </Container>
	</div>
  );
}
