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
	STATUS_INFO,
   CASTEOBJ, HUMADSUBCASTEOBJ,
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


export default function ApplicationEditGeneral() {
	const gClasses = globalStyles();
   
	var myProps = JSON.parse(sessionStorage.getItem("application_appRec"));
   //console.log(myProps);
	//console.log(JSON.parse(myProps.applicationRec.data).oldHodRec);
	//console.log(JSON.parse(myProps.applicationRec.data).newHodRec);
	
	const [registerStatus, setRegisterStatus] = useState(0);
	const [appData, setAppdata] = useState(JSON.parse(myProps.applicationRec.data));
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
	setAction("Reject");
	setStage("Reject");
}

async function handleApplicationApprove() {
   //console.log(appData.oldHodRec);
   //console.log(appData.newHodRec);

	if ((appData.oldHodRec.caste == CASTEOBJ.humad) && (appData.oldHodRec.subCaste == HUMADSUBCASTEOBJ.dasha)) {
      // if dasha humad
      var msg = `Set membership of Pratapgarh Raj. Welfare samiti?`
      vsDialog("PRWS membership", msg,
      {label: "Yes", onClick: () => handleApplicationApproveVerified("true") },
      {label: "No", onClick: () => handleApplicationApproveVerified("false")  }
      );  
   }
   else
      handleApplicationApproveVerified("nochange");  
}
	

async function handleApplicationApproveVerified(newPrwsSts) {
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
   var finRem = prwsMem + "ARUNSALGIA" + myRemarks;
	try {
		let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/apply/approve/${myProps.applicationRec.id}/${sessionStorage.getItem("mid")}/${finRem}`;
		let resp = await axios.get(myUrl);
		var returnStatus = {
			status: STATUS_INFO.SUCCESS, applicationRec: resp.data, 
			msg: `Application approved by Admin`
			};
		sessionStorage.setItem("application_returnstatus", JSON.stringify(returnStatus));
		setTab(process.env.REACT_APP_APPLICATION);
		//myProps.onReturn.call(this, {status: STATUS_INFO.SUCCESS, applicationRec: resp.data, msg: `Application rejected by Admin`});
		
	} catch (e) {
		console.log(e);
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
		console.log(e);
		showError(`Error rejecting edit general`);
	}
}


function isChangeOfAddress(oldHodRec, newHodRec) {
	if (oldHodRec.indianResident !== newHodRec.indianResident) return true;
	if (oldHodRec.resAddr1 !== newHodRec.resAddr1) return true;
	if (oldHodRec.resAddr2 !== newHodRec.resAddr2) return true;
	if (oldHodRec.resAddr3 !== newHodRec.resAddr3) return true;
	if (oldHodRec.resAddr4 !== newHodRec.resAddr4) return true;
	if (oldHodRec.resAddr5 !== newHodRec.resAddr5) return true;
   if (oldHodRec.pinCode !== newHodRec.pinCode) return true;
	if (oldHodRec.indianResident) {
		if (oldHodRec.city !== newHodRec.city) return true;
		if (oldHodRec.district !== newHodRec.district) return true;
		if (oldHodRec.pinCode !== newHodRec.pinCode) return true;
		if (oldHodRec.state !== newHodRec.state) return true;
		if (oldHodRec.suburb !== newHodRec.suburb) return true;
	}
	else {
		// for NRI only check if country is matching
		if (oldHodRec.country !== newHodRec.country) return true;	
	}
	// all items matches. Thus declare no chnage in address
	return false;
}

function isChangeOfHomeTownContact(oldHodRec, newHodRec) {
	if (oldHodRec.village !== newHodRec.village) return true;
	if (oldHodRec.resPhone1 !== newHodRec.resPhone1) return true;
	if (oldHodRec.resPhone2 !== newHodRec.resPhone2) return true;
	//console.log("allMatches");
	return false;
}


function handleCancel() {
	setTab(process.env.REACT_APP_APPLICATION);
}

function getPhoneString(phone1, phone2) {
	var myPhone = phone1;
	
	if (phone2 !== "") {
		if (myPhone !== "") myPhone = myPhone + " / ";
		myPhone = myPhone + phone2;
	}
	
	if (myPhone === "") myPhone = "-";
	return myPhone;
}

//console.log(appData.newHodRec);
return (
	<div className={gClasses.webPage} >
	<Container component="main" maxWidth="xs">	
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} style={{paddingLeft: "5px", paddingRight: "5px"}} >
	<VsCancel align="right" onClick={handleCancel} />
	<ApplicationHeader applicationRec={myProps.applicationRec} header="Application for change of Res. address and phone " />
	<br />
	{(stage === "INITIAL") &&
		<div>
		<Accordion expanded={expandedPanel === "generaldetails"} onChange={handleAccordionChange("generaldetails")}>
			<Box align="right" className={(expandedPanel === "generaldetails") ? gClasses.selectedAccordian : gClasses.normalAccordian} borderColor="black" borderRadius={7} border={1} >
			<AccordionSummary aria-controls="panel1a-content" id="panel1a-header" expandIcon={<ExpandMoreIcon />}>
				<Typography align="left" >{"Res. Address"}</Typography>
			</AccordionSummary>
			</Box>
			<br />
			<DisplayApplicationName name={(isChangeOfAddress(appData.oldHodRec, appData.newHodRec)) ? "Old Res. Address" : "No Change in Res. Address"} style={{paddingTop: "5px" }}  />
			<DisplayApplicationNameValue name="Indian Resident" value={(appData.oldHodRec.indianResident) ? "Yes" : "No"}  />
			<DisplayApplicationNameValue name="Address" value={appData.oldHodRec.resAddr1} style={{paddingTop: "5px" }}  />
			<DisplayApplicationNameValue name="" value={appData.oldHodRec.resAddr2}  />
			<DisplayApplicationNameValue name="" value={appData.oldHodRec.resAddr3}   />
			<DisplayApplicationNameValue name="" value={appData.oldHodRec.resAddr4}  />
			<DisplayApplicationNameValue name="" value={appData.oldHodRec.resAddr5}   />
			{(appData.oldHodRec.indianResident) &&
				<div>
				<DisplayApplicationNameValue name="Suburb" value={appData.oldHodRec.suburb} style={{paddingTop: "5px" }}  />
				<DisplayApplicationNameValue name="District" value={appData.oldHodRec.district}   />
				<DisplayApplicationNameValue name="City" value={appData.oldHodRec.city}   />
				<DisplayApplicationNameValue name="State" value={appData.oldHodRec.state}  />
				<DisplayApplicationNameValue name="Pin Code" value={appData.oldHodRec.pinCode}  />		
				</div>
			}
			{(!appData.oldHodRec.indianResident) &&
				<div>
				<DisplayApplicationNameValue name="ZIP Code" value={(appData.oldHodRec.pinCode > 0) ? appData.oldHodRec.pinCode : '-'}  />		
				<DisplayApplicationNameValue name="Country" value={appData.oldHodRec.country} style={{paddingTop: "5px" }}  />
				</div>
			}
			{(isChangeOfAddress(appData.oldHodRec, appData.newHodRec)) &&
         <div>
				<Divider style={{ marginTop: "10px", marginBottom: "10px", paddingTop: "1px", backgroundColor: 'black', padding: 'none' }} />				
            <DisplayApplicationName name={"New Res. Address"} style={{paddingTop: "5px" }}  />
			   <DisplayApplicationNameValue name="Indian Resident" value={(appData.newHodRec.indianResident) ? "Yes" : "No"} different={appData.oldHodRec.indianResident !== appData.newHodRec.indianResident}  />
				<DisplayApplicationNameValue name="Address" value={appData.newHodRec.resAddr1} different={appData.oldHodRec.resAddr1 !== appData.newHodRec.resAddr1} style={{paddingTop: "5px" }}  />
				<DisplayApplicationNameValue name="" value={appData.newHodRec.resAddr2} different={appData.oldHodRec.resAddr2 !== appData.newHodRec.resAddr2}   />
				<DisplayApplicationNameValue name="" value={appData.newHodRec.resAddr3} different={appData.oldHodRec.resAddr3 !== appData.newHodRec.resAddr3} />
				<DisplayApplicationNameValue name="" value={appData.newHodRec.resAddr4} different={appData.oldHodRec.resAddr4 !== appData.newHodRec.resAddr4}  />
				<DisplayApplicationNameValue name="" value={appData.newHodRec.resAddr5} different={appData.oldHodRec.resAddr5 !== appData.newHodRec.resAddr5}  />
				{(appData.newHodRec.indianResident) &&
					<div>
					<DisplayApplicationNameValue name="Suburb" value={appData.newHodRec.suburb} different={appData.oldHodRec.suburb !== appData.newHodRec.suburb} style={{paddingTop: "5px" }}  />
					<DisplayApplicationNameValue name="District" value={appData.newHodRec.district}  different={appData.oldHodRec.district !== appData.newHodRec.district} />
					<DisplayApplicationNameValue name="City" value={appData.newHodRec.city + (appData.newHodRec.newCity ? " (new)" : "")} different={appData.oldHodRec.city !== appData.newHodRec.city} />
					<DisplayApplicationNameValue name="State" value={appData.newHodRec.state} different={appData.oldHodRec.state !== appData.newHodRec.state}  />
					<DisplayApplicationNameValue name="PinCode" value={appData.newHodRec.pinCode} different={appData.oldHodRec.pinCode !== appData.newHodRec.pinCode}  />		
					</div>
				}
				{(!appData.newHodRec.indianResident) &&
					<div>
               <DisplayApplicationNameValue name="ZIP Code" value={(appData.newHodRec.pinCode > 0) ? appData.newHodRec.pinCode : '-'} different={appData.oldHodRec.pinCode !== appData.newHodRec.pinCode} style={{paddingTop: "5px" }}  />
					<DisplayApplicationNameValue name="Country" value={appData.newHodRec.country + (appData.newHodRec.newCountry ? " (new)" : "")} different={appData.oldHodRec.country !== appData.newHodRec.country} style={{paddingTop: "5px" }}  />
					</div>
				}
         </div>
			}
			<br />
		</Accordion>	
		<br />
		<Accordion expanded={expandedPanel === "hometown"} onChange={handleAccordionChange("hometown")}>
			<Box align="right" className={(expandedPanel === "hometown") ? gClasses.selectedAccordian : gClasses.normalAccordian} borderColor="black" borderRadius={7} border={1} >
			<AccordionSummary aria-controls="panel1a-content" id="panel1a-header" expandIcon={<ExpandMoreIcon />}>
				<Typography align="left" >{"Home town & Contact"}</Typography>
			</AccordionSummary>
			</Box>
			<DisplayApplicationName name={(isChangeOfHomeTownContact(appData.oldHodRec, appData.newHodRec)) ? "Old Home town & Contact" : "No Change in Home town & Contact"} style={{paddingTop: "5px" }}  />
			<DisplayApplicationNameValue name="Home Town" value={appData.oldHodRec.village}  style={{paddingTop: "5px" }}  />
			<DisplayApplicationNameValue name="Phone 1" value={appData.oldHodRec.resPhone1}  />
			<DisplayApplicationNameValue name="Phone 2" value={appData.oldHodRec.resPhone2}  />
			{(isChangeOfHomeTownContact(appData.oldHodRec, appData.newHodRec)) &&
			<div>
			<Divider style={{ marginTop: "10px", marginBottom: "10px", paddingTop: "1px", backgroundColor: 'black', padding: 'none' }} />				
			<DisplayApplicationName name={"New Home town & Contact"} style={{paddingTop: "5px" }}  />
			<DisplayApplicationNameValue name="Home Town" value={appData.newHodRec.village} different={appData.oldHodRec.village !== appData.newHodRec.village} style={{paddingTop: "5px" }}  />
			<DisplayApplicationNameValue name="Phone 1" value={appData.newHodRec.resPhone1} different={appData.oldHodRec.resPhone1 !== appData.newHodRec.resPhone1}   />
			<DisplayApplicationNameValue name="Phone 2" value={appData.newHodRec.resPhone2} different={appData.oldHodRec.resPhone2 !== appData.newHodRec.resPhone2} />	
			</div>
			}
			<br />
		</Accordion>	
		<br />
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
