import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
import { TextField, InputAdornment } from "@material-ui/core";
// import { Switch, Route, Link } from 'react-router-dom';
import { ValidatorForm, TextValidator, TextValidatorcvariant} from 'react-material-ui-form-validator';
import Drawer from '@material-ui/core/Drawer';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Switch } from '@material-ui/core';

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
import lodashCloneDeep from "lodash/cloneDeep";

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
import VsRadioGroup from "CustomComponents/VsRadioGroup";


import {
	ADMIN, APPLICATIONTYPES, SELECTSTYLE,
  PADSTYLE,
	MEMBERTITLE, RELATION, SELFRELATION, GENDER, BLOODGROUP, MARITALSTATUS,
	STATUS_INFO, MIN_DATE,
   CASTE, HUMADSUBCASTRE, PJYM_MAXAGE,
   HUMADSUBCASTEOBJ, CASTEOBJ,
	 PRWS_VILLAGE,
} from 'views/globals';

import {
	getMemberName,
	dateString, dateStringMMM, disableFutureDt,
	getAge,
	
} from 'views/functions';

import {
	setTab,
} from "CustomComponents/CricDreamTabs.js"


import {
	memberGetByMidOne,
} from 'views/clientdbfunctions';
	


export default function MemberNewMemberhsip() {
	//console.log("new membership");
	const gClasses = globalStyles();
	const myProps = JSON.parse(sessionStorage.getItem("membershipApplication"));


	// show in accordion
	const [expandedPanel, setExpandedPanel] = useState("");
	const handleAccordionChange = (panel) => (event, isExpanded) => {
		setExpandedPanel(isExpanded ? panel : false);
		//setRegisterStatus(0);
	};

   
	//const [header, setHeader] = useState(`Application for ${myProps.membershipType} membership`);
	const [header, setHeader] = useState(`Application for membership`);
	const [registerStatus, setRegisterStatus] = useState(0);
   
   const [gotraArray, setGotraArray] = useState([]);
	 const [cityArray ,setCityArray] = useState([]);
   const [stateArray, setStateArray] = useState([]);
   const [countryArray, setCountryArray] = useState([]);
   
   const [myGotra, setMyGotra] = useState("");
   const [myCity, setMyCity] = useState("");
   const [myState, setMyState] = useState("");
   const [myCountry, setMyCountry] = useState("");
   
   const [currentGotraRec, setCurrentGotraRec] = useState(null);
   const [caste, setCaste] = useState(CASTEOBJ.humad);
   const [subCaste, setSubCaste] = useState(HUMADSUBCASTEOBJ.dasha);
   const [village, setVillage] = useState(PRWS_VILLAGE);
   const [isDashaHumad, setIsDashaHumad] = useState(true);

	const [indian, setIndian] = useState(true);
	const [newCountry, setNewCountry] = useState(false);
	const [newCity, setNewCity] = useState(false);

   const [humadMembership, setHumadMembership] = useState(false);
   const [pjymMembership, setPjymMembership] = useState(false);
	 const [prwsMembership, setPrwsMembership] = useState(true);
   
	// address
	const [emurAddr1, setEmurAddr1] = useState("");
	const [emurAddr2, setEmurAddr2] = useState("");
	const [emurAddr3, setEmurAddr3] = useState("");
	const [emurAddr4, setEmurAddr4] = useState("");
	const [emurAddr5, setEmurAddr5] = useState("");
	
	const [suburb, setSuburb] = useState("");	
	const [district, setDistrict] = useState("");   
	const [city, setCity] = useState("Mumbai");
	const [state, setState] = useState("Maharashtra");
	const [country, setCountry] = useState("Australia");


	const [emurGotra, setEmurGotra] = useState("");
	const [emurVillage, setEmurVillage] = useState("");
	const [emurPinCode, setEmurPincCode] = useState("");
	const [emurResPhone1, setEmurResPhone1] = useState("");
	const [emurResPhone2, setEmurResPhone2] = useState("");
	const [emurPinResp, setEmurPinResp] = useState({});
	const [emurDate1, setEmurDate1] = useState("");
	const [emurDate2, setEmurDate2] = useState("");


	const [title, setTitle] = useState("Shri");
	const [lastName, setLastName] = useState("");
	const [firstName, setFirstName] = useState("");
	const [middleName, setMiddleName] = useState("");
	const [alias, setAlias] = useState("");
   
   
	const [gender, SetGender] = useState("Male");
	const [relation, setRelation] = useState("Son");
	const [emsStatus, setEmsStatus] = useState("Unmarried");
	const [bloodGroup, setBloodGroup] = useState("O+");
	const [dob, setDob] = useState(moment(MIN_DATE));
  const [dom, setDom] = useState(moment(MIN_DATE)); 
	const [emurAddr10, setEmurAddr10] = useState("");
	const [persMobile1, SetPersMobile1] = useState("");
	const [persMobile2, SetPersMobile2] = useState("");
	const [persEmail1, setPersEmail1] = useState("");
	const [persEmail2, setPersEmail2] = useState("");
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
   
	// permission for samaj membership
	const [prwsMembershipAllowed, setPrwsMembershipAllowed] = useState(true);
	const [pjymMembershipAllowed, setPjymMembershipAllowed] = useState(false);
	const [humadMembershipAllowed, setHumadMembershipAllowed] = useState(true);
	
	
  useEffect(() => {	
	async function getGotraList() {
		//console.log("Hi");
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/gotra/list`
			let resp = await axios.get(myUrl);
			//console.log(resp.data);
         
			setGotraArray(resp.data);
			//var test = resp.data.find(
		} catch (e) {
			console.log(e);
			showError(`Error fetching Gotra List`);
			setGotraArray([]);
		}	
	}

	async function getCityList() {
		//console.log("Hi");
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/city/list`
			let resp = await axios.get(myUrl);
			setCityArray(resp.data);
			//console.log(resp.data);
		} catch (e) {
			console.log(e);
			showError(`Error fetching city List`);
			setCityArray([]);
		}	
	}

	async function getStateList() {
		//console.log("Hi");
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/state/list`
			let resp = await axios.get(myUrl);
         //console.log(resp.data);
			setStateArray(resp.data);
			//setCurrentMember()
		} catch (e) {
			console.log(e);
			showError(`Error fetching state List`);
			setStateArray([]);
		}	
	}

	async function getCountryList() {
		//console.log("Hi");
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/country/list`
			let resp = await axios.get(myUrl);
         var tmp = resp.data;  //.concat([{country: "Add new Country"}]);
			setCountryArray(tmp);
			//setCurrentMember()
		} catch (e) {
			console.log(e);
			showError(`Error fetching Country List`);
			setCountryArray([]);
		}	
	}

		getGotraList();
		getCityList(); 
      getStateList(); 
		getCountryList(); 
  }, []);


