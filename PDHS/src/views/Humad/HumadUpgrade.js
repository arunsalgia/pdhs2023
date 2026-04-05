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
	DisplayApplicationNameValue, DisplayApplicationName,
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
	//HUMADCATEGORY,
	STATUS_INFO,
} from 'views/globals';

import {
	getMemberName,
	hasPRWSpermission,
	getHumadMembershipName,
   getMembershipInfo,
} from 'views/functions';

const MERGECREATEARRAY = [
{msg: "Merge with existing family", value: "MERGE"},
{msg: "Create new family", value: "CREATE"}
];
const MERGEINDEX = 0;
const CREATEINDEX = 1;

const header = "Apply to move member(s)";

export default function HumadUpgrade() {
	//const classes = useStyles();
	const gClasses = globalStyles();
	const myProps = JSON.parse(sessionStorage.getItem("humad_props"));
  //console.log(myProps);
	const hodRec = myProps.hodRec;
	var HUMADCATEGORY = [];

	const [remarks, setRemarks] = useState("");
	const [newUpgrade, setNewUpgrade] = useState(myProps.selectedMid);
	const [upgradeArray, setUpgradeArray] = useState([]);

	const [registerStatus, setRegisterStatus] = useState(0);

	useEffect(() => {
		
		async function getHodRec() {
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/hod/get/${myProps.memberRec.hid}`;
			var resp = await axios.get(myUrl);
			setHodRec(resp.data);
		} catch (e) {
			console.log(e);
			showError("Unable to fetch HOD Record");
		}	
	}		

   async function getMIInfo() {
      var tmp = await getMembershipInfo();
      HUMADCATEGORY = tmp.filter(x => x.manch === "Humad");;
      console.log(HUMADCATEGORY);
		if (myProps.humadRec) {
         //console.log(HUMADCATEGORY);
         var myShortMembership = myProps.humadRec.membershipNumber.substr(0, 1);
         //console.log(myShortMembership);
         var shortLevelArray = HUMADCATEGORY.map(e => e.short);
         //console.log(shortLevelArray);
         var myIndex = HUMADCATEGORY.map(e => e.short).indexOf(myProps.humadRec.membershipNumber.substr(0, 1));
         //console.log(myIndex);
			var myArray = HUMADCATEGORY.slice(0, HUMADCATEGORY.map(e => e.short).indexOf(myProps.humadRec.membershipNumber.substr(0, 1))); 
         //console.log(myArray);
			setUpgradeArray(myArray);
			setNewUpgrade(myArray[0].desc);
			setRemarks(myProps.humadRec.remarks);
		}
		else {
			// This is for new members ship
         //console.log(HUMADCATEGORY);
			setUpgradeArray(HUMADCATEGORY);
			setNewUpgrade(HUMADCATEGORY[0].desc);		
		}
   }

      getMIInfo();
			//getHodRec();
	}, [])


async function handlHumadUpgradeSubmit() {
	console.log(HUMADCATEGORY);
	console.log(newUpgrade);
	var myData = {
		hid: myProps.memberRec.hid,
		humadRec: myProps.humadRec,
		memberRec: myProps.memberRec,
		newUpgrade: newUpgrade,
		upgradeDate: new Date(),
		remarks: remarks,
	};
	console.log(myData);

	let myMsg = '';
	let myStatus = STATUS_INFO.SUCCESS;
	var myTmp = encodeURIComponent(JSON.stringify(myData));
	try {
		let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/apply/humadupgrade/${hodRec.mid}/${sessionStorage.getItem('mid')}/${myTmp}`;
		let resp = await axios.get(myUrl);
		myMsg = `Successfully applied for Humad upgrade. Application reference ${resp.data.id}.`;
		myStatus = STATUS_INFO.SUCCESS;
	} 
	catch (e) {
		console.log(e);
		myMsg = `Error applying for Humad upgrade`;
		myStatus = STATUS_INFO.ERROR;
	}
	var returnStatus = {status: myStatus,  msg: myMsg};
	sessionStorage.setItem("humad_returnstatus", JSON.stringify(returnStatus));
	//sessionStorage.setItem("family_currentSelection", myProps.calledFrom);
   //console.log(myProps);
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
	<Typography align="center"  className={gClasses.pdhs_title} >{(myProps.humadRec) ? "Upgrade of Humad Membership" : "New Humad Membership"}</Typography>
	<Typography align="center"  className={gClasses.pdhs_title} >{getMemberName(myProps.memberRec, false, false)}</Typography>
	{(myProps.humadRec) &&
   <div>
      <Divider style={{ marginTop: "10px", marginBottom: "10px", paddingTop: "1px", backgroundColor: 'black', padding: 'none' }} />
      <DisplayApplicationName name="Current membership details" value={``}  />
      <DisplayApplicationNameValue name="Membership" value={getHumadMembershipName(myProps.humadRec.membershipNumber)}  />
      <DisplayApplicationNameValue name="Mem. Number" value={`${myProps.humadRec.membershipNumber}`}  />
   </div>
	}	
	<Divider style={{ marginTop: "10px", marginBottom: "10px", paddingTop: "1px", backgroundColor: 'black', padding: 'none' }} />
	<DisplayApplicationName name="New membership details" value={``}  />
	{upgradeArray.map( (u, index) => {
		return (
		<Grid key={"BALMEM"+index} className={gClasses.noPadding} container  alignItems="flex-start" >
		<Grid style={{marginTop: "10px"}}  item xs={10} sm={10} md={8} lg={8} >
			<Typography style={{marginLeft: "10px"}} className={gClasses.title}>{u.desc + (u.fees > 0 ? ` (fees: ${u.fees})` : '')}</Typography>
		</Grid>	
		<Grid item xs={2} sm={2} md={2} lg={2} >
			<VsRadio checked={u.desc == newUpgrade} onClick={() => setNewUpgrade(u.desc)}  />
		</Grid>
		</Grid>	

	)})}
	<Grid key={"HUMREMARKS"} className={gClasses.noPadding} container  alignItems="flex-start" >
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
	<VsButton align="center" name="Submit" onClick={handlHumadUpgradeSubmit} />
	<br />
	<ToastContainer />
	</Box>
	</Container>
	</div>
	)
}
