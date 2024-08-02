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
} from 'CustomComponents/CustomComponents.js';

import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import EditIcon from '@material-ui/icons/Edit';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import CancelIcon from '@material-ui/icons/Cancel';

import globalStyles from "assets/globalStyles";

import VsButton from "CustomComponents/VsButton"; 

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
	dateString, disableFutureDt,
	hasPRWSpermission, 
} from 'views/functions';


export default function ApplicationTransferMember(props) {
	const gClasses = globalStyles();
	
	//const [registerStatus, setRegisterStatus] = useState(0);
	const [appData, setAppdata] = useState({});
	
	// show in accordion
	const [expandedPanel, setExpandedPanel] = useState("");
	const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedPanel(isExpanded ? panel : false);
    //setRegisterStatus(0);
  };
	
	const [remarks, setRemarks] = useState("");
	const [action, setAction] = useState("");
	const [stage, setStage] = useState("INITIAL");
	
	
	
	useEffect(() => {
			//console.log(props.applicationRec.data);
			setAppdata(JSON.parse(props.applicationRec.data));
	}, [])


async function handleMemberAddEditSubmit() {
	props.onReturn.call(this, {status: STATUS_INFO.ERROR, msg: `Error Add/Edit gotra`});
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
		let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/apply/approve/${props.applicationRec.id}/${sessionStorage.getItem("mid")}/${myRemarks}`;
		let resp = await axios.get(myUrl);
		props.onReturn.call(this, {status: STATUS_INFO.SUCCESS, applicationRec: resp.data, msg: `Application approved by Admin`});
		
	} catch (e) {
		console.log(e);
		showError(`Error approving ceased member`);
	}
}

async function  handleApplicationRejectConfirm(myRemarks) {
	try {
		let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/apply/reject/${props.applicationRec.id}/${sessionStorage.getItem("mid")}/${myRemarks}`;
		let resp = await axios.get(myUrl);
		props.onReturn.call(this, {status: STATUS_INFO.ERROR, applicationRec: resp.data, msg: `Application rejected by Admin`});
		
	} catch (e) {
		console.log(e);
		showError(`Error rejecting ceased member`);
	}
}



	//console.log(appData);
	if (!appData.hid) 
		return false;

	
return (
	<div>
	<ApplicationHeader applicationRec={props.applicationRec} header={`Application to move member(s)`} />
	{(stage === "INITIAL") &&
	<div>
	<Typography align="center" style={{paddingTop: "5px" }} className={gClasses.pdhs_title} >Application data</Typography>
	<br />
	</div>
	}
	{(stage === "INITIAL") &&
		<Accordion expanded={expandedPanel === "TRANSFERDETAILS"} onChange={handleAccordionChange("TRANSFERDETAILS")}>
		<Box align="right" className={(expandedPanel === "TRANSFERDETAILS") ? gClasses.selectedAccordian : gClasses.normalAccordian} borderColor="black" borderRadius={7} border={1} >
		<AccordionSummary aria-controls="panel1a-content" id="panel1a-header" expandIcon={<ExpandMoreIcon />}>
			<Typography align="left" >{(appData.createNewFamily) ? `Transfer members to new family` : `Transfer to family of ${appData.mergedFamilyHeadName}`}</Typography>
		</AccordionSummary>
		</Box>
		{/*<Typography align="center" style={{paddingTop: "5px" }} className={gClasses.pdhs_title} >{(appData.createNewFamily) ?  "Create new family"  :  "Merge with another family"}</Typography>*/}
		<br />
		<DisplayApplicationNameValue name="Family Head" value={(appData.createNewFamily) ? `${appData.newHodName}` : `${appData.mergedFamilyHeadName}`} style={{paddingTop: "5px" }}  />
		{/*  Display list if names whar are to be moved */}
		{appData.transferNameList.map( (memberName, index) => {
			if (appData.transferRelation[index] === 'Self') return;
			//var relation = (appData.transferRelation[index] === 'Self') ? "Family Head" : appData.transferRelation[index];
			return (
				<div key={memberName} >
					<DisplayApplicationNameValueNameBig name={memberName} value={appData.transferRelation[index]} style={{paddingTop: "5px" }}  />
				</div>
			)}
		)}
		<br />
	</Accordion>
	}
	<br />
	{(stage === "INITIAL") &&
		<Accordion expanded={expandedPanel === "BALANCEMEMBERS"} onChange={handleAccordionChange("BALANCEMEMBERS")}>
		<Box align="right" className={(expandedPanel === "BALANCEMEMBERS") ? gClasses.selectedAccordian : gClasses.normalAccordian} borderColor="black" borderRadius={7} border={1} >
		<AccordionSummary aria-controls="panel1a-content" id="panel1a-header" expandIcon={<ExpandMoreIcon />}>
			<Typography align="left" >{"Balance member(s) Details"}</Typography>
		</AccordionSummary>
		</Box>
		<br />
		<DisplayApplicationNameValue name="Family Head" value={appData.balanceFamilyHodName} style={{paddingTop: "5px" }}  />
		<br />
		{/*  Display list if names whar are to be moved */}
		{appData.balanceFamilyName.map( (memberName, index) => {
			if (appData.balanceFamilyRelation[index] === 'Self') return;
			//var relation = (appData.transferRelation[index] === 'Self') ? "Family Head" : appData.transferRelation[index];
			return (
				<div key={memberName} >
					<DisplayApplicationNameValueNameBig name={memberName} value={appData.balanceFamilyRelation[index]} style={{paddingTop: "5px" }}  />
				</div>
			)}
		)}
		<br />
	</Accordion>
	}
	<br />
	{((props.applicationRec.status === APPLICATIONSTATUS.pending) && (stage === "INITIAL")) &&
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
	{((stage === "Remarks") && (props.applicationRec.status === "Pending")) &&
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
			readOnly = {(props.applicationRec.status !== "Pending")}   // Specifies that the text area is read-only, meaning the user cannot modify its content
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
	</div>
	)
}