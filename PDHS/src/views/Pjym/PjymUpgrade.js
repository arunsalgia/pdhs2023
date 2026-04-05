import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
import { TextField, InputAdornment } from "@material-ui/core";
import { Switch } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { ValidatorForm, TextValidator, TextValidatorcvariant} from 'react-material-ui-form-validator';
import Drawer from '@material-ui/core/Drawer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';

import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Grid from "@material-ui/core/Grid";
import Divider from '@material-ui/core/Divider';

import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import BlueRadio from 'components/Radio/BlueRadio';
import { UserContext } from "../../UserContext";

import { 
	JumpButton, DisplayPageHeader, ValidComp, BlankArea,
	DisplayApplicationNameValue
} from 'CustomComponents/CustomComponents.js';

import lodashSortBy from "lodash/sortBy";
import lodashMap from "lodash/map";

import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";

import VsButton from "CustomComponents/VsButton"; 
import VsSelect from "CustomComponents/VsSelect";
import VsRadio from "CustomComponents/VsRadio";
import VsCheckBox from "CustomComponents/VsCheckBox";
import VsCancel from "CustomComponents/VsCancel";
import VsTextFilter from "CustomComponents/VsTextFilter";


import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import EditIcon from '@material-ui/icons/Edit';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import CancelIcon from '@material-ui/icons/Cancel';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SearchIcon from '@material-ui/icons/Search';



import { 
	showError, showSuccess, showInfo,
	disableFutureDt,
} from 'views/functions';

import globalStyles from "assets/globalStyles";

import {setTab } from "CustomComponents/CricDreamTabs.js"


import {
	MUNCHNAME,
	STATUS_INFO,
} from 'views/globals';

import {
	getMemberName,
	hasPRWSpermission,
	getMembershipInfo,
} from 'views/functions';

const MERGECREATEARRAY = [
{msg: "Merge with existing family", value: "MERGE"},
{msg: "Create new family", value: "CREATE"}
];
const MERGEINDEX = 0;
const CREATEINDEX = 1;

const header = "Apply to move member(s)";

export default function PjymUpgrade() {
	const gClasses = globalStyles();
	const myProps = JSON.parse(sessionStorage.getItem("pjym_props"));
	const hodRec = myProps.hodRec;
	
	const [remarks, setRemarks] = useState("");
	const [upgradeArray, setUpgradeArray] = useState([]);
	const [newUpgrade, setNewUpgrade] = useState("");

	useEffect(() => {


   async function getMIInfo() {
      var tmp = await getMembershipInfo();
      var PJYMCATEGORY = tmp.filter(x => x.manch === MUNCHNAME.pjym);;
			setUpgradeArray(PJYMCATEGORY);	
			setNewUpgrade(PJYMCATEGORY[0].desc);
		}
   
		getMIInfo();

	}, [])


async function handlPjymUpgradeSubmit() {
	console.log(newUpgrade);
	var myData = {
		hid: myProps.memberRec.hid,
		pjymRec: myProps.pjymRec,
		memberRec: myProps.memberRec,
		newUpgrade: newUpgrade,
		upgradeDate: new Date(),
		remarks: remarks,
	};


	let myMsg = '';
	let myStatus = STATUS_INFO.SUCCESS;
	var myTmp = encodeURIComponent(JSON.stringify(myData));
	try {
		let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/apply/pjymupgrade/${hodRec.mid}/${sessionStorage.getItem('mid')}/${myTmp}`;
		console.log(myUrl);
		let resp = await axios.get(myUrl);
		myMsg = `Successfully applied for PJYM upgrade. Application reference ${resp.data.id}.`;
		myStatus = STATUS_INFO.SUCCESS;
	} 
	catch (e) {
		console.log(e);
		myMsg = `Error applying for Pjym upgrade`;
		myStatus = STATUS_INFO.ERROR;
	}
	var returnStatus = {status: myStatus,  msg: myMsg};
	console.log(returnStatus);
	sessionStorage.setItem("pjym_returnstatus", JSON.stringify(returnStatus));
	setTab(myProps.calledFrom);

	return;

	
	myProps.onReturn.call(this, {status: STATUS_INFO.ERROR, msg: `Error Humad upgrade`});
	return;
}


function handleCancel() {
	//sessionStorage.setItem("family_currentSelection", "Personal");
	setTab(myProps.calledFrom);
}


return (
	<div className={gClasses.webPage} >
	<Container component="main" maxWidth="xs">	
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} style={{paddingLeft: "5px", paddingRight: "5px"}} >
	<VsCancel align="right" onClick={handleCancel} />
	<Typography align="center"  className={gClasses.pdhs_title} >{(myProps.pjymRec) ? "PJYM Membership" : "PJYM Membership"}</Typography>
	<br />
	<div>
		<br />
		<Typography align="center"  className={gClasses.pdhs_title} >{getMemberName(myProps.memberRec, false, false)}</Typography>
		<br />
		{upgradeArray.map( (u, index) => {
			return (
			<Grid key={"BALMEM"+index} className={gClasses.noPadding} container  alignItems="flex-start" >
			<Grid style={{marginTop: "10px"}}  item xs={6} sm={6} md={6} lg={6} >
				<Typography style={{marginLeft: "10px"}} className={gClasses.title}>{u.desc}</Typography>
			</Grid>	
			<Grid item xs={2} sm={2} md={2} lg={2} >
				<VsRadio checked={u.desc == newUpgrade} onClick={() => setNewUpgrade(u.desc)}  />
			</Grid>
			</Grid>	

		)})}
		<br />	
		<Grid key={"PJYMREMARKS"} className={gClasses.noPadding} container  alignItems="flex-start" >
		<Grid style={{marginTop: "10px"}}  item xs={6} sm={6} md={6} lg={6} >
			<Typography style={{marginLeft: "10px"}} className={gClasses.title}>Remarks</Typography>
		</Grid>	
		<Grid item xs={5} sm={5} md={5} lg={5} >
			<TextField id="outlined-required" label={myProps.inputName}
				value={remarks}  autoFocus
				onChange={(event) => { setRemarks(event.target.value); }}
			/>			
		</Grid>
		</Grid>			
		<br />	
		<VsButton align="center" name="Submit" onClick={handlPjymUpgradeSubmit} />
		<br />
	</div>

	<ToastContainer />
	</Box>
	</Container>
	</div>
	)
}
