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

import Container from '@material-ui/core/Container';
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

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';

import lodashSortBy from "lodash/sortBy";

import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import EditIcon from '@material-ui/icons/Edit';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import CancelIcon from '@material-ui/icons/Cancel';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

//import { NoGroup, JumpButton, DisplayPageHeader, MessageToUser } from 'CustomComponents/CustomComponents.js';
import { isMobile, getWindowDimensions, displayType, decrypt, encrypt,
	showError, showSuccess, showInfo,
} from 'views/functions';

import globalStyles from "assets/globalStyles";

import VsButton from "CustomComponents/VsButton"; 
import VsSelect from "CustomComponents/VsSelect";
import VsRadio from "CustomComponents/VsRadio";
import VsCheckBox from "CustomComponents/VsCheckBox";
import VsCancel from "CustomComponents/VsCancel";

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

import {
	setTab,
} from "CustomComponents/CricDreamTabs.js"


import {
	memberGetByMidOne,
} from 'views/clientdbfunctions';
	

function MyInput(myProps) {
	const gClasses = globalStyles();
return (
  <div>
		<TextValidator required style={{paddingLeft: "10px", paddingRight: "10px" }} className={gClasses.vgSpacing} inputProps={{className: gClasses.dateTimeNormal}}
			label={myProps.label} type="text" value={myProps.value} onChange={myProps.onChange} />	
  </div>
)};

