import React, { useState, useContext, useEffect } from 'react';
import {  CssBaseline } from '@material-ui/core';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Divider from '@material-ui/core/Divider';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//import Avatar from '@material-ui/core/Avatar';


//import lodashCloneDeep from 'lodash/cloneDeep';
import lodashSortBy from "lodash/sortBy";
//import lodashMap from "lodash/map";

//import VsButton from "CustomComponents/VsButton";
//import VsCancel from "CustomComponents/VsCancel";
//import VsRadio from "CustomComponents/VsRadio";
//import VsRadioGroup from "CustomComponents/VsRadioGroup";
//import VsCheckBox from "CustomComponents/VsCheckBox";
//import VsSelect from "CustomComponents/VsSelect";
//import VsTextFilter from "CustomComponents/VsTextFilter";
//import VsList from "CustomComponents/VsList";

import MemberGeneral from "views/Member/MemberGeneral"
import MemberPersonal from "views/Member/MemberPersonal"
import MemberOffice from "views/Member/MemberOffice"
import MemberSpouse from "views/Member/MemberSpouse"

import axios from "axios";
import Drawer from '@material-ui/core/Drawer';
import { useAlert } from 'react-alert'

import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';
//import Box from '@material-ui/core/Box';
//import 'react-step-progress/dist/index.css';
//import Datetime from "react-datetime";
//import "react-datetime/css/react-datetime.css";
//import moment from "moment";

// styles
import globalStyles from "assets/globalStyles";
//import modalStyles from "assets/modalStyles";



//const BlankMemberData = {firstName: "", middleName: "", lastName: ""};

import {
	BlankArea,
	DisplayMemberHeader,
} from "CustomComponents/CustomComponents.js"

/*import {
//SupportedMimeTypes, SupportedExtensions,
//str1by4, str1by2, str3by4,
//HOURSTR, MINUTESTR, 
MEMBERTITLE, RELATION, SELFRELATION, GENDER, BLOODGROUP, MARITALSTATUS,
DATESTR, MONTHNUMBERSTR,
CASTE, HUMADSUBCASTRE,
} from "views/globals.js";
*/

import { 
	showSuccess, showError,
} from "views/functions.js";

/*
import { 
	decrypt, dispMobile, dispEmail, disableFutureDt,
} from 'views/functions';
import {  } from 'views/functions';
*/

//import { update } from 'lodash';
//import { updateCbItem } from 'typescript';

//var loginHid, loginMid;
//var adminData = {superAdmin: false, humadAdmin: false, pjymAdmin: false, prwsAdmin: false} ;

var isMember = false;

export default function Member(props) {
	const loginHid = Number(sessionStorage.getItem("hid"));
	const loginMid = Number(sessionStorage.getItem("mid"));
	
	
	const gClasses = globalStyles();
	//const alert = useAlert();

	const [currentSelection, setCurrentSelection] = useState("");
	const [memberArray, setMemberArray] = useState([])
	//const [currentMember, setCurrentMember] = useState("");
	const [currentMemberData, setCurrentMemberData] = useState(null);
	const [currentHod, setCurrentHod] = useState({});
	const [currentCity, setCurrentCity] = useState("");
	
	/*const [gotraArray, setGotraArray] = useState([]);
	const [gotraFilterArray, setGotraFilterArray] = useState([]);
	//const [ceasedArray, setCeasedArray] = useState([]);
	const [hodNamesArray, setHodNamesArray] = useState([])
	const [groomArray, setGroomArray] = useState([])
	const [brideArray, setBrideArray] = useState([])
	const [domArray, setDomArray] = useState([])
	const [domMomemtArray, setDomMomemtArray] = useState([])
	const [unLinkedLadies, setUnLinkedLadies] = useState([]);
	const [radioRecord, setRadioRecord] = useState(0);
	const [emurDate1, setEmurDate1] = useState(moment());*/


  useEffect(() => {	
		//console.log("In Member");
		
		async function getHod(hid) {
			try {
				let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/hod/get/${hid}`
				let resp = await axios.get(myUrl);
				setCurrentHod(resp.data);
				setCurrentCity(resp.data.city);
				sessionStorage.setItem("member_hod", JSON.stringify(resp.data));
			} catch (e) {
				console.log(e);
				showError(`Error fetching HOD details of ${hid}`);
				setCurrentHod({});
			}	
		}

		async function getHodMembers(hid, mid) {
			try {
				let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/member/hod/${hid}`;
				let resp = await axios.get(myUrl);
				var tmpList = lodashSortBy(resp.data, 'order');
				setMemberArray(tmpList);
				//console.log(tmpList);
				sessionStorage.setItem("member_members", "");
				sessionStorage.setItem("member_members", JSON.stringify(tmpList));
				let tmp = (mid > 0) ? tmpList.find(x => x.mid === mid) : tmpList[0];
				setCurrentMemberData((tmp) ? tmp : null);
			} catch (e) {
				console.log(e);
				showError(`Error fetching Member details of HOD ${hid}`);
				setMemberArray([]);
			}	
		}

		const getDetails = async () => {
			var memberHid = (props.hid !== 0) ? props.hid : loginHid;
			var memberMid = (props.hid !== 0) ? props.mid : loginMid;			
			isMember = (sessionStorage.getItem("isMember") === "true");
			await getHod(memberHid);
			await getHodMembers(memberHid, memberMid);
			setSelection("Personal");
			//console.log("setting personal");
		}
		
		if (sessionStorage.getItem("isMember") === "true") {
			getDetails();
		}
		
  }, []);



	function DisplayFunctionItem(props) {
		let itemName = props.item;
		return (
		<Grid key={"BUT"+itemName} item xs={6} sm={3} md={2} lg={2} >	
		<Typography onClick={() => setSelection(itemName)}>
			<span 
				className={(itemName === currentSelection) ? gClasses.functionSelected : gClasses.functionUnselected}>
			{itemName}
			</span>
		</Typography>
		</Grid>
	)}
	
	async function setSelection(item) {
		//setRadioRecord(0);
		//sessionStorage.setItem("hod", JSON.stringify(currentHod));
		//sessionStorage.setItem("members", JSON.stringify(memberArray));
		setCurrentSelection(item);
	}


  /*<Box style={{marginLeft: "5px", marginRight: "5px", marginBottom: "5px" }} className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >*/
	
	function DisplayFunctionHeader() {
		return (
		<Grid className={gClasses.noPadding} key="AllPatients" container align="center">
			<DisplayFunctionItem item="General" />
			<DisplayFunctionItem item="Personal" />
			<DisplayFunctionItem item="Office" />
			<DisplayFunctionItem item="Spouse" />
		</Grid>	
	)}
	
	if (sessionStorage.getItem("isMember") === "false") 
	return (
	<div key="PRWS" className={gClasses.webPage} align="center" key="main">
		<br />
		<br />
		<Typography className={gClasses.message18Blue}>No permission to Guest to view Member information</Typography>
		<br />
		<br />
	</div>
	);
		
	
	if (memberArray.length === 0) return false;

	//console.log(currentSelection);
	
	return (
	<div className={gClasses.webPage} align="center" key="main">
	<DisplayFunctionHeader />
	{(currentSelection === "General") &&
		<MemberGeneral  isMember={isMember}  />
	}
	{(currentSelection === "Personal") &&
		<MemberPersonal isMember={isMember} city={currentCity} />
	}
	{(currentSelection === "Office") &&
		<MemberOffice  isMember={isMember} city={currentCity} />
	}
	{(currentSelection === "Spouse") &&
		<MemberSpouse isMember={isMember} />
	}
	<ToastContainer />
  </div>
  );    
}
