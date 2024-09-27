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
	ApplicationHeader, DisplayApplicationNameValue, DisplayApplicationName,
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
	isMobile, getWindowDimensions, displayType, decrypt, encrypt,
	vsDialog, showError, showSuccess, showInfo,
	getMemberName,
	dateString, disableFutureDt,
	hasPRWSpermission, 
} from 'views/functions';

import {
	setTab,
} from "CustomComponents/CricDreamTabs.js"


export default function ApplicationAddEditMember() {
	const gClasses = globalStyles();
	const myProps = JSON.parse(sessionStorage.getItem("application_appRec"));
	
	//const [registerStatus, setRegisterStatus] = useState(0);
	const [appData, setAppdata] = useState(JSON.parse(myProps.applicationRec.data));
	
	// show in accordion
	const [expandedPanel, setExpandedPanel] = useState("");
	const handleAccordionChange = (panel) => (event, isExpanded) => {
		setExpandedPanel(isExpanded ? panel : false);
		//setRegisterStatus(0);
	};
	
	const [remarks, setRemarks] = useState("");
	const [action, setAction] = useState("");
	const [stage, setStage] = useState("INITIAL");
	
	console.log(appData.oldMemberRec.email)
	console.log(appData.memberRec.email)
	//useEffect(() => {
	//		console.log(myProps.applicationRec);
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
	if (appData.mode === "ADD") {
		showError("Approve on add not yet implemented");
		return;
	}
		
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
	try {
		let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/apply/approve/${myProps.applicationRec.id}/${sessionStorage.getItem("mid")}/${myRemarks}`;
		let resp = await axios.get(myUrl);
		var returnStatus = {
			status: STATUS_INFO.SUCCESS, applicationRec: resp.data, 
			msg: `Application approved by Admin`
		};
		sessionStorage.setItem("application_returnstatus", JSON.stringify(returnStatus));
		setTab(process.env.REACT_APP_APPLICATION);
		//myProps.onReturn.call(this, {status: STATUS_INFO.SUCCESS, applicationRec: resp.data, msg: `Application approved by Admin`});
		
	} catch (e) {
		console.log(e);
		showError(`Error approving Edit personal change`);
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
		console.log(e);
		showError(`Error rejecting Edit personal change`);
	}
}

function hasNameChanged() {
	if (appData.oldMemberRec.title !== appData.memberRec.title) return true;
	if (appData.oldMemberRec.firstName !== appData.memberRec.firstName) return true;
	if (appData.oldMemberRec.lastName !== appData.memberRec.lastName) return true;
	if (appData.oldMemberRec.middleName !== appData.memberRec.middleName) return true;
	if (appData.oldMemberRec.alias !== appData.memberRec.alias) return true;
	return false;
}

function hasPersonalChanged() {
	if (appData.oldMemberRec.relation !== appData.memberRec.relation) return true;
	if (appData.oldMemberRec.bloodGroup !== appData.memberRec.bloodGroup) return true;
	if (appData.oldMemberRec.mobile !== appData.memberRec.mobile) return true;
	if (appData.oldMemberRec.mobile1 !== appData.memberRec.mobile1) return true;
	if (appData.oldMemberRec.email !== appData.memberRec.email) return true;
	if (appData.oldMemberRec.gender !== appData.memberRec.gender) return true;
	if (appData.oldMemberRec.dob !== appData.memberRec.dob) return true;
	return false;
}

function hasOfficeChanged() {
	if (appData.oldMemberRec.occupation !== appData.memberRec.occupation) return true;
	if (appData.oldMemberRec.officePhone !== appData.memberRec.officePhone) return true;
	if (appData.oldMemberRec.officeName !== appData.memberRec.officeName) return true;
	if (appData.oldMemberRec.education !== appData.memberRec.education) return true;
	return false;
}

function handleCancel() {
	setTab(process.env.REACT_APP_APPLICATION);
}


	//console.log(appData);
	if (!appData.hid) return false;
	//console.log(appData.memberRec);
	var newTitlePrefix = "New";   //(appData.mode === "EDIT")  ? "" : "New ";
	//console.log(appData);

return (
	<div className={gClasses.webPage} >
	<Container component="main" maxWidth="xs">	
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} style={{paddingLeft: "5px", paddingRight: "5px"}} >
	<VsCancel align="right" onClick={handleCancel} />
	<ApplicationHeader applicationRec={myProps.applicationRec} header={`Application to ${appData.mode} member details`} />
	<br />
	{(stage === "INITIAL") &&
	<Accordion expanded={expandedPanel === "NAMEDETAILS"} onChange={handleAccordionChange("NAMEDETAILS")}>
		<Box align="right" className={(expandedPanel === "NAMEDETAILS") ? gClasses.selectedAccordian : gClasses.normalAccordian} borderColor="black" borderRadius={7} border={1} >
		<AccordionSummary aria-controls="panel1a-content" id="panel1a-header" expandIcon={<ExpandMoreIcon />}>
			<Typography align="left" >{"Name Details"}</Typography>
		</AccordionSummary>
		</Box>
		{((appData.mode === "EDIT") && hasNameChanged()) &&
		<div>
			<DisplayApplicationNameValue name={`Old Name`} value={getMemberName(appData.oldMemberRec, true, true)} style={{paddingTop: "5px" }}  />
		</div>
		}
		{((appData.mode === "EDIT") && !hasNameChanged()) &&
			<DisplayApplicationName name="No change in name details" value="" style={{paddingTop: "5px" }}  />
		}
		<DisplayApplicationNameValue name={`${newTitlePrefix} Name`} value={getMemberName(appData.memberRec, true, true)} style={{paddingTop: "5px" }}  />
		<br />
	</Accordion>
	}
	<br />
	{(stage === "INITIAL") &&
	<Accordion expanded={expandedPanel === "PERSONALDETAILS"} onChange={handleAccordionChange("PERSONALDETAILS")}>
		<Box align="right" className={(expandedPanel === "PERSONALDETAILS") ? gClasses.selectedAccordian : gClasses.normalAccordian} borderColor="black" borderRadius={7} border={1} >
		<AccordionSummary aria-controls="panel1a-content" id="panel1a-header" expandIcon={<ExpandMoreIcon />}>
			<Typography align="left" >{"Personal Details"}</Typography>
		</AccordionSummary>
		</Box>
		{(appData.mode === "EDIT") &&
			<DisplayApplicationName name={hasPersonalChanged() ? "Old Personal details" : "No change in Personal details"} value="" style={{paddingTop: "5px" }}  />
		}
		{((appData.mode === "EDIT") && hasPersonalChanged()) &&
		<div>
			<DisplayApplicationNameValue name={`Relation`} value={appData.oldMemberRec.relation} style={{paddingTop: "5px" }}  />
			<DisplayApplicationNameValue name={`Gender`} value={appData.oldMemberRec.gender} style={{paddingTop: "5px" }}  />
			<DisplayApplicationNameValue name="Blood group" value={appData.oldMemberRec.bloodGroup} style={{paddingTop: "5px" }}  />
			<DisplayApplicationNameValue name="DOB" value={dateString(appData.oldMemberRec.dob)} style={{paddingTop: "5px" }}  />
			<DisplayApplicationNameValue name={`Mobile 1`} value={appData.oldMemberRec.mobile} style={{paddingTop: "5px" }}  />
			<DisplayApplicationNameValue name={`Mobile 2`} value={appData.oldMemberRec.mobile1} style={{paddingTop: "5px" }}  />
			<DisplayApplicationNameValue name="Email" value={decrypt(appData.oldMemberRec.email)} style={{paddingTop: "5px" }}  />
			<br />
			<Divider style={{ paddingBottom: "2px", backgroundColor: 'black', padding: 'none' }} />			
			<DisplayApplicationName name={`${newTitlePrefix} Personal details`} value="" style={{paddingTop: "5px" }}  />
		</div>
		}
		<DisplayApplicationNameValue name={`Relation`} value={appData.memberRec.relation} style={{paddingTop: "5px" }}  />
		<DisplayApplicationNameValue name={`Gender`} value={appData.memberRec.gender} style={{paddingTop: "5px" }}  />
		<DisplayApplicationNameValue name="Blood group" value={appData.memberRec.bloodGroup} style={{paddingTop: "5px" }}  />
		<DisplayApplicationNameValue name="DOB" value={dateString(appData.memberRec.dob)} style={{paddingTop: "5px" }}  />
		<DisplayApplicationNameValue name={`Mobile 1`} value={appData.memberRec.mobile} style={{paddingTop: "5px" }}  />
		<DisplayApplicationNameValue name={`Mobile 2`} value={appData.memberRec.mobile1} style={{paddingTop: "5px" }}  />
		<DisplayApplicationNameValue name="Email" value={decrypt(appData.memberRec.email)} style={{paddingTop: "5px" }}  />
		<br />
	</Accordion>
	}
	<br />
	{(stage === "INITIAL") &&
	<Accordion expanded={expandedPanel === "OFFICEDETAILS"} onChange={handleAccordionChange("OFFICEDETAILS")}>
		<Box align="right" className={(expandedPanel === "OFFICEDETAILS") ? gClasses.selectedAccordian : gClasses.normalAccordian} borderColor="black" borderRadius={7} border={1} >
		<AccordionSummary aria-controls="panel1a-content" id="panel1a-header" expandIcon={<ExpandMoreIcon />}>
			<Typography align="left" >{"Office Details"}</Typography>
		</AccordionSummary>
		</Box>
		{(appData.mode === "EDIT") &&
			<DisplayApplicationName name={hasOfficeChanged() ? "Old Office details" : "No change in Office details"} value="" style={{paddingTop: "5px" }}  />
		}
		{((appData.mode === "EDIT") && hasOfficeChanged()) &&
		<div>
			<DisplayApplicationNameValue name="Eductaion" value={appData.oldMemberRec.education} style={{paddingTop: "5px" }}  />
			<DisplayApplicationNameValue name="Occupation" value={appData.oldMemberRec.occupation} style={{paddingTop: "5px" }}  />
			<DisplayApplicationNameValue name="Company Name" value={appData.oldMemberRec.officeName} style={{paddingTop: "5px" }}  />
			<DisplayApplicationNameValue name="Company Phone" value={appData.oldMemberRec.officePhone} style={{paddingTop: "5px" }}  />
			<br />
			<Divider style={{ paddingBottom: "2px", backgroundColor: 'black', padding: 'none' }} />			
			<DisplayApplicationName name={`${newTitlePrefix} Office details`} value="" style={{paddingTop: "5px" }}  />
		</div>
		}
		<DisplayApplicationNameValue name="Eductaion" value={appData.memberRec.education} style={{paddingTop: "5px" }}  />
		<DisplayApplicationNameValue name="Occupation" value={appData.memberRec.occupation} style={{paddingTop: "5px" }}  />
		<DisplayApplicationNameValue name="Company Name" value={appData.memberRec.officeName} style={{paddingTop: "5px" }}  />
		<DisplayApplicationNameValue name="Company Phone" value={appData.memberRec.officePhone} style={{paddingTop: "5px" }}  />
		<br />
	</Accordion>
	}
	<br />
	{(hasPRWSpermission() && (myProps.applicationRec.status === APPLICATIONSTATUS.pending) && (stage === "INITIAL")) &&
		<YesNoButton title="" yesName="Approve" noName="Reject" yesClick={handleApplicationApprove} noClick={handleApplicationReject} />
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
