import React, { useState, useContext, useEffect } from 'react';
import {  CssBaseline } from '@material-ui/core';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';


import lodashCloneDeep from 'lodash/cloneDeep';
import lodashSortBy from "lodash/sortBy";
import lodashMap from "lodash/map";

import VsButton from "CustomComponents/VsButton";
import VsCancel from "CustomComponents/VsCancel";
import VsRadio from "CustomComponents/VsRadio";
import VsRadioGroup from "CustomComponents/VsRadioGroup";
import VsCheckBox from "CustomComponents/VsCheckBox";
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
import Box from '@material-ui/core/Box';
import 'react-step-progress/dist/index.css';
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";

// styles
import globalStyles from "assets/globalStyles";
//import modalStyles from "assets/modalStyles";



//const BlankMemberData = {firstName: "", middleName: "", lastName: ""};

import {
	BlankArea,
	DisplayMemberHeader,
} from "CustomComponents/CustomComponents.js"

import {
//SupportedMimeTypes, SupportedExtensions,
//str1by4, str1by2, str3by4,
//HOURSTR, MINUTESTR, 
MEMBERTITLE, RELATION, SELFRELATION, GENDER, BLOODGROUP, MARITALSTATUS,
DATESTR, MONTHNUMBERSTR,
CASTE, HUMADSUBCASTRE,
} from "views/globals.js";


import { 
	getImageName,
	vsDialog,
	getMemberName,
	dispAge,
} from "views/functions.js";

import { 
	decrypt, dispMobile, dispEmail, disableFutureDt,
} from 'views/functions';
import {  } from 'views/functions';

//import { update } from 'lodash';
//import { updateCbItem } from 'typescript';

//var loginHid, loginMid;
//var adminData = {superAdmin: false, humadAdmin: false, pjymAdmin: false, prwsAdmin: false} ;

var isMember = false;

export default function Member(props) {
	const loginHid = Number(sessionStorage.getItem("hid"));
	const loginMid = Number(sessionStorage.getItem("mid"));
	
	
	const gClasses = globalStyles();
	const alert = useAlert();

	const [currentSelection, setCurrentSelection] = useState("");
	const [memberArray, setMemberArray] = useState([])
	//const [currentMember, setCurrentMember] = useState("");
	const [currentMemberData, setCurrentMemberData] = useState(null);
	const [currentHod, setCurrentHod] = useState({});
	const [gotraArray, setGotraArray] = useState([]);
	const [gotraFilterArray, setGotraFilterArray] = useState([]);
	//const [ceasedArray, setCeasedArray] = useState([]);
	const [hodNamesArray, setHodNamesArray] = useState([])
	const [groomArray, setGroomArray] = useState([])
	const [brideArray, setBrideArray] = useState([])
	const [domArray, setDomArray] = useState([])
	const [domMomemtArray, setDomMomemtArray] = useState([])
	const [unLinkedLadies, setUnLinkedLadies] = useState([]);
	const [radioRecord, setRadioRecord] = useState(0);
	const [emurDate1, setEmurDate1] = useState(moment());


  useEffect(() => {	
		const getDetails = async () => {	
      var memberHid = Number(sessionStorage.getItem("memberHid"));
      var memberMid = Number(sessionStorage.getItem("memberMid"));
			//console.log(memberHid, memberMid);
			isMember = (loginHid === props.hid);
			await getHod(memberHid);
			await getHodMembers(memberHid, memberMid);
			setSelection("Personal");
		}
		getDetails();
		
  }, []);


	async function getHod(hid) {
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/hod/get/${hid}`
			let resp = await axios.get(myUrl);
			setCurrentHod(resp.data);
			sessionStorage.setItem("hod", JSON.stringify(resp.data));
		} catch (e) {
			console.log(e);
			alert.error(`Error fetching HOD details of ${hid}`);
			setCurrentHod({});
		}	
	}

	async function getHodMembers(hid, mid) {
		//console.log("Hi");
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/member/hod/${hid}`
			let resp = await axios.get(myUrl);
			let tmp = resp.data.find(x => x.mid === mid);
			//console.log(mid);
			//console.log(tmp);
			setCurrentMemberData(tmp);
			//console.log(tmp);
			setMemberArray(resp.data);
		} catch (e) {
			console.log(e);
			alert.error(`Error fetching Member details of HOD ${hid}`);
			setMemberArray([]);
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

	return (
	<div className={gClasses.webPage} align="center" key="main">
	<CssBaseline />
	{(currentSelection === "") &&
		<DisplayMemberHeader member={currentMemberData} />
	}
	{(currentSelection !== "") &&
		<div>
		{/*<DisplayMemberHeader member={currentMemberData} />*/}
		{/*<Divider className={gClasses.divider} />*/}
		<DisplayFunctionHeader />
		{(currentSelection === "General") &&
			<MemberGeneral hod={currentHod} isMember={isMember} />
		}
		{(currentSelection === "Personal") &&
			<MemberPersonal list={memberArray} isMember={isMember} />
		}
		{(currentSelection === "Office") &&
			<MemberOffice list={memberArray} isMember={isMember} />
		}
		{(currentSelection === "Spouse") &&
			<MemberSpouse list={memberArray} isMember={isMember} />
		}
		</div>
	}
  </div>
  );    
}
