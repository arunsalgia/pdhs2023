import React, { useState, useContext, useEffect } from 'react';
import {  CssBaseline } from '@material-ui/core';
import { TextField, InputAdornment } from "@material-ui/core";
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
//import Avatar from '@material-ui/core/Avatar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Autocomplete from '@material-ui/lab/Autocomplete';

import lodashCloneDeep from 'lodash/cloneDeep';
import lodashSortBy from "lodash/sortBy";
import lodashMap from "lodash/map";

import VsButton from "CustomComponents/VsButton";
import VsCancel from "CustomComponents/VsCancel";
import VsRadio from "CustomComponents/VsRadio";
import VsRadioGroup from "CustomComponents/VsRadioGroup";
import VsCheckBox from "CustomComponents/VsCheckBox";
import VsSelect from "CustomComponents/VsSelect";

import axios from "axios";
import Drawer from '@material-ui/core/Drawer';

import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import 'react-step-progress/dist/index.css';
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";
//import { useAlert } from 'react-alert';


// styles
import globalStyles from "assets/globalStyles";




//const BlankMemberData = {firstName: "", middleName: "", lastName: ""};

import {
	BlankArea,
	DisplayMemberHeader,
} from "CustomComponents/CustomComponents.js"

import { 
	ADMIN, SELECTSTYLE,
	MEMBERTITLE, RELATION, SELFRELATION, GENDER, BLOODGROUP, MARITALSTATUS,
	DATESTR, MONTHNUMBERSTR,
	CASTE, HUMADSUBCASTRE,
	APPLICATIONTYPES,
} from "views/globals.js";


import { 
	hasPRWSpermission,
	getImageName,
	vsDialog, vsInfo,
	getMemberName,
	dispAge,
	applicationSuccess,
	showError, showSuccess,
} from "views/functions.js";

import { 
	decrypt, dispMobile, dispEmail, disableFutureDt,
} from 'views/functions';
import {  } from 'views/functions';


