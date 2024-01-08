import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
// import { Switch, Route, Link } from 'react-router-dom';
import { ValidatorForm, TextValidator, TextValidatorcvariant} from 'react-material-ui-form-validator';
import Drawer from '@material-ui/core/Drawer';
//import Tooltip from "react-tooltip";
//import ReactTooltip from 'react-tooltip'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Box from '@material-ui/core/Box';
import Grid from "@material-ui/core/Grid";

import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";

import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import BlueRadio from 'components/Radio/BlueRadio';
import { UserContext } from "../../UserContext";
import { JumpButton, DisplayPageHeader, ValidComp, BlankArea} from 'CustomComponents/CustomComponents.js';

import lodashSortBy from "lodash/sortBy";

import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import EditIcon from '@material-ui/icons/Edit';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import CancelIcon from '@material-ui/icons/Cancel';

//import { NoGroup, JumpButton, DisplayPageHeader, MessageToUser } from 'CustomComponents/CustomComponents.js';
import { isMobile, getWindowDimensions, displayType, decrypt, encrypt,
	showError, showSuccess, showInfo,
} from 'views/functions';

import globalStyles from "assets/globalStyles";

import {setTab} from "CustomComponents/CricDreamTabs.js"

import VsButton from "CustomComponents/VsButton"; 
import VsSelect from "CustomComponents/VsSelect";
import VsRadio from "CustomComponents/VsRadio";
import VsCheckBox from "CustomComponents/VsCheckBox";
//import VsRadioGroup from "CustomComponents/VsRadioGroup";


import {
	ADMIN, APPLICATIONTYPES, SELECTSTYLE,
  PADSTYLE,
	MEMBERTITLE, RELATION, SELFRELATION, GENDER, BLOODGROUP, MARITALSTATUS,
	STATUS_INFO,
} from 'views/globals';

import {
	getMemberName,
	dateString, disableFutureDt,
	
} from 'views/functions';


