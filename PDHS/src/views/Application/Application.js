import React,{useState, useEffect } from 'react';
import { CssBaseline } from '@material-ui/core';
import axios from 'axios';
import Container from '@material-ui/core/Container';

import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';

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
import VisibilityIcon from '@material-ui/icons/Visibility';
// styles
import globalStyles from "assets/globalStyles";


import ApplicationEditGotra from "views/Application/ApplicationEditGotra";
import ApplicationMemberCeased from "views/Application/ApplicationMemberCeased";
import ApplicationAddEditMember from "views/Application/ApplicationAddEditMember";
import ApplicationNewHod from "views/Application/ApplicationNewHod";
import ApplicationTransferMember from "views/Application/ApplicationTransferMember";
import ApplicationChangeDom from "views/Application/ApplicationChangeDom";
import ApplicationMarriage from 'views/Application/ApplicationMarriage'
import ApplicationUnmarriage from 'views/Application/ApplicationUnmarriage'


import {
	ADMIN, APPLICATIONSTATUS, APPLICATIONTYPES, SELECTSTYLE, STATUS_INFO,
	AppDataStyle,
	CASTE, HUMADSUBCASTRE,
	OWNER,
} from "views/globals.js";


import {
	DisplayPageHeader, ValidComp, BlankArea,
	ApplHeader, ApplStatus, ApplCommand,
} from "CustomComponents/CustomComponents.js"

import {
	setTab,
} from "CustomComponents/CricDreamTabs.js"


import { 
	isMobile,
	vsDialog,
	hasAnyAdminPermission,
	showError, showSuccess,
} from "views/functions.js";

import { getMemberName, dateString } from 'views/functions';

//var loginHid, loginMid;

const DEFAULTOWNER = OWNER.prws;

const applOption = ["Application Approved", "Application Rejected"];
const RadioList = ["All", "Pending", "Approved","Rejected" ];
 
const funCodeTable = [
	{fun: APPLICATIONTYPES.changeDom, 			code: process.env.REACT_APP_APPLICATION_DOMCHANGE},
	{fun: APPLICATIONTYPES.transferMember, 	code: process.env.REACT_APP_APPLICATION_TRANSFERMEMBER},
	{fun: APPLICATIONTYPES.addMember, 			code: process.env.REACT_APP_APPLICATION_ADDMEMBER},
	{fun: APPLICATIONTYPES.editMember, 			code: process.env.REACT_APP_APPLICATION_EDITMEMBER},
	{fun: APPLICATIONTYPES.newHod, 					code: process.env.REACT_APP_APPLICATION_NEWHOD},
	{fun: APPLICATIONTYPES.memberCeased, 		code: process.env.REACT_APP_APPLICATION_CEASEDMEMBER},
	{fun: APPLICATIONTYPES.editGotra, 			code: process.env.REACT_APP_APPLICATION_EDITGOTRA},
	{fun: APPLICATIONTYPES.editGeneral, 		code: process.env.REACT_APP_APPLICATION_EDITDETAILS},
	{fun: APPLICATIONTYPES.marriage, 				code: process.env.REACT_APP_APPLICATION_MARRIAGE},
	{fun: APPLICATIONTYPES.unMarriage, 			code: process.env.REACT_APP_APPLICATION_UNMARRIAGE},
	{fun: APPLICATIONTYPES.humadUpgrade, 		code: process.env.REACT_APP_APPLICATION_HUMADUPGRADE},
];