export default function MemberGeneral (props) {
	const loginHid = parseInt(sessionStorage.getItem("hid"), 10);
	const loginMid = parseInt(sessionStorage.getItem("mid"), 10);
	const isMember = props.isMember;
	const isAdmin = hasPRWSpermission();

	const gClasses = globalStyles();

	const [currentHod, setCurrentHod] = useState(JSON.parse(sessionStorage.getItem("member_hod")));
	//const [memberArray, setMemberArray] = useState(JSON.parse(sessionStorage.getItem("member_members")));
	//const [hodName, setHodName] = useState("");
	
	const [existingGotra, setExistingGotra] = useState(true);
	const [header, setHeader] = useState("");
	const [isFamily, setIsFamily] = useState(false);
	
	
	//const [currentMember, setCurrentMember] = useState("");
	const [currentMemberData, setCurrentMemberData] = useState({});
	const [gotraArray, setGotraArray] = useState([]);
	const [cityArray, setCityArray] = useState([]);
	const [gotraFilterArray, setGotraFilterArray] = useState([]);
		
	const [radioRecord, setRadioRecord] = useState(0);
	const [emurDate1, setEmurDate1] = useState(moment());
	const [currentSelection, setCurrentSelection] = useState("");

	


	
	const [cbList, setCbList] = useState([]);
	const [isDrawerOpened, setIsDrawerOpened] = useState("");
	
	
	const [emurGotra, setEmurGotra] = useState("");

	const [currentGotraRec, setCurrentGotraRec] = useState(null);
	const [currentGotra, setCurrentGotra] = useState("");

	const [emurVillage, setEmurVillage] = useState("");
	const [emurPinCode, setEmurPincCode] = useState("");
	const [emurResPhone1, setEmurResPhone1] = useState("");
	const [emurResPhone2, setEmurResPhone2] = useState("");
	const [emurPinResp, setEmurPinResp] = useState({});

	const [emurAddr1, setEmurAddr1] = useState("");
	const [emurAddr2, setEmurAddr2] = useState("");
	const [emurAddr3, setEmurAddr3] = useState("");
	const [emurAddr4, setEmurAddr4] = useState("");
	const [emurAddr5, setEmurAddr5] = useState("");
	const [emurAddr6, setEmurAddr6] = useState("");
	const [emurAddr7, setEmurAddr7] = useState("");
	const [emurAddr8, setEmurAddr8] = useState("");
	const [emurAddr9, setEmurAddr9] = useState("");
	const [emurAddr10, setEmurAddr10] = useState("");
	const [emurAddr11, setEmurAddr11] = useState("");
	const [emurAddr12, setEmurAddr12] = useState("");
	const [emurAddr13, setEmurAddr13] = useState("");



	const [registerStatus, setRegisterStatus] = useState(0);

	

	
  useEffect(() => {	
		
		//var memRec = memberArray.find(x => x.mid === currentHod.mid);
		//setHodName(getMemberName(memrec, false));
		
		
		setIsFamily(currentHod.hid === loginHid);
		getGotraList();
		getCityList(); 

  }, []);

	async function getGotraList() {
		//console.log("Hi");
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/gotra/list`
			let resp = await axios.get(myUrl);
			console.log(resp.data);
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
			//setCurrentMember()
		} catch (e) {
			console.log(e);
			showError(`Error fetching city List`);
			setCityArray([]);
		}	
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



	function DisplaySingleLine(props) {
	return(
		<Grid className={gClasses.noPadding} key={props.msg1+props.msg2} container align="center">
		<Grid align="left"  item xs={4} sm={4} md={2} lg={2} >
			<Typography className={gClasses.patientInfo2Blue}>{props.msg1}</Typography>
		</Grid>	
		<Grid align="left"  item xs={8} sm={8} md={10} lg={10} >
			<Typography className={gClasses.patientInfo2}>{props.msg2}</Typography>
		</Grid>	
		</Grid>

	)} 


	async function handleVerifyPincode() {
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/hod/pincode/${emurPinCode}`;
			let resp = await axios.get(myUrl);
			//console.log(resp.data);
			setEmurPinResp(resp.data);
			console.log(resp.data);
			//setIsDrawerOpened("");
			setRegisterStatus(0);
			setIsDrawerOpened("CONFIRMGENERAL")
		} catch (e) {
			console.log(e);
			setRegisterStatus(1001);
		}		
	}



	// Apply / Edit for General details

	function editGeneralDetials() {
		
		setHeader("Edit Details");
		setEmurGotra(currentHod.gotra);
		setGotraFilterArray([{name: currentHod.gotra}])

		setEmurVillage(currentHod.village);

		setEmurAddr1(currentHod.resAddr1);
		setEmurAddr2(currentHod.resAddr2);
		setEmurAddr3(currentHod.resAddr3);
		setEmurAddr4(currentHod.resAddr4);
		setEmurAddr5(currentHod.resAddr5);
		setEmurAddr6(currentHod.suburb);
		setEmurAddr7(currentHod.city);

		setEmurAddr10(currentHod.district);
		setEmurAddr11(currentHod.state);
		
		setEmurPincCode(currentHod.pinCode);

		setEmurResPhone1(currentHod.resPhone1);
		setEmurResPhone2(currentHod.resPhone2);

		setIsDrawerOpened("GENERAL");
	}

	async function handleEditGeneralSubmit() {
		//if (isDrawerOpened === "EDITGENERAL") return handleVerifyPincode();
		setRegisterStatus(0);
		let tmp = encodeURIComponent(JSON.stringify({
			hid:   currentHod.hid,
			addr1: emurAddr1,
			addr2: emurAddr2,
			addr3: emurAddr3,
			addr4: emurAddr4,
			addr5: emurAddr5,
			suburb: emurAddr6,
			city: emurAddr7,
			district: emurAddr10,
			state: emurAddr11,
			pinCode: emurPinCode,
			village: emurVillage,
			resPhone1: emurResPhone1,
			resPhone2: emurResPhone2
		}));
		let err = 1002;
		try {
			let myUrl = (isAdmin) 
				? `${process.env.REACT_APP_AXIOS_BASEPATH}/hod/updatedetails/${tmp}`
				: `${process.env.REACT_APP_AXIOS_BASEPATH}/apply/editfamilydetails/${loginMid}/${tmp}`
			//console.log(myUrl)
			let resp = await axios.get(myUrl);
			setCurrentHod(resp.data);
			setIsDrawerOpened("");
			showSuccess("Successfully updated HOD details");
			err = 0;
		} catch (e) {
			console.log(e);
			if (e.response) 
			if (e.response.status === 602)
				err = 1001;
			//showError(`Error updating HOD details of ${props.member.hid}`);
		}	
		setRegisterStatus(err);
	}
	
	
	// Apply / Edit for Gotra caste change
	function editGotraDetails() {
		setHeader("Apply to change Gotra & Caste");
		setCurrentGotra(currentHod.gotra);
		var tmp = gotraArray.find(x => x.gotra === currentHod.gotra);
		setCurrentGotraRec(tmp);
		setExistingGotra(tmp !== null);
		
		setEmurAddr2(currentHod.caste);
		setEmurAddr3(currentHod.subCaste);
		setIsDrawerOpened("GOTRA");
	}

	async function handleEditGotraSubmit() {
		let tmp = encodeURIComponent(JSON.stringify({
			hid: currentHod.hid,
			gotra: emurAddr1, 
			caste: emurAddr2, 
			subCaste: emurAddr3
		}));

		try {
			let myUrl = (isAdmin) 
				? `${process.env.REACT_APP_AXIOS_BASEPATH}/hod/updategotra/${tmp}`
				: `${process.env.REACT_APP_AXIOS_BASEPATH}/apply/updategotra/${currentHod.mid}/${loginMid}/${tmp}`;

			let resp = await axios.get(myUrl);
			if (isAdmin) 
				showSuccess("Successfully updated Gotra, Caste");
			else
				vsInfo("Application Success", `Successfully applied for Gotra, Caste change. Application reference ${resp.data.id}.`,
					{label: "Okay" }
				);
		} catch (e) {
			console.log(e);
			showError(`Error applying for Gotra/Caste change`);
		}
		setIsDrawerOpened("");
	}
	
	
	function DisplayGeneralInformation() {
	return (
	<Box style={{marginLeft: "5px", marginRight: "5px", paddingLeft: "5px" }} className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<br />
		<DisplaySingleLine msg1="Gotra" msg2={currentHod.gotra} />
		<DisplaySingleLine msg1="Caste" msg2={currentHod.caste} />
		{(currentHod.caste === "Humad") &&
			<div>
			<DisplaySingleLine msg1="SubCaste" msg2={currentHod.subCaste} />
			</div>
		}
		<DisplaySingleLine msg1="Village" msg2={currentHod.village} />
		<DisplaySingleLine msg1="Res. Addr." msg2={currentHod.resAddr1} />
		{(currentHod.resAddr2 !== "") &&
		<DisplaySingleLine msg1="" msg2={currentHod.resAddr2} />
		}
		{(currentHod.resAddr3 !== "") &&
		<DisplaySingleLine msg1="" msg2={currentHod.resAddr3} />
		}
		{(currentHod.resAddr4 !== "") &&
		<DisplaySingleLine msg1="" msg2={currentHod.resAddr4} />
		}
		{(currentHod.resAddr5 !== "") &&
		<DisplaySingleLine msg1="" msg2={currentHod.resAddr5} />
		}
		<DisplaySingleLine msg1="Suburb" msg2={currentHod.suburb} />
		<DisplaySingleLine msg1="City" msg2={currentHod.city} />
		<DisplaySingleLine msg1="Pin Code" msg2={currentHod.pinCode} />
		<DisplaySingleLine msg1="Division" msg2={currentHod.division} />
		<DisplaySingleLine msg1="District" msg2={currentHod.district} />
		<DisplaySingleLine msg1="State" msg2={currentHod.state} />
		<DisplaySingleLine msg1="Res. Phone" msg2={currentHod.resPhone1 + (currentHod.resPhone2 !== "") ? " / " + currentHod.resPhone2 : "" } />
		<br />
	</Box>	
	)}

	function DisplayButtons() {
	return (
	<div align = "right">
		<VsButton disabled={!isFamily && !isAdmin} name="Edit Gotra and Caste" onClick={editGotraDetails} />
		<VsButton disabled={!isFamily && !isAdmin} name="Edit General Details" onClick={editGeneralDetials} />
	</div>
	)}
	
	function handleDate1(d) {
		setEmurDate1(d);
	}

	return (
	<div className={gClasses.webPage} align="center" key="main">
	<DisplayButtons />
	<DisplayGeneralInformation />
	<Drawer style={{width: "100%"}} className={gClasses.drawerStyle}  anchor="top" variant="temporary" open={isDrawerOpened != ""} >
	<Container component="main" maxWidth="xs">	
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} style={{paddingLeft: "5px", paddingRight: "5px"}} >
	<VsCancel align="right" onClick={() => { setIsDrawerOpened("")}} />
	<Typography align="center" className={gClasses.patientInfo2Blue}>{header}</Typography>
	<br />
	{(isDrawerOpened === "GOTRA") &&
		<ValidatorForm align="left" className={gClasses.form} onSubmit={handleEditGotraSubmit}>
			<Grid key="ADEDITMEMBERPERSONAL" className={gClasses.noPadding} container  alignItems="flex-start" >
			<Grid item xs={12} sm={12} md={12} lg={12} >
				<VsCheckBox align="left" label="Existing Gotra" checked={existingGotra} onClick={() => setExistingGotra(!existingGotra) }  />
			</Grid>
			<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
			<Grid item xs={4} sm={4} md={4} lg={4} >
				<Typography style={{paddingTop: "20px" }} className={gClasses.patientInfo2Blue} >Gotra</Typography>
			</Grid>
			<Grid align="left" item xs={8} sm={8} md={8} lg={8} >
			{(existingGotra) &&
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
			}
			{(!existingGotra) &&
				<TextValidator required className={gClasses.vgSpacing}
					label="Gotra" type="text"
					value={currentGotra}
					onChange={(event) => { setCurrentGotra(event.target.value) }}			
				/>	
			}
			</Grid>
			<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
			<Grid item xs={4} sm={4} md={4} lg={4} >
				<Typography style={{paddingTop: "10px" }} className={gClasses.patientInfo2Blue} >Caste</Typography>
			</Grid>
			<Grid item xs={8} sm={8} md={8} lg={8} >
				<VsRadioGroup
					value={emurAddr2} onChange={(event) => setEmurAddr2(event.target.value)}
					radioList={CASTE}
				/>
			</Grid>
			<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
			<Grid item xs={4} sm={4} md={4} lg={4} >
				{(emurAddr2 === "Humad") &&
				<Typography style={{paddingTop: "10px" }} className={gClasses.patientInfo2Blue} >Sub Caste</Typography>
				}
			</Grid>
			<Grid item xs={8} sm={8} md={8} lg={8} >
				{(emurAddr2 === "Humad") &&
				<VsRadioGroup 
					value={emurAddr3} onChange={(event) => setEmurAddr3(event.target.value)}
					radioList={HUMADSUBCASTRE}
				/>
				}
			</Grid>
			<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
			</Grid>			
			<DisplayRegisterStatus />
			<BlankArea />
			<VsButton align="center" name={(isAdmin) ? "Update" : "Apply"} type="submit" />
		</ValidatorForm>
	}	
	{(isDrawerOpened === "GENERAL") &&
		<ValidatorForm align="left" className={gClasses.form} onSubmit={handleEditGeneralSubmit}>
			<div>
			<Grid key="ADEDITMEMBERGENERAL" className={gClasses.noPadding} container  alignItems="flex-start" >
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
			<Grid item xs={4} sm={4} md={4} lg={4} >
				<Typography className={gClasses.patientInfo2Blue} >Home Town</Typography>
			</Grid>
			<Grid align="left" item xs={8} sm={8} md={8} lg={8} >
				<TextValidator required fullWidth className={gClasses.vgSpacing}
					value={emurVillage} onChange={(event) => { setEmurVillage(event.target.value) }}			
				/>
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
			<Grid item xs={4} sm={4} md={4} lg={4} >
				<Typography className={gClasses.patientInfo2Blue} >Suburb</Typography>
			</Grid>
			<Grid align="left" item xs={8} sm={8} md={8} lg={8} >
				<TextValidator  fullWidth className={gClasses.vgSpacing}
					value={emurAddr6}
					disabled={(isDrawerOpened === "CONFIRMGENERAL")}
					onChange={(event) => { setEmurAddr6(event.target.value) }}			
				/>
			</Grid>
			<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
			<Grid item xs={4} sm={4} md={4} lg={4} >
				<Typography style={{paddingTop: "20px" }} className={gClasses.patientInfo2Blue} >City</Typography>
			</Grid>
			<Grid align="left" item xs={8} sm={8} md={8} lg={8} >
        <VsSelect size="small" align="left"  style={{paddingLeft: "10px", paddingRight: "10px" }}
					inputProps={{className: gClasses.dateTimeNormal}} options={cityArray} field="city"
					value={emurAddr7} onChange={(event) => setEmurAddr7(event.target.value)}
				/>				
			</Grid>
			<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
			<Grid item xs={4} sm={4} md={4} lg={4} >
				<Typography className={gClasses.patientInfo2Blue} >District</Typography>
			</Grid>
			<Grid align="left" item xs={8} sm={8} md={8} lg={8} >
				<TextValidator fullWidth className={gClasses.vgSpacing}
					value={emurAddr10} onChange={(event) => { setEmurAddr10(event.target.value) }}			
				/>
			</Grid>
			<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
			<Grid item xs={4} sm={4} md={4} lg={4} >
				<Typography className={gClasses.patientInfo2Blue} >State</Typography>
			</Grid>
			<Grid align="left" item xs={8} sm={8} md={8} lg={8} >
				<TextValidator fullWidth className={gClasses.vgSpacing}
					value={emurAddr11} onChange={(event) => { setEmurAddr11(event.target.value) }}			
				/>
			</Grid>
			<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
			<Grid item xs={4} sm={4} md={4} lg={4} >
				<Typography className={gClasses.patientInfo2Blue} >Pin Code</Typography>
			</Grid>
			<Grid align="left" item xs={8} sm={8} md={8} lg={8} >
				<TextValidator  required fullWidth className={gClasses.vgSpacing} type="number"
					value={emurPinCode} onChange={(event) => { setEmurPincCode(event.target.value) }}	
					validators={['minNumber:350000', 'maxNumber:449999']}
					errorMessages={['Invalid Pin code', 'Invalid Pin code']}			
				/>
			</Grid>
			<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />	
			</Grid>
			<br />
			<VsButton align="center" name="Update" type="submit" />
			</div>
		</ValidatorForm>
	}	
	</Box>
	</Container>
	<ToastContainer />
	</Drawer>
  </div>
  );    

}