export default function MemberAddEdit(props) {
	console.log("In add edit");
	//const classes = useStyles();
	const gClasses = globalStyles();
	
	const [header, setHeader] = useState("");
	const [registerStatus, setRegisterStatus] = useState(0);
	
	const [emurGotra, setEmurGotra] = useState("");
	const [emurVillage, setEmurVillage] = useState("");
	const [emurPinCode, setEmurPincCode] = useState("");
	const [emurResPhone1, setEmurResPhone1] = useState("");
	const [emurResPhone2, setEmurResPhone2] = useState("");
	const [emurPinResp, setEmurPinResp] = useState({});
	const [emurDate1, setEmurDate1] = useState(moment());


	const [emurAddr1, setEmurAddr1] = useState("Shri");
	const [emurAddr2, setEmurAddr2] = useState("");
	const [emurAddr3, setEmurAddr3] = useState("");
	const [emurAddr4, setEmurAddr4] = useState("");
	const [emurAddr5, setEmurAddr5] = useState("");
	const [emurAddr6, setEmurAddr6] = useState("Son");
	const [emurAddr7, setEmurAddr7] = useState("Male");
	const [emurAddr8, setEmurAddr8] = useState("Unmarried");
	const [emurAddr9, setEmurAddr9] = useState("O+");
	const [emurAddr10, setEmurAddr10] = useState("");
	const [emurAddr11, setEmurAddr11] = useState("");
	const [emurAddr12, setEmurAddr12] = useState("");
	const [emurAddr13, setEmurAddr13] = useState("");
	
	const [isMemberHod, setIsMemberHod] = useState(false);
	useEffect(() => {
		
		var myHeader = "";
		if (props.mode == "ADD") {
			myHeader = "Add new family member";
		}
		else {
			console.log(props);
			myHeader = `Edit details of ${getMemberName(props.memberRec)}`;
			setEmurAddr1(props.memberRec.title);
			setEmurAddr2(props.memberRec.lastName);
			setEmurAddr3(props.memberRec.firstName);
			setEmurAddr4(props.memberRec.middleName);
			setEmurAddr5(props.memberRec.alias)
			setEmurAddr6(props.memberRec.relation);
			setEmurAddr7(props.memberRec.gender)
			setEmurAddr8(props.memberRec.emsStatus)
			setEmurAddr9(props.memberRec.bloodGroup);
			setEmurDate1(moment(props.memberRec.dob));
			setEmurAddr10(props.memberRec.occupation);
			setEmurAddr11(props.memberRec.mobile);
			setEmurAddr12(props.memberRec.mobile1);
			setEmurAddr13(decrypt(props.memberRec.email));
			console.log(props.memberRec.dob);
			
			setIsMemberHod(props.memberRec.mid === props.hodMid);
		}
		setHeader(myHeader);
	}, [])


async function handleMemberAddEditSubmit() {
	props.onReturn.call(this, {status: STATUS_INFO.ERROR, msg: `Error Add/Edit member`});
	return;
}


return (
	<div>
	<Typography align="center" className={gClasses.title}>{header}</Typography>
	<br />
	<ValidatorForm align="left" className={gClasses.form} onSubmit={handleMemberAddEditSubmit}>
	<Grid key="ADEDITMEMBERPERSONAL" className={gClasses.noPadding} container  alignItems="flex-start" >
		<Grid item xs={5} sm={5} md={5} lg={5} >
			<Typography style={{paddingTop: "20px" }} className={gClasses.patientInfo2Blue} >Title</Typography>
		</Grid>
		<Grid item xs={7} sm={7} md={7} lg={7} >
			<VsSelect size="small" align="left" inputProps={{className: gClasses.dateTimeNormal}} style={{paddingLeft: "10px", paddingRight: "10px" }}
			options={MEMBERTITLE} value={emurAddr1} onChange={(event) => { setEmurAddr1(event.target.value); }} />
		</Grid>
		<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
		<Grid item xs={5} sm={5} md={5} lg={5} >
			<Typography style={{paddingTop: "20px" }} className={gClasses.patientInfo2Blue} >Last Name</Typography>
		</Grid>
		<Grid item xs={7} sm={7} md={7} lg={7} >
			<TextValidator required style={{paddingLeft: "10px", paddingRight: "10px" }} className={gClasses.vgSpacing} inputProps={{className: gClasses.dateTimeNormal}}
				label="Last Name" type="text" value={emurAddr2} onChange={(event) => { setEmurAddr2(event.target.value) }} />	
		</Grid>
		<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
		<Grid item xs={5} sm={5} md={5} lg={5} >
			<Typography style={{paddingTop: "20px" }} className={gClasses.patientInfo2Blue} >First Name</Typography>
		</Grid>
		<Grid item xs={7} sm={7} md={7} lg={7} >
			<TextValidator required style={{paddingLeft: "10px", paddingRight: "10px" }} className={gClasses.vgSpacing}
				inputProps={{className: gClasses.dateTimeNormal}} label="First Name" type="text" value={emurAddr3}
				onChange={(event) => { setEmurAddr3(event.target.value) }}			
			/>	
		</Grid>
		<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
		<Grid item xs={5} sm={5} md={5} lg={5} >
			<Typography style={{paddingTop: "20px" }} className={gClasses.patientInfo2Blue} >Middle Name</Typography>
		</Grid>
		<Grid item xs={7} sm={7} md={7} lg={7} >
			<TextValidator required style={{paddingLeft: "10px", paddingRight: "10px" }} className={gClasses.vgSpacing}
				inputProps={{className: gClasses.dateTimeNormal}} label="Middle Name" type="text" value={emurAddr4}
				onChange={(event) => { setEmurAddr4(event.target.value) }}			
			/>	
		</Grid>
		<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
		<Grid item xs={5} sm={5} md={5} lg={5} >
			<Typography style={{paddingTop: "20px" }} className={gClasses.patientInfo2Blue} >Relation</Typography>
		</Grid>
		<Grid item xs={7} sm={7} md={7} lg={7} >
			<VsSelect size="small" align="left"  style={{paddingLeft: "10px", paddingRight: "10px" }}
				inputProps={{className: gClasses.dateTimeNormal}} options={(isMemberHod) ? SELFRELATION : RELATION} 
				value={emurAddr6} onChange={(event) => { setEmurAddr6(event.target.value); }} 
			/>				
		</Grid>
		<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
		<Grid item xs={5} sm={5} md={5} lg={5} >
			<Typography style={{paddingTop: "20px" }} className={gClasses.patientInfo2Blue} >Gender</Typography>
		</Grid>
		<Grid item xs={7} sm={7} md={7} lg={7} >
			<VsSelect size="small" align="left"  style={{paddingLeft: "10px", paddingRight: "10px" }}
				inputProps={{className: gClasses.dateTimeNormal}} label="Gender" options={GENDER} 
				value={emurAddr7} onChange={(event) => { setEmurAddr7(event.target.value); }} 
			/>
		</Grid>
		<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
		<Grid item xs={5} sm={5} md={5} lg={5} >
			<Typography style={{paddingTop: "1px" }} className={gClasses.patientInfo2Blue} >Date of Birth</Typography>
		</Grid>
		<Grid item xs={7} sm={7} md={7} lg={7} >
			<Datetime 
				className={gClasses.dateTimeBlock}
				inputProps={{className: gClasses.dateTimeNormal}}
				timeFormat={false} 
				initialValue={emurDate1}
				value={emurDate1}
				dateFormat="DD/MM/yyyy"
				isValidDate={disableFutureDt}
				onClose={setEmurDate1}
				closeOnSelect={true}
			/>
		</Grid>
		<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
		<Grid item xs={5} sm={5} md={5} lg={5} >
			<Typography style={{paddingTop: "20px" }} className={gClasses.patientInfo2Blue} >Gender</Typography>
		</Grid>
		<Grid item xs={7} sm={7} md={7} lg={7} >
			<VsSelect size="small" align="left"  style={{paddingLeft: "10px", paddingRight: "10px" }}
				inputProps={{className: gClasses.dateTimeNormal}} label="Gender" options={GENDER} 
				value={emurAddr7} onChange={(event) => { setEmurAddr7(event.target.value); }} 
			/>
		</Grid>
		<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
		<Grid item xs={5} sm={5} md={5} lg={5} >
			<Typography style={{paddingTop: "20px" }} className={gClasses.patientInfo2Blue} >Blood Group</Typography>
		</Grid>
		<Grid item xs={7} sm={7} md={7} lg={7} >
			<VsSelect size="small" align="left"  style={{paddingLeft: "10px", paddingRight: "10px" }}
				inputProps={{className: gClasses.dateTimeNormal}} label="BldGrp" options={BLOODGROUP} 
				value={emurAddr9} onChange={(event) => { setEmurAddr9(event.target.value); }} 
			/>
		</Grid>
		<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
		<Grid item xs={5} sm={5} md={5} lg={5} >
			<Typography style={{paddingTop: "20px" }} className={gClasses.patientInfo2Blue} >Marital Status</Typography>
		</Grid>
		<Grid item xs={7} sm={7} md={7} lg={7} >
			<VsSelect size="small" align="left"  style={{paddingLeft: "10px", paddingRight: "10px" }}
				inputProps={{className: gClasses.dateTimeNormal}} label="Marital Status" options={MARITALSTATUS} 
				value={emurAddr8} onChange={(event) => { setEmurAddr8(event.target.value); }} 
			/>			
		</Grid>
		<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
		<Grid item xs={5} sm={5} md={5} lg={5} >
			<Typography style={{paddingTop: "20px" }} className={gClasses.patientInfo2Blue} >Occupation</Typography>
		</Grid>
		<Grid item xs={7} sm={7} md={7} lg={7} >
			<TextValidator required className={gClasses.vgSpacing}
				inputProps={{className: gClasses.dateTimeNormal}}
				label="Occupation" type="text"
				value={emurAddr10}
				onChange={(event) => { setEmurAddr10(event.target.value) }}			
			/>			
		</Grid>
		<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
		<Grid item xs={5} sm={5} md={5} lg={5} >
			<Typography style={{paddingTop: "20px" }} className={gClasses.patientInfo2Blue} >Mobile 1</Typography>
		</Grid>
		<Grid item xs={7} sm={7} md={7} lg={7} >
			<TextValidator className={gClasses.vgSpacing}
				inputProps={{className: gClasses.dateTimeNormal}}
				label="Mobile 1" type="number"
				value={emurAddr11}
				onChange={(event) => { setEmurAddr11(event.target.value) }}			
				validators={['minNumber:1000000000', 'maxNumber:9999999999']}
				errorMessages={['Invalid mobile number', 'Invalid mobile number']}			
			/>
		</Grid>
		<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
		<Grid item xs={5} sm={5} md={5} lg={5} >
			<Typography style={{paddingTop: "20px" }} className={gClasses.patientInfo2Blue} >Mobile 2</Typography>
		</Grid>
		<Grid item xs={7} sm={7} md={7} lg={7} >
			<TextValidator className={gClasses.vgSpacing}
				inputProps={{className: gClasses.dateTimeNormal}}
				label="Mobile 2" type="number"
				value={emurAddr12}
				onChange={(event) => { setEmurAddr12(event.target.value) }}			
				validators={['minNumber:1000000000', 'maxNumber:9999999999']}
				errorMessages={['Invalid mobile number', 'Invalid mobile number']}			
			/>
		</Grid>
		<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
		<Grid item xs={5} sm={5} md={5} lg={5} >
			<Typography style={{paddingTop: "20px" }} className={gClasses.patientInfo2Blue} >Email</Typography>
		</Grid>
		<Grid item xs={7} sm={7} md={7} lg={7} >
			<TextValidator className={gClasses.vgSpacing}
				inputProps={{className: gClasses.dateTimeNormal}}
				label="Email" type="email"
				value={emurAddr13}
				onChange={(event) => { setEmurAddr13(event.target.value) }}			
			/>	
		</Grid>
		<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
		</Grid>
		<VsButton align="center" name={(props.mode === "ADD") ? "Add" : "Update"} type="submit" />		
	</ValidatorForm>
	<ToastContainer />
	</div>
	)
}