function checkMembershipEligibility(myCaste, mySubCaste, myVillage, myCity, myDob) {
	console.log(myCity);
	var prws = false;
	var pjym = false;
	var humad = false;
	
	console.log(myDob);
	console.log(getAge(myDob));
	
	if (myCaste === CASTEOBJ.humad) {
		humad = true;
		// Do not check for village
		//if ((mySubCaste === HUMADSUBCASTEOBJ.dasha) && ( myVillage.toLowerCase() === PRWS_VILLAGE.toLowerCase() )) {	
		if ((mySubCaste === HUMADSUBCASTEOBJ.dasha) && ( true )) {	
			var isMMr = cityArray.find(x => x.mmr === true && x.city === myCity);
			if (isMMr) {
				prws = true;
				if (getAge(myDob) <= PJYM_MAXAGE) {
					pjym = true;
				}
			}
		}
	}
	// do not decided on PRWS membership
	//if (!prws) setPrwsMembership(false);
  //setPrwsMembershipAllowed(prws);
	
	if (!pjym) setPjymMembership(false);
	setPjymMembershipAllowed(pjym);
	
	if (!humad) setHumadMembership(false);
	setHumadMembershipAllowed(humad);
}


async function handleNewMembership() {
	 var myErr = 0;
   if (!currentGotraRec) myErr = -1001;
	 else if ((firstName === "") || (middleName === "") || (lastName === "")) myErr = -1002; 
	 //else if ((!pjymMembership) && (!prwsMembership) && (!humadMembership)) myErr = -1003;	
	 else if (emurAddr1 === "")  myErr = -1004;
	 else if ((emurPinCode <= 110000) || (emurPinCode >= 860000)) myErr = -1005;	
	setRegisterStatus(myErr);
	if (myErr !== 0)
		return;
	
	var isMmr = false;
	if (indian) {
	  var cityRec = cityArray.find(x => x.city === city);
		isMmr = cityRec.mmr;
	}

   var myData = {
     hid: 0,
     title: title,
     lastName: lastName,
     firstName: firstName,
     middleName: middleName,
     alias: alias,
     gotra: currentGotraRec.gotra,
     caste: caste,
     subCaste: subCaste,
     village: village,
     humadMembership: humadMembership,
		 prwsMembership: true,		//		prwsMembership,
     pjymMembership: pjymMembership,
     gender: gender,
     dob: dob,
     bloodGroup: (bloodGroup !== 'NotKnown') ? bloodGroup : '' ,
		 emsStatus: emsStatus,
		 dom: dom,
     persMobile1: persMobile1,
     persMobile2: persMobile2,
     persEmail1: encrypt((persEmail1 !== "") ? persEmail1 : "-"),
		 persEmail2: encrypt((persEmail2 !== "") ? persEmail2 : "-"),
     // update ADDRESS
     indianResident: indian,
     addr1: emurAddr1,
     addr2: emurAddr2,
     addr3: emurAddr3,
     addr4: emurAddr4,
     addr5: emurAddr5,
     district: district,
     suburb: suburb,
     city: city,
		 mmr: isMmr,
     state: state,
     country: (indian) ? 'India' : country,
     pinCode: emurPinCode,
		 applier:  sessionStorage.getItem('prwsLogin'),
   };
   console.log(myData);

	let myMsg = 'Error applying for guest membership';
	let myStatus = STATUS_INFO.ERROR;
	let myRec = null;
	let tmp = encodeURIComponent(JSON.stringify(myData));
	try {
		//let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/apply/guestmembership/${sessionStorage.getItem('prwsLogin')}/${tmp}`;
		let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/apply/guestmembership/0/${tmp}`;
		let resp = await axios.get(myUrl);
		myRec = resp.data;
		myMsg = `Successfully applied for new membership by Guest. Application reference ${resp.data.id}.`
		myStatus = STATUS_INFO.SUCCESS;
      
	} catch (e) {
		console.log(e.response);
	}
	var returnStatus = {status: myStatus, applicationRec: myRec, msg: myMsg };
	sessionStorage.setItem("guestmembership_returnstatus", JSON.stringify(returnStatus));
	setTab(myProps.calledFrom);
	//var returnStatus = {status: myStatus,  msg: myMsg};
	//sessionStorage.setItem(myProps.applicationRec ? "application_returnstatus" : "family_personal_returnstatus", JSON.stringify(returnStatus));
	//notreq sessionStorage.setItem("family_currentSelection", myProps.calledFrom);
	return;
}


	function DisplayRegisterStatus() {
    // console.log(`Status is ${registerStatus}`);
		let regerr = true;
    let myMsg;
    switch (registerStatus) {
      case 0:
        myMsg = "";
				regerr = false;
        break;
      case -1001:
        myMsg = `Gotra need to be selected`;
        break;
      case -1002:
        myMsg = `Name details to be provided`;
        break;
			case -1003:
				myMsg = `Minimum 1 membership to be selected`;
				break;
			case -1004:
				myMsg = `Residential address to be provided`;
				break;
			case -1005:
				myMsg = `Invalid Pin Code`;
				break;
			default:
          myMsg = "";
          break;
    }
    return(
      <div>
        <Typography className={(regerr) ? gClasses.error : gClasses.nonerror}>{myMsg}</Typography>
      </div>
    )
  }

function toggleNewCity(newVal) {
  setNewCity(newVal);  
  if (!newVal) setCity("");
}

function toggleNewCountry(newVal) {
  setNewCountry(newVal);  
  if (!newVal) setCountry("");
}

function handleCancel() {
	//sessionStorage.setItem("family_currentSelection", "Personal");
	setTab(myProps.calledFrom);
}

function handleCasteChange(newCaste) {
  setCaste(newCaste);
  checkMembershipEligibility(newCaste, subCaste, village, city, dob.toDate());
}

function handleSubCasteChange(newSubCaste) {
  setSubCaste(newSubCaste);
  checkMembershipEligibility(caste, newSubCaste, village, city, dob.toDate());
}

function handleCity(newCity) {
  setCity(newCity);
  checkMembershipEligibility(caste, subCaste, village, newCity, dob.toDate());
}

function handleDob(newDate) {
	setDob(newDate);
	checkMembershipEligibility(caste, subCaste, village, city, newDate.toDate());
}

return (
	<div className={gClasses.webPage} >
	<Container component="main" maxWidth="xs">	
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} style={{paddingLeft: "5px", paddingRight: "5px"}} >
	<VsCancel align="right" onClick={handleCancel} />
	<Typography align="center" className={gClasses.title}>{header}</Typography>
	<br />
	<ValidatorForm align="left" className={gClasses.form} onSubmit={handleNewMembership}>
   
	<Accordion expanded={expandedPanel === "GOTRADETAILS"} onChange={handleAccordionChange("GOTRADETAILS")}>
		<Box align="right" className={(expandedPanel === "GOTRADETAILS") ? gClasses.selectedAccordian : gClasses.normalAccordian} borderColor="black" borderRadius={7} border={1} >
		<AccordionSummary aria-controls="panel1a-content" id="panel1a-header" expandIcon={<ExpandMoreIcon />}>
			<Typography align="left" >{"Gotra Caste and Village"}</Typography>
		</AccordionSummary>
		</Box>
		<Grid key="EDITGOTRA" className={gClasses.noPadding} container  alignItems="flex-start" >
         <Grid item xs={4} sm={4} md={4} lg={4} >
            <Typography style={{paddingTop: "20px" }} className={gClasses.patientInfo2Blue} >Gotra</Typography>
         </Grid>
         <Grid align="left" item xs={8} sm={8} md={8} lg={8} >
            <Autocomplete
               disablePortal
               id="GOTRANAME"
               value={currentGotraRec}
               onChange={(event, values) => setCurrentGotraRec(values) }
               style={{paddingTop: "10px" }}
               getOptionLabel={(option) => option.gotra || ""}
               options={gotraArray}
               sx={{ width: 300 }}  
               renderInput={(params) => <TextField {...params} />}
            />			
         </Grid>
         <Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
         <Grid item xs={4} sm={4} md={4} lg={4} >
            <Typography style={{paddingTop: "10px" }} className={gClasses.patientInfo2Blue} >Caste</Typography>
         </Grid>
         <Grid item xs={8} sm={8} md={8} lg={8} >
            <VsRadioGroup
               value={caste} onChange={(event) => handleCasteChange(event.target.value)}
               radioList={CASTE}
            />
         </Grid>
         <Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
         {(caste === CASTEOBJ.humad) &&
         <Grid item xs={4} sm={4} md={4} lg={4} >
            {(caste === CASTEOBJ.humad) &&
            <Typography style={{paddingTop: "10px" }} className={gClasses.patientInfo2Blue} >Sub Caste</Typography>
            }
         </Grid>
         }
         {(caste === "Humad") &&         
         <Grid item xs={8} sm={8} md={8} lg={8} >
            <VsRadioGroup 
               value={subCaste} onChange={(event) => handleSubCasteChange(event.target.value)}
               radioList={HUMADSUBCASTRE}
            />
         </Grid>
         }
         <Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />     
         <Grid item xs={4} sm={4} md={4} lg={4} >
            <Typography style={{paddingTop: "20px" }} className={gClasses.patientInfo2Blue} >Village</Typography>
         </Grid>
         <Grid item xs={8} sm={8} md={8} lg={8} >
            <TextValidator style={{paddingLeft: "10px", paddingRight: "10px", marginTop: "10px"  }} className={gClasses.vgSpacing} inputProps={{className: gClasses.dateTimeNormal}}
            type="text" value={village} onChange={(event) => { setVillage(event.target.value) }} />
         </Grid>
      </Grid>
      <br />
	</Accordion>
  <br />
	<Accordion expanded={expandedPanel === "NAMEDETAILS"} onChange={handleAccordionChange("NAMEDETAILS")}>
		<Box align="right" className={(expandedPanel === "NAMEDETAILS") ? gClasses.selectedAccordian : gClasses.normalAccordian} borderColor="black" borderRadius={7} border={1} >
		<AccordionSummary aria-controls="panel1a-content" id="panel1a-header" expandIcon={<ExpandMoreIcon />}>
			<Typography align="left" >{'Name Details'}</Typography>
		</AccordionSummary>
		</Box>
      <Grid key="NAME" className={gClasses.noPadding} container  alignItems="flex-start" >
         <Grid item xs={5} sm={5} md={5} lg={5} >
            <Typography style={{paddingTop: "20px" }} className={gClasses.patientInfo2Blue} >Title</Typography>
         </Grid>
         <Grid item xs={7} sm={7} md={7} lg={7} >
            <VsSelect size="small" align="left" inputProps={{className: gClasses.dateTimeNormal}} style={{paddingLeft: "10px", paddingRight: "10px" }}
            options={MEMBERTITLE} value={title} onChange={(event) => { setTitle(event.target.value); }} />
         </Grid>
         <Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
         <Grid item xs={5} sm={5} md={5} lg={5} >
            <Typography style={{paddingTop: "10px" }} className={gClasses.patientInfo2Blue} >Last Name</Typography>
         </Grid>
         <Grid item xs={7} sm={7} md={7} lg={7} >
            <TextValidator style={{paddingLeft: "10px", paddingRight: "10px" }} className={gClasses.vgSpacing} inputProps={{className: gClasses.dateTimeNormal}}
            type="text" value={lastName} onChange={(event) => { setLastName(event.target.value) }} />
         </Grid>
         <Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
         <Grid item xs={5} sm={5} md={5} lg={5} >
            <Typography style={{paddingTop: "10px" }} className={gClasses.patientInfo2Blue} >First Name</Typography>
         </Grid>
         <Grid item xs={7} sm={7} md={7} lg={7} >
            <TextValidator style={{paddingLeft: "10px", paddingRight: "10px" }} className={gClasses.vgSpacing}
               inputProps={{className: gClasses.dateTimeNormal}} type="text" value={firstName}
               onChange={(event) => { setFirstName(event.target.value) }}			
            />	
         </Grid>
         <Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
         <Grid item xs={5} sm={5} md={5} lg={5} >
            <Typography style={{paddingTop: "10px" }} className={gClasses.patientInfo2Blue} >Middle Name</Typography>
         </Grid>
         <Grid item xs={7} sm={7} md={7} lg={7} >
            <TextValidator style={{paddingLeft: "10px", paddingRight: "10px" }} className={gClasses.vgSpacing}
               inputProps={{className: gClasses.dateTimeNormal}} type="text" value={middleName}
               onChange={(event) => { setMiddleName(event.target.value) }}			
            />	
         </Grid>
         <Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
         <Grid item xs={5} sm={5} md={5} lg={5} >
            <Typography style={{paddingTop: "10px" }} className={gClasses.patientInfo2Blue} >Alias</Typography>
         </Grid>
         <Grid item xs={7} sm={7} md={7} lg={7} >
            <TextValidator style={{paddingLeft: "10px", paddingRight: "10px" }} className={gClasses.vgSpacing} inputProps={{className: gClasses.dateTimeNormal}}
            type="text" value={alias} onChange={(event) => { setAlias(event.target.value) }} />
         </Grid>
      </Grid>
      <br />
   </Accordion>   
	<br />
	<Accordion expanded={expandedPanel === "ADDRESSDETAILS"} onChange={handleAccordionChange("ADDRESSDETAILS")}>
		<Box align="right" className={(expandedPanel === "ADDRESSDETAILS") ? gClasses.selectedAccordian : gClasses.normalAccordian} borderColor="black" borderRadius={7} border={1} >
		<AccordionSummary aria-controls="panel1a-content" id="panel1a-header" expandIcon={<ExpandMoreIcon />}>
			<Typography align="left" >{"Address"}</Typography>
		</AccordionSummary>
		</Box>
      <Grid key="ADDRESS" className={gClasses.noPadding} container  alignItems="flex-start" >
			<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
			<Grid item xs={4} sm={4} md={4} lg={4} >
				<Typography className={gClasses.patientInfo2Blue} >Indian Resident</Typography>
			</Grid>
			<Grid align="left" item xs={8} sm={8} md={8} lg={8} >
				<Switch color="primary" checked={indian} onChange={() => setIndian(!indian) } />
			</Grid>
			<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
			<Grid item xs={4} sm={4} md={4} lg={4} >
				<Typography className={gClasses.patientInfo2Blue} >Address</Typography>
			</Grid>
			<Grid align="left" item xs={8} sm={8} md={8} lg={8} >
				<TextValidator fullWidth  className={gClasses.vgSpacing}
					value={emurAddr1} onChange={(event) => { setEmurAddr1(event.target.value) }}			
				/>
				<TextValidator fullWidth className={gClasses.vgSpacing}
					value={emurAddr2} onChange={(event) => { setEmurAddr2(event.target.value) }}			
				/>
				<TextValidator fullWidth className={gClasses.vgSpacing}
					value={emurAddr3} onChange={(event) => { setEmurAddr3(event.target.value) }}			
				/>
				<TextValidator  fullWidth className={gClasses.vgSpacing}
					value={emurAddr4} onChange={(event) => { setEmurAddr4(event.target.value) }}			
				/>
				<TextValidator  fullWidth className={gClasses.vgSpacing}
					value={emurAddr5} onChange={(event) => { setEmurAddr5(event.target.value) }}			
				/>
			</Grid>
			<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
			</Grid>
			{(indian) &&
			<Grid key="NONNRI" className={gClasses.noPadding} container  alignItems="flex-start" >
				<Grid item xs={4} sm={4} md={4} lg={4} >
					<Typography className={gClasses.patientInfo2Blue} >Suburb</Typography>
				</Grid>
				<Grid align="left" item xs={8} sm={8} md={8} lg={8} >
					<TextValidator  fullWidth className={gClasses.vgSpacing}
						value={suburb}
						onChange={(event) => { setSuburb(event.target.value) }}			
					/>
				</Grid>
				<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
				<Grid item xs={4} sm={4} md={4} lg={4} >
					<Typography className={gClasses.patientInfo2Blue} >District</Typography>
				</Grid>
				<Grid align="left" item xs={8} sm={8} md={8} lg={8} >
					<TextValidator fullWidth className={gClasses.vgSpacing}
						value={district} onChange={(event) => { setDistrict(event.target.value) }}			
					/>
				</Grid>
				<Grid item xs={4} sm={4} md={4} lg={4} >
					<Typography style={{paddingTop: "20px" }} className={gClasses.patientInfo2Blue} >City</Typography>
				</Grid>
				<Grid align="left" item xs={8} sm={8} md={8} lg={8} >
            {(!newCity) &&
					<VsSelect size="small" align="left"  style={{paddingRight: "10px" }}
						inputProps={{className: gClasses.dateTimeNormal}} options={cityArray} field="city"
						value={city} onChange={(event) => handleCity(event.target.value)}
					/>			
            }
            {(newCity) &&
					<TextValidator style={{marginTop: "10px"}}  fullWidth className={gClasses.vgSpacing}
						value={city} onChange={(event) => { handleCity(event.target.value) }}			
					/>
            }
				</Grid>
				<Grid style={{paddingTop: "20px" }}  item xs={4} sm={4} md={4} lg={4} >
					<Typography className={gClasses.patientInfo2Blue} >State</Typography>
				</Grid>
            <Grid align="left" item xs={8} sm={8} md={8} lg={8} >
            <VsSelect size="small" align="left"  style={{paddingRight: "10px" }}
               inputProps={{className: gClasses.dateTimeNormal}} options={stateArray} field="state"
               value={state} onChange={(event) => setState(event.target.value)}
            />			
				</Grid>
				<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
				<Grid item xs={4} sm={4} md={4} lg={4} >
					<Typography className={gClasses.patientInfo2Blue} >Pin Code</Typography>
				</Grid>
				<Grid align="left" item xs={8} sm={8} md={8} lg={8} >
					<TextValidator  fullWidth className={gClasses.vgSpacing} type="number"
						value={emurPinCode} onChange={(event) => { setEmurPincCode(event.target.value) }}	
						validators={['minNumber:110000', 'maxNumber:859999']}
						errorMessages={['Invalid Pin code', 'Invalid Pin code']}			
					/>
				</Grid>
			</Grid>
			}
			{(!indian) &&
			<Grid key="NRI" className={gClasses.noPadding} container  alignItems="flex-start" >
				<Grid item xs={4} sm={4} md={4} lg={4} >
					<Typography style={{marginTop: "15px" }} className={gClasses.patientInfo2Blue} >ZIP Code</Typography>
				</Grid>
				<Grid  align="left" item xs={8} sm={8} md={8} lg={8} >
					<TextValidator style={{margin: "5px"}}  fullWidth className={gClasses.vgSpacing} type="number"
						value={emurPinCode} onChange={(event) => { setEmurPincCode(event.target.value) }}			
					/>
				</Grid>
				<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
				<Grid item xs={4} sm={4} md={4} lg={4} >
					<Typography style={{marginTop: "15px" }} className={gClasses.patientInfo2Blue} >Country</Typography>
				</Grid>
				<Grid align="left" item xs={8} sm={8} md={8} lg={8} >
               {(!newCountry) &&
					<VsSelect size="small" align="left"  style={{paddingLeft: "10px", paddingRight: "10px" }}
						inputProps={{className: gClasses.dateTimeNormal}} options={countryArray} field="country"
						value={country} onChange={(event) => setCountry(event.target.value)}
					/>
               }               
               {(newCountry) &&
					<TextValidator style={{margin: "5px"}}  fullWidth className={gClasses.vgSpacing}
						value={country} onChange={(event) => { setCountry(event.target.value) }}			
					/>
               }               
				</Grid>
			</Grid>
			}
      <br />
   </Accordion>
	<br />
	<Accordion expanded={expandedPanel === "PERSDETAILS"} onChange={handleAccordionChange("PERSDETAILS")}>
		<Box align="right" className={(expandedPanel === "PERSDETAILS") ? gClasses.selectedAccordian : gClasses.normalAccordian} borderColor="black" borderRadius={7} border={1} >
		<AccordionSummary aria-controls="panel1a-content" id="panel1a-header" expandIcon={<ExpandMoreIcon />}>
			<Typography align="left" >{'Personal Details'}</Typography>
		</AccordionSummary>
		</Box>
      <Grid key="NAME" className={gClasses.noPadding} container  alignItems="flex-start" >
          <Grid item xs={5} sm={5} md={5} lg={5} >
            <Typography style={{paddingTop: "20px" }} className={gClasses.patientInfo2Blue} >Gender</Typography>
         </Grid>
         <Grid item xs={7} sm={7} md={7} lg={7} >
            <VsSelect size="small" align="left" inputProps={{className: gClasses.dateTimeNormal}} style={{paddingLeft: "10px", paddingRight: "10px" }}
            options={GENDER} value={gender} onChange={(event) => { SetGender(event.target.value); }} />
         </Grid>
         <Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
         <Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
				<Grid item xs={5} sm={5} md={5} lg={5} >
					<Typography style={{paddingTop: "1px" }} className={gClasses.patientInfo2Blue} >Date of Birth</Typography>
				</Grid>
				<Grid item xs={7} sm={7} md={7} lg={7} >
					<Datetime 
						className={gClasses.dateTimeBlock}
						inputProps={{className: gClasses.dateTimeNormal}}
						timeFormat={false} 
						initialValue={dob}
						value={dob}
						dateFormat="DD/MMM/yyyy"
						isValidDate={disableFutureDt}
						onClose={(selectedDate) => handleDob(selectedDate)}
						closeOnSelect={true}
					/>
				</Grid>   
         <Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
          <Grid item xs={5} sm={5} md={5} lg={5} >
            <Typography style={{paddingTop: "20px" }} className={gClasses.patientInfo2Blue} >Blood Group</Typography>
         </Grid>
         <Grid item xs={7} sm={7} md={7} lg={7} >
            <VsSelect size="small" align="left" inputProps={{className: gClasses.dateTimeNormal}} style={{paddingLeft: "10px", paddingRight: "10px" }}
            options={BLOODGROUP} value={bloodGroup} onChange={(event) => { setBloodGroup(event.target.value); }} />
         </Grid>
         <Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
         <Grid item xs={5} sm={5} md={5} lg={5} >
            <Typography style={{paddingTop: "20px" }} className={gClasses.patientInfo2Blue} >Marital Status</Typography>
         </Grid>
         <Grid item xs={7} sm={7} md={7} lg={7} >
            <VsSelect size="small" align="left" inputProps={{className: gClasses.dateTimeNormal}} style={{paddingLeft: "10px", paddingRight: "10px" }}
            options={MARITALSTATUS} value={emsStatus} onChange={(event) => { setEmsStatus(event.target.value); }} />
         </Grid>
				 {(emsStatus === "Married") &&
         <Grid item xs={5} sm={5} md={5} lg={5} >
            <Typography style={{paddingTop: "20px" }} className={gClasses.patientInfo2Blue} >Date of Marriage</Typography>
         </Grid>
				 }
				 {(emsStatus === "Married") &&
         <Grid item style={{paddingTop: "20px" }}  xs={7} sm={7} md={7} lg={7} >
					<Datetime 
						className={gClasses.dateTimeBlock}
						inputProps={{className: gClasses.dateTimeNormal}}
						timeFormat={false} 
						initialValue={dom}
						value={dom}
						dateFormat="DD/MMM/yyyy"
						isValidDate={disableFutureDt}
						onClose={(selectedDate) => setDom(selectedDate)}
						closeOnSelect={true}
					/>
         </Grid>
				 }
         <Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
         <Grid item xs={5} sm={5} md={5} lg={5} >
					<Typography style={{paddingTop: "10px" }} className={gClasses.patientInfo2Blue} >Mobile 1</Typography>
				</Grid>
				<Grid item xs={7} sm={7} md={7} lg={7} >
					<TextValidator className={gClasses.vgSpacing}
						inputProps={{className: gClasses.dateTimeNormal}} type="number" value={persMobile1}
						onChange={(event) => { SetPersMobile1(event.target.value) }}			
					/>
				</Grid>
         <Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
				<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
				<Grid item xs={5} sm={5} md={5} lg={5} >
					<Typography style={{paddingTop: "10px" }} className={gClasses.patientInfo2Blue} >Mobile 2</Typography>
				</Grid>
				<Grid item xs={7} sm={7} md={7} lg={7} >
					<TextValidator className={gClasses.vgSpacing} type="number" value={persMobile2}
						onChange={(event) => { SetPersMobile2(event.target.value) }}			
					/>
				</Grid>
        <Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
				<Grid item xs={5} sm={5} md={5} lg={5} >
					<Typography style={{paddingTop: "10px" }} className={gClasses.patientInfo2Blue} >Email 1</Typography>
				</Grid>
				<Grid item xs={7} sm={7} md={7} lg={7} >
					<TextValidator className={gClasses.vgSpacing}
						inputProps={{className: gClasses.dateTimeNormal}} type="email" value={persEmail1}
						onChange={(event) => { setPersEmail1(event.target.value) }}			
					/>	
				</Grid>
         <Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
				<Grid item xs={5} sm={5} md={5} lg={5} >
					<Typography style={{paddingTop: "10px" }} className={gClasses.patientInfo2Blue} >Email 2</Typography>
				</Grid>
				<Grid item xs={7} sm={7} md={7} lg={7} >
					<TextValidator className={gClasses.vgSpacing}
						inputProps={{className: gClasses.dateTimeNormal}} type="email" value={persEmail2}
						onChange={(event) => { setPersEmail2(event.target.value) }}			
					/>	
				</Grid>
        <Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
      </Grid>
   </Accordion>  
	<br />
	<Accordion expanded={expandedPanel === "MEMBERSHIP"} onChange={handleAccordionChange("MEMBERSHIP")}>
		<Box align="right" className={(expandedPanel === "MEMBERSHIP") ? gClasses.selectedAccordian : gClasses.normalAccordian} borderColor="black" borderRadius={7} border={1} >
		<AccordionSummary aria-controls="panel1a-content" id="panel1a-header" expandIcon={<ExpandMoreIcon />}>
			<Typography align="left" >{"Membership"}</Typography>
		</AccordionSummary>
		</Box>
		<br />
		<Grid key="MEMBERSHIP" className={gClasses.noPadding} container  alignItems="flex-start" >
			<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
				{/*
			<Grid align="left" item xs={8} sm={8} md={8} lg={8} >
				<Typography className={gClasses.patientInfo2Blue} >PRWS membership</Typography>
			</Grid>
			<Grid item xs={4} sm={4} md={4} lg={4} >
				<Switch color="primary" disabled={!prwsMembershipAllowed} checked={prwsMembership} onChange={() => setPrwsMembership(!prwsMembership) } />
			</Grid>
			<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
				*/}
			<Grid align="left" item xs={8} sm={8} md={8} lg={8} >
				<Typography className={gClasses.patientInfo2Blue} >PJYM membership</Typography>
			</Grid>
			<Grid item xs={4} sm={4} md={4} lg={4} >
				<Switch color="primary" disabled={!pjymMembershipAllowed}  checked={pjymMembership} onChange={() => setPjymMembership(!pjymMembership) } />
			</Grid>
			<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
			<Grid align="left" item xs={8} sm={8} md={8} lg={8} >
				<Typography className={gClasses.patientInfo2Blue} >Humad membership</Typography>
			</Grid>
			<Grid item xs={4} sm={4} md={4} lg={4} >
				<Switch color="primary" disabled={!humadMembershipAllowed} checked={humadMembership} onChange={() => setHumadMembership(!humadMembership) } />
			</Grid>
      </Grid>
      <br />
		</Accordion>
      <br />
  <DisplayRegisterStatus />
   <br />
   <VsButton align="center" name={"Apply"} type="submit" />
	</ValidatorForm>
	<br />
	<ToastContainer />
	</Box>
	</Container>
	</div>
	)
}
