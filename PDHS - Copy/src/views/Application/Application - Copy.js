import React,{useState, useEffect } from 'react';
import { CssBaseline } from '@material-ui/core';
import axios from 'axios';
import VsButton from "CustomComponents/VsButton"; 
import VsCancel from "CustomComponents/VsCancel";
import VsCheckBox from "CustomComponents/VsCheckBox";
import VsSelect from "CustomComponents/VsSelect";
import VsRadioGroup from "CustomComponents/VsRadioGroup";
import ReactTooltip from "react-tooltip";

//import TextField from '@material-ui/core/TextField';
import Grid from "@material-ui/core/Grid";
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Drawer from '@material-ui/core/Drawer';
import { useAlert } from 'react-alert'

import lodashSortBy from 'lodash/sortBy';
import lodashReverse from 'lodash/reverse';
// icons
import CancelIcon from '@material-ui/icons/Cancel';
import EditIcon from '@material-ui/icons/Edit';
import InfoIcon   from 	'@material-ui/icons/Info';

// styles
import globalStyles from "assets/globalStyles";

import {
	ADMIN, APPLICATIONSTATUS, APPLICATIONTYPES, SELECTSTYLE,
	AppDataStyle,
	CASTE, HUMADSUBCASTRE,
} from "views/globals.js";


import {
	DisplayPageHeader, ValidComp, BlankArea,
	ApplHeader, ApplStatus, ApplCommand,
} from "CustomComponents/CustomComponents.js"


import { 
	isMobile,
	vsDialog,
	hasAnyAdminpermission,
} from "views/functions.js";

import { getMemberName, dateString } from 'views/functions';

//var loginHid, loginMid;

const DEFAULTOWNER="PRWS";
const applOption = ["Application Approved", "Application Rejected"];

