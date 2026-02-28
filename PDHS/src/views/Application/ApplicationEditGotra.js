import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
// import { Switch, Route, Link } from 'react-router-dom';
import { ValidatorForm, TextValidator, TextValidatorcvariant} from 'react-material-ui-form-validator';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';

//import Tooltip from "react-tooltip";
//import ReactTooltip from 'react-tooltip'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Grid from "@material-ui/core/Grid";

import Typography from '@material-ui/core/Typography';
import { UserContext } from "../../UserContext";

import { 
	JumpButton, DisplayPageHeader, ValidComp, BlankArea, 
	ApplicationHeader, DisplayApplicationNameValue, DisplayApplicationName,
	YesNoButton,
} from 'CustomComponents/CustomComponents.js';

import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import EditIcon from '@material-ui/icons/Edit';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import CancelIcon from '@material-ui/icons/Cancel';

import globalStyles from "assets/globalStyles";

import VsButton from "CustomComponents/VsButton"; 
import VsCancel from "CustomComponents/VsCancel";


import {
	ADMIN, APPLICATIONTYPES, APPLICATIONSTATUS, SELECTSTYLE, 
  PADSTYLE,
	MEMBERTITLE, RELATION, SELFRELATION, GENDER, BLOODGROUP, MARITALSTATUS,
	STATUS_INFO,
   CASTEOBJ, HUMADSUBCASTEOBJ,
} from 'views/globals';

import {
	isMobile, getWindowDimensions, displayType, decrypt, encrypt,
	vsDialog, showError, showSuccess, showInfo,
	getMemberName,
	dateString, disableFutureDt,
	hasPRWSpermission, 
} from 'views/functions';

import {
	setTab,
} from "CustomComponents/CricDreamTabs.js"


