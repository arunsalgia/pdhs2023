import React,{useState, useEffect } from 'react';
import { CssBaseline } from '@material-ui/core';
import axios from 'axios';
import Container from '@material-ui/core/Container';


import VsButton from "CustomComponents/VsButton"; 
import VsCancel from "CustomComponents/VsCancel";
import VsCheckBox from "CustomComponents/VsCheckBox";
import VsSelect from "CustomComponents/VsSelect";
import VsRadioGroup from "CustomComponents/VsRadioGroup";
import ReactTooltip from "react-tooltip";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


//import TextField from '@material-ui/core/TextField';
import Grid from "@material-ui/core/Grid";
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Drawer from '@material-ui/core/Drawer';
import { useAlert } from 'react-alert'

//import VsRadioGroup from "CustomComponents/VsRadioGroup";

import lodashSortBy from 'lodash/sortBy';
import lodashReverse from 'lodash/reverse';
// icons
import CancelIcon from '@material-ui/icons/Cancel';
import EditIcon from '@material-ui/icons/Edit';
import InfoIcon   from 	'@material-ui/icons/Info';

// styles
import globalStyles from "assets/globalStyles";


import ApplicationEditGotra from "views/Application/ApplicationEditGotra";
import ApplicationMemberCeased from "views/Application/ApplicationMemberCeased";
import ApplicationAddEditMember from "views/Application/ApplicationAddEditMember";
import ApplicationNewHod from "views/Application/ApplicationNewHod";
import ApplicationTransferMember from "views/Application/ApplicationTransferMember";


import {
	ADMIN, APPLICATIONSTATUS, APPLICATIONTYPES, SELECTSTYLE, STATUS_INFO,
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
	hasAnyAdminPermission,
	showError, showSuccess,
} from "views/functions.js";

import { getMemberName, dateString } from 'views/functions';

//var loginHid, loginMid;

const DEFAULTOWNER="PRWS";
const applOption = ["Application Approved", "Application Rejected"];
const RadioList = ["All", "Pending", "Approved","Rejected"];
 