export default function Application(props) {
	const loginHid = parseInt(sessionStorage.getItem("hid"), 10);
	const loginMid = parseInt(sessionStorage.getItem("mid"), 10);
	var adminRec = sessionStorage.getItem("adminRec");
	var userType = 'user';

	const gClasses = globalStyles();	
	const [applicationMasterArray, setApplicationMasterArray] = useState([]);	
  const [applicationArray, setApplicationArray] = useState([]);	
	const [hodName, setHodName] = useState("");
	
	const [currentSelection, setCurrentSelection] = useState(DEFAULTOWNER);
	const [onlyPending, setOnlyPending] = useState(false);
	
	const [editApplRec, setEditApplRec] = useState(null);
	const [approve, setApprove] = useState("Application Rejected");
	
	const [isDrawerOpened, setIsDrawerOpened] = useState("");
	const [emurRemarks, setEmurRemarks] = useState("");
	
	const [emurData1, setEmurData1] = useState("");
	const [emurData11, setEmurData11] = useState("");
	const [emurData2, setEmurData2] = useState("");
	const [emurData3, setEmurData3] = useState("");
	
	const [emurCB1, setEmurCB1] = useState(false);
	const [emurCB2, setEmurCB2] = useState(false);
	

	
  useEffect(() => {		
		getAllApplication();
  }, []);

	async function getHodName(hid) {
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/hod/hodname/${hid}`;
			let resp = await axios.get(myUrl);
			return getMemberName(resp.data);
		} catch (e) {
			console.log(e);
			return "";
		}	
	}
	async  function getAllApplication() {
		try {
			let myUrl = (hasAnyAdminpermission())
				? `${process.env.REACT_APP_AXIOS_BASEPATH}/application/list`
				: `${process.env.REACT_APP_AXIOS_BASEPATH}/application/list/${loginHid}`;
			let resp = await axios.get(myUrl);
			setApplicationMasterArray(resp.data);
			setApplicationArray(resp.data);	
		} catch (e) {
			console.log(e);
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
	
	function filterArray(myArray, item) {
		let tmpArray = (item === "All") ?
			myArray :
			myArray.filter(x => x.owner === item);

		if (onlyPending)
			tmpArray = tmpArray.filter(x => x.status === APPLICATIONSTATUS.pending);
		
		return tmpArray;
	}
	
	
	async function setSelection(item) {
		let tmpArray = filterArray(applicationMasterArray, item);
		//console.log(tmpArray);
		setApplicationArray(tmpArray);
		setCurrentSelection(item);
	}
	
	
	function DisplayFunctionHeader() {
	return (
	<Box  className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
	<Grid className={gClasses.noPadding} key="AllOptions" container align="center">
		{/*<DisplayFunctionItem item="All" />*/}
		<DisplayFunctionItem item="PRWS" />
		<DisplayFunctionItem item="PJYM" />
		<DisplayFunctionItem item="HUMAD" />
	</Grid>	
	</Box>
	)}
	
	function DisplayAllApplication() {
	return (
	<div>
		<Box  key={"MEMBOXHDR"} className={gClasses.boxStyle} borderColor="black" borderRadius={30} border={1} >
		<Grid key={"MEMGRIDHDR"} className={gClasses.noPadding} container align="center" alignItems="center" >
		<Grid align="left" item xs={3} sm={3} md={1} lg={1} >
			<Typography className={gClasses.patientInfo2Brown} >Date</Typography>
		</Grid>
		<Grid align="center" item xs={7} sm={7} md={6} lg={6} >
			<Typography className={gClasses.patientInfo2Brown} >Description</Typography>
		</Grid>
		{(!isMobile()) &&
		<Grid align="center" item xs={2} sm={2} md={1} lg={1} >
			<Typography className={gClasses.patientInfo2Brown} >Status</Typography>
		</Grid>		
		}
		<Grid align="center" item xs={2} sm={2} md={1} lg={1} >
		</Grid>
		</Grid>
		</Box>
		{applicationArray.map( (a, index) => {
			let myInfo = "HID: " + a.hid + "<br />";
			myInfo += "MID: " + a.mid + "<br />";
			myInfo += "AppId:" + a.id + "<br />";
			myInfo += "Name:" + a.name + "<br />";
			myInfo += "Status:" + a.status + "<br />";
			//myInfo += "Admin:" + a.adminName + "<br />";
			return (
			<Box  key={"DOC0Box"+index} className={gClasses.boxStyle} borderColor="black" borderRadius={30} border={1} >
			<Grid key={"DOC0GRD"+index} className={gClasses.noPadding} container align="center" alignItems="center" >
			<Grid align="left"  item xs={3} sm={3} md={1} lg={1} >
				<Typography className={gClasses.patientInfo2}>
					<span>{dateString(a.date)}</span>
						<span align="left"
							data-for={"APP"+a.id}
							data-tip={myInfo}
							data-iscapture="true"
						>
							<InfoIcon color="primary" size="small"/>
						</span>
				</Typography>
			</Grid>
			<Grid align="center" item xs={7} sm={7} md={6} lg={6} >
				<Typography>
					<span className={gClasses.patientInfo2}>{a.desc}</span>
				</Typography>
			</Grid>
			{(!isMobile()) &&
			<Grid align="center" item xs={2} sm={2} md={1} lg={1} >
				<Typography className={gClasses.patientInfo2}>{a.status}</Typography>
			</Grid>
			}
			<Grid align="center" item xs={2} sm={2} md={1} lg={1} >
				<EditIcon size="small" color="primary" onClick={() => editApplication(a)} />
				<CancelIcon size="small" color="secondary" onClick={() => deleteApplication(a)} />
			</Grid>
			</Grid>
			</Box>
		)})}
	</div>
	)}
	
	function DisplayAllToolTips() {
	return(
		<div>
		{applicationArray.map( t =>
			<ReactTooltip key={"APP"+t.id} type="info" effect="float" id={"APP"+t.id} multiline={true}/>
		)}
		</div>
	)}	
	
	function deleteApplication(appRec) {		
		vsDialog("Delete application", `Are you sure you want to delete application ${appRec.id}?`,
		{label: "Yes", onClick: () => deleteApplicationConfirm(appRec) },
		{label: "No" }
		);
	}
	
	async function deleteApplicationConfirm(appRec) {
		console.log(appRec);
	}
	
	
	// edit application by admin
	async function editApplication(appRec) {
		console.log(new Date());
		setEditApplRec(appRec);
		setApprove("Application Rejected");
		setEmurRemarks("");
		setHodName(await getHodName(appRec.hid));
		let data = JSON.parse(appRec.data);
		console.log(new Date());
		if (appRec.desc === APPLICATIONTYPES.editGotra) {
			let myList = await getGotraList();
			let tmp = myList.find(x => x.name === data.gotra)
			console.log(tmp);
			setEmurCB1(false);
			setEmurCB2(tmp != null);
			setEmurData1(data.gotra);
			setEmurData11(data.gotra);
			setEmurData2(data.caste);
			setEmurData3(data.subCaste);
		} 
		else if (appRec.desc === APPLICATIONTYPES.splitFamily) {
			//let myList = await getFamilyMembers(data[0].hid);
			//
			//let myNames = [];
			//for(var i=0; i<data.length; ++i) {
			//	let tmp = myList.find(x => x.mid === data[i].mid);
			//	let tmpName = `${i+1}) ${getMemberName(tmp)} ${(data[i].ishod) ? ' ( New HOD )' : ''}`;
			//	//console.log(tmpName);
			//	myNames.push(tmpName);
			//}
			setMemberNames(data);
		}
		console.log(appRec);
		setIsDrawerOpened(appRec.desc);
		console.log(new Date());
	}
	
	var previousDrawer;
	function rejectApplication() {
		previousDrawer = isDrawerOpened;
		setIsDrawerOpened("");
		
		vsDialog("Reject application", `Are you sure you want to reject application ${editApplRec.id}?`,
		{label: "Yes", onClick: rejectApplicationConfirm },
		{label: "No",  onClick: rejectApplicationCancel  }
		);
	}
	
	async function rejectApplicationCancel() {
		setIsDrawerOpened(previousDrawer)
	}
		
	async function rejectApplicationConfirm() {
		console.log("Status is ", "Reject");
		let tmp = encodeURIComponent(emurRemarks);
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/application/reject/${editApplRec.id}/${sessionStorage.getItem("userName")}/${tmp}`
			console.log(myUrl);
			
			let resp = await axios.get(myUrl);
			console.log("Success");
			let tmpArray = [resp.data].concat(applicationMasterArray.filter(x => x.id !== editApplRec.id));
			tmpArray = lodashReverse(lodashSortBy(tmpArray, 'id'));
			setApplicationMasterArray(tmpArray);
			tmpArray = filterArray(tmpArray, currentSelection);
			setApplicationArray(tmpArray);
			console.log("Success--over");
		} catch (e) {
			console.log(e);
			alert.error(`Error rejecting application`);
		}	
		setIsDrawerOpened("");
	}
	
	//-------------- start of EDIT Gotra
	const [gotraArray, setGotraArray] = useState([]);
		
	async function getGotraList() {
		//console.log("Hi");
		let myList = [];
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/gotra/list`
			let resp = await axios.get(myUrl);
			setGotraArray(resp.data);
			return resp.data;
			//setCurrentMember()
		} catch (e) {
			console.log(e);
			alert.error(`Error fetching Gotra List`);
			setGotraArray([]);
			return [];
		}	
	}
	
	async function handleEditApplyGotra() {
			if (approve === "Application Rejected") return rejectApplication();
			
			console.log("Apply gotra");
	}
	
	//------ start of SPLIT family
	
	const [memberNames, setMemberNames]  = useState([]);
	
	async function getFamilyMembers(hid) {
		//console.log("Hi");
		let myList = [];
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/member/hod/${hid}`
			let resp = await axios.get(myUrl);
			setGotraArray(resp.data);
			return resp.data;
			//setCurrentMember()
		} catch (e) {
			console.log(e);
			alert.error(`Error fetching member List`);
			return [];
		}	
	}
	
	// -- application rejected
	
	async function handleEditApplySplitFamily() {
		console.log("In split family");
		
		if (approve === "Application Rejected") return rejectApplication();
		setIsDrawerOpened("");
	}
	
	return (
	<div className={gClasses.webPage} align="center" key="main">
	<CssBaseline />
	<DisplayPageHeader headerName={"Application Status" } groupName="" tournament=""/>
	<DisplayAllToolTips />
	<br />
	<DisplayAllApplication />
	<DisplayFunctionHeader />
	<Drawer anchor="right" classes={{ paper: gClasses.drawerPaper }} variant="temporary" open={isDrawerOpened != ""} >
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
	<VsCancel align="right" onClick={() => { setIsDrawerOpened("")}} />
	{(isDrawerOpened !== "") &&
		<div>
		<ApplHeader appl={editApplRec} hodName={hodName} />
		<Box sx={AppDataStyle} >
		{(editApplRec.desc === APPLICATIONTYPES.editGotra) &&
		<ValidatorForm align="left" className={gClasses.form} onSubmit={handleEditApplyGotra} >
			<VsSelect inputProps={{className: gClasses.dateTimeNormal}} style={SELECTSTYLE} 
				disabled={userType === 'user'}
				label="Gotra" options={gotraArray} field="name" value={emurData1} onChange={(event) => { setEmurData1(event.target.value); }} />
			{(emurData1 === "Other") &&
				<TextValidator required fullWidth className={gClasses.vgSpacing}
					inputProps={{className: gClasses.dateTimeNormal}}
					label="Other Gotra" type="text"
					value={emurData11}
					disabled={userType === 'user'}
					onChange={(event) => { setEmurData11(event.target.value) }}			
				/>	
			}
			<VsSelect inputProps={{className: gClasses.dateTimeNormal}} style={SELECTSTYLE} 
				disabled={userType === 'user'}
				label="Caste" options={CASTE} value={emurData2} onChange={(event) => { setEmurData2(event.target.value); }} />

			{(emurData2 === "Humad") &&
				<VsSelect inputProps={{className: gClasses.dateTimeNormal}} style={SELECTSTYLE} 
					disabled={userType === 'user'}
					label="SubCaste" options={HUMADSUBCASTRE} value={emurData3} onChange={(event) => { setEmurData3(event.target.value); }} />	
			}
			<TextValidator required fullWidth className={gClasses.vgSpacing}
				disabled={userType === 'user'}
				label="Admin Remarks" type="text"
				value={emurRemarks}
				inputProps={{className: gClasses.dateTimeNormal}}
				onChange={(event) => { setEmurRemarks(event.target.value) }}			
			/>
			<VsSelect inputProps={{className: gClasses.dateTimeNormal}} style={SELECTSTYLE} 
				disabled={userType === 'user'}
				label="Status" options={applOption} value={approve} onChange={(event) => { setApprove(event.target.value); }} />		
			{(userType !== 'user') &&
			<VsButton align="center" name="Update" type="submit" />
			}
		</ValidatorForm>
		}
		{(editApplRec.desc === APPLICATIONTYPES.splitFamily) &&
			<ValidatorForm align="left" className={gClasses.form} onSubmit={handleEditApplySplitFamily}  >
			<Typography className={gClasses.patientInfo2Brown}>New Family List</Typography>
			<br />
			{memberNames.map( (m, index) => 
				<Typography className={gClasses.patientInfo2Blue}>{(index+1).toString() + ') ' + m.name+((m.hod)  ? ' ( New HOD )' : '')}</Typography>
			)}
			<TextValidator required fullWidth className={gClasses.vgSpacing}
				disabled={userType === 'user'}
				label="Admin Remarks" type="text"
				value={emurRemarks}
				onChange={(event) => { setEmurRemarks(event.target.value) }}			
			/>
			<VsSelect inputProps={{className: gClasses.dateTimeNormal}} style={SELECTSTYLE} 
				disabled={userType === 'user'}
				label="Status" options={applOption} value={approve} onChange={(event) => { setApprove(event.target.value); }} />			
			{(userType !== 'user') &&
			<VsButton align="center" name="Update" type="submit" />
			}
		</ValidatorForm>
		}
		</Box>
		</div>
	}
	</Box>
	</Drawer>
	</div>
	);
}
 