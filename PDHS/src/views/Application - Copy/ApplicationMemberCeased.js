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

import globalStyles from "assets/globalStyles";

import VsButton from "CustomComponents/VsButton"; 
import VsCancel from "CustomComponents/VsCancel";

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


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
	dateString, dateStringMMM, disableFutureDt,
	hasPRWSpermission, 
} from 'views/functions';

import {
	setTab,
} from "CustomComponents/CricDreamTabs.js"


export default function ApplicationMemberCeased() {
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
		
	//useEffect(() => {
			//console.log(myProps.applicationRec.data);
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
		showError(`Error approving ceased member`);
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
		showError(`Error rejecting ceased member`);
	}
}

function handleCancel() {
	setTab(process.env.REACT_APP_APPLICATION);
}


	//console.log(appData);

	if (!appData.hid) return false;
	//console.log(appData.oldMemberRec);
	
return (
	<div className={gClasses.webPage} >
	<Container component="main" maxWidth="xs">	
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} style={{paddingLeft: "5px", paddingRight: "5px"}} >
	<VsCancel align="right" onClick={handleCancel} />
	<ApplicationHeader applicationRec={myProps.applicationRec} header={`Application for member ceased`} />
	<br />
	{(stage === "INITIAL") &&
	<Accordion expanded={expandedPanel === "PERSONALDETAILS"} onChange={handleAccordionChange("PERSONALDETAILS")}>
		<Box align="right" className={(expandedPanel === "PERSONALDETAILS") ? gClasses.selectedAccordian : gClasses.normalAccordian} borderColor="black" borderRadius={7} border={1} >
		<AccordionSummary aria-controls="panel1a-content" id="panel1a-header" expandIcon={<ExpandMoreIcon />}>
			<Typography align="left" >{"Ceased member details"}</Typography>
		</AccordionSummary>
		</Box>
		<br />
		<DisplayApplicationNameValue name={"Ceased member"} value={appData.ceasedName} style={{paddingTop: "5px" }}  />
		<DisplayApplicationNameValue name={"Ceased date"} value={dateStringMMM(appData.ceasedDate)} style={{paddingTop: "5px" }}  />
		<br />
	</Accordion>
	}
	<br />
	{((stage === "INITIAL") && (appData.newHodName !== "")) &&
	<Accordion expanded={expandedPanel === "FHEADDETAILS"} onChange={handleAccordionChange("FHEADDETAILS")}>
		<Box align="right" className={(expandedPanel === "FHEADDETAILS") ? gClasses.selectedAccordian : gClasses.normalAccordian} borderColor="black" borderRadius={7} border={1} >
		<AccordionSummary aria-controls="panel1a-content" id="panel1a-header" expandIcon={<ExpandMoreIcon />}>
			<Typography align="left" >{"New family head details"}</Typography>
		</AccordionSummary>
		</Box>
		<DisplayApplicationNameValue name={"New family head"} value={appData.newHodName} style={{paddingTop: "5px" }}  />
		<br />
	</Accordion>
	}
	<br />
	{((stage === "INITIAL") && (appData.midList.length > 0)) &&
	<Accordion expanded={expandedPanel === "relationDETAILS"} onChange={handleAccordionChange("relationDETAILS")}>
		<Box align="right" className={(expandedPanel === "relationDETAILS") ? gClasses.selectedAccordian : gClasses.normalAccordian} borderColor="black" borderRadius={7} border={1} >
		<AccordionSummary aria-controls="panel1a-content" id="panel1a-header" expandIcon={<ExpandMoreIcon />}>
			<Typography align="left" >{"Relation details"}</Typography>
		</AccordionSummary>
		</Box>
		<DisplayApplicationName name={`Relation of members with new family head`} value="" style={{paddingTop: "5px" }}  />
		{appData.nameList.map( (memberName, index) => {
			if (appData.midList[index] === appData.newHodMid) return;
			//var oldRelation = appData.oldRelationList[index];
			var newRelation = appData.relationList[index];
			return (
				<div key={memberName} >
					<DisplayApplicationNameValue name={memberName} value={newRelation} style={{paddingTop: "5px" }}  />
				</div>
			)}
		)}
		<br />
	</Accordion>
	}
	<br />
	{(hasPRWSpermission() && (myProps.applicationRec.status === APPLICATIONSTATUS.pending) && (stage === "INITIAL")) &&
		<YesNoButton title="" yesName="Approve" noName="Reject" yesClick={handleApplicationApprove} noClick={handleApplicationReject} />
	}
	{((myProps.applicationRec.status === APPLICATIONSTATUS.rejected) && (sessionStorage.getItem("mid") == myProps.applicationRec.mid)) &&
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
