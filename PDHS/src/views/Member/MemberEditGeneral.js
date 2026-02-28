import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';

import { TextField, InputAdornment } from "@material-ui/core";
import { Switch } from '@material-ui/core';

import { ValidatorForm, TextValidator, TextValidatorcvariant} from 'react-material-ui-form-validator';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Drawer from '@material-ui/core/Drawer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';

import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Grid from "@material-ui/core/Grid";


import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import BlueRadio from 'components/Radio/BlueRadio';
import { UserContext } from "../../UserContext";
import { JumpButton, DisplayPageHeader, ValidComp, BlankArea} from 'CustomComponents/CustomComponents.js';

import lodashSortBy from "lodash/sortBy";
import lodashMap from "lodash/map";

import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";

import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import EditIcon from '@material-ui/icons/Edit';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import CancelIcon from '@material-ui/icons/Cancel';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


//import { NoGroup, JumpButton, DisplayPageHeader, MessageToUser } from 'CustomComponents/CustomComponents.js';
import { 
	showError, showSuccess, showInfo,
	disableFutureDt,
	dateString,
} from 'views/functions';

import globalStyles from "assets/globalStyles";

import {setTab} from "CustomComponents/CricDreamTabs.js"

import VsButton from "CustomComponents/VsButton"; 
import VsCancel from "CustomComponents/VsCancel";
import VsSelect from "CustomComponents/VsSelect";
import VsRadio from "CustomComponents/VsRadio";
import VsCheckBox from "CustomComponents/VsCheckBox";
import VsRadioGroup from "CustomComponents/VsRadioGroup";


import {
	SELFRELATION, RELATION, GENTSRELATION, LADIESRELATION,
	STATUS_INFO,
	CASTE, HUMADSUBCASTRE,
	APPLICATIONTYPES,
} from 'views/globals';

import {
	getMemberName,
	hasPRWSpermission,
   correctName,
} from 'views/functions';


