import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
// import { Switch, Route, Link } from 'react-router-dom';
import { ValidatorForm, TextValidator, TextValidatorcvariant, TextareaAutosize} from 'react-material-ui-form-validator';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';

//import Tooltip from "react-tooltip";
//import ReactTooltip from 'react-tooltip'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Grid from "@material-ui/core/Grid";

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';

import Typography from '@material-ui/core/Typography';
import { UserContext } from "../../UserContext";

import { 
	JumpButton, DisplayPageHeader, ValidComp, BlankArea, 
	ApplicationHeader, DisplayApplicationNameValue, DisplayApplicationNameValueNameBig,
	YesNoButton,
} from 'CustomComponents/CustomComponents.js';

import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import EditIcon from '@material-ui/icons/Edit';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import CancelIcon from '@material-ui/icons/Cancel';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import globalStyles from "assets/globalStyles";

import VsButton from "CustomComponents/VsButton"; 
import VsCancel from "CustomComponents/VsCancel";



import {
	ADMIN, APPLICATIONTYPES, APPLICATIONSTATUS, SELECTSTYLE, 
  PADSTYLE,
	MEMBERTITLE, RELATION, SELFRELATION, GENDER, BLOODGROUP, MARITALSTATUS,
	STATUS_INFO,
	MAXDISPLAYTEXTROWS,
} from 'views/globals';

import {
   isFamilyLock,
	isMobile, getWindowDimensions, displayType, decrypt, encrypt,
	vsDialog, showError, showSuccess, showInfo,
	getMemberName,
	dateString, disableFutureDt,
	hasPRWSpermission, 
} from 'views/functions';

import {
	setTab,
} from "CustomComponents/CricDreamTabs.js"

export default function ApplicationMarriage() {
	const gClasses = globalStyles();
	const myProps = JSON.parse(sessionStorage.getItem("application_appRec"));
	//console.log(myProps);
	
	//const [registerStatus, setRegisterStatus] = useState(0);
	const [appData, setAppdata] = useState(JSON.parse(myProps.applicationRec.data));
	
	// show in accordion
	const [expandedPanel, setExpandedPanel] = useState("BASICMARRIAGE");
	const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedPanel(isExpanded ? panel : false);
    //setRegisterStatus(0);
  };
	
	const [remarks, setRemarks] = useState("");
	const [action, setAction] = useState("");
	const [stage, setStage] = useState("INITIAL");
	
	useEffect(() => {
		//console.log(appData);
	}, [])


