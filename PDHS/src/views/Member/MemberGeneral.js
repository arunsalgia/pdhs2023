import React, { useState, useContext, useEffect } from 'react';
import {  CssBaseline } from '@material-ui/core';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
//import Avatar from '@material-ui/core/Avatar';
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
import { useAlert } from 'react-alert';


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
	getAdminInfo,
	getImageName,
	vsDialog,
	getMemberName,
	dispAge,
	applicationSuccess,
} from "views/functions.js";

import { 
	decrypt, dispMobile, dispEmail, disableFutureDt,
} from 'views/functions';
import {  } from 'views/functions';



export default function MemberGeneral (props) {
	const loginHid = parseInt(sessionStorage.getItem("hid"), 10);
	const loginMid = parseInt(sessionStorage.getItem("mid"), 10);
	const isMember = props.isMember;
	//console.log(loginHid, isMember);
	
	const adminInfo = getAdminInfo();
	const gClasses = globalStyles();
	const alert = useAlert();

	const [currentHod, setCurrentHod] = useState(props.hod);
	const [existingGotra, setExistingGotra] = useState(true);
	
	const [memberArray, setMemberArray] = useState([])
	//const [currentMember, setCurrentMember] = useState("");
	const [currentMemberData, setCurrentMemberData] = useState({});
	const [gotraArray, setGotraArray] = useState([]);
	const [gotraFilterArray, setGotraFilterArray] = useState([]);
		
	const [radioRecord, setRadioRecord] = useState(0);
	const [emurDate1, setEmurDate1] = useState(moment());
	const [currentSelection, setCurrentSelection] = useState("");

	


	
	const [cbList, setCbList] = useState([]);
	const [isDrawerOpened, setIsDrawerOpened] = useState("");
	
	
	const [emurGotra, setEmurGotra] = useState("");
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
		const getDetails = async () => {		
		}
		getGotraList();
  }, []);

	async function getGotraList() {
		//console.log("Hi");
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/gotra/list`
			let resp = await axios.get(myUrl);
			setGotraArray(resp.data);
			//setCurrentMember()
		} catch (e) {
			console.log(e);
			alert.error(`Error fetching Gotra List`);
			setGotraArray([]);
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


	function editgeneralDetials() {
		
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

		setEmurPincCode(currentHod.pinCode);

		setEmurResPhone1(currentHod.resPhone1);
		setEmurResPhone2(currentHod.resPhone2);

		setIsDrawerOpened("EDITGENERAL");
	}

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

	async function handleEditGeneral() {
		if (isDrawerOpened === "EDITGENERAL") return handleVerifyPincode();

		// pin has been verified. Now it is confirm
		setRegisterStatus(0);
		//console.log(emurGotra);
		let tmp = encodeURIComponent(JSON.stringify({
			gotra: emurGotra,
			village: currentHod.village,
			addr1: emurAddr1,
			addr2: emurAddr2,
			addr3: emurAddr3,
			addr4: emurAddr4,
			addr5: emurAddr5,
			suburb: emurAddr6,
			city: emurAddr7,
			pinCode: emurPinCode,
			resPhone1: emurResPhone1,
			resPhone2: emurResPhone2
		}));
		let err = 1002;
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/hod/updatedetails/${props.member.hid}/${tmp}`;
			//console.log(myUrl)
			let resp = await axios.get(myUrl);
			setCurrentHod(resp.data);
			setIsDrawerOpened("");
			alert.success("Successfully updated HOD details");
			err = 0;
		} catch (e) {
			console.log(e);
			if (e.response) 
			if (e.response.status === 602)
				err = 1001;
			//alert.error(`Error updating HOD details of ${props.member.hid}`);
		}	
		setRegisterStatus(err);
	}

	async function handleApplyGotra() {
		//console.log("Apply");
		let tmp = encodeURIComponent(JSON.stringify({
			owner: 'PRWS',
			desc: APPLICATIONTYPES.editGotra,
			name: sessionStorage.getItem("userName"),
			hid: currentHod.hid,
			mid: 0,
			isMember: isMember,
			data: {gotra: emurAddr1, caste: emurAddr2, subCaste: emurAddr3}
		}));
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/application/add/${tmp}`;
			let resp = await axios.get(myUrl);
			applicationSuccess(resp.data);
		} catch (e) {
			console.log(e);
			alert.error(`Error applying for Gotra/Caste change`);
		}
		setIsDrawerOpened("");
	}
	
	
	async function handleEditGotra() {
		

	}

	function handleEditApplyGotra() {
		console.log("Common");
		if (isDrawerOpened === "APPLYGOTRA") 
			handleApplyGotra();
		else
			handleEditGotra();
	}

	function editGotraDetails(action) {
		//console.log("Action is "+action)
		setEmurAddr1(currentHod.gotra);
		setEmurAddr2(currentHod.caste);
		setEmurAddr3(currentHod.subCaste);
		setIsDrawerOpened(action);
		//console.log("2Action is "+action)
	}

	function DisplayGeneralInformation() {
		let family = (currentHod.hid === loginHid);
		let admin = (adminInfo & (ADMIN.superAdmin | ADMIN.prwsAdmin) !== 0);
	return (
	<Box style={{marginLeft: "5px", marginRight: "5px", paddingLeft: "5px" }} className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		{(family || admin) &&
			<div align = "right">
			<VsButton name="Application for Gotra, Caste" onClick={() => editGotraDetails("APPLYGOTRA")} />
			<VsButton name="Edit General Details" onClick={editgeneralDetials} />
			</div>
		}
		<DisplaySingleLine msg1="Gotra" msg2={currentHod.gotra} />
		<BlankArea />
		<DisplaySingleLine msg1="Caste" msg2={currentHod.caste} />
		{(currentHod.caste === "Humad") &&
			<div>
			<BlankArea />
			<DisplaySingleLine msg1="SubCaste" msg2={currentHod.subCaste} />
			</div>
		}
		<BlankArea />
		<DisplaySingleLine msg1="Village" msg2={currentHod.village} />
		<BlankArea />
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
		<BlankArea />
		<DisplaySingleLine msg1="Suburb" msg2={currentHod.suburb} />
		<BlankArea />
		<DisplaySingleLine msg1="City" msg2={currentHod.city} />
		<BlankArea />
		<DisplaySingleLine msg1="Pin Code" msg2={currentHod.pinCode} />
		<BlankArea />
		<DisplaySingleLine msg1="Division" msg2={currentHod.division} />
		<BlankArea />
		<DisplaySingleLine msg1="District" msg2={currentHod.district} />
		<BlankArea />
		<DisplaySingleLine msg1="State" msg2={currentHod.state} />
		<BlankArea />
		<DisplaySingleLine msg1="Res. Phone" msg2={currentHod.resPhone1 + (currentHod.resPhone2 !== "") ? " / " + currentHod.resPhone2 : "" } />
	</Box>	
	)}

	function handleDate1(d) {
		setEmurDate1(d);
	}

	return (
	<div className={gClasses.webPage} align="center" key="main">
	<DisplayGeneralInformation />
	<Drawer style={{width: "100%"}} className={gClasses.drawerStyle}  anchor="top" variant="temporary" open={isDrawerOpened != ""} >
	{((isDrawerOpened === "EDITGOTRA") || (isDrawerOpened === "APPLYGOTRA")) &&
		<Container component="main" maxWidth="xs">	
		<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} style={{paddingLeft: "5px", paddingRight: "5px"}} >
		<VsCancel align="right" onClick={() => { setIsDrawerOpened("")}} />
		<ValidatorForm align="left" className={gClasses.form} onSubmit={handleEditApplyGotra}>
			<Typography align="center" className={gClasses.title}>{((isDrawerOpened === "EDITGOTRA") ? "Edit" : "Application to change") + " Gotra, Caste, Sub Caste"}</Typography>
			<br />
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
        <VsSelect size="small" align="left"  style={{paddingLeft: "10px", paddingRight: "10px" }}
					inputProps={{className: gClasses.dateTimeNormal}} options={gotraArray} field={"name"}
					value={emurAddr1} onChange={(event) => setEmurAddr1(event.target.value)}
				/>
			}
			{(!existingGotra) &&
				<TextValidator required className={gClasses.vgSpacing}
					label="Gotra" type="text"
					value={emurAddr1}
					onChange={(event) => { setEmurAddr1(event.target.value) }}			
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
			<VsButton align="center" name={(isDrawerOpened === "EDITGOTRA") ? "Update" : "Apply"} type="submit" />
		</ValidatorForm>
		</Box>
		</Container>
	}	
	{((isDrawerOpened === "EDITGENERAL") || (isDrawerOpened === "CONFIRMGENERAL")) &&
		<Container component="main" maxWidth="xs">	
		<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} style={{paddingLeft: "5px", paddingRight: "5px"}} >
		<VsCancel align="right" onClick={() => { setIsDrawerOpened("")}} />
		<ValidatorForm align="left" className={gClasses.form} onSubmit={handleEditGeneral}>
		<Typography align="center" className={gClasses.patientInfo2Blue}>{"Edit family details "}</Typography>
		<BlankArea />
			<Grid key="ADEDITMEMBERGENERAL" className={gClasses.noPadding} container  alignItems="flex-start" >
			<Grid item xs={4} sm={4} md={4} lg={4} >
				<Typography className={gClasses.patientInfo2Blue} >Address</Typography>
			</Grid>
			<Grid align="left" item xs={8} sm={8} md={8} lg={8} >
				<TextValidator fullWidth required className={gClasses.vgSpacing}
					value={emurAddr1}
					disabled={(isDrawerOpened === "CONFIRMGENERAL")}
					onChange={(event) => { setEmurAddr1(event.target.value) }}			
				/>
				<TextValidator fullWidth required className={gClasses.vgSpacing}
					value={emurAddr2}
					disabled={(isDrawerOpened === "CONFIRMGENERAL")}
					onChange={(event) => { setEmurAddr2(event.target.value) }}			
				/>
				<TextValidator fullWidth className={gClasses.vgSpacing}
					value={emurAddr3}
					disabled={(isDrawerOpened === "CONFIRMGENERAL")}
					onChange={(event) => { setEmurAddr3(event.target.value) }}			
				/>
				<TextValidator  fullWidth className={gClasses.vgSpacing}
					value={emurAddr4}
					disabled={(isDrawerOpened === "CONFIRMGENERAL")}
					onChange={(event) => { setEmurAddr4(event.target.value) }}			
				/>
				<TextValidator  fullWidth className={gClasses.vgSpacing}
					value={emurAddr5}
					disabled={(isDrawerOpened === "CONFIRMGENERAL")}
					onChange={(event) => { setEmurAddr5(event.target.value) }}			
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
				<Typography className={gClasses.patientInfo2Blue} >City</Typography>
			</Grid>
			<Grid align="left" item xs={8} sm={8} md={8} lg={8} >
				<TextValidator  fullWidth className={gClasses.vgSpacing}
					value={emurAddr7}
					disabled={(isDrawerOpened === "CONFIRMGENERAL")}
					onChange={(event) => { setEmurAddr7(event.target.value) }}			
				/>
			</Grid>
			<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
			<Grid item xs={4} sm={4} md={4} lg={4} >
				<Typography className={gClasses.patientInfo2Blue} >Pin Code</Typography>
			</Grid>
			<Grid align="left" item xs={8} sm={8} md={8} lg={8} >
				<TextValidator  required fullWidth className={gClasses.vgSpacing} type="number"
					value={emurPinCode}
					disabled={(isDrawerOpened === "CONFIRMGENERAL")}
					onChange={(event) => { setEmurPincCode(event.target.value) }}	
					validators={['minNumber:350000', 'maxNumber:449999']}
					errorMessages={['Invalid Pin code', 'Invalid Pin code']}			
				/>
			</Grid>
			<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
			
			<Grid item xs={4} sm={4} md={4} lg={4} >
				<Typography className={gClasses.patientInfo2Blue} >Phone 1</Typography>
			</Grid>
			<Grid align="left" item xs={8} sm={8} md={8} lg={8} >
				<TextValidator  fullWidth className={gClasses.vgSpacing} type="number"
					value={emurResPhone1}
					disabled={(isDrawerOpened === "CONFIRMGENERAL")}
					onChange={(event) => { setEmurResPhone1(event.target.value) }}			
				/>
			</Grid>
			<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />

			<Grid item xs={4} sm={4} md={4} lg={4} >
				<Typography className={gClasses.patientInfo2Blue} >Phone 2</Typography>
			</Grid>
			<Grid align="left" item xs={8} sm={8} md={8} lg={8} >
				<TextValidator  fullWidth className={gClasses.vgSpacing} type="number"
					value={emurResPhone2}
					disabled={(isDrawerOpened === "CONFIRMGENERAL")}
					onChange={(event) => { setEmurResPhone2(event.target.value) }}			
				/>
			</Grid>
			<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />

			<Grid item xs={4} sm={4} md={4} lg={4} >
				<Typography className={gClasses.patientInfo2Blue} >Home Town</Typography>
			</Grid>
			<Grid align="left" item xs={8} sm={8} md={8} lg={8} >
				<TextValidator required fullWidth className={gClasses.vgSpacing}
					value={emurVillage}
					disabled={(isDrawerOpened === "CONFIRMGENERAL")}
					onChange={(event) => { setEmurVillage(event.target.value) }}			
				/>
			</Grid>
			<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
			</Grid>
			<DisplayRegisterStatus />
			<BlankArea />
			{(isDrawerOpened === "EDITGENERAL") &&
				<VsButton align="center" name="Validate PinCode" type="submit" />
			}
		{(isDrawerOpened === "CONFIRMGENERAL") &&
			<div>
			<br />
			<Typography className={gClasses.patientInfo2Blue} >
			{"As per Pincode "+ emurPinCode + ", Division/District/State details are "+emurPinResp.division+"/"+emurPinResp.district+"/"+emurPinResp.state}
			</Typography>
			<Typography className={gClasses.patientInfo2Blue} >			
			Click Confirm if Pincode is correct.
			</Typography>
			<div align="center">
			<VsButton name="Confirm" type="submit" />
			<VsButton name="Cancel" onClick={() => setIsDrawerOpened("EDITGENERAL")} />
			</div>
			</div>
		}
		</ValidatorForm>
		</Box>
		</Container>
	}	
	</Drawer>
  </div>
  );    

}
