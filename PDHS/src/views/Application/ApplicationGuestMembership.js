import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
// import { Switch, Route, Link } from 'react-router-dom';
import { ValidatorForm, TextValidator, TextValidatorcvariant} from 'react-material-ui-form-validator';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';


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
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


import globalStyles from "assets/globalStyles";

import VsButton from "CustomComponents/VsButton"; 
import VsCancel from "CustomComponents/VsCancel";


import {
	ADMIN, APPLICATIONTYPES, APPLICATIONSTATUS, SELECTSTYLE, 
  PADSTYLE,
	MEMBERTITLE, RELATION, SELFRELATION, GENDER, BLOODGROUP, MARITALSTATUS,
	STATUS_INFO, OWNER,
   CASTEOBJ, HUMADSUBCASTEOBJ,
} from 'views/globals';

import {
   isFamilyLock,
	isMobile, getWindowDimensions, displayType, decrypt, encrypt,
	vsDialog, showError, showSuccess, showInfo,
	getMemberName,
	dateString, disableFutureDt,
	hasPRWSpermission, hasPJYMpermission, hasHumadpermission,
	dateStringMMM, getAge,
} from 'views/functions';

import {
	setTab,
} from "CustomComponents/CricDreamTabs.js"


export default function ApplicationGuestMembership() {
	const gClasses = globalStyles();
   
	const myProps = JSON.parse(sessionStorage.getItem("application_appRec"))
	const appData = JSON.parse(myProps.applicationRec.data);
	
	const applicantFullName = `${appData.title} ${appData.lastName} ${appData.firstName} ${appData.middleName}` + ((appData.alias != '') ? ` ( ${appData.alias} )` : '');
	const prwsStatus  = ((appData.prwsMembership) ? "Yes (default)" : "No") + " - " + myProps.applicationRec.approvalStatus[0].status;
	const pjymStatus  = ((appData.pjymMembership) ? "Yes" : "No") + " - " + myProps.applicationRec.approvalStatus[1].status;
	const humadStatus = ((appData.humadMembership) ? "Yes" : "No") + " - " + myProps.applicationRec.approvalStatus[2].status;
	const caste_subcaste = ((appData.caste === CASTEOBJ.humad) ? `${appData.subCaste}-` : '') + appData.caste;
	
	const iHavePrwsPerm = hasPRWSpermission();
	const iHavePjymPerm = hasPJYMpermission();
	const iHaveHumadPerm = hasHumadpermission();
	
	const [registerStatus, setRegisterStatus] = useState(0);
	const [remarks, setRemarks] = useState("");
	const [action, setAction] = useState("");	
	const [stage, setStage] = useState("INITIAL");
   const [prwsMem, setPrwsMem] = useState("nochange");

	// show in accordion
	const [expandedPanel, setExpandedPanel] = useState("");
	const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedPanel(isExpanded ? panel : false);
    setRegisterStatus(0);
  };
	
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
	if (myProps.applicationRec.owner === OWNER.prws) {
      // if dasha humad
      var msg = `Are you sure you want to reject Pratapgarh Raj. Welfare Samiti membership?`
      vsDialog("Reject PRWS membership", msg,
      {label: "Yes", onClick: () => handleApplicationRejectVerified("Reject") },
      //{label: "No", onClick: () => handleApplicationApproveVerified("false")  }
			{label: "No" }
      );  
  }
	else if (myProps.applicationRec.owner === OWNER.pjym) {
      // if dasha humad
      var msg = `Are you sure you want to reject Pratapgarh Jain Yuva Manch membership?`
      vsDialog("Reject PJYM membership", msg,
      {label: "Yes", onClick: () => handleApplicationRejectVerified("Reject") },
      //{label: "No", onClick: () => handleApplicationApproveVerified("false")  }
			{label: "No" }
      );  
   }
	else if (myProps.applicationRec.owner === OWNER.humad) {
      // if dasha humad
      var msg = `Are you sure you want to reject Humad Samaj membership?`
      vsDialog("Reject Humad Samaj membership", msg,
      {label: "Yes", onClick: () => handleApplicationRejectVerified("Reject") },
      //{label: "No", onClick: () => handleApplicationApproveVerified("false")  }
			{label: "No" }
      );  
   }
}

