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
import { isMobile, encrypt, getMemberName} from "views/functions.js"
import {setTab} from "CustomComponents/CricDreamTabs.js"
import { VsLogo, ValidComp } from 'CustomComponents/CustomComponents.js'; 


//let deviceIsMobile=isMobile();

export default function SignIn() {
  const gClasses = globalStyles();

  const [userName, setUserName] = useState();
  const [password, setPassword] = useState();
  const [stage, setStage] = useState("MOBILE");
  const [ errorMessage, setErrorMessage ] = useState({msg: "", isError: false });


  useEffect(() => {
    if (window.localStorage.getItem("logout")) {
      localStorage.clear();
    }
    if (window.localStorage.getItem("uid")) {
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
    <Typography className={gClasses.title}>Enter your registered mobile number</Typography>
    <TextValidator fullWidth  variant="outlined" required className={gClasses.vgSpacing}
      label="Mobile" type="text"
      value={userName} 
      onChange={(event) => { setUserName(event.target.value) }}
      validators={['minNumber:1000000000', 'maxNumber:9999999999']}
      errorMessages={['Invalid mobile number', 'Invalid mobile number']}
    />
		<Grid className={gClasses.noPadding} key="SUBMITMOBILE" container align="center">
		<Grid item xs={2} sm={2} md={4} lg={4} />	
		<Grid item xs={8} sm={8} md={4} lg={4} >	
			<Button type="submit" fullWidth variant="contained" color="primary">Continue</Button>
		</Grid>
		<Grid item xs={2} sm={2} md={4} lg={4} />	
		</Grid>	
    </ValidatorForm>	
  }
  {(stage === "CAPTCHA") &&
    <ValidatorForm align="center" className={gClasses.form} onSubmit={handleSubmit}>
    <Typography className={gClasses.title}>Enter captcha sent on {userName}</Typography>
    <TextValidator fullWidth  variant="outlined" required className={gClasses.vgSpacing}
      label="Captcha" type="text"
      value={password} 
      onChange={(event) => { setPassword(event.target.value) }}
      validators={['noSpecialCharacters']}
      errorMessages={['Special characters not permitted']}
    />
    <Typography className={(errorMessage.isError) ? gClasses.error : gClasses.nonerror} align="left">{errorMessage.msg}</Typography>
    <ValidComp />
		<Grid className={gClasses.noPadding} key="SUBMITCAPTCHA" container align="center" alignItems="center">
		<Grid item xs={5} sm={5} md={5} lg={5} >	
    <Button className={gClasses.vgSpacing} type="submit" fullWidth variant="contained" color="primary">Login</Button>
		</Grid>
		<Grid item xs={2} sm={2} md={2} lg={2} />
		<Grid item xs={5} sm={5} md={5} lg={5} >	
    <Button className={gClasses.vgSpacing} fullWidth variant="contained" color="primary" onClick={() => setStage("MOBILE")}>Back</Button>
		</Grid>
		</Grid>	
    </ValidatorForm>	
  }
  </Container>
	</div>
  );
}