export default function MemberEditGeneral() {
	const gClasses = globalStyles();
	const myProps = JSON.parse(sessionStorage.getItem("family_personal_props"));
	//console.log(myProps.hodRec);
	
	const [header, setHeader] = useState("Apply to change general details");

	const [existingGotra, setExistingGotra] = useState(true);
	const [currentGotraRec, setCurrentGotraRec] = useState(null);
	const [currentGotra, setCurrentGotra] = useState(myProps.hodRec.gotra);
	const [hodRec, setHodRec] = useState(myProps.hodRec);
	const [caste, setCaste] = useState(myProps.hodRec.caste);
	const [subCaste, setSubCaste] = useState(myProps.hodRec.subCaste);

	const [registerStatus, setRegisterStatus] = useState(0);
		
   const [newCountry, setNewCountry] = useState(false);
   const [newCity, setNewCity] = useState(false);
	const [emurVillage, setEmurVillage] = useState(myProps.hodRec.village);
	const [emurResPhone1, setEmurResPhone1] = useState(myProps.hodRec.resPhone1);
	const [emurResPhone2, setEmurResPhone2] = useState(myProps.hodRec.resPhone2);

	// address
	const [emurAddr1, setEmurAddr1] = useState(myProps.hodRec.resAddr1);
	const [emurAddr2, setEmurAddr2] = useState(myProps.hodRec.resAddr2);
	const [emurAddr3, setEmurAddr3] = useState(myProps.hodRec.resAddr3);
	const [emurAddr4, setEmurAddr4] = useState(myProps.hodRec.resAddr4);
	const [emurAddr5, setEmurAddr5] = useState(myProps.hodRec.resAddr5);
	
	const [suburb, setSuburb] = useState(myProps.hodRec.suburb);			
	const [city, setCity] = useState(myProps.hodRec.city);
	const [country, setCountry] = useState(myProps.hodRec.country);
	const [indian, setIndian] = useState(myProps.hodRec.indianResident);


	const [emurAddr8, setEmurAddr8] = useState("");
	const [emurAddr9, setEmurAddr9] = useState("");
	const [district, setDistrict] = useState(myProps.hodRec.district);
	const [state, setState] = useState(myProps.hodRec.state);
	const [emurPinCode, setEmurPincCode] = useState(myProps.hodRec.pinCode);

	const [emurAddr12, setEmurAddr12] = useState("");
	const [emurAddr13, setEmurAddr13] = useState("");


	
	// show in accordion
	const [expandedPanel, setExpandedPanel] = useState("");
	const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedPanel(isExpanded ? panel : false);
    setRegisterStatus(0);
  };


	//useEffect(() => {
		//console.log(myProps.cityList);
		//console.log(myProps);
	//}, [])



	function DisplayRegisterStatus() {
    // console.log(`Status is ${registerStatus}`);
		let regerr = true;
    let myMsg;
    switch (registerStatus) {
      case 0:
        myMsg = "";
				regerr = false;
        break;
      case 1001:
        myMsg = `Invalid Pin Code`;
        break;
      case 1002:
        myMsg = `Unknown HOD update error`;
        break;
			case 2001:
				myMsg = `No HOD selected for new family`;
				break;
			case 2002:
				myMsg = `No member(s) selected for new family`;
				break;
			case 3001:
				myMsg = `City not selected`;
				break;
			case 3002:
				myMsg = `Country not selected`;
				break;
			case 3003:
				myMsg = `Country cannot be India for Non Resident Indian`;
				break;
			default:
          myMsg = "Unknown Error";
          break;
    }
    return(
      <div>
        <Typography className={(regerr) ? gClasses.error : gClasses.nonerror}>{myMsg}</Typography>
      </div>
    )
  }


	async function handleEditGeneralSubmit() {
		//console.log(indian, city, country);
      var myNewCity = newCity;
      var myNewCountry = newCountry;
      var myCity = city;
      var myCountry = country;
      

		if (indian) {
			if (city === "") return setRegisterStatus(3001);
		}
		else {
			if (country === "") return setRegisterStatus(3002);
			if (country === "India") return setRegisterStatus(3003);
		}
      if (myNewCity)  {
        myCity = correctName(myCity.trim());
        if (myProps.cityList.filter(x => x.city === myCity).length > 0) myNewCity = false;
      }
      if (myNewCountry) {  
         myCountry = correctName(myCountry.trim());
         if (myProps.countryList.filter(x => x.country === myCountry).length > 0) myNewCountry = false;
		}
      //console.log(myCity, myCountry);
      //console.log(myNewCity, myNewCountry)

		//let myData  = encodeURIComponent(JSON.stringify({
		let myData = {
         hid: hodRec.hid,
			oldHodRec:  myProps.hodRec,
			newHodRec: {
				indianResident: indian,
            newCity: myNewCity,
            newCountry: myNewCountry,
				resAddr1: emurAddr1,
				resAddr2: emurAddr2,
				resAddr3: emurAddr3,
				resAddr4: emurAddr4,
				resAddr5: emurAddr5,
				suburb: suburb,
				city: myCity,
				country: myCountry,
				district: district,
				state: state,
				pinCode: emurPinCode,
				village: emurVillage,
				resPhone1: emurResPhone1,
				resPhone2: emurResPhone2
			}
		};		//));
		//console.log(myData);
      
		let myMsg = '';
		let myStatus = STATUS_INFO.SUCCESS;
		var myTmp = encodeURIComponent(JSON.stringify(myData));
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/apply/editfamilydetails/${myProps.hodRec.mid}/${sessionStorage.getItem('mid')}/${myTmp}`;
			console.log(myUrl);
			let resp = await axios.get(myUrl);
			myMsg = `Successfully applied for change in general details. Application reference ${resp.data.id}.`;
			myStatus = STATUS_INFO.SUCCESS;
		} 
		catch (e) {
			console.log(e);
			myMsg = `Error applying for change in general details.`;
			myStatus = STATUS_INFO.ERROR;
		}
		var returnStatus = {status: myStatus,  msg: myMsg};
		sessionStorage.setItem("family_personal_returnstatus", JSON.stringify(returnStatus));
		sessionStorage.setItem("family_currentSelection", myProps.calledFrom);
		setTab(process.env.REACT_APP_FAMILY);

		return;
		
	}
	

function handleCancel() {
	sessionStorage.setItem("family_currentSelection", myProps.calledFrom);
	setTab(process.env.REACT_APP_FAMILY);
}

function toggleNewCountry(newVal) {
  setNewCountry(newVal);  
  if (!newVal) setCountry(myProps.hodRec.country);
}

function toggleNewCity(newVal) {
  setNewCity(newVal);  
  if (!newVal) setCity(myProps.hodRec.city);
}
return (
	<div className={gClasses.webPage} >
	<Container component="main" maxWidth="xs">	
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} style={{paddingLeft: "5px", paddingRight: "5px"}} >
	<VsCancel align="right" onClick={handleCancel} />
	<Typography align="center" className={gClasses.title}>{header}</Typography>
	<br />
	<ValidatorForm align="left" className={gClasses.form} onSubmit={handleEditGeneralSubmit}>
		<Accordion expanded={expandedPanel === "generaldetails"} onChange={handleAccordionChange("generaldetails")}>
			<Box align="right" className={(expandedPanel === "generaldetails") ? gClasses.selectedAccordian : gClasses.normalAccordian} borderColor="black" borderRadius={7} border={1} >
			<AccordionSummary aria-controls="panel1a-content" id="panel1a-header" expandIcon={<ExpandMoreIcon />}>
				<Typography align="left" >{"Res. Address"}</Typography>
			</AccordionSummary>
			</Box>
			<Grid key="COMMON" className={gClasses.noPadding} container  alignItems="flex-start" >
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
				<TextValidator fullWidth required className={gClasses.vgSpacing}
					value={emurAddr1} onChange={(event) => { setEmurAddr1(event.target.value) }}			
				/>
				<TextValidator fullWidth required className={gClasses.vgSpacing}
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
						inputProps={{className: gClasses.dateTimeNormal}} options={myProps.cityList} field="city"
						value={city} onChange={(event) => setCity(event.target.value)}
					/>			
            }
            {(newCity) &&
					<TextValidator style={{marginTop: "10px"}}  fullWidth className={gClasses.vgSpacing}
						value={city} onChange={(event) => { setCity(event.target.value) }}			
					/>
            }
				</Grid>
				<Grid item xs={4} sm={4} md={4} lg={4} >
					<Typography style={{marginTop: "5px" }} className={gClasses.patientInfo2Blue} >New City</Typography>
				</Grid>
				<Grid align="left" item xs={8} sm={8} md={8} lg={8} >
               <Switch color="primary" checked={newCity} onChange={() => toggleNewCity(!newCity) } />	
				</Grid>
				<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
				<Grid style={{paddingTop: "20px" }}  item xs={4} sm={4} md={4} lg={4} >
					<Typography className={gClasses.patientInfo2Blue} >State</Typography>
				</Grid>
            <Grid align="left" item xs={8} sm={8} md={8} lg={8} >
            <VsSelect size="small" align="left"  style={{paddingRight: "10px" }}
               inputProps={{className: gClasses.dateTimeNormal}} options={myProps.stateList} field="state"
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
						inputProps={{className: gClasses.dateTimeNormal}} options={myProps.countryList} field="country"
						value={country} onChange={(event) => setCountry(event.target.value)}
					/>
               }               
               {(newCountry) &&
					<TextValidator style={{margin: "5px"}}  fullWidth className={gClasses.vgSpacing}
						value={country} onChange={(event) => { setCountry(event.target.value) }}			
					/>
               }               
				</Grid>
				<Grid item xs={4} sm={4} md={4} lg={4} >
					<Typography style={{marginTop: "5px" }} className={gClasses.patientInfo2Blue} >New Country</Typography>
				</Grid>
				<Grid align="left" item xs={8} sm={8} md={8} lg={8} >
               <Switch color="primary" checked={newCountry} onChange={() => toggleNewCountry(!newCountry) } />	
				</Grid>
				<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
			</Grid>
			}
		</Accordion>
		<br />
		<Accordion expanded={expandedPanel === "phoneandhometown"} onChange={handleAccordionChange("phoneandhometown")}>
			<Box align="right" className={(expandedPanel === "phoneandhometown") ? gClasses.selectedAccordian : gClasses.normalAccordian} borderColor="black" borderRadius={7} border={1} >
			<AccordionSummary aria-controls="panel1a-content" id="panel1a-header" expandIcon={<ExpandMoreIcon />}>
				<Typography align="left" >{"Res. Phone and Home town"}</Typography>
			</AccordionSummary>
			</Box>
			<Grid key="EDITMEMBERPHONE" className={gClasses.noPadding} container  alignItems="flex-start" >
			<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
			<Grid item xs={4} sm={4} md={4} lg={4} >
				<Typography className={gClasses.patientInfo2Blue} >Home Town</Typography>
			</Grid>
			<Grid align="left" item xs={8} sm={8} md={8} lg={8} >
				<TextValidator fullWidth className={gClasses.vgSpacing}
					value={emurVillage} onChange={(event) => { setEmurVillage(event.target.value) }}			
				/>
			</Grid>
			<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
			<Grid item xs={4} sm={4} md={4} lg={4} >
				<Typography className={gClasses.patientInfo2Blue} >Phone 1</Typography>
			</Grid>
			<Grid align="left" item xs={8} sm={8} md={8} lg={8} >
				<TextValidator  fullWidth className={gClasses.vgSpacing} type="number"
					value={emurResPhone1} onChange={(event) => { setEmurResPhone1(event.target.value) }}			
				/>
			</Grid>
			<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
			<Grid item xs={4} sm={4} md={4} lg={4} >
				<Typography className={gClasses.patientInfo2Blue} >Phone 2</Typography>
			</Grid>
			<Grid align="left" item xs={8} sm={8} md={8} lg={8} >
				<TextValidator  fullWidth className={gClasses.vgSpacing} type="number"
					value={emurResPhone2} onChange={(event) => { setEmurResPhone2(event.target.value) }}			
				/>
			</Grid>
			<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
			</Grid>
		</Accordion>
		<DisplayRegisterStatus />
		<br />
		<VsButton align="center" name={"Apply"} type="submit" />
	</ValidatorForm>
	<ToastContainer />
	</Box>
	</Container>
	</div>
	)
}
