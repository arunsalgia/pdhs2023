import React, { useState, useMemo } from "react";
//import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { Router, Route, Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { createBrowserHistory } from "history";
import { UserContext } from "./UserContext"; 
//import Admin from "layouts/Admin.js";
import "assets/css/material-dashboard-react.css?v=1.9.0";
// import { DesktopWindows } from "@material-ui/icons";
import { CricDreamTabs, setTab } from "CustomComponents/CricDreamTabs"

import SignIn from "views/Login/SignIn"
import LandingPage from "views/Login/LandingPage"
import Directory from "views/Directory/Directory"

import IdleTimer from 'react-idle-timer'

import { PinDropSharp } from "@material-ui/icons";

import {
	readAllMembers,
} from "views/clientdbfunctions";

//import firebase from 'firebase';
//import arunfb from 'firebase';

//const arunfb = require('firebase/app').default
//import messaging from 'firebase/messaging';

import { 
setIdle, isUserLogged,
isMobile, cdRefresh, specialSetPos, 
encrypt, 
clearBackupData, downloadApk 
} from "views/functions.js"

const hist = createBrowserHistory();


function initCdParams() {
  let ipos = 0;
  if ((localStorage.getItem("tabpos") !== null) &&
  (localStorage.getItem("tabpos") !== "") ) {
    ipos = parseInt(localStorage.getItem("tabpos"));
    if (ipos >= process.env.REACT_APP_BASEPOS) localStorage.setItem("tabpos", ipos-process.env.REACT_APP_BASEPOS);
  } else
    localStorage.setItem("tabpos", 0);
  console.log(`ipos: ${ipos}   Tabpos ${localStorage.getItem("tabpos")}`)
}



function checkSessionRequest() {
	let resetLink = false;
	let x = location.pathname.split("/");
  console.log("Path is");
  console.log(x);
	if (x.length >= 3)
	if (x[1].toLowerCase() === "medmaster")
	if (x[2].toLowerCase() === "session") {
		resetLink = true;
	}
	return resetLink;
}


function checkResetPasswordRequest() {
	let resetLink = "";
	let x = location.pathname.split("/");
  //console.log("Path is");
  //console.log(x);
	if (x.length >= 4)
	if (x[1] === "doctorviraag")
	if (x[2] === "resetpassword") {
		resetLink = x[3];
	}
	return resetLink;
}


function AppRouter() {
  //let history={hist}

  const [user, setUser] = useState(null);
	const [fireToken, setFireToken] = useState("");
	
  const value = useMemo(() => ({ user, setUser }), [user, setUser]);
  var idleTimer = null;
  
  
  async function handleOnActive (event) {
    // console.log('user is active', event);
  }

  async function handleOnAction (event) {
    // console.log(`Action from user ${sessionStorage.getItem("uid")}`);
  }


  async function handleOnIdle (event) {
    // console.log('user is idle', event);
    // console.log('last active', idleTimer.getLastActiveTime());
    setIdle(true);
  }



  function DispayTabs() {
    let isLogged = isUserLogged();
    if (isLogged) {
      return (
        <div>
          <CricDreamTabs/>
        </div>
      )  
    } 
		else if (sessionStorage.getItem("currentLogin") ===  "SIGNIN") {
			return <SignIn />
		} 
		else  {
			let myLink = checkResetPasswordRequest();
			//console.log("Link", myLink);
			if (myLink !== "") {
				sessionStorage.setItem("currentUserCode", myLink);
				hist.push("/");
				//return (<ResetPassword />);
        return null;
			} else {
				//console.log("About to call Welcome");
				if (process.env.REACT_APP_SHOWWELCOMEPAGE === 'true')
					return (<SignIn/>)
				else
					return <SignIn />
			}
		} 
  }

  var myStatus = sessionStorage.getItem("prwsLogin");
  var showLanding = ((typeof myStatus === 'undefined') || (myStatus == null) || (myStatus === ""));
	//sessionStorage.removeItem("prwsMemberList");
	//readAllMembers();
  return (
    <Router history={hist}> 
    <UserContext.Provider value={value}>
    </UserContext.Provider>
    { showLanding &&
      <LandingPage />
    }
    {(!showLanding && (myStatus === "LOGIN")) &&
      <SignIn/>
    }
    {(!showLanding && (myStatus !== "LOGIN")) &&
      <CricDreamTabs/>
    }
    </Router>
  );

}

export default AppRouter;