export default function Application(props) {
	const loginHid = parseInt(sessionStorage.getItem("hid"), 10);
	const loginMid = parseInt(sessionStorage.getItem("mid"), 10);
	var adminRec = sessionStorage.getItem("adminRec");
	var userType = 'user';

	const gClasses = globalStyles();	
	const [applicationMasterArray, setApplicationMasterArray] = useState([]);	
  const [applicationArray, setApplicationArray] = useState([]);	
	const [hodName, setHodName] = useState("");
	
	const [applicationRec, setApplicationRec] = useState(null);
	
	const [currentSelection, setCurrentSelection] = useState(DEFAULTOWNER);
	const [onlyPending, setOnlyPending] = useState(false);
	
	const [editApplRec, setEditApplRec] = useState(null);
	const [approve, setApprove] = useState("Application Rejected");
	
	const [radOpts, setRadOpts] = useState("All");
	
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
			let myUrl = (hasAnyAdminPermission())
				? `${process.env.REACT_APP_AXIOS_BASEPATH}/apply/list`
				: `${process.env.REACT_APP_AXIOS_BASEPATH}/apply/list/${loginMid}`;
			//console.log(hasAnyAdminPermission(), myUrl);
			let resp = await axios.get(myUrl);
			//console.log(resp.data);
			setApplicationMasterArray(resp.data);
			//setApplicationArray(resp.data);	
			setSelection(resp.data, "PRWS", "All");
		} catch (e) {
			console.log(e);
		}	
	}

	
	function DisplayFunctionItem(props) {
		let itemName = props.item;
		return (
		<Grid key={"BUT"+itemName} item xs={6} sm={3} md={2} lg={2} >	
		<Typography onClick={() => setSelection(applicationMasterArray, itemName, radOpts)}>
			<span 
				className={(itemName === currentSelection) ? gClasses.functionSelected : gClasses.functionUnselected}>
			{itemName}
			</span>
		</Typography>
		</Grid>
		)}
	
	function filterArray(myArray, item, radOpts) {
		let tmpArray = myArray.filter(x => x.owner === item);
		if (radOpts !== "All")
			tmpArray = tmpArray.filter(x => x.status === radOpts);
		//if (onlyPending)
		//	tmpArray = tmpArray.filter(x => x.status === APPLICATIONSTATUS.pending);
		
		return tmpArray;
	}
	
	
	async function setSelection(myArray, item, radOpts) {
		let tmpArray = filterArray(myArray, item, radOpts);
		//console.log(tmpArray);
		setApplicationArray(tmpArray);
		setCurrentSelection(item);
	}
	
	
	function DisplayFunctionHeader() {
	return (
	<Grid className={gClasses.noPadding} key="AllOptions" container align="center">
		{/*<DisplayFunctionItem item="All" />*/}
		<DisplayFunctionItem item="PRWS" />
		<DisplayFunctionItem item="PJYM" />
		<DisplayFunctionItem item="HUMAD" />
	</Grid>	
	)}
	
	function DisplayAllApplication() {
	return (
	<div>
		<Box  key={"MEMBOXHDR"} className={gClasses.boxStyleOdd} borderColor="black" borderRadius={30} border={1} >
		<Grid key={"MEMGRIDHDR"} className={gClasses.noPadding} container justifyContent="center" alignItems="center" >
		<Grid align="center" item xs={4} sm={4} md={2} lg={2} >
			<Typography className={gClasses.patientInfo2Brown} >Date</Typography>
		</Grid>
		<Grid align="center" item xs={4} sm={4} md={2} lg={2} >
			<Typography className={gClasses.patientInfo2Brown} >Reference Id</Typography>
		</Grid>
		<Grid align="center" item xs={4} sm={4} md={2} lg={2} >
			<Typography className={gClasses.patientInfo2Brown} >Description</Typography>
		</Grid>
		<Grid align="center" item xs={12} sm={12} md={3} lg={3} >
			<Typography className={gClasses.patientInfo2Brown} >Applicant</Typography>
		</Grid>
		<Grid align="center" item xs={6} sm={6} md={2} lg={2} >
			<Typography className={gClasses.patientInfo2Brown} >Status</Typography>
		</Grid>
		<Grid align="center" item xs={6} sm={6} md={1} lg={1} >
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
			<Box  key={"MEMBOX"+index} 
				className={((index % 2) == 0) ? gClasses.boxStyleEven : gClasses.boxStyleOdd} 
				borderColor="black" borderRadius={30} border={1} 
			>
			<Grid key={"MEMGRID"+props.index} className={gClasses.noPadding} container justifyContent="center" alignItems="center" >
			<Grid align="center"  item xs={4} sm={4} md={2} lg={2} >
				<Typography className={gClasses.patientInfo2}>
					<span>{dateString(a.date)}</span>
				</Typography>
			</Grid>
			<Grid align="center" item xs={4} sm={4} md={2} lg={2} >
				<Typography className={gClasses.patientInfo2}>{a.id}</Typography>
			</Grid>
			<Grid align="center" item xs={4} sm={4} md={2} lg={2} >
				<Typography className={gClasses.patientInfo2}>{a.desc}</Typography>
			</Grid>
			<Grid align="center" item xs={12} sm={12} md={3} lg={3} >
				<Typography className={gClasses.patientInfo2}>{a.name}</Typography>
			</Grid>
			<Grid align="center" item xs={6} sm={6} md={2} lg={2} >
				<Typography className={gClasses.patientInfo2}>{a.status}</Typography>
			</Grid>
			<Grid align="center" item xs={6} sm={6} md={1} lg={1} >
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
		//console.log(appRec);
		try {
			let myUrl =  `${process.env.REACT_APP_AXIOS_BASEPATH}/apply/delete/${appRec.id}`;
			let resp = await axios.get(myUrl);
			showSuccess(`Successfully deleted application with id ${appRec.id}`);
			setApplicationArray(applicationArray.filter(x => x.id !== appRec.id));
			setApplicationMasterArray(applicationMasterArray.filter(x => x.id !== appRec.id));
		} catch (e) {
			console.log(e);
			showError(`Error deleting application with id ${appRec.id}`);
		}	
	}
	
	
	// edit application by admin
	async function oldeditApplication(appRec) {
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
			setMemberNames(data);
		}
		console.log(appRec);
		setIsDrawerOpened(appRec.desc);
		console.log(new Date());
	}
	
	// edit application by admin
	async function editApplication(appRec) {
		setApplicationRec(appRec);
		setIsDrawerOpened(appRec.desc);
		console.log(new Date(), appRec.id, appRec.desc);
	}
	
	function handleApplictionEditBack(sts) {
		//console.log(sts);
		if ((sts.msg !== "") && (sts.status === STATUS_INFO.ERROR)) showError(sts.msg); 
		else if ((sts.msg !== "") && (sts.status === STATUS_INFO.SUCCESS)) showSuccess(sts.msg); 
		
		if (sts.status == STATUS_INFO.SUCCESS) {
			console.log(sts.applicationRec);
			var tmp = [sts.applicationRec].concat(applicationArray.filter(x => x.id !== applicationRec.id));
			setApplicationArray(lodashReverse(lodashSortBy(tmp, 'id')));
		}
		else {
			console.log("Yaha kaise aaya");
		}
		setIsDrawerOpened("");
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
	
	function submitChangeOpt(opt) {
		setSelection(applicationMasterArray, currentSelection, opt)
		setRadOpts(opt);
	}
	
	//console.log(isDrawerOpened)
	//console.log(isDrawerOpened,  APPLICATIONTYPES.editMember, APPLICATIONTYPES.addMember);
  
	return (
	<div className={gClasses.webPage} align="center" key="main">
	<CssBaseline />
	<DisplayPageHeader headerName={"Application Status" } groupName="" tournament=""/>
	<DisplayFunctionHeader />
	<VsRadioGroup radioList={RadioList} value={radOpts} onChange={() => submitChangeOpt(event.target.value) } />
	<DisplayAllApplication />
	<DisplayAllToolTips />
	<Drawer style={{ width: "100%"}} anchor="top" variant="temporary" open={isDrawerOpened != ""} >
	<Container component="main" maxWidth="xs">	
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} style={{paddingLeft: "5px", paddingRight: "5px"}} >
	<VsCancel align="right" onClick={() => { setIsDrawerOpened("")}} />
	{(isDrawerOpened === APPLICATIONTYPES.editGotra) &&
		<ApplicationEditGotra applicationRec={applicationRec}  onReturn={handleApplictionEditBack}/>
	}
	{(isDrawerOpened === APPLICATIONTYPES.memberCeased) &&
		<ApplicationMemberCeased applicationRec={applicationRec}  onReturn={handleApplictionEditBack}/>
	}
	{( (isDrawerOpened === APPLICATIONTYPES.editMember) || (isDrawerOpened === APPLICATIONTYPES.addMember) ) &&
		<ApplicationAddEditMember applicationRec={applicationRec}  onReturn={handleApplictionEditBack}/>
	}	
	{(isDrawerOpened === APPLICATIONTYPES.newHod) &&
		<ApplicationNewHod applicationRec={applicationRec}  onReturn={handleApplictionEditBack}/>
	}	
	{(isDrawerOpened === APPLICATIONTYPES.transferMember) &&
		<ApplicationTransferMember applicationRec={applicationRec}  onReturn={handleApplictionEditBack}/>
	}		</Box>
	</Container>
	</Drawer>
	<ToastContainer />
	</div>
	);
}
 