import React,{useState, useEffect } from 'react';
import { CssBaseline } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField, InputAdornment } from "@material-ui/core";

import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';

import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";

import axios from 'axios';
import VsButton from "CustomComponents/VsButton"; 
import VsCancel from "CustomComponents/VsCancel";
import VsCheckBox from "CustomComponents/VsCheckBox";
import VsRadioGroup from "CustomComponents/VsRadioGroup";
import VsRadio from "CustomComponents/VsRadio";


//import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import Grid from "@material-ui/core/Grid";
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Drawer from '@material-ui/core/Drawer';
//import { useAlert } from 'react-alert'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import lodashSortBy from 'lodash/sortBy';
import lodashCloneDeep from 'lodash/cloneDeep';

// icons
import CancelIcon from '@material-ui/icons/Cancel';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import VisibilityIcon from '@material-ui/icons/Visibility';

import {
	setTab,
} from "CustomComponents/CricDreamTabs.js"


// styles
import globalStyles from "assets/globalStyles";


import {DisplayPageHeader, ValidComp, BlankArea,
	DisplayApplicationName
} from "CustomComponents/CustomComponents.js"


import { 
	vsDialog,
	getWindowDimensions, displayType,
	dateString, dateTimeString, dateTimeStringMMM, compareDate,
	disableFutureDt,
	showError, showSuccess, showInfo,
} from "views/functions.js";

import {
  PADSTYLE,
	NONMOBROWSPERPAGE,
	APPLICATIONTYPES,
} from "views/globals.js";

const FILTERLIST = ["All", "OnlyLogInOut", "NoLogInOut"];

const NonViewableActionList = ["Login", "Logout"];

	var APPLICATIONPAGES = [
		{action: APPLICATIONTYPES.editGotra, page: process.env.REACT_APP_APPLICATION_EDITGOTRA },
		{action: APPLICATIONTYPES.editGeneral, page: process.env.REACT_APP_APPLICATION_EDITDETAILS},
		{action: APPLICATIONTYPES.addMember, page: process.env.REACT_APP_APPLICATION_ADDMEMBER},
		{action: APPLICATIONTYPES.editMember, page: process.env.REACT_APP_APPLICATION_EDITMEMBER},
		{action: APPLICATIONTYPES.memberCeased, page: process.env.REACT_APP_APPLICATION_CEASEDMEMBER},
		//{action: APPLICATIONTYPES.spouseDetails, page: process.env.},
		{action: APPLICATIONTYPES.transferMember, page: process.env.REACT_APP_APPLICATION_TRANSFERMEMBER},
		{action: APPLICATIONTYPES.changeDom, page: process.env.REACT_APP_APPLICATION_DOMCHANGE},
		{action: APPLICATIONTYPES.marriage, page: process.env.REACT_APP_APPLICATION_MARRIAGE},
		{action: APPLICATIONTYPES.unMarriage, page: process.env.REACT_APP_APPLICATION_UNMARRIAGE},
		{action: APPLICATIONTYPES.humadUpgrade, page: process.env.REACT_APP_APPLICATION_HUMADUPGRADE}
	];
	