function handleReapply() {
   var tmp = JSON.parse(myProps.applicationRec.data);
   if (isFamilyLock(tmp.hid)) return;

   showInfo("Reapply selected");
   return;

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
   var returnStatus = null;
	try {
		let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/apply/approve/${myProps.applicationRec.id}/${sessionStorage.getItem("mid")}/${myRemarks}`;
		let resp = await axios.get(myUrl);
		returnStatus = {status: STATUS_INFO.SUCCESS, applicationRec: resp.data, msg: `Application approved by Admin`};
      sessionStorage.setItem("application_returnstatus", JSON.stringify(returnStatus));
      setTab(process.env.REACT_APP_APPLICATION);
      //myProps.onReturn.call(this, {status: STATUS_INFO.SUCCESS, applicationRec: resp.data, msg: `Application approved by Admin`});
	} catch (e) {
		console.log(e.response);
		showError(e.response.data);
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
		//myProps.onReturn.call(this, {status: STATUS_INFO.ERROR, applicationRec: resp.data, msg: `Application rejected by Admin`});	
	} catch (e) {
		console.log(e.response);
		showError(e.response.data);
	}
}

function handleCancel() {
	setTab(process.env.REACT_APP_APPLICATION);
}


	//console.log(appData);
	if (!appData.dom)  return false;


return (
	<div className={gClasses.webPage} >
	<Container component="main" maxWidth="xs">	
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} style={{paddingLeft: "5px", paddingRight: "5px"}} >
	<VsCancel align="right" onClick={handleCancel} />
	<ApplicationHeader applicationRec={myProps.applicationRec} header={`Application for Marriage`} />
	<br />
	{(stage === "INITIAL") &&
		<div>
		<Accordion expanded={expandedPanel === "BASICMARRIAGE"} onChange={handleAccordionChange("BASICMARRIAGE")}>
		<Box align="right" className={(expandedPanel === "BASICMARRIAGE") ? gClasses.selectedAccordian : gClasses.normalAccordian} borderColor="black" borderRadius={7} border={1} >
		<AccordionSummary aria-controls="panel1a-content" id="panel1a-header" expandIcon={<ExpandMoreIcon />}>
			<Typography align="left" >Basic Details</Typography>
		</AccordionSummary>
		</Box>
		<DisplayApplicationNameValue name="Family head" value={myProps.applicationRec.hodName} style={{paddingTop: "5px" }}  />
		<DisplayApplicationNameValue name="Member name" value={getMemberName(appData.memberRec, false, false)} style={{paddingTop: "5px" }}  />
		{((appData.memberRec.gender === "Female") && appData.isMarriedNameRequired) &&
			<DisplayApplicationNameValue name="Married name" value={`${appData.marriedName.lastName} ${appData.marriedName.firstName} ${appData.marriedName.middleName}`} style={{paddingTop: "5px" }}  />
		}
		<DisplayApplicationNameValue name="Date of marriage" value={dateString(appData.dom)} style={{paddingTop: "5px" }}  />
		<DisplayApplicationNameValue name="Is spouse member?" value={appData.isSpouseMember ? "Yes" : "No"} style={{paddingTop: "5px" }}  />
		{((appData.memberRec.gender === "Female") && !appData.isSpouseMember) &&
			<DisplayApplicationNameValue name="Is spouse Humad?" value={appData.isSpouseHumad ? "Yes" : "No"} style={{paddingTop: "5px" }}  />
		}
		{(appData.isSpouseMember) &&
			<DisplayApplicationNameValue name="Spouse name" value={getMemberName(appData.spouseMemberRec, false, false)} style={{paddingTop: "5px" }}  />
		}
		{(!appData.isSpouseMember && appData.isSpousePersonalDetailsRequired) &&
			<DisplayApplicationNameValue name="Spouse name" value={`${appData.spousePersonalDetails.lastName} ${appData.spousePersonalDetails.firstName} ${appData.spousePersonalDetails.middleName}`} style={{paddingTop: "5px" }}  />
		}
		{((appData.memberRec.gender === "Male") && appData.isMarriedNameRequired) &&
			<DisplayApplicationNameValue name="Spose married name" value={`${appData.marriedName.lastName} ${appData.marriedName.firstName} ${appData.marriedName.middleName}`} style={{paddingTop: "5px" }}  />
		}
		{(appData.isSpouseRelationRequired) &&
			<DisplayApplicationNameValue name="Spouse relation" value={appData.relation} style={{paddingTop: "5px" }}  />
		}
		<br />
		</Accordion>
		<br />
		{(appData.isSpousePersonalDetailsRequired) &&
		<div>
		<Accordion expanded={expandedPanel === "SPOUSEDETAILS"} onChange={handleAccordionChange("SPOUSEDETAILS")}>
		<Box align="right" className={(expandedPanel === "SPOUSEDETAILS") ? gClasses.selectedAccordian : gClasses.normalAccordian} borderColor="black" borderRadius={7} border={1} >
		<AccordionSummary aria-controls="panel1a-content" id="panel1a-header" expandIcon={<ExpandMoreIcon />}>
			<Typography align="left" >Spouse details</Typography>
		</AccordionSummary>
		</Box>
		<br />
		<DisplayApplicationNameValue name="Date of Birth" value={dateString(appData.spousePersonalDetails.dob)} style={{paddingTop: "5px" }}  />
		<DisplayApplicationNameValue name="Blood group" value={appData.spousePersonalDetails.bloodGroup} style={{paddingTop: "5px" }}  />
		<DisplayApplicationNameValue name="Mobile 1" value={appData.spousePersonalDetails.mobile} style={{paddingTop: "5px" }}  />
		<DisplayApplicationNameValue name="Mobile 2" value={appData.spousePersonalDetails.mobile1} style={{paddingTop: "5px" }}  />
		<DisplayApplicationNameValue name="Email" value={appData.spousePersonalDetails.email} style={{paddingTop: "5px" }}  />
		<br />
		</Accordion>
		<br />
		</div>
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
	<ToastContainer />
	</Box>
	</Container>
	</div>
	)
}