export default function MemberAddEdit() {
	//console.log("In add edit");
	//const classes = useStyles();
	const gClasses = globalStyles();
	const myProps = JSON.parse(sessionStorage.getItem("family_personal_props"));
	//console.log(myProps);
	
	const [header, setHeader] = useState("");
	const [registerStatus, setRegisterStatus] = useState(0);
	
	const [emurGotra, setEmurGotra] = useState("");
	const [emurVillage, setEmurVillage] = useState("");
	const [emurPinCode, setEmurPincCode] = useState("");
	const [emurResPhone1, setEmurResPhone1] = useState("");
	const [emurResPhone2, setEmurResPhone2] = useState("");
	const [emurPinResp, setEmurPinResp] = useState({});
	const [emurDate1, setEmurDate1] = useState("");
	const [emurDate2, setEmurDate2] = useState("");


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
	// Office data
	const [education, setEducation] = useState("");
	const [company, setCompany] = useState("");
	const [officePhone, setOfficePhone] = useState("");

	
	const [memberArray, setMemberArray] = useState([]);
	const	[emurSpouseRec, setEmurSpouseRec] = useState(0);
	const [selectSpouse, setSelectSpouse] = useState(false);
	const [spouseList, setSpouseList] = useState([]);
	
	const [newSpouseMid, setNewSpouseMid] = useState(0);
	
	const [isMemberHod, setIsMemberHod] = useState(false);
	
	
	// show in accordion
	const [expandedPanel, setExpandedPanel] = useState("");
	const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedPanel(isExpanded ? panel : false);
    setRegisterStatus(0);
  };
	
	
	useEffect(() => {
		
		async function getAllMembers(hid, spouseMid) {
			try {
				let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/member/hod/${hid}`;
				let resp = await axios.get(myUrl);
				setMemberArray(resp.data);
				var tmp = resp.data.find(x => x.mid === spouseMid);
				setEmurSpouseRec(tmp);
			}
			catch (e) {
				console.log(e);
				showError("Error fetching members");
				setMemberArray([]);
				setEmurSpouseRec(null);
			}
			return 
		}

		var myHeader = "";
		if (myProps.mode == "ADD") {
			myHeader = "Add new family member";
			//console.log(myProps.memberRec);
			setEmurAddr2(myProps.memberRec.lastName);
		}
		else {
			//console.log(myProps);
			myHeader = `Edit details of ${getMemberName(myProps.memberRec)}`;
			setEmurAddr1(myProps.memberRec.title);
			setEmurAddr2(myProps.memberRec.lastName);
			setEmurAddr3(myProps.memberRec.firstName);
			setEmurAddr4(myProps.memberRec.middleName);
			setEmurAddr5(myProps.memberRec.alias)
			setEmurAddr6(myProps.memberRec.relation);
			setEmurAddr7(myProps.memberRec.gender)
			setEmurAddr8(myProps.memberRec.emsStatus)
			setEmurAddr9(myProps.memberRec.bloodGroup);
			setEmurAddr11(myProps.memberRec.mobile);
			setEmurAddr12(myProps.memberRec.mobile1);
			var xxx = decrypt(myProps.memberRec.email);
			if (xxx === "-") xxx = "";
			setEmurAddr13(xxx);
			setEmurDate1(moment(myProps.memberRec.dob));
			setEmurDate2(moment(myProps.memberRec.dateOfMarriage));
			setIsMemberHod(myProps.memberRec.mid === myProps.hodMid);
			// Office details
			setEmurAddr10(myProps.memberRec.occupation);
			setEducation(myProps.memberRec.education);
			setCompany(myProps.memberRec.officeName);
			setOfficePhone(myProps.memberRec.officePhone);
			
			
			getAllMembers(myProps.memberRec.hid, myProps.memberRec.spouseMid);
			//console.log(myProps.memberRec.dob);
			
		}
		setHeader(myHeader);
	}, [])

function handleSpouseSelect() {
	//console.log(memberArray);
	var spouseGender = (myProps.memberRec.gender === "Male") ? "Female" : "Male";
	var tmp = memberArray.filter( x => (x.gender === spouseGender) && (x.spouseMid === 0));
	var tmpSpouse = memberArray.find(x => x.mid === myProps.memberRec.spouseMid); 
	if (tmpSpouse) {
		//console.log("Have Spouse");
		tmp = [tmpSpouse].concat(tmp);
	}
	//console.log(tmp);
	
	if (tmp.length > 0) {
		setNewSpouseMid(tmp[0].mid);
		setSpouseList(tmp);
		setSelectSpouse(true)
	}
	else {
		setSpouseList([]);
		showInfo("No spouse available");
	}
}

function updateNewSpouse() {
	var tmpRec = memberArray.find(x => x.mid === newSpouseMid);
	setEmurSpouseRec(tmpRec);
	setSelectSpouse(false);
	//console.log(newSpouseMid);
}


async function handleMemberAddEditSubmit() {

	/*var tmpRec = {
		title: emurAddr1,
		lastName: emurAddr2,
		firstName: emurAddr3,
		middleName: emurAddr4,
		alias: emurAddr5,
		relation: emurAddr6,
		gender: emurAddr7,
		emsStatus: emurAddr8,
		bloodGroup: emurAddr9,
		occupation: emurAddr10,
		mobile: emurAddr11,
		mobile1: emurAddr12,
		email: encrypt(emurAddr13),
		dob: emurDate1.toDate(),
		dateOfMarriage: emurDate2.toDate(),
		spouseMid: (emurSpouseRec) ? emurSpouseRec.mid : 0
	}*/
	var tmpRec = {};
	
	console.log("in submit");
	console.log(myProps.memberRec);
	// first update if change of name
	if (myProps.memberRec.title !== emurAddr1)
		tmpRec["title"] = emurAddr1;
	if ((myProps.memberRec.lastName !== emurAddr2) || (myProps.mode == "ADD"))
		tmpRec["lastName"] = emurAddr2;
	if (myProps.memberRec.firstName !== emurAddr3)
		tmpRec["firstName"] = emurAddr3;
	if (myProps.memberRec.middleName !== emurAddr4)
		tmpRec["middleName"] = emurAddr4;
	if (myProps.memberRec.alias !== emurAddr5)
		tmpRec["alias"] = emurAddr5;
	// update personal details
	if (myProps.memberRec.relation !== emurAddr6)
		tmpRec["relation"] = emurAddr6;
	if (myProps.memberRec.gender !== emurAddr7)
		tmpRec["gender"] = emurAddr7;
	/*if (myProps.memberRec.emsStatus !== emurAddr8)
		tmpRec["emsStatus"] = emurAddr8;*/
	if (myProps.memberRec.bloodGroup !== emurAddr9)
		tmpRec["bloodGroup"] = emurAddr9;
	// other details
	if (myProps.memberRec.mobile !== emurAddr11)
		tmpRec["mobile"] = emurAddr11;
	if (myProps.memberRec.mobile1 !== emurAddr12)
		tmpRec["mobile1"] = emurAddr12;
	// encrypt email
	var xxxtmp = (emurAddr13 !== "") ? emurAddr13 : "-";
	xxxtmp = encrypt(xxxtmp);
	if (myProps.memberRec.email !== xxxtmp)
		tmpRec["email"] = xxxtmp;
	// Now dates 
	xxxtmp = emurDate1.toDate();
	if (new Date(myProps.memberRec.dob).getTime() !== xxxtmp.getTime())
		tmpRec["dob"] = xxxtmp;
	/*xxxtmp = emurDate2.toDate();
	if (new Date(myProps.memberRec.dateOfMarriage).getTime() !== xxxtmp.getTime())
		tmpRec["dateOfMarriage"] = xxxtmp;	*/

	// Spouse
/*	xxxtmp = (emurSpouseRec) ? emurSpouseRec.mid : 0;
	if (myProps.memberRec.spouseMid !== xxxtmp) {
		tmpRec["spouseMid"] = xxxtmp;
		tmpRec["spouseName"] = (xxxtmp !=  0) ? getMemberName(emurSpouseRec, false, false) : "";
	}*/
	// Office 
	if (myProps.memberRec.occupation !== emurAddr10)
		tmpRec["occupation"] = emurAddr10;
	if (myProps.memberRec.education !== education)
		tmpRec["education"] = education;
	if (myProps.memberRec.officePhone !== officePhone)
		tmpRec["officePhone"] = officePhone;
	if (myProps.memberRec.officeName !== company)
		tmpRec["officeName"] = company;
	
	console.log(tmpRec);
	
	// Now send the details to server
	var myData = {
		hid: myProps.memberRec.hid,
		mode: myProps.mode,
		oldMemberRec: myProps.memberRec,
		memberRec: tmpRec
	}
	
	let myMsg = '';
	let myStatus;
	let tmp = encodeURIComponent(JSON.stringify(myData));
	try {
		let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/apply/addeditpersonal/${myProps.hodMid}/${sessionStorage.getItem('mid')}/${tmp}`;
		var submsg = (myProps.mode === "ADD") ? 'add member' : 'edit';
		let resp = await axios.get(myUrl);
		myMsg = `Successfully applied to ${submsg} member details. Application reference ${resp.data.id}.`;
		myStatus = STATUS_INFO.SUCCESS;
	} catch (e) {
		console.log(e);
		myMsg = `Error applying for add/edit member personal details`;
		myStatus = STATUS_INFO.ERROR;
	}
	var returnStatus = {status: myStatus,  msg: myMsg};
	sessionStorage.setItem("family_personal_returnstatus", JSON.stringify(returnStatus));
	sessionStorage.setItem("family_currentSelection", myProps.calledFrom);
	setTab(process.env.REACT_APP_FAMILY);
	//myProps.onReturn.call(this, {status: myStatus,  msg: myMsg});
	return;
}

function handleCancel() {
	sessionStorage.setItem("family_currentSelection", myProps.calledFrom);
	setTab(process.env.REACT_APP_FAMILY);
}

return (
	<div className={gClasses.webPage} >
	<Container component="main" maxWidth="xs">	
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} style={{paddingLeft: "5px", paddingRight: "5px"}} >
	<VsCancel align="right" onClick={handleCancel} />
	<Typography align="center" className={gClasses.title}>{header}</Typography>
	<br />
	<ValidatorForm align="left" className={gClasses.form} onSubmit={handleMemberAddEditSubmit}>
		<Accordion expanded={expandedPanel === "NAME"} onChange={handleAccordionChange("NAME")}>
			<Box align="right" className={(expandedPanel === "NAME") ? gClasses.selectedAccordian : gClasses.normalAccordian} borderColor="black" borderRadius={7} border={1} >
			<AccordionSummary aria-controls="panel1a-content" id="panel1a-header" expandIcon={<ExpandMoreIcon />}>
				<Typography align="left" >{`Name: ${emurAddr1} ${emurAddr2} ${emurAddr3} ${emurAddr4}`}</Typography>
			</AccordionSummary>
			</Box>
			<Grid key="NAME" className={gClasses.noPadding} container  alignItems="flex-start" >
				<Grid item xs={5} sm={5} md={5} lg={5} >
					<Typography style={{paddingTop: "20px" }} className={gClasses.patientInfo2Blue} >Title</Typography>
				</Grid>
				<Grid item xs={7} sm={7} md={7} lg={7} >
					<VsSelect size="small" align="left" inputProps={{className: gClasses.dateTimeNormal}} style={{paddingLeft: "10px", paddingRight: "10px" }}
					options={MEMBERTITLE} value={emurAddr1} onChange={(event) => { setEmurAddr1(event.target.value); }} />
				</Grid>
				<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
				<Grid item xs={5} sm={5} md={5} lg={5} >
					<Typography style={{paddingTop: "10px" }} className={gClasses.patientInfo2Blue} >Last Name</Typography>
				</Grid>
				<Grid item xs={7} sm={7} md={7} lg={7} >
					<TextValidator required style={{paddingLeft: "10px", paddingRight: "10px" }} className={gClasses.vgSpacing} inputProps={{className: gClasses.dateTimeNormal}}
					type="text" value={emurAddr2} onChange={(event) => { setEmurAddr2(event.target.value) }} />
				</Grid>
				<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
				<Grid item xs={5} sm={5} md={5} lg={5} >
					<Typography style={{paddingTop: "10px" }} className={gClasses.patientInfo2Blue} >First Name</Typography>
				</Grid>
				<Grid item xs={7} sm={7} md={7} lg={7} >
					<TextValidator required style={{paddingLeft: "10px", paddingRight: "10px" }} className={gClasses.vgSpacing}
						inputProps={{className: gClasses.dateTimeNormal}} type="text" value={emurAddr3}
						onChange={(event) => { setEmurAddr3(event.target.value) }}			
					/>	
				</Grid>
				<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
				<Grid item xs={5} sm={5} md={5} lg={5} >
					<Typography style={{paddingTop: "10px" }} className={gClasses.patientInfo2Blue} >Middle Name</Typography>
				</Grid>
				<Grid item xs={7} sm={7} md={7} lg={7} >
					<TextValidator required style={{paddingLeft: "10px", paddingRight: "10px" }} className={gClasses.vgSpacing}
						inputProps={{className: gClasses.dateTimeNormal}} type="text" value={emurAddr4}
						onChange={(event) => { setEmurAddr4(event.target.value) }}			
					/>	
				</Grid>
			</Grid>
			<br />
		</Accordion>
		<br />
		<Accordion expanded={expandedPanel === "PERDETAILS"} onChange={handleAccordionChange("PERDETAILS")}>
			<Box align="right" className={(expandedPanel === "PERDETAILS") ? gClasses.selectedAccordian : gClasses.normalAccordian} borderColor="black" borderRadius={7} border={1} >
			<AccordionSummary aria-controls="panel1a-content" id="panel1a-header" expandIcon={<ExpandMoreIcon />}>
				<Typography align="left" >{"Personal Details"}</Typography>
			</AccordionSummary>
			</Box>
			<Grid key="PERDETAILS" className={gClasses.noPadding} container  alignItems="flex-start" >
				<Grid item xs={5} sm={5} md={5} lg={5} >
					<Typography style={{paddingTop: "20px" }} className={gClasses.patientInfo2Blue} >Relation with F.Head</Typography>
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
						inputProps={{className: gClasses.dateTimeNormal}} options={GENDER} 
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
					<Typography style={{paddingTop: "20px" }} className={gClasses.patientInfo2Blue} >Blood Group</Typography>
				</Grid>
				<Grid item xs={7} sm={7} md={7} lg={7} >
					<VsSelect size="small" align="left"  style={{paddingLeft: "10px", paddingRight: "10px" }}
						inputProps={{className: gClasses.dateTimeNormal}} options={BLOODGROUP} 
						value={emurAddr9} onChange={(event) => { setEmurAddr9(event.target.value); }} 
					/>
				</Grid>
				<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
				<Grid item xs={5} sm={5} md={5} lg={5} >
					<Typography style={{paddingTop: "10px" }} className={gClasses.patientInfo2Blue} >Mobile 1</Typography>
				</Grid>
				<Grid item xs={7} sm={7} md={7} lg={7} >
					<TextValidator className={gClasses.vgSpacing}
						inputProps={{className: gClasses.dateTimeNormal}} type="text" value={emurAddr11}
						onChange={(event) => { setEmurAddr11(event.target.value) }}			
					/>
				</Grid>
				<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
				<Grid item xs={5} sm={5} md={5} lg={5} >
					<Typography style={{paddingTop: "10px" }} className={gClasses.patientInfo2Blue} >Mobile 2</Typography>
				</Grid>
				<Grid item xs={7} sm={7} md={7} lg={7} >
					<TextValidator className={gClasses.vgSpacing} type="text" value={emurAddr12}
						onChange={(event) => { setEmurAddr12(event.target.value) }}			
					/>
				</Grid>
				<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
				<Grid item xs={5} sm={5} md={5} lg={5} >
					<Typography style={{paddingTop: "10px" }} className={gClasses.patientInfo2Blue} >Email</Typography>
				</Grid>
				<Grid item xs={7} sm={7} md={7} lg={7} >
					<TextValidator className={gClasses.vgSpacing}
						inputProps={{className: gClasses.dateTimeNormal}} type="email" value={emurAddr13}
						onChange={(event) => { setEmurAddr13(event.target.value) }}			
					/>	
				</Grid>
			</Grid>
			<br />
		</Accordion>
		<br />
		{/*<Accordion expanded={expandedPanel === "SPOUSEDETAILS"} onChange={handleAccordionChange("SPOUSEDETAILS")}>
			<Box align="right" className={(expandedPanel === "SPOUSEDETAILS") ? gClasses.selectedAccordian : gClasses.normalAccordian} borderColor="black" borderRadius={7} border={1} >
			<AccordionSummary aria-controls="panel1a-content" id="panel1a-header" expandIcon={<ExpandMoreIcon />}>
				<Typography align="left" >{"Marital Details"}</Typography>
			</AccordionSummary>
			</Box>
			<Grid key="SPOUSEDETAILS" className={gClasses.noPadding} container  alignItems="flex-start" >
				<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
				<Grid item xs={5} sm={5} md={5} lg={5} >
					<Typography style={{paddingTop: "20px" }} className={gClasses.patientInfo2Blue} >Marital Status</Typography>
				</Grid>
				<Grid item xs={7} sm={7} md={7} lg={7} >
					<VsSelect size="small" align="left"  style={{paddingLeft: "10px", paddingRight: "10px" }}
						inputProps={{className: gClasses.dateTimeNormal}} label="Marital Status" 
						options={MARITALSTATUS} 
						value={emurAddr8} onChange={(event) => { setEmurAddr8(event.target.value); }} 
					/>			
				</Grid>
			</Grid>	
			{(emurAddr8 === "Married") &&
			<div>
			<Grid key="SPOUSEDETAILS_PART2" className={gClasses.noPadding} container  alignItems="flex-start" >
				<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
				<Grid item xs={5} sm={5} md={5} lg={5} >
					<Typography style={{paddingTop: "1px" }} className={gClasses.patientInfo2Blue} >Date of Marriage</Typography>
				</Grid>
				<Grid item xs={7} sm={7} md={7} lg={7} >
					<Datetime 
						className={gClasses.dateTimeBlock}
						inputProps={{className: gClasses.dateTimeNormal}}
						timeFormat={false} 
						initialValue={emurDate2}
						value={emurDate2}
						dateFormat="DD/MM/yyyy"
						isValidDate={disableFutureDt}
						onClose={setEmurDate2}
						closeOnSelect={true}
					/>
				</Grid>
				<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
			</Grid>
			{ (!selectSpouse) &&
			<Grid key="SPOUSEDETAILS_PART4" className={gClasses.noPadding} container  alignItems="flex-start" >				
				<Grid item xs={5} sm={5} md={5} lg={5} >
					<Typography style={{paddingTop: "20px" }} className={gClasses.patientInfo2Blue} >Spouse</Typography>
				</Grid>
				<Grid item xs={7} sm={7} md={7} lg={7} >
					<Typography style={{paddingTop: "20px" }} className={gClasses.patientInfo2} >
						{(emurSpouseRec) ? getMemberName(emurSpouseRec, false, false) : ""}
					</Typography>		
				</Grid>
				<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
				<Grid item xs={6} sm={6} md={6} lg={6} >
					<VsButton align="center" name="Clear" type="button" onClick={() => setEmurSpouseRec(null) } />
				</Grid>
				<Grid item xs={6} sm={6} md={6} lg={6} >
					<VsButton align="center" name="Modify" type="button" onClick={handleSpouseSelect} />
				</Grid>
			</Grid>
			}
			{ (selectSpouse) &&
				<Box align="center" borderColor="black" borderRadius={7} border={1} >
				<VsCancel align="right" onClick={() => setSelectSpouse(false) } />
				<br />
				<Typography className={gClasses.patientInfo2Brown}>Select Spouse</Typography>
				<br />
				{spouseList.map( (m, index) => {
					return (
						<Grid key={"SELECTSPOUSE"+index} className={gClasses.noPadding} container  alignItems="flex-start" >
						<Grid style={{marginTop: "10px"}}  item xs={8} sm={8} md={8} lg={8} >
							<Typography style={{marginLeft: "10px"}} className={gClasses.title}>{getMemberName(m, false, false)}</Typography>
						</Grid>	
						<Grid item xs={2} sm={2} md={2} lg={2} >
							<VsRadio checked={newSpouseMid === m.mid} onClick={() => setNewSpouseMid(m.mid) }  />
						</Grid>
						</Grid>	
					)}
				)}
				<br />
				<VsButton type="button" align="center"  name="Confirm" onClick={updateNewSpouse} />
				</Box>
			}
			</div>
			}
			<br />
		</Accordion>
		<br />*/}
		<Accordion expanded={expandedPanel === "OTHERDETAILS"} onChange={handleAccordionChange("OTHERDETAILS")}>
			<Box align="right" className={(expandedPanel === "OTHERDETAILS") ? gClasses.selectedAccordian : gClasses.normalAccordian} borderColor="black" borderRadius={7} border={1} >
			<AccordionSummary aria-controls="panel1a-content" id="panel1a-header" expandIcon={<ExpandMoreIcon />}>
				<Typography align="left" >{"Office Details"}</Typography>
			</AccordionSummary>
			</Box>
			<Grid key="OTHERDETAILS" className={gClasses.noPadding} container  alignItems="flex-start" >
				<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
				<Grid item xs={5} sm={5} md={5} lg={5} >
					<Typography style={{paddingTop: "10px" }} className={gClasses.patientInfo2Blue} >Occupation</Typography>
				</Grid>
				<Grid item xs={7} sm={7} md={7} lg={7} >
					<TextValidator className={gClasses.vgSpacing}
						inputProps={{className: gClasses.dateTimeNormal}} type="text" value={emurAddr10}
						onChange={(event) => { setEmurAddr10(event.target.value) }}			
					/>			
				</Grid>
				<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
				<Grid item xs={5} sm={5} md={5} lg={5} >
					<Typography style={{paddingTop: "10px" }} className={gClasses.patientInfo2Blue} >Education</Typography>
				</Grid>
				<Grid item xs={7} sm={7} md={7} lg={7} >
					<TextValidator className={gClasses.vgSpacing}
						inputProps={{className: gClasses.dateTimeNormal}} type="text" value={education}
						onChange={(event) => { setEducation(event.target.value) }}			
					/>			
				</Grid>
				<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
				<Grid item xs={5} sm={5} md={5} lg={5} >
					<Typography style={{paddingTop: "10px" }} className={gClasses.patientInfo2Blue} >Company</Typography>
				</Grid>
				<Grid item xs={7} sm={7} md={7} lg={7} >
					<TextValidator className={gClasses.vgSpacing}
						inputProps={{className: gClasses.dateTimeNormal}} type="text" value={company}
						onChange={(event) => { setCompany(event.target.value) }}			
					/>			
				</Grid>
				<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
				<Grid item xs={5} sm={5} md={5} lg={5} >
					<Typography style={{paddingTop: "10px" }} className={gClasses.patientInfo2Blue} >Office Phone</Typography>
				</Grid>
				<Grid item xs={7} sm={7} md={7} lg={7} >
					<TextValidator className={gClasses.vgSpacing}
						inputProps={{className: gClasses.dateTimeNormal}} type="text" value={officePhone}
						onChange={(event) => { setOfficePhone(event.target.value) }}			
					/>			
				</Grid>
			</Grid>
			<br />
		</Accordion>
		<br />
		<VsButton align="center" name={(myProps.mode === "ADD") ? "Add" : "Update"} type="submit" />		
	</ValidatorForm>
	<ToastContainer />
	</Box>
	</Container>
	</div>
	)
}