function handleApplicationRejectVerified(newPrwsaction) {
	setAction(newPrwsaction);
	setStage("Remarks");	
}

async function handleApplicationApprove() {
	
	if (myProps.applicationRec.owner === OWNER.prws) {
      // if dasha humad
      var msg = `Are you sure you want to approve Pratapgarh Raj. Welfare Samiti membership?`
      vsDialog("Approve PRWS membership", msg,
      {label: "Yes", onClick: () => handleApplicationApproveVerified("Approve") },
      //{label: "No", onClick: () => handleApplicationApproveVerified("false")  }
			{label: "No" }
      );  
   }
	 else if (myProps.applicationRec.owner === OWNER.pjym) {
      // if dasha humad
      var msg = `Are you sure you want to approve Pratapgarh Jain Yuva Manch membership?`
      vsDialog("Approve PJYM membership", msg,
      {label: "Yes", onClick: () => handleApplicationApproveVerified("Approve") },
      //{label: "No", onClick: () => handleApplicationApproveVerified("false")  }
			{label: "No" }
      );  
   }
	 else if (myProps.applicationRec.owner === OWNER.humad) {
      // if dasha humad
      var msg = `Are you sure you want to approve Humad Samaj membership?`
      vsDialog("Approve Humad Samaj membership", msg,
      {label: "Yes", onClick: () => handleApplicationApproveVerified("Approve") },
      //{label: "No", onClick: () => handleApplicationApproveVerified("false")  }
			{label: "No" }
      );  
   }
}
	

async function handleApplicationApproveVerified(newPrwsaction) {
   setPrwsMem(newPrwsaction);
   //console.log(newPrwsaction);
	 setAction(newPrwsaction);
	setStage("Remarks");
}


function handleRemarksDone() {
	var myRemarks = (remarks !== "") ? remarks : "-";
	if (action === "Approve")
		handleApplicationApproveConfirm(myRemarks);
	else
		handleApplicationRejectConfirm(myRemarks);
}


async function  handleApplicationApproveConfirm(myRemarks) {
   var finRem = myProps.applicationRec.owner + "ARUNSALGIA" + myRemarks;
	try {
		let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/apply/approve/${myProps.applicationRec.id}/${sessionStorage.getItem("mid")}/${finRem}`;
		//console.log(myUrl);
		let resp = await axios.get(myUrl);
		var returnStatus = {
			status: STATUS_INFO.SUCCESS, applicationRec: resp.data, 
			msg: `Application approved by Admin`
		};
		//showSuccess(`Application approved by Admin`);
		sessionStorage.setItem("application_returnstatus", JSON.stringify(returnStatus));
		setTab(process.env.REACT_APP_APPLICATION);	
	} catch (e) {
		//console.log(e);
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
		//myProps.onReturn.call(this, {status: STATUS_INFO.SUCCESS, applicationRec: resp.data, msg: `Application rejected by Admin`});
		
	} catch (e) {
		//console.log(e);
		showError(`Error rejecting edit general`);
	}
}

function handleCancel() {
	setTab(process.env.REACT_APP_APPLICATION);
}


//console.log(appData.newHodRec);
return (
	<div className={gClasses.webPage} >
	<Container component="main" maxWidth="xs">	
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} style={{paddingLeft: "5px", paddingRight: "5px"}} >
	<VsCancel align="right" onClick={handleCancel} />
	<ApplicationHeader applicationRec={myProps.applicationRec} header="Application for Guest membership" />
	<br />
	<DisplayApplicationNameValue name="Applicant Name" value={applicantFullName} />
	<DisplayApplicationNameValue name="Applied for PRWS" value={prwsStatus} different={false} />
	<DisplayApplicationNameValue name="Applied for PJYM" value={pjymStatus} different={false} />
	<DisplayApplicationNameValue name="Applied for Humad" value={humadStatus} different={false} />
	<br />
	<Accordion expanded={expandedPanel === "STATUS"} onChange={handleAccordionChange("STATUS")}>
		<Box align="right" className={(expandedPanel === "STATUS") ? gClasses.selectedAccordian : gClasses.normalAccordian} borderColor="black" borderRadius={7} border={1} >
		<AccordionSummary aria-controls="panel1a-content" id="panel1a-header" expandIcon={<ExpandMoreIcon />}>
			<Typography align="left" >{"Application Status Details"}</Typography>
		</AccordionSummary>
		</Box>
		<br />
		<DisplayApplicationNameValue name="PRWS Appl."  value={(myProps.applicationRec.approvalStatus[0].status === APPLICATIONSTATUS.pending) ? APPLICATIONSTATUS.pending : `${myProps.applicationRec.approvalStatus[0].status} by ${myProps.applicationRec.approvalStatus[0].approvalName}`}  />
		<DisplayApplicationNameValue name="Date" value={dateStringMMM(myProps.applicationRec.approvalStatus[0].date)}  />
		<DisplayApplicationNameValue name="Comments" value={myProps.applicationRec.approvalStatus[0].comments}  />
		<br />
		<Divider style={{ paddingTop: "2px", backgroundColor: 'black', padding: 'none' }} />
		<br />
		<DisplayApplicationNameValue name="PJYM Appl."  value={(myProps.applicationRec.approvalStatus[1].status === APPLICATIONSTATUS.pending) ? APPLICATIONSTATUS.pending : `${myProps.applicationRec.approvalStatus[1].status} by ${myProps.applicationRec.approvalStatus[1].approvalName}`}  />
		<DisplayApplicationNameValue name="Date" value={dateStringMMM(myProps.applicationRec.approvalStatus[1].date)}  />
		<DisplayApplicationNameValue name="Comments" value={myProps.applicationRec.approvalStatus[1].comments}  />
		<br />
		<Divider style={{ paddingTop: "2px", backgroundColor: 'black', padding: 'none' }} />
		<br />
		<DisplayApplicationNameValue name="Humad Appl." value={(myProps.applicationRec.approvalStatus[2].status === APPLICATIONSTATUS.pending) ? APPLICATIONSTATUS.pending : `${myProps.applicationRec.approvalStatus[2].status} by ${myProps.applicationRec.approvalStatus[2].approvalName}`}  />
		<DisplayApplicationNameValue name="Date" value={dateStringMMM(myProps.applicationRec.approvalStatus[2].date)}  />
		<DisplayApplicationNameValue name="Comments" value={myProps.applicationRec.approvalStatus[2].comments}  />
		<br />
	</Accordion>
	<br />
	{(iHavePrwsPerm && (myProps.applicationRec.status === APPLICATIONSTATUS.pending) && myProps.applicationRec.owner === OWNER.prws) &&
		<div>
		<Accordion expanded={expandedPanel === "PRWSINFO"} onChange={handleAccordionChange("PRWSINFO")}>
		<Box align="right" className={(expandedPanel === "PRWSINFO") ? gClasses.selectedAccordian : gClasses.normalAccordian} borderColor="black" borderRadius={7} border={1} >
		<AccordionSummary aria-controls="panel1a-content" id="panel1a-header" expandIcon={<ExpandMoreIcon />}>
			<Typography align="left" >{"PRWS Admin Info"}</Typography>
		</AccordionSummary>
		</Box>
		<br />
		<DisplayApplicationNameValue name="Gotra" value={appData.gotra}  />
		<DisplayApplicationNameValue name="Caste" value={caste_subcaste}  />
		<DisplayApplicationNameValue name="Village" value={appData.village}   />
		<DisplayApplicationNameValue name="City" value={`${appData.city} ${(appData.mmr) ? '- (MMR)' : ''} `}   />
		<DisplayApplicationNameValue name="Country" value={appData.country}   />
		<br />
		</Accordion>
		<br />
		</div>
	}	
	{(iHavePjymPerm && (myProps.applicationRec.status === APPLICATIONSTATUS.pending) && myProps.applicationRec.owner === OWNER.pjym) &&
		<div>
		<Accordion expanded={expandedPanel === "PJYMINFO"} onChange={handleAccordionChange("PJYMINFO")}>
		<Box align="right" className={(expandedPanel === "PJYMINFO") ? gClasses.selectedAccordian : gClasses.normalAccordian} borderColor="black" borderRadius={7} border={1} >
		<AccordionSummary aria-controls="panel1a-content" id="panel1a-header" expandIcon={<ExpandMoreIcon />}>
			<Typography align="left" >{"PJYM Admin Info"}</Typography>
		</AccordionSummary>
		</Box>
		<br />
		<DisplayApplicationNameValue name="PRWS Status" value={"Approved"}  />
		<DisplayApplicationNameValue name="Approved By" value={myProps.applicationRec.approvalStatus[0].approvalName}  />
		<DisplayApplicationNameValue name="Approved On" value={dateStringMMM(myProps.applicationRec.approvalStatus[0].date)}  />
		<DisplayApplicationNameValue name="Comments" value={myProps.applicationRec.approvalStatus[0].comments}  />
		<br />
		<Divider style={{ paddingTop: "2px", backgroundColor: 'black', padding: 'none' }} />
		<DisplayApplicationNameValue name="Gotra" value={appData.gotra}  />
		<DisplayApplicationNameValue name="Caste" value={caste_subcaste}  />
		<DisplayApplicationNameValue name="Village" value={appData.village}   />
		<DisplayApplicationNameValue name="City" value={`${appData.city} ${(appData.mmr) ? '- (MMR)' : ''} `}   />
		<DisplayApplicationNameValue name="Country" value={appData.country}   />
		<DisplayApplicationNameValue name="Applicant age" value={getAge(appData.dob)}  />
		<br />
		</Accordion>
		<br />
		</div>
	}	
	{(iHaveHumadPerm && (myProps.applicationRec.status === APPLICATIONSTATUS.pending) && myProps.applicationRec.owner === OWNER.humad) &&
		<div>
		<Accordion expanded={expandedPanel === "HUMADINFO"} onChange={handleAccordionChange("HUMADINFO")}>
		<Box align="right" className={(expandedPanel === "HUMADINFO") ? gClasses.selectedAccordian : gClasses.normalAccordian} borderColor="black" borderRadius={7} border={1} >
		<AccordionSummary aria-controls="panel1a-content" id="panel1a-header" expandIcon={<ExpandMoreIcon />}>
			<Typography align="left" >{"Humad Admin Info"}</Typography>
		</AccordionSummary>
		</Box>
		<br />
		<DisplayApplicationNameValue name="PRWS Status" value={"Approved"}  />
		<DisplayApplicationNameValue name="Approved By" value={myProps.applicationRec.approvalStatus[0].approvalName}  />
		<DisplayApplicationNameValue name="Approved On" value={dateStringMMM(myProps.applicationRec.approvalStatus[0].date)}  />
		<DisplayApplicationNameValue name="Comments" value={myProps.applicationRec.approvalStatus[0].comments}  />
		<br />
		<Divider style={{ paddingTop: "2px", backgroundColor: 'black', padding: 'none' }} />
		<br />
		<DisplayApplicationNameValue name="PJYM Status" value={"Approved"}  />
		<DisplayApplicationNameValue name="Approved By" value={myProps.applicationRec.approvalStatus[1].approvalName}  />
		<DisplayApplicationNameValue name="Approved On" value={dateStringMMM(myProps.applicationRec.approvalStatus[1].date)}  />
		<DisplayApplicationNameValue name="Comments" value={myProps.applicationRec.approvalStatus[1].comments}  />
		<br />
		<Divider style={{ paddingTop: "2px", backgroundColor: 'black', padding: 'none' }} />
		<br />
		<DisplayApplicationNameValue name="Gotra" value={appData.gotra}  />		
		<DisplayApplicationNameValue name="Caste" value={caste_subcaste}  />
		<DisplayApplicationNameValue name="Village" value={appData.village}   />
		<br />
		</Accordion>
		<br />
		</div>
	}	
		<Accordion expanded={expandedPanel === "GOTRADETAILS"} onChange={handleAccordionChange("GOTRADETAILS")}>
		<Box align="right" className={(expandedPanel === "GOTRADETAILS") ? gClasses.selectedAccordian : gClasses.normalAccordian} borderColor="black" borderRadius={7} border={1} >
		<AccordionSummary aria-controls="panel1a-content" id="panel1a-header" expandIcon={<ExpandMoreIcon />}>
			<Typography align="left" >{"Gotra and Caste"}</Typography>
		</AccordionSummary>
		</Box>
		<br />
		<DisplayApplicationNameValue name="Gotra" value={appData.gotra}  />
		<DisplayApplicationNameValue name="Caste" value={caste_subcaste}  />
		<DisplayApplicationNameValue name="Village" value={appData.village}   />
		<br />
	</Accordion>
	<br />
	<Accordion expanded={expandedPanel === "PERSONALDETAILS"} onChange={handleAccordionChange("PERSONALDETAILS")}>
		<Box align="right" className={(expandedPanel === "PERSONALDETAILS") ? gClasses.selectedAccordian : gClasses.normalAccordian} borderColor="black" borderRadius={7} border={1} >
		<AccordionSummary aria-controls="panel1a-content" id="panel1a-header" expandIcon={<ExpandMoreIcon />}>
			<Typography align="left" >{"Personal Details"}</Typography>
		</AccordionSummary>
		</Box>
		<br />
		<DisplayApplicationNameValue name="Gender" value={appData.gender}  />
		<DisplayApplicationNameValue name="Birth Date" value={dateStringMMM(appData.dob)}  />
		<DisplayApplicationNameValue name="Marital Status" value={appData.emsStatus}  />
		{(appData.emsStatus === 'Married') &&
		<DisplayApplicationNameValue name="Marriage Date" value={dateStringMMM(appData.dom)}  />
		}
		<DisplayApplicationNameValue name="Mobile 1" value={appData.persMobile1}  />
		<DisplayApplicationNameValue name="Mobile 2" value={appData.persMobile2}  />
		<DisplayApplicationNameValue name="Email 1" value={decrypt(appData.persEmail1)}  />
		<DisplayApplicationNameValue name="Email 2" value={decrypt(appData.persEmail2)}  />
		<br />
	</Accordion>
	<br />
	<Accordion expanded={expandedPanel === "ADDRESS"} onChange={handleAccordionChange("ADDRESS")}>
		<Box align="right" className={(expandedPanel === "ADDRESS") ? gClasses.selectedAccordian : gClasses.normalAccordian} borderColor="black" borderRadius={7} border={1} >
		<AccordionSummary aria-controls="panel1a-content" id="panel1a-header" expandIcon={<ExpandMoreIcon />}>
			<Typography align="left" >{"Address"}</Typography>
		</AccordionSummary>
		</Box>
		<br />
		<DisplayApplicationNameValue name="Indian Resident" value={(appData.indianResident) ? "Yes" : "No"}  />
		<DisplayApplicationNameValue name="Address" value={appData.addr1}  />
		{(appData.addr2 !== "") &&
		<DisplayApplicationNameValue name="" value={appData.addr2}  />
		}
		{(appData.addr3 !== "") &&
		<DisplayApplicationNameValue name="" value={appData.addr3}  />
		}
		{(appData.addr4 !== "") &&		
		<DisplayApplicationNameValue name="" value={appData.addr4}  />
		}
		{(appData.addr5 !== "") &&		
		<DisplayApplicationNameValue name="" value={appData.addr5}  />
		}
		<DisplayApplicationNameValue name="Suburb" value={appData.suburb}  />
		<DisplayApplicationNameValue name="District" value={appData.district} />
		<DisplayApplicationNameValue name="City" value={`${appData.city} ${(appData.mmr) ? '- (MMR)' : ''} `}  />
		<DisplayApplicationNameValue name="Pin Code" value={appData.pinCode}  />
		<DisplayApplicationNameValue name="Country" value={(appData.indianResident) ? "India" : appData.country}  />
		<br />
	</Accordion>
	<br />
	{(iHavePrwsPerm && (myProps.applicationRec.status === APPLICATIONSTATUS.pending) && (stage === "INITIAL")) &&
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
	<br />
	<ToastContainer />
	</Box>
	</Container>
	</div>
	)
}
