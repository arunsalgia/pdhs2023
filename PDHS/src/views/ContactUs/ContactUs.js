import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
// import { Switch, Route, Link } from 'react-router-dom';
//import { ValidatorForm, TextValidator, TextValidatorcvariant} from 'react-material-ui-form-validator';
import { ValidatorForm, TextValidator, TextValidatorcvariant, TextareaAutosize} from 'react-material-ui-form-validator';
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
import lodashCloneDeep from "lodash/cloneDeep";

import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import EditIcon from '@material-ui/icons/Edit';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import CancelIcon from '@material-ui/icons/Cancel';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

//import { NoGroup, JumpButton, DisplayPageHeader, MessageToUser } from 'CustomComponents/CustomComponents.js';
import { isMobile, getWindowDimensions, displayType, decrypt, dbdecrypt, encrypt,
	showError, showSuccess, showInfo,
   getMemberName,
	dateString, dateStringMMM, disableFutureDt,
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
	setTab,
} from "CustomComponents/CricDreamTabs.js"


//import {
//	memberGetByMidOne,
//} from 'views/clientdbfunctions';
	

function MyInput(myProps) {
	const gClasses = globalStyles();
return (
  <div>
		<TextValidator required style={{paddingLeft: "10px", paddingRight: "10px" }} className={gClasses.vgSpacing} inputProps={{className: gClasses.dateTimeNormal}}
			label={myProps.label} type="text" value={myProps.value} onChange={myProps.onChange} />	
  </div>
)};

export default function ContactUs() {
	//console.log("In add edit");
	//const classes = useStyles();
	const gClasses = globalStyles();
	const myProps = JSON.parse(sessionStorage.getItem("family_personal_props"));
	//console.log(myProps);
	
	const [header, setHeader] = useState("");
	const [registerStatus, setRegisterStatus] = useState(0);
	
	const [name, setName] = useState("");
   const [mobile, setMobile] = useState("");
	const [email, setEmail] = useState("");
	const [remarks, setRemarks] = useState("");

	useEffect(() => {
      // find out if user is a member or not
      if (sessionStorage.getItem("isMember") == "true") {
         //console.log("is a member");
         var myRec = JSON.parse(sessionStorage.getItem("loginMemberRec"));
         //console.log(myRec);
         setName(getMemberName(myRec, false));
         setMobile(myRec.mobile);
         setEmail(decrypt(myRec.email));
      }
      else {
         setName(sessionStorage.getItem("userName"));
         setMobile(sessionStorage.getItem("prwsLogin"));
         //console.log("is NOTTTTT a member");
         
      }
	}, [])
   
function handleCancel() {
	setTab(process.env.REACT_APP_DASH);
}

async function handleContactUsSubmit() {
  var myData={
     name: name,
     mobile: mobile,
     email: encrypt((email != "") ? email : "-"),
     remarks: remarks
  }
  console.log(myData);
  myData = encodeURIComponent(JSON.stringify(myData));
  try { 
		let response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/user/suggestion/${myData}`); 
      showInfo("Successfully submitted suggestion");
      setTab(process.env.REACT_APP_DASH);
  } catch (err) {
		showError("Error updating suggestion");
	}
}

//console.log("Mobile", isMobile());

return (
	<div className={gClasses.webPage} >
   <br />
   <br />
	<Container component="main" maxWidth="xs">	
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} style={{paddingLeft: "5px", paddingRight: "5px"}} >
	<VsCancel align="right" onClick={handleCancel} />
	<Typography align="center" className={gClasses.title}>Contact Us</Typography>
	<br />
	<ValidatorForm align="left" className={gClasses.form} onSubmit={handleContactUsSubmit}>
   <Grid key="PERDETAILS" className={gClasses.noPadding} container  alignItems="flex-start" >		
      <Grid item xs={4} sm={4} md={4} lg={4} >
         <Typography style={{paddingTop: "10px" }} className={gClasses.patientInfo2Blue} >Name</Typography>
      </Grid>
      <Grid item xs={8} sm={8} md={8} lg={8} >
         <TextValidator fullWidth required className={gClasses.vgSpacing} variant="outlined" label="Name" 
            inputProps={{className: gClasses.dateTimeNormal}} type="text" value={name}
            onChange={(event) => { setName(event.target.value) }}			
         />	
      </Grid>
      <Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
      <Grid item xs={4} sm={4} md={4} lg={4} >
         <Typography style={{paddingTop: "10px" }} className={gClasses.patientInfo2Blue} >Mobile</Typography>
      </Grid>
      <Grid item xs={8} sm={8} md={8} lg={8} >
       <TextValidator fullWidth  variant="outlined" required className={gClasses.vgSpacing}
         label="Mobile" type="text"
         value={mobile} 
         onChange={(event) => { setMobile(event.target.value) }}
       />
      </Grid>
      <Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
      <Grid item xs={4} sm={4} md={4} lg={4} >
         <Typography style={{paddingTop: "10px" }} className={gClasses.patientInfo2Blue} >Email</Typography>
      </Grid>
      <Grid item xs={8} sm={8} md={8} lg={8} >
         <TextValidator fullWidth className={gClasses.vgSpacing} variant="outlined" label="Email" 
            inputProps={{className: gClasses.dateTimeNormal}} type="email" value={email}
            onChange={(event) => { setEmail(event.target.value) }}			
         />	
      </Grid>
      <Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
      <Grid item xs={4} sm={4} md={4} lg={4} >
         <Typography style={{paddingTop: "10px" }} className={gClasses.patientInfo2Blue} >Suggestion</Typography>
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12} >
		<textarea
         fullwidth="true"
			rows = {5}    // Specifies the number of visible text lines
			cols = {(!isMobile()) ? 48 : 38}    // Specifies the width of the text area in characters
			value = {remarks}   // Specifies the initial value of the text area
			placeholder = "Add suggestion"   // Specifies a short hint that describes the expected value of the textarea
			//wrap = "soft"   // Specifies how the text in the text area should be wrapped
			//readOnly = {(myProps.applicationRec.status !== "Pending")}   // Specifies that the text area is read-only, meaning the user cannot modify its content
			name = "Suggestion"   // Specifies the name of the text area, which can be used when submitting a form
			//disabled = {true}   //  Specifies that the text area is disabled, meaning the user cannot interact with it
			//minLength = {150}   // Specifies the minimum number of characters required in the textarea
			maxLength = {200}   // Specifies the maximum number of characters allowed in the textarea
			onChange = {() => setRemarks(event.target.value) }
		/>
      </Grid>
   </Grid>
   <br />
   <br />
   <VsButton align="center" name={"Submit"} type="submit" />		
	</ValidatorForm>
	<ToastContainer />
	</Box>
	</Container>
	</div>
	)
}
