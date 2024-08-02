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
	ApplicationHeader, DisplayApplicationNameValue,
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


export default function ApplicationAddEditMember(props) {
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
			console.log(props.applicationRec);
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
		let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/apply/approve/${props.applicationRec.id}/${sessionStorage.getItem("mid")}/${myRemarks}`;
		let resp = await axios.get(myUrl);
		props.onReturn.call(this, {status: STATUS_INFO.SUCCESS, applicationRec: resp.data, msg: `Application approved by Admin`});
		
	} catch (e) {
		console.log(e);
		showError(`Error approving Edit personal change`);
	}
}

async function  handleApplicationRejectConfirm(myRemarks) {
	try {
		let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/apply/reject/${props.applicationRec.id}/${sessionStorage.getItem("mid")}/${myRemarks}`;
		let resp = await axios.get(myUrl);
		props.onReturn.call(this, {status: STATUS_INFO.ERROR, applicationRec: resp.data, msg: `Application rejected by Admin`});
		
	} catch (e) {
		console.log(e);
		showError(`Error rejecting Edit personal change`);
	}
}



	//console.log(appData);
	if (!appData.hid) return false;
	console.log(appData.memberRec);
var newTitlePrefix = (appData.mode !== "ADD") ? "" : "New ";

return (
	<div>
	<ApplicationHeader applicationRec={props.applicationRec} header={`Application for ${appData.mode} member details`} />
	{(stage === "INITIAL") &&
	<div>
	<Typography align="center" style={{paddingTop: "5px" }} className={gClasses.pdhs_title} >Application data</Typography>
	<Typography align="center" style={{paddingTop: "5px" }} className={gClasses.pdhs_title} >
	{(appData.mode !== "ADD") ?
		`Modified details of ${getMemberName(appData.oldMemberRec)}` :
		`New details of ${getMemberName(appData.memberRec)}`
	}
	</Typography>
	<br />
	</div>
	}
	{(stage === "INITIAL") &&
	<Accordion expanded={expandedPanel === "NAMEDETAILS"} onChange={handleAccordionChange("NAMEDETAILS")}>
		<Box align="right" className={(expandedPanel === "NAMEDETAILS") ? gClasses.selectedAccordian : gClasses.normalAccordian} borderColor="black" borderRadius={7} border={1} >
		<AccordionSummary aria-controls="panel1a-content" id="panel1a-header" expandIcon={<ExpandMoreIcon />}>
			<Typography align="left" >{"Name Details"}</Typography>
		</AccordionSummary>
		</Box>
		{(appData.memberRec.title) &&
			<div>
			{(appData.mode !== "ADD") &&
			  <DisplayApplicationNameValue name="Old Title" value={appData.oldMemberRec.title} style={{paddingTop: "5px" }}  />
			}
			<DisplayApplicationNameValue name="New Title" value={appData.memberRec.title} style={{paddingTop: "5px" }}  />
			<Divider style={{ paddingBottom: "2px", backgroundColor: 'black', padding: 'none' }} />
			<br />
			</div>
		}
		{(appData.memberRec.lastName) &&
			<div>
			{(appData.mode !== "ADD") &&
			<DisplayApplicationNameValue name="Old Last Name" value={appData.oldMemberRec.lastName} style={{paddingTop: "5px" }}  />
			}
			<DisplayApplicationNameValue name="New Last Name" value={appData.memberRec.lastName} style={{paddingTop: "5px" }}  />
			<Divider style={{ paddingBottom: "2px", backgroundColor: 'black', padding: 'none' }} />
			<br />
			</div>
		}
		{(appData.memberRec.middleName) &&
			<div>
			{(appData.mode !== "ADD") &&
			<DisplayApplicationNameValue name="Old Middle Name" value={appData.oldMemberRec.middleName} style={{paddingTop: "5px" }}  />
			}
			<DisplayApplicationNameValue name="New Middle Name" value={appData.memberRec.middleName} style={{paddingTop: "5px" }}  />
			<Divider style={{ paddingBottom: "2px", backgroundColor: 'black', padding: 'none' }} />
			<br />
			</div>
		}
		{(appData.memberRec.firstName) &&
			<div>
			{(appData.mode !== "ADD") &&
			<DisplayApplicationNameValue name="Old First Name" value={appData.oldMemberRec.firstName} style={{paddingTop: "5px" }}  />
			}
			<DisplayApplicationNameValue name="New First Name" value={appData.memberRec.firstName} style={{paddingTop: "5px" }}  />
			<Divider style={{ paddingBottom: "2px", backgroundColor: 'black', padding: 'none' }} />
			<br />
			</div>
		}
		<br />
	</Accordion>
	}
	{(stage === "INITIAL") &&
	<Accordion expanded={expandedPanel === "PERSONALDETAILS"} onChange={handleAccordionChange("PERSONALDETAILS")}>
		<Box align="right" className={(expandedPanel === "PERSONALDETAILS") ? gClasses.selectedAccordian : gClasses.normalAccordian} borderColor="black" borderRadius={7} border={1} >
		<AccordionSummary aria-controls="panel1a-content" id="panel1a-header" expandIcon={<ExpandMoreIcon />}>
			<Typography align="left" >{"Personal Details"}</Typography>
		</AccordionSummary>
		</Box>
		{(appData.memberRec.relation) &&
			<div>
			<Divider style={{ paddingBottom: "2px", backgroundColor: 'black', padding: 'none' }} />
			{(appData.mode !== "ADD") &&
			<DisplayApplicationNameValue name="Old Relation" value={appData.oldMemberRec.relation} style={{paddingTop: "5px" }}  />
			}
			<DisplayApplicationNameValue name="New Relation" value={appData.memberRec.relation} style={{paddingTop: "5px" }}  />
			<br />
			</div>
		}
		{(appData.memberRec.gender) &&
			<div>
			<Divider style={{ paddingBottom: "2px", backgroundColor: 'black', padding: 'none' }} />
			{(appData.mode !== "ADD") &&
			<DisplayApplicationNameValue name="Old Gender" value={appData.oldMemberRec.gender} style={{paddingTop: "5px" }}  />
			}
			<DisplayApplicationNameValue name="New Gender" value={appData.memberRec.gender} style={{paddingTop: "5px" }}  />
			<br />
			</div>
		}
		{(appData.memberRec.dob) &&
			<div>
			<Divider style={{ paddingBottom: "2px", backgroundColor: 'black', padding: 'none' }} />
			{(appData.mode !== "ADD") &&
			<DisplayApplicationNameValue name="Old DOB" value={dateString(appData.oldMemberRec.dob)} style={{paddingTop: "5px" }}  />
			}
			<DisplayApplicationNameValue name="New DOB" value={dateString(appData.memberRec.dob)} style={{paddingTop: "5px" }}  />
			<br />
			</div>
		}
		{(appData.memberRec.bloodGroup) &&
			<div>
			<Divider style={{ paddingBottom: "2px", backgroundColor: 'black', padding: 'none' }} />
			{(appData.mode !== "ADD") &&
			<DisplayApplicationNameValue name="Old Blood group" value={appData.oldMemberRec.bloodGroup} style={{paddingTop: "5px" }}  />
			}
			<DisplayApplicationNameValue name="New Blood group" value={appData.memberRec.bloodGroup} style={{paddingTop: "5px" }}  />
			<br />
			</div>
		}
		{(appData.memberRec.mobile) &&
			<div>
			<Divider style={{ paddingBottom: "2px", backgroundColor: 'black', padding: 'none' }} />
			{(appData.mode !== "ADD") &&
			<DisplayApplicationNameValue name="Old Mobile" value={appData.oldMemberRec.mobile} style={{paddingTop: "5px" }}  />
			}
			<DisplayApplicationNameValue name="New Mobile" value={appData.memberRec.mobile} style={{paddingTop: "5px" }}  />
			<br />
			</div>
		}
		{(appData.memberRec.mobile1) &&
			<div>
			<Divider style={{ paddingBottom: "2px", backgroundColor: 'black', padding: 'none' }} />
			{(appData.mode !== "ADD") &&
			<DisplayApplicationNameValue name="Old Mobile 2" value={appData.oldMemberRec.mobile1} style={{paddingTop: "5px" }}  />
			}
			<DisplayApplicationNameValue name="New Mobile 2" value={appData.memberRec.mobile1} style={{paddingTop: "5px" }}  />
			<br />
			</div>
		}
		{(true && (appData.memberRec.email)) &&
			<div>
			<Divider style={{ paddingBottom: "2px", backgroundColor: 'black', padding: 'none' }} />
			{(appData.mode !== "ADD") &&
			<DisplayApplicationNameValue name="Old EMail" value={decrypt(appData.oldMemberRec.email)} style={{paddingTop: "5px" }}  />
			}
			<DisplayApplicationNameValue name="New Email" value={decrypt(appData.memberRec.email)} style={{paddingTop: "5px" }}  />
			<br />
			</div>
		}
		<br />
	</Accordion>
	}
	{((stage === "INITIAL")  && false) &&	
	<Accordion expanded={expandedPanel === "MARITALDETAILS"} onChange={handleAccordionChange("MARITALDETAILS")}>
		<Box align="right" className={(expandedPanel === "MARITALDETAILS") ? gClasses.selectedAccordian : gClasses.normalAccordian} borderColor="black" borderRadius={7} border={1} >
		<AccordionSummary aria-controls="panel1a-content" id="panel1a-header" expandIcon={<ExpandMoreIcon />}>
			<Typography align="left" >{"Marital Details"}</Typography>
		</AccordionSummary>
		</Box>
		{(appData.memberRec.emsStatus) &&
			<div>
			<Divider style={{ paddingBottom: "2px", backgroundColor: 'black', padding: 'none' }} />
			<DisplayApplicationNameValue name="Old Marital status" value={dateString(appData.oldMemberRec.emsStatus)} style={{paddingTop: "5px" }}  />
			<DisplayApplicationNameValue name="New Marital status" value={dateString(appData.memberRec.emsStatus)} style={{paddingTop: "5px" }}  />
			<br />
			</div>
		}
		{(appData.memberRec.dateOfMarriage) &&
			<div>
			<Divider style={{ paddingBottom: "2px", backgroundColor: 'black', padding: 'none' }} />
			<DisplayApplicationNameValue name="Old DOM" value={dateString(appData.oldMemberRec.dateOfMarriage)} style={{paddingTop: "5px" }}  />
			<DisplayApplicationNameValue name="New DOM" value={dateString(appData.memberRec.dateOfMarriage)} style={{paddingTop: "5px" }}  />
			<br />
			</div>
		}
		{(appData.memberRec.spouseMid) &&
			<div>
			<Divider style={{ paddingBottom: "2px", backgroundColor: 'black', padding: 'none' }} />
			<DisplayApplicationNameValue name="Old Spouse" value={(appData.oldMemberRec.spouseMid !== 0) ? getMemberName(appData.oldMemberRec,false, false) : ""} style={{paddingTop: "5px" }}  />
			<DisplayApplicationNameValue name="New Spouse" value={appData.memberRec.spouseName} style={{paddingTop: "5px" }}  />
			<br />
			</div>
		}
		<br />
	</Accordion>
	}
	{((stage === "INITIAL") && false) &&
	<Accordion expanded={expandedPanel === "OTHERDETAILS"} onChange={handleAccordionChange("OTHERDETAILS")}>
		<Box align="right" className={(expandedPanel === "OTHERDETAILS") ? gClasses.selectedAccordian : gClasses.normalAccordian} borderColor="black" borderRadius={7} border={1} >
		<AccordionSummary aria-controls="panel1a-content" id="panel1a-header" expandIcon={<ExpandMoreIcon />}>
			<Typography align="left" >{"Other Details"}</Typography>
		</AccordionSummary>
		</Box>
		<br />
	</Accordion>
	}
	{(stage === "INITIAL") &&
	<Accordion expanded={expandedPanel === "OFFICEDETAILS"} onChange={handleAccordionChange("OFFICEDETAILS")}>
		<Box align="right" className={(expandedPanel === "OFFICEDETAILS") ? gClasses.selectedAccordian : gClasses.normalAccordian} borderColor="black" borderRadius={7} border={1} >
		<AccordionSummary aria-controls="panel1a-content" id="panel1a-header" expandIcon={<ExpandMoreIcon />}>
			<Typography align="left" >{"Office Details"}</Typography>
		</AccordionSummary>
		</Box>
		{(appData.memberRec.occupation) &&
			<div>
			<Divider style={{ paddingBottom: "2px", backgroundColor: 'black', padding: 'none' }} />
			{(appData.mode !== "ADD") &&
			<DisplayApplicationNameValue name="Old Occupation" value={appData.oldMemberRec.occupation} style={{paddingTop: "5px" }}  />
			}
			<DisplayApplicationNameValue name="New Occupation" value={appData.memberRec.occupation} style={{paddingTop: "5px" }}  />
			<br />
			</div>
		}
		{(appData.memberRec.officeName) &&
			<div>
			<Divider style={{ paddingBottom: "2px", backgroundColor: 'black', padding: 'none' }} />
			{(appData.mode !== "ADD") &&
			<DisplayApplicationNameValue name="Old Office" value={appData.oldMemberRec.officeName} style={{paddingTop: "5px" }}  />
			}
			<DisplayApplicationNameValue name="New Office" value={appData.memberRec.officeName} style={{paddingTop: "5px" }}  />
			<br />
			</div>
		}
		{(appData.memberRec.education) &&
			<div>
			<Divider style={{ paddingBottom: "2px", backgroundColor: 'black', padding: 'none' }} />
			{(appData.mode !== "ADD") &&
			<DisplayApplicationNameValue name="Old Education" value={appData.oldMemberRec.education} style={{paddingTop: "5px" }}  />
			}
			<DisplayApplicationNameValue name="New Education" value={appData.memberRec.education} style={{paddingTop: "5px" }}  />
			<br />
			</div>
		}
		{(appData.memberRec.officePhone) &&
			<div>
			<Divider style={{ paddingBottom: "2px", backgroundColor: 'black', padding: 'none' }} />
			{(appData.mode !== "ADD") &&
			<DisplayApplicationNameValue name="Old Office Phone" value={appData.oldMemberRec.officePhone} style={{paddingTop: "5px" }}  />
			}
			<DisplayApplicationNameValue name="New Office Phone" value={appData.memberRec.officePhone} style={{paddingTop: "5px" }}  />
			<br />
			</div>
		}
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
