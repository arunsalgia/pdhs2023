import React, { useState, useMemo } from "react";
//import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { Router, Route, Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { createBrowserHistory } from "history";
import { UserContext } from "./UserContext"; 
import globalStyles from "assets/globalStyles";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';


//import Admin from "layouts/Admin.js";
import "assets/css/material-dashboard-react.css?v=1.9.0";
// import { DesktopWindows } from "@material-ui/icons";
import { CricDreamTabs, setTab } from "CustomComponents/CricDreamTabs"

import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';

import SignIn from "views/Login/SignIn"
import LandingPage from "views/Login/LandingPage"
import Directory from "views/Directory/Directory"
import ApplicationTest from "views/Application/ApplicationTest"

import Dashboard from 'views/Dashboard/Dashboard'
import Member from 'views/Member/Member'
import Humad from 'views/Humad/Humad'
import Pjym from 'views/Pjym/Pjym'
import Prws from 'views/Prws/Prws'
import Application from 'views/Application/Application'

import ApplicationChangeDom from 'views/Application/ApplicationChangeDom'
import ApplicationTransferMember from 'views/Application/ApplicationTransferMember'
import ApplicationAddEditMember from 'views/Application/ApplicationAddEditMember'
import ApplicationNewHod from 'views/Application/ApplicationNewHod'
import ApplicationMemberCeased from 'views/Application/ApplicationMemberCeased'

import NewHod from 'views/Member/NewHod'
import MemberAddEdit from 'views/Member/MemberAddEdit'




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
clearBackupData, downloadApk,
vsDialog, handleLogout,
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
	const gClasses = globalStyles();
	
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

  function handleDashBoard() {
		sessionStorage.setItem("menuValue", process.env.REACT_APP_DASH);
		cdRefresh();
	}

	function ask_Logout_Confirm() {
		vsDialog("Logout", `Continue Logout?`,
		{label: "Yes", onClick: () => handleLogout() },
		{label: "No" }
		); 
	  
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
    <div className={gClasses.root}>
      <AppBar position="static">
        <Toolbar className={gClasses.noSpacing}>
        <Grid key="SUBMITMOBILE" container>
        <Grid align="left" item xs={6} sm={6} md={6} lg={6} >	
					<Typography>
						<span onClick={handleDashBoard}  className={gClasses.message14} >{"PRWS"}</span>
					</Typography>
        </Grid>
        <Grid align="right" item xs={6} sm={6} md={6} lg={6} >	
          <Typography>
						<span className={gClasses.message16} style={{paddingRight: "5px"}} >{"Welcome "+  sessionStorage.getItem("firstName")}</span>
            <span style={{paddingTop: "10px"}} ><PowerSettingsNewIcon value={{size: 70 }}  onClick={ask_Logout_Confirm} /></span>
          </Typography>
        </Grid>
        </Grid>
			 </Toolbar>
      </AppBar>
			{(sessionStorage.getItem("menuValue") === process.env.REACT_APP_DASH) &&
				<Dashboard />
			}
			{(sessionStorage.getItem("menuValue") === process.env.REACT_APP_PRWS) &&
				<Prws />
			}
			{(sessionStorage.getItem("menuValue") === process.env.REACT_APP_HUMAD) &&
				<Humad />
			}
			{(sessionStorage.getItem("menuValue") === process.env.REACT_APP_PJYM) &&
				<Pjym />
			}			
			{(sessionStorage.getItem("menuValue") === process.env.REACT_APP_FAMILY) &&
				<Member 
					hid={Number(sessionStorage.getItem("menuHid"))} 
					mid={Number(sessionStorage.getItem("menuMid"))} 
				/>
			}	
			{(sessionStorage.getItem("menuValue") === process.env.REACT_APP_APPLICATION) &&
				<Application />
			}	
			{(sessionStorage.getItem("menuValue") === process.env.REACT_APP_APPLICATION_DOMCHANGE) &&
				<ApplicationChangeDom />
			}	
			{(sessionStorage.getItem("menuValue") === process.env.REACT_APP_APPLICATION_TRANSFERMEMBER) &&
				<ApplicationTransferMember />
			}	
			{( [process.env.REACT_APP_APPLICATION_ADDMEMBER, process.env.REACT_APP_APPLICATION_EDITMEMBER].includes(sessionStorage.getItem("menuValue")) ) &&
				<ApplicationAddEditMember />
			}				
			{(sessionStorage.getItem("menuValue") === process.env.REACT_APP_APPLICATION_CEASEDMEMBER) &&
				<ApplicationMemberCeased />
			}	
			{(sessionStorage.getItem("menuValue") === process.env.REACT_APP_APPLICATION_NEWHOD) &&
				<ApplicationNewHod />
			}	
			{(sessionStorage.getItem("menuValue") === process.env.REACT_APP_FAMILY_PERSONAL_NEWHOD) &&
				<NewHod />
			}	
			{( [process.env.REACT_APP_FAMILY_PERSONAL_ADD, process.env.REACT_APP_FAMILY_PERSONAL_EDIT].includes(sessionStorage.getItem("menuValue")) ) &&
				<MemberAddEdit />
			}				
			</div>
    }
    </Router>
  );

}

export default AppRouter;