export default function ApplicationEditGotra() {
	const gClasses = globalStyles();
	const myProps = JSON.parse(sessionStorage.getItem("application_appRec"));
	
	//const [registerStatus, setRegisterStatus] = useState(0);
	const [appData, setAppdata] = useState(JSON.parse(myProps.applicationRec.data));
	const [remarks, setRemarks] = useState("");
	const [action, setAction] = useState("");	
	const [stage, setStage] = useState("INITIAL");
   const [prwsMem, setPrwsMem] = useState("nochange");
	
	//useEffect(() => {
	//		setAppdata(JSON.parse(myProps.applicationRec.data));
	//}, [])


function handleReapply() {
   showInfo("Reppaly selected");
}

async function handleMemberAddEditSubmit() {
	myProps.onReturn.call(this, {status: STATUS_INFO.ERROR, msg: `Error Add/Edit gotra`});
	return;
}

async function handleApplicationReject() {
	setAction("Reject");
	setStage("Reject");
}

async function handleApplicationApprove() {
    console.log(myProps.applicationRec);
   // change of caste or sub caste get PRWS membership info
	if ((appData.oldData.caste !== appData.newData.caste) || (appData.oldData.subCaste !== appData.newData.subCaste)) {
      // Change of caste / sub caste
      if ((appData.newData.caste == CASTEOBJ.humad) && (appData.newData.subCaste == HUMADSUBCASTEOBJ.dasha)) {
         // if dasha humad
         var msg = `Set membership of Pratapgarh Raj. Welfare samiti?`
         vsDialog("PRWS membership", msg,
         {label: "Yes", onClick: () => handleApplicationApproveFinal("true") },
         {label: "No", onClick: () => handleApplicationApproveFinal("false")  }
         );  
      }
      else 
        handleApplicationApproveFinal("false");
   }
   else
      handleApplicationApproveFinal("nochange");  
}
	


async function handleApplicationApproveFinal(newPrwsSts) {
   setPrwsMem(newPrwsSts);
   console.log(newPrwsSts);
   setAction("Approve");
	setStage("Approve");
}


function handleRemarksDone() {
	var myRemarks = (remarks !== "") ? remarks : "-";
	if (action === "Approve")
		handleApplicationApproveConfirm(myRemarks);
	else
		handleApplicationRejectConfirm(myRemarks);
}

   
async function  handleApplicationApproveConfirm(myRemarks) {
   // send prwsMem information as part of remarks
   var finRem = prwsMem + "ARUNSALGIA" + myRemarks;
	var myTmp = encodeURIComponent(JSON.stringify(myProps.applicationRec));
	var returnStatus = {};
	try {
		let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/apply/approve/${myProps.applicationRec.id}/${sessionStorage.getItem("mid")}/${finRem}`;
		let resp = await axios.get(myUrl);
		returnStatus = {
			status: STATUS_INFO.SUCCESS, 
			applicationRec: resp.data, 
			msg: `Application approved and updated by Admin`
		};
      sessionStorage.setItem("application_returnstatus", JSON.stringify(returnStatus));
      setTab(process.env.REACT_APP_APPLICATION);
	} 
	catch (e) {
		console.log(e.response);
		showError(e.response.data);
	}
	//myProps.onReturn.call(this, {status: STATUS_INFO.SUCCESS, applicationRec: resp.data, msg: `Application rejected by Admin`});
}


async function  handleApplicationRejectConfirm(myRemarks) {
	try {
		let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/apply/reject/${myProps.applicationRec.id}/${sessionStorage.getItem("mid")}/${myRemarks}`;
		let resp = await axios.get(myUrl);
		var returnStatus = {
			status: STATUS_INFO.ERROR, applicationRec: resp.data, 
			msg: `Application rejected by Admin`
		};
		sessionStorage.setItem("application_returnstatus", JSON.stringify(returnStatus));
		setTab(process.env.REACT_APP_APPLICATION);
		//myProps.onReturn.call(this, {status: STATUS_INFO.SUCCESS, applicationRec: resp.data, msg: `Application rejected by Admin`});
		
	} catch (e) {
		console.log(e);
		showError(`Error rejecting Gotra/Caste change`);
	}
}


function hasGotraChanged() {
	if (appData.oldData.gotra !== appData.newData.gotra) return true;
	if (appData.oldData.caste !== appData.newData.caste) return true;
	if ((appData.newData.caste === "Humad") && (appData.oldData.subCaste === appData.newData.subCaste))  return true;
	return false;
}

function handleCancel() {
	setTab(process.env.REACT_APP_APPLICATION);
}

//console.log(appData);


return (
	<div className={gClasses.webPage} >
	<Container component="main" maxWidth="xs">	
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} style={{paddingLeft: "5px", paddingRight: "5px"}} >
	<VsCancel align="right" onClick={handleCancel} />
	<ApplicationHeader applicationRec={myProps.applicationRec} header="Application for change of Gotra/Caste/SubCaste" />
	{(stage === "INITIAL") &&
	<div>
	{(hasGotraChanged()) &&
	<div>
		<br />
		<DisplayApplicationName name="Old Gotra/Caste/Subcaste" value="" style={{paddingTop: "5px" }}  />
		<DisplayApplicationNameValue name="Gotra" value={appData.oldData.gotra} style={{paddingTop: "5px" }}  />
		<DisplayApplicationNameValue name="Caste" value={appData.oldData.caste} style={{paddingTop: "5px" }}  />
		{(appData.oldData.caste === "Humad") &&
			<DisplayApplicationNameValue name="SubCaste" value={appData.oldData.subCaste} style={{paddingTop: "5px" }}  />
		}
		<br />
		<Divider style={{ paddingBottom: "2px", backgroundColor: 'black', padding: 'none' }} />			
	</div>
	}
	<br />
	<DisplayApplicationName name="New Gotra/Caste/Subcaste" value="" style={{paddingTop: "5px" }}  />
	<DisplayApplicationNameValue name="Gotra" value={appData.newData.gotra} different={appData.oldData.gotra !== appData.newData.gotra} style={{paddingTop: "5px" }}  />
	{(!appData.newData.existingGotra) &&
	<DisplayApplicationName name="(Note that the new gotra is not in gotra database)" value="" style={{paddingTop: "5px" }}  />
	}
	<DisplayApplicationNameValue name="Caste" value={appData.newData.caste} different={appData.oldData.caste !== appData.newData.caste} style={{paddingTop: "5px" }}  />
	{(appData.newData.caste === "Humad")  &&
		<DisplayApplicationNameValue name="SubCaste" value={appData.newData.subCaste} different={appData.oldData.subCaste !== appData.newData.subCaste}  style={{paddingTop: "5px" }}  />	
	}
	</div>
	}
	{(hasPRWSpermission() && (myProps.applicationRec.status === APPLICATIONSTATUS.pending) && (stage === "INITIAL")) &&
		<YesNoButton title="" yesName="Approve" noName="Reject" yesClick={handleApplicationApprove} noClick={handleApplicationReject} />
	}
	{(false && (myProps.applicationRec.status === APPLICATIONSTATUS.rejected) && (sessionStorage.getItem("mid") == myProps.applicationRec.mid)) &&
		<VsButton align="center" name="Re-Apply" onClick={handleReapply} />
	}	
	{((stage === "Approve") || (stage === "Reject")) && 
		<YesNoButton title={`${stage} Application?`} yesName="Yes" noName="No" yesClick={() => setStage("Remarks") } noClick={() => setStage("INITIAL") } />
	}
	{((stage === "Remarks") && (myProps.applicationRec.status === "Pending")) &&
	<div align="center">
		<br />
		<Typography align="center" className={gClasses.functionSelected}>{`Remarks for application ${action}`}</Typography>
		<br />
		{/*<TextareaAutosize maxRows={MAXDISPLAYTEXTROWS} className={gClasses.textAreaFixed}  value={remarks} />*/}
		<textarea
			rows = {5}    // Specifies the number of visible text lines
			cols = {40}    // Specifies the width of the text area in characters
			value = {remarks}   // Specifies the initial value of the text area
			placeholder = "Add remarks"   // Specifies a short hint that describes the expected value of the textarea
			//wrap = "soft"   // Specifies how the text in the text area should be wrapped
			readOnly = {(myProps.applicationRec.status !== "Pending")}   // Specifies that the text area is read-only, meaning the user cannot modify its content
			name = "Remarks"   // Specifies the name of the text area, which can be used when submitting a form
			//disabled = {true}   //  Specifies that the text area is disabled, meaning the user cannot interact with it
			//minLength = {150}   // Specifies the minimum number of characters required in the textarea
			maxLength = {200}   // Specifies the maximum number of characters allowed in the textarea
			onChange = {() => setRemarks(event.target.value) }
		/>
		<br />
			<VsButton align="center" name="Submit" onClick={handleRemarksDone} />
		<br />
	</div>
	}
	<br />
	<ToastContainer />
	</Box>
	</Container>
	</div>
	)
}