export default function Logs() {
	//const classes = useStyles();
	const gClasses = globalStyles();
	
	var DefaultFilterCond = {
		filterBy: "NoLogInOut",
		timeRange: false,
		startDate: moment().toDate().toString(),
		endDate: moment().toDate().toString(),
		currentPage: 0,
		pageSize: NONMOBROWSPERPAGE
	};

	if ("log_condition" in sessionStorage) {
		//console.log("Condition found");
		DefaultFilterCond = JSON.parse(sessionStorage.getItem("log_condition"));
		sessionStorage.removeItem("application_condition");
	} 

  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  const [dispType, setDispType] = useState("lg");
  const [ROWSPERPAGE, setROWSPERPAGE] = useState(NONMOBROWSPERPAGE);
	
  const [logArray, setLogArray] = useState([]);	
	//const [logMasterArray, setLogMasterArray] = useState([]);	
	//const [registerStatus, setRegisterStatus] = useState(0);

	const [timeRange, setTimeRange] = useState(DefaultFilterCond.timeRange);
	const [time1, setTime1] = useState(moment(DefaultFilterCond.startDate));
	const [time2, setTime2] = useState(moment(DefaultFilterCond.endDate));
	const [currentPage, setCurrentPage] = useState(DefaultFilterCond.currentPage);
	const [filterBy, setFilterBy] = useState(DefaultFilterCond.filterBy);

	const [totalCount, setTotalCount] = useState(0);
	
	const [filterCond, setFilterCond] = useState(DefaultFilterCond)
  useEffect(() => {	
		function handleResize() {
			let myDim = getWindowDimensions();
			setWindowDimensions(myDim);
			//console.log(displayType(myDim.width));
			setDispType(displayType(myDim.width));
		}
	
		getAllLogs(DefaultFilterCond);
		window.addEventListener('resize', handleResize);
  }, []);

	async  function getAllLogs(fCond) {
		setFilterCond(fCond);
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/log/filterlist/${JSON.stringify(fCond)}`;
			let resp = await axios.get(myUrl);
			console.log(resp.data);
			//var tmp = resp.data.filter(x => !NonViewableActionList.includes(x.action) )
			///console.log(tmp.length);
			setLogArray(resp.data.data);
			setTotalCount(resp.data.totalCount);
			//setLogMasterArray(resp.data.data);
		} catch (e) {
			setLogArray([]);
			setLogMasterArray([]);
		}	
	}
	
/*
	function ShowResisterStatus() {
		let myMsg = "";
		switch (registerStatus) {
			case 0:  myMsg = ""; break;
			case 1001: myMsg = "Blank City name"; break;
			case 1002: myMsg = "Duplicate City name"; break;
			case 1004: myMsg = "City not selected from existing list."; break;
			default:  myMsg = "Unknown error"; break;
		}
		return (
		<div>
			<Typography className={(registerStatus != 0) ? gClasses.error : gClasses.nonerror}>{myMsg}</Typography>
		</div>
		);
	}
*/
	
	function DisplayLogsHeader() {
	return (
	<TableHead>
	<TableRow key={"MEMGRIDHDR"}  className={gClasses.boxStyleOdd} >
		<TableCell style={{padding: "2px" }} align="center">
			<Typography className={gClasses.patientInfo2Brown }>Date</Typography>		
		</TableCell>
		<TableCell style={{padding: "2px" }} align="center">
			<Typography className={gClasses.patientInfo2Brown}>Action</Typography>
		</TableCell>
		<TableCell style={{padding: "2px" }} align="center">
			<Typography className={gClasses.patientInfo2Brown}>Admin</Typography>
		</TableCell>
		<TableCell style={{padding: "2px" }} align="center">
				<Typography className={gClasses.patientInfo2Brown} >Name</Typography>		
		</TableCell>
		<TableCell style={{padding: "2px" }} align="left">
			<Typography style={{marginLeft: "0px", paddingLeft: "0px" }} className={gClasses.patientInfo2Brown} >Description</Typography>		
		</TableCell>
		<TableCell style={{padding: "2px" }} align="center">
		</TableCell>
	</TableRow>
	</TableHead>
	)}
  

	async function viewApplicationInfo(logRec) {
		if (logRec.data === '') return;
		// Objectify the application record using the filed "data"
		var myAppRec = JSON.parse(logRec.data);
		// Find the page number information based on the application action
		console.log(myAppRec);
		var myRec = APPLICATIONPAGES.find(x => x.action === myAppRec.desc);
		if (!myRec) {
			showError(`Unable to find page for application ${myAppRec.id}`);
			return;
		}
		sessionStorage.setItem("application_appRec", JSON.stringify({applicationRec: myAppRec}));
		sessionStorage.setItem("application_caller", process.env.REACT_APP_LOG);
		sessionStorage.setItem("application_readonly", "true");
		sessionStorage.setItem("log_condition", JSON.stringify(filterCond));
		//console.log(myRec.applPage);
		setTab(myRec.page);
	}
	
	
	function DisplayAllLogs() {
	if (logArray.length === 0) return null;
	return (
		<TableBody>
		{logArray.slice(0*ROWSPERPAGE, (0+1)*ROWSPERPAGE).map( (l, index) => {
				//console.log(l.admin);
				//console.log(l.action, NonViewableActionList.includes(l.action));
			var viewDisable = true;
			if (l.referenceId)
			if (l.referenceId> 0)
				viewDisable = false;
		return (
		<TableRow key={"MEMGRID"+index}  className={((index % 2) == 0) ? gClasses.boxStyleEven : gClasses.boxStyleOdd} >
		<TableCell style={{padding: "0px"}} align="center">
			<Typography className={gClasses.patientInfo2 }>{dateTimeStringMMM(l.date)}</Typography>		
		</TableCell>
		<TableCell style={{padding: "0px"}} align="center">
			<Typography className={gClasses.patientInfo2}>{l.action}</Typography>
		</TableCell>
		<TableCell style={{padding: "0px"}} align="center">
			<Typography className={gClasses.patientInfo2}>{(l.isAdmin === "true") ? "Yes" : "-"}</Typography>
		</TableCell>
		<TableCell  style={{padding: "0px"}} align="center">
			<Typography className={gClasses.patientInfo2 } >{l.name}</Typography>		
		</TableCell>
		<TableCell style={{padding: "0px"}} align="left">
			<Typography style={{marginLeft: "0px", paddingLeft: "0px" }} className={gClasses.patientInfo2 } >{l.desc}</Typography>		
		</TableCell>
		<TableCell style={{padding: "0px"}} align="center">
			<IconButton disabled={viewDisable}  color="primary" size="small" onClick={() => {viewApplicationInfo(l)}}><VisibilityIcon /></IconButton>			
		</TableCell>
		</TableRow>
		)}
		)}
		</TableBody>
	)}
  
/*
	function filterLogs(selection, trange, t1, t2) {
		//console.log(t1, t2)
		var tmp = [].concat(logMasterArray);
		if (trange) {
			var t1Nor = t1.toDate();
			var t2Nor = t2.toDate();
			//console.log(t1Nor, t2Nor);
			//console.log(compareDate(t1Nor, new Date(tmp[7].date)));
			if (compareDate(t1Nor, t2Nor) > 0) 
				tmp = [];
			else {
				tmp = tmp.filter(x => compareDate(new Date(x.date), t1Nor) >= 0);
				tmp = tmp.filter(x => compareDate(new Date(x.date), t2Nor) <= 0);
			}
		}
		switch (selection) {
			case "NoLogInOut" :
				tmp = tmp.filter( x => (x.action !== "Login") && (x.action !== "Logout"));
				break;
			case "OnlyLogInOut" :
				tmp = tmp.filter( x => (x.action === "Login") || (x.action === "Logout"));
				break;
		}
		setCurrentPage(0);
		setLogArray(tmp);
	}
*/
	
	// pagination function 
	function handleChangePage(event, newPage)  {
    setCurrentPage(newPage);
		
		var tmp = lodashCloneDeep(filterCond);
		tmp.currentPage = newPage;
		console.log(tmp);
		getAllLogs(tmp);
  };

	
	// action type
	function setNewFilter(value) {
		setFilterBy(value);
		setCurrentPage(0);
		console.log(value);
		var tmp = lodashCloneDeep(filterCond);
		tmp.filterBy = value;
		tmp.currentPage = 0;
		console.log(tmp);
		getAllLogs(tmp);

		//filterLogs(value, timeRange, time1, time2);
	}
	
	// strat date
	function enableTimeRange(newState) {
		setTimeRange(newState);
		setCurrentPage(0);
		var tmp = lodashCloneDeep(filterCond);
		tmp.timeRange = newState;
		tmp.currentPage = 0;
		console.log(tmp);
		getAllLogs(tmp);

		//filterLogs(filterBy, newState, time1, time2);
	}
	
	// end date
	function enableDate1(newTime) {
		//console.log(newTime);
		setTime1(newTime);
		setCurrentPage(0);
		var tmp = lodashCloneDeep(filterCond);
		tmp.startDate = newTime.toDate().toString();
		tmp.currentPage = 0;
		console.log(tmp);
		getAllLogs(tmp);
		
	}

	function enableDate2(newTime) {
		//console.log(newTime);
		setTime2(newTime);
		setCurrentPage(0);
		var tmp = lodashCloneDeep(filterCond);
		tmp.endDate = newTime.toDate().toString();
		tmp.currentPage = 0;
		console.log(tmp);
		getAllLogs(tmp);
	}

	return (
		<div className={gClasses.webPage} align="center" key="main">
		<CssBaseline />
		<DisplayPageHeader headerName="PRWS logs" groupName="" tournament=""/>
		<Grid key={"FIKTER"} className={gClasses.noPadding} container justifyContent="center" alignItems="center" >
			{/*<Grid align="center" item xs={12} sm={12} md={6} lg={6} >
			<VsRadioGroup radioList={FILTERLIST} value={filterBy} onChange={(event) => setNewFilter(event.target.value)} />
			</Grid>*/}
			<Grid align="center" item xs={2} sm={2} md={2} lg={2} >
				<VsCheckBox label="TimeRange" checked={timeRange} onClick={() => enableTimeRange(!timeRange) }  />			
			</Grid>
			<Grid align="center" item xs={5} sm={5} md={2} lg={2} >
			{(timeRange) &&
			<Datetime 
				className={gClasses.dateTimeBlock}
				inputProps={{className: (compareDate(time1.toDate(), time2.toDate()) > 0) ? gClasses.error : gClasses.dateTimeNormal}}
				timeFormat={false} 
				initialValue={time1}
				value={time1}
				dateFormat="DD/MMM/yyyy"
				isValidDate={disableFutureDt}
				onClose={(date) => enableDate1(date)}
				closeOnSelect={true}
			/>
			}
			</Grid >
			<Grid align="center" item xs={5} sm={5} md={2} lg={2} >
				{(timeRange) &&
				<Datetime 
				className={gClasses.dateTimeBlock}
				inputProps={{className: (compareDate(time1.toDate(), time2.toDate()) > 0) ? gClasses.error : gClasses.dateTimeNormal}}
				timeFormat={false} 
				initialValue={time2}
				value={time2}
				dateFormat="DD/MMM/yyyy"
				isValidDate={disableFutureDt}
				onClose={(date) => enableDate2(date)}
				closeOnSelect={true}
			/>
			}
			</Grid >
			<Grid align="center" item xs={2} sm={2} md={1} lg={1} />
		</Grid>
		<Box key="BOXPRWSFILTERTABLE"className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<TableContainer>
		<Table style={{padding: "2px" }} >
		<DisplayLogsHeader />
		<DisplayAllLogs />
		</Table>
		</TableContainer>
		</Box>	
		<TablePagination
			align="right"
			rowsPerPageOptions={[ROWSPERPAGE]}
			component="div"
			labelRowsPerPage="Logs per page"
			count={totalCount}
			rowsPerPage={ROWSPERPAGE}
			page={currentPage}
			onPageChange={handleChangePage}
			//onRowsPerPageChange={handleChangeRowsPerPage}
			//showFirstButton={true}
		/>
		<ToastContainer />
		</div>
	);
}
 