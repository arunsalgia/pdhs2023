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

import Box from '@material-ui/core/Box';
import Grid from "@material-ui/core/Grid";

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
} from 'views/functions';


export default function ApplicationmemberCeased(props) {
	const gClasses = globalStyles();
	
	//const [registerStatus, setRegisterStatus] = useState(0);
	const [appData, setAppdata] = useState({});
	
	
	useEffect(() => {
			setAppdata(JSON.parse(props.applicationRec.data));
	}, [])


async function handleMemberAddEditSubmit() {
	props.onReturn.call(this, {status: STATUS_INFO.ERROR, msg: `Error Add/Edit gotra`});
	return;
}

async function handleApplicationReject() {
	handleApplicationRejectConfirm();
	
	/*vsDialog("Reject", `Are you sure you want reject application?`,
		{label: "Yes", onClick: () => handleApplicationRejectConfirm() },
		{label: "No" }
		);*/
}

async function  handleApplicationRejectConfirm() {
	try {
		let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/apply/reject/${props.applicationRec.id}/${sessionStorage.getItem("mid")}/my comments`;
		let resp = await axios.get(myUrl);
		props.onReturn.call(this, {status: STATUS_INFO.SUCCESS, applicationRec: resp.data, msg: `Application rejected by Admin`});
		
	} catch (e) {
		console.log(e);
		showError(`Error rejecting Gotra/Caste change`);
	}
}


async function handleApplicationApprove() {
	
}

return (
	<div>
	<ApplicationHeader applicationRec={props.applicationRec} header="Application for member ceased" />
	<Typography align="center" style={{paddingTop: "5px" }} className={gClasses.pdhs_title} >Application data</Typography>
	<br />
	{/*	<DisplayApplicationNameValue name="Gotra" value={appData.gotra} style={{paddingTop: "5px" }}  />
	<DisplayApplicationNameValue name="Caste" value={appData.caste} style={{paddingTop: "5px" }}  />
	{ (appData.subCaste !== "") &&
	<DisplayApplicationNameValue name="SubCaste" value={appData.subCaste} style={{paddingTop: "5px" }}  />
	}
	<br />
	*/}
	{(props.applicationRec.status === APPLICATIONSTATUS.pending) &&
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
	<br />
	<ToastContainer />
	</div>
	)
}