export default function Application(props) {
	sessionStorage.removeItem("application_appRec");
	
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
		if ("application_returnstatus" in sessionStorage) {
			console.log("has return status");
			var sts = JSON.parse(sessionStorage.getItem("application_returnstatus"));
			console.log(sts);
			sessionStorage.removeItem("application_returnstatus");
			handleApplictionEditBack(sts);
		}
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
		<DisplayFunctionItem item={OWNER.prws} />
		<DisplayFunctionItem item={OWNER.pjym} />
		<DisplayFunctionItem item={OWNER.humad} />
	</Grid>	
	)}
	
	function DisplayAllApplication() {
	return (
	<Box key="BOXPRWSFILTERTABLE"className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
	<TableContainer>
	<Table style={{padding: "2px" }} >
	<TableHead key={"MEMGRIDTBLHDR"}>
	<TableRow key={"MEMGRIDHDR"}  className={gClasses.boxStyleOdd} >
	<TableCell style={{padding: "2px" }} align="center">
			<Typography className={gClasses.patientInfo2Brown} >Date</Typography>
	</TableCell>
	<TableCell style={{padding: "2px" }} align="center">
		<Typography className={gClasses.patientInfo2Brown} >Reference Id</Typography>
	</TableCell>
	<TableCell style={{padding: "2px" }} align="center">
		<Typography className={gClasses.patientInfo2Brown} >Description</Typography>
	</TableCell>
	<TableCell style={{padding: "2px" }} align="center">
		<Typography className={gClasses.patientInfo2Brown} >Applicant</Typography>
		</TableCell>
	<TableCell style={{padding: "2px" }} align="center">
		<Typography className={gClasses.patientInfo2Brown} >Status</Typography>
	</TableCell>
	<TableCell style={{padding: "2px" }} align="center">
	</TableCell>		
	</TableRow>
	</TableHead>
	<TableBody>
	{applicationArray.map( (a, index) => {
		let myInfo = "HID: " + a.hid + "<br />";
		myInfo += "MID: " + a.mid + "<br />";
		myInfo += "AppId:" + a.id + "<br />";
		myInfo += "Name:" + a.name + "<br />";
		myInfo += "Status:" + a.status + "<br />";
		//myInfo += "Admin:" + a.adminName + "<br />";
		return (
		<TableRow key={"MEMGRID"+index}  className={((index % 2) == 0) ? gClasses.boxStyleEven : gClasses.boxStyleOdd} >
		<TableCell style={{padding: "0px" }} align="center">
			<Typography className={gClasses.patientInfo2}><span>{dateString(a.date)}</span></Typography>
		</TableCell>
		<TableCell style={{padding: "0px" }} align="center">
			<Typography className={gClasses.patientInfo2}>{a.id}</Typography>
		</TableCell>
		<TableCell style={{padding: "0px" }} align="center">
			<Typography className={gClasses.patientInfo2}>{a.desc}</Typography>
		</TableCell>
		<TableCell style={{padding: "0px" }} align="center">
			<Typography className={gClasses.patientInfo2}>{a.name}</Typography>
		</TableCell>
		<TableCell style={{padding: "0px" }} align="center">
			<Typography className={gClasses.patientInfo2}>{a.status}</Typography>
		</TableCell>
		<TableCell style={{padding: "0px" }} align="center">
			<VisibilityIcon size="small" color="primary" onClick={() => editApplicationPage(a)} />
			<CancelIcon size="small" color="secondary" onClick={() => deleteApplication(a)} />
		</TableCell>
		</TableRow>
	)})}
	</TableBody>
	</Table>
	</TableContainer>
	</Box>	
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
	
	function submitChangeOpt(opt) {
		setSelection(applicationMasterArray, currentSelection, opt)
		setRadOpts(opt);
	}		
		// edit application by admin
	async function editApplicationPage(appRec) {
		var myRec = funCodeTable.find(x => x.fun === appRec.desc);
		//console.log(JSON.parse(appRec.data));
		//return;
		if (myRec) {
			sessionStorage.setItem("application_appRec", JSON.stringify({applicationRec: appRec}));
			setTab(myRec.code);
			return;
		}
		else {
			//sessionStorage.setItem("application_appRec", appRec);
			setApplicationRec(appRec);
			setIsDrawerOpened(appRec.desc);
		}	
		//console.log(new Date(), appRec.id, appRec.desc);
	}
	
	function handleApplictionEditBack(sts) {
		//console.log(sts);
		if ( (sts.status == STATUS_INFO.SUCCESS) || (sts.status == STATUS_INFO.ERROR) ) {
			if ((sts.msg !== "") && (sts.status === STATUS_INFO.ERROR)) showError(sts.msg); 
			else if ((sts.msg !== "") && (sts.status === STATUS_INFO.SUCCESS)) showSuccess(sts.msg); 
			console.log(sts.applicationRec);
			//var tmp = [sts.applicationRec].concat(applicationArray.filter(x => x.id !== applicationRec.id));
			//setApplicationArray(lodashReverse(lodashSortBy(tmp, 'id')));
		}
		else {
			console.log("Yaha kaise aaya");
		}
		setIsDrawerOpened("");
	}
	

	return (
	<div className={gClasses.webPage} align="center" key="main">
	<CssBaseline />
	<DisplayPageHeader headerName={"Application Status" } groupName="" tournament=""/>
	<DisplayFunctionHeader />
	<VsRadioGroup radioList={RadioList} value={radOpts} onChange={() => submitChangeOpt(event.target.value) } />
	<DisplayAllApplication />
	{/*<Drawer style={{ width: "100%"}} anchor="top" variant="temporary" open={isDrawerOpened != ""} >
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
	}		
	{(isDrawerOpened === APPLICATIONTYPES.changeDom) &&
		<ApplicationChangeDom applicationRec={applicationRec}  onReturn={handleApplictionEditBack}/>
	}		
	{(isDrawerOpened === APPLICATIONTYPES.marriage) &&
		<ApplicationMarriage applicationRec={applicationRec}  onReturn={handleApplictionEditBack}/>
	}		
	</Box>
	</Container>
	</Drawer>*/}
	<ToastContainer />
	</div>
	);
}
 