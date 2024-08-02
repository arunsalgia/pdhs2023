import React, { useState, useContext, useEffect } from 'react';
import {  CssBaseline } from '@material-ui/core';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Divider from '@material-ui/core/Divider';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//import Avatar from '@material-ui/core/Avatar';
import ArrowLeftRoundedIcon from '@material-ui/icons/ArrowLeftRounded';
import ArrowRightRoundedIcon from '@material-ui/icons/ArrowRightRounded';

//import lodashCloneDeep from 'lodash/cloneDeep';
import lodashSortBy from "lodash/sortBy";
//import lodashMap from "lodash/map";


import MemberGeneral from "views/Member/MemberGeneral"
import MemberPersonal from "views/Member/MemberPersonal"
import MemberOffice from "views/Member/MemberOffice"
import MemberSpouse from "views/Member/MemberSpouse"

import axios from "axios";
import Drawer from '@material-ui/core/Drawer';
import { useAlert } from 'react-alert'

import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';

import VsButton from "CustomComponents/VsButton";

// styles
import globalStyles from "assets/globalStyles";




//const BlankMemberData = {firstName: "", middleName: "", lastName: ""};

import {
	BlankArea,
	DisplayMemberHeader,
	DisplayPageHeader,
} from "CustomComponents/CustomComponents.js"



import { 
	showSuccess, showError,
} from "views/functions.js";

import {
	readAllMembers, memberGetByHidMany,
} from "views/clientdbfunctions";

import {
	VALUEDIRECTION,
} from "views/globals.js";


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
	


  useEffect(() => {	
		//console.log("In Member");
		
		if (sessionStorage.getItem("isMember") === "true") {
			getDetails((props.hid !== 0) ? props.hid : loginHid, (props.hid !== 0) ? props.mid : loginMid);
		}
		
  }, []);

	async function getHod(hid, direction=VALUEDIRECTION.current) {
		var subcmd = '';
		switch (direction) {
			case VALUEDIRECTION.previous :
				subcmd = 'getprevious';
				break;
			case VALUEDIRECTION.next :
				subcmd = 'getnext';
				break;
			default:
				subcmd = 'get';
				break
		}
		
		var retVal = null;
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/hod/${subcmd}/${hid}`
			let resp = await axios.get(myUrl);
			retVal = resp.data
		} catch (e) {
			console.log(e);
			showError(`Error fetching HOD details of ${hid}`);
			//setCurrentHod({});
		}	
		return retVal;
	}

	async function getHodMembers(hid, mid) {
		var myData = [];
		try {
			if (process.env.REACT_APP_PRWS_DB === "true") {
				myData = memberGetByHidMany(hid);		
			}
			else {
				let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/member/hod/${hid}`;
				let resp = await axios.get(myUrl);
				myData = resp.data;
				myData = lodashSortBy(myData, 'order');
			}
		} catch (e) {
			console.log(e);
			showError(`Error fetching Member details of HOD ${hid}`);
			//setMemberArray([]);
		}
		return myData;
	}

	async function getDetails(memberHid, memberMid, direction = VALUEDIRECTION.exact) {
		//var memberHid = (props.hid !== 0) ? props.hid : loginHid;
		//var memberMid = (props.hid !== 0) ? props.mid : loginMid;			
		isMember = (sessionStorage.getItem("isMember") === "true");
		var hidData = await getHod(memberHid, direction);
		if (hidData) {
			setCurrentHod(hidData);
			setCurrentCity(hidData.city);
			sessionStorage.removeItem("member_hod");
			sessionStorage.setItem("member_hod", JSON.stringify(hidData));
			// get correct HID
			memberHid = hidData.hid;

			// now get members
			var myData = await getHodMembers(memberHid, memberMid);
			if (myData.length > 0) {
				setMemberArray(myData);
				//console.log(tmpList);
				sessionStorage.removeItem("member_members");
				sessionStorage.setItem("member_members", JSON.stringify(myData));
				let tmp = (memberMid > 0) ? myData.find(x => x.mid === memberMid) : myData[0];
				setCurrentMemberData((tmp) ? tmp : null);
				setSelection("");
				setSelection("Personal");
				//console.log("setting personal");
			}
			else {
				
			}
		}
		else {
			
		}
	}
	

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
	
	async function getNewFamily(direction) {
		getDetails(currentHod.hid, 0, direction);
	}
	
	
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
			<Grid  item xs={6} sm={3} md={2} lg={2} >	
				<VsButton align="center" name="Prev. Family"  onClick={() => getNewFamily(VALUEDIRECTION.previous) } />
			</Grid>
			<DisplayFunctionItem item="General" />
			<DisplayFunctionItem item="Personal" />
			<DisplayFunctionItem item="Office" />
			<DisplayFunctionItem item="Spouse" />
			<Grid  item xs={6} sm={3} md={2} lg={2} >	
				<VsButton align="center" name="Next. Family"  onClick={() => getNewFamily(VALUEDIRECTION.next) } />
			</Grid>
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
	<DisplayPageHeader headerName={"Family details of " + currentHod.hid} />
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
