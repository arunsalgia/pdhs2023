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
} from 'views/globals';

import {
	isMobile, getWindowDimensions, displayType, decrypt, encrypt,
	vsDialog, showError, showSuccess, showInfo,
	getMemberName,
	dateString, disableFutureDt,
	hasPRWSpermission, 
	getHumadMembershipName,
} from 'views/functions';

import {
	setTab,
} from "CustomComponents/CricDreamTabs.js"


export default function ApplicationUpgradeHumad() {
	const gClasses = globalStyles();
	const myProps = JSON.parse(sessionStorage.getItem("application_appRec"));
	//console.log(myProps);
	
	//const [registerStatus, setRegisterStatus] = useState(0);
	const [appData, setAppdata] = useState(JSON.parse(myProps.applicationRec.data));
	const [remarks, setRemarks] = useState("");
	const [action, setAction] = useState("");	
	const [stage, setStage] = useState("INITIAL");
	
	//useEffect(() => {
	//		setAppdata(JSON.parse(myProps.applicationRec.data));
	//}, [])


async function handleMemberAddEditSubmit() {
	myProps.onReturn.call(this, {status: STATUS_INFO.ERROR, msg: `Error Add/Edit gotra`});
	return;
}

async function handleApplicationReject() {
	setAction("Reject");
	setStage("Reject");
}

async function handleApplicationApprove() {
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

async function junk_handleApplicationReject() {
	handleApplicationRejectConfirm();
	
	/*vsDialog("Reject", `Are you sure you want reject application?`,
		{label: "Yes", onClick: () => handleApplicationRejectConfirm() },
		{label: "No" }
		);*/
}

async function  handleApplicationApproveConfirm(myRemarks) {
	showInfo("TO be implemenetd");
	return;
	
	try {
		let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/apply/reject/${myProps.applicationRec.id}/${sessionStorage.getItem("mid")}/my comments`;
		let resp = await axios.get(myUrl);
		myProps.onReturn.call(this, {status: STATUS_INFO.SUCCESS, applicationRec: resp.data, msg: `Application rejected by Admin`});
		
	} catch (e) {
		console.log(e);
		showError(`Error rejecting Gotra/Caste change`);
	}
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



function handleCancel() {
	setTab(process.env.REACT_APP_APPLICATION);
}

//console.log(appData);


return (
	<div className={gClasses.webPage} >
	<Container component="main" maxWidth="xs">	
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} style={{paddingLeft: "5px", paddingRight: "5px"}} >
	<VsCancel align="right" onClick={handleCancel} />
	<ApplicationHeader applicationRec={myProps.applicationRec} header="Application for Humad Membership" />
	<br />
	{(stage === "INITIAL") &&
	<div>
		<DisplayApplicationNameValue name="Member" value={getMemberName(appData.memberRec, false, false)} style={{paddingTop: "5px" }}  />
		<DisplayApplicationNameValue name="New or Upgrade" value={(myProps.humadRec) ? "Upgrade" : "New" } style={{paddingTop: "5px" }}  />
		{(myProps.humadRec) &&
		<DisplayApplicationNameValue name="Current membership" value={getHumadMembershipName(appData.humadRec.membershipNumber)} style={{paddingTop: "5px" }}  />
		}
		{(myProps.humadRec) &&
		<DisplayApplicationNameValue name="Membership receipt" value={appData.humadRec.membershipNumber} style={{paddingTop: "5px" }}  />
		}
		<Divider style={{ marginTop: "10px", marginBottom: "10px", paddingTop: "1px", backgroundColor: 'black', padding: 'none' }} />
		<DisplayApplicationName name="New membership details" value={``}  />
		<DisplayApplicationNameValue name="Membership" value={appData.newUpgrade} style={{paddingTop: "5px" }}  />
		<DisplayApplicationNameValue name="Membership Date" value={dateString(appData.upgradeDate)} style={{paddingTop: "5px" }}  />
		<DisplayApplicationNameValue name="Remarks" value={appData.remarks} style={{paddingTop: "5px" }}  />
		<br />
	</div>
	}
	{((myProps.applicationRec.status === APPLICATIONSTATUS.pending) && (stage === "INITIAL")) &&
	<Grid key={"APPLBUTTON"} className={gClasses.noPadding} container  alignItems="flex-start" >
		<Grid item xs={2} sm={2} md={2} lg={2} />
		<Grid item xs={4} sm={4} md={4} lg={4} >
			<VsButton align="center" name="Approve" onClick={handleApplicationApprove} />
		</Grid>
		<Grid item xs={4} sm={4} md={4} lg={4} >
			<VsButton align="center" name="Reject" type="button"  onClick={handleApplicationReject} />
		</Grid>
		<Grid item xs={2} sm={2} md={2} lg={2} />
	</Grid>
	}
	{((stage === "Approve") || (stage === "Reject")) && 
	<Grid key={"APPLAPPROVEREHECT"} className={gClasses.noPadding} container  alignItems="flex-start" >
		<Grid item xs={12} sm={12} md={12} lg={12} >
			<Typography align="center" className={gClasses.functionSelected}>{`${stage} Application?`}</Typography>
			<br />
		</Grid>
		<Grid item xs={2} sm={2} md={2} lg={2} />
		<Grid item xs={4} sm={4} md={4} lg={4} >
			<VsButton align="center" name="Yes" onClick={() => setStage("Remarks") } />
		</Grid>
		<Grid item xs={4} sm={4} md={4} lg={4} >
			<VsButton align="center" name="No" onClick={() => setStage("INITIAL") } />
		</Grid>
		<Grid item xs={2} sm={2} md={2} lg={2} />
	</Grid>
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
