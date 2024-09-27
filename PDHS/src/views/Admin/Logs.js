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

// icons
import CancelIcon from '@material-ui/icons/Cancel';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import VisibilityIcon from '@material-ui/icons/Visibility';

// styles
import globalStyles from "assets/globalStyles";


import {DisplayPageHeader, ValidComp, BlankArea,
	DisplayApplicationName
} from "CustomComponents/CustomComponents.js"


import { 
	vsDialog,
	getWindowDimensions, displayType,
	dateString, dateTimeString, compareDate,
	disableFutureDt,
	showError, showSuccess, showInfo,
} from "views/functions.js";

import {
  PADSTYLE,
	NONMOBROWSPERPAGE,
} from "views/globals.js";

const FILTERLIST = ["All", "OnlyLogInOut", "NoLogInOut"];

const NonMovableActionList = ["Login", "Logout"];

export default function Logs() {
	//const classes = useStyles();
	const gClasses = globalStyles();

  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  const [dispType, setDispType] = useState("lg");
  const [ROWSPERPAGE, setROWSPERPAGE] = useState(NONMOBROWSPERPAGE);
	const [currentPage, setCurrentPage] = useState(0);
	
  const [logArray, setLogArray] = useState([]);	
	const [logMasterArray, setLogMasterArray] = useState([]);	
	const [filterBy, setFilterBy] = useState("All");
	const [registerStatus, setRegisterStatus] = useState(0);

	const [timeRange, setTimeRange] = useState(false);
	const [time1, setTime1] = useState(moment());
	const [time2, setTime2] = useState(moment());
	
  useEffect(() => {	
		function handleResize() {
			let myDim = getWindowDimensions();
			setWindowDimensions(myDim);
			//console.log(displayType(myDim.width));
			setDispType(displayType(myDim.width));
		}
	
		getAllLogs();
		window.addEventListener('resize', handleResize);
  }, []);

	async  function getAllLogs() {
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/log/list/all`;
			let resp = await axios.get(myUrl);
			setLogMasterArray(resp.data);
			setLogArray(resp.data);
		} catch (e) {
			setLogArray([]);
			setLogMasterArray([]);
		}	
	}
	
	// pagination function 
	const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

	

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
  

	function editApplication(logRec) {
		showInfo("View Application to be implemented");
	}
	
	
	function DisplayAllLogs() {
	if (logArray.length === 0) return null;
	return (
		<TableBody>
		{logArray.slice(currentPage*ROWSPERPAGE, (currentPage+1)*ROWSPERPAGE).map( (l, index) => {
				//console.log(l.admin);
				//console.log(l.action, NonMovableActionList.includes(l.action));
		return (
		<TableRow key={"MEMGRID"+index}  className={((index % 2) == 0) ? gClasses.boxStyleEven : gClasses.boxStyleOdd} >
		<TableCell style={{padding: "0px"}} align="center">
			<Typography className={gClasses.patientInfo2 }>{dateTimeString(l.date)}</Typography>		
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
			<IconButton disabled={NonMovableActionList.includes(l.action)}  color="primary" size="small" onClick={() => {editApplication(l)}}><VisibilityIcon /></IconButton>			
		</TableCell>
		</TableRow>
		)}
		)}
		</TableBody>
	)}
  
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
	
	function setNewFilter(value) {
		//console.log(value);
		setFilterBy(value);
		filterLogs(value, timeRange, time1, time2);
	}
	
	function enableTimeRange(newState) {
		setTimeRange(newState);
		filterLogs(filterBy, newState, time1, time2);
	}
	
	function enableDate1(newTime) {
		//console.log(newTime);
		setTime1(newTime);
		filterLogs(filterBy, timeRange, newTime, time2);
	}

	function enableDate2(newTime) {
		//console.log(newTime);
		setTime2(newTime);
		filterLogs(filterBy, timeRange, time1, newTime);
	}

	return (
		<div className={gClasses.webPage} align="center" key="main">
		<CssBaseline />
		<DisplayPageHeader headerName="PRWS logs" groupName="" tournament=""/>
		<Grid key={"FIKTER"} className={gClasses.noPadding} container justifyContent="center" alignItems="center" >
			<Grid align="center" item xs={12} sm={12} md={6} lg={6} >
			<VsRadioGroup radioList={FILTERLIST} value={filterBy} onChange={(event) => setNewFilter(event.target.value)} />
			</Grid>
			<Grid align="center" item xs={12} sm={12} md={2} lg={2} >
				<VsCheckBox label="TimeRange" checked={timeRange} onClick={() => enableTimeRange(!timeRange) }  />			
			</Grid>
			<Grid align="center" item xs={12} sm={12} md={2} lg={2} >
			{(timeRange) &&
			<Datetime 
				className={gClasses.dateTimeBlock}
				inputProps={{className: (compareDate(time1.toDate(), time2.toDate()) > 0) ? gClasses.error : gClasses.dateTimeNormal}}
				timeFormat={false} 
				initialValue={time1}
				value={time1}
				dateFormat="DD/MM/yyyy"
				isValidDate={disableFutureDt}
				onClose={(date) => enableDate1(date)}
				closeOnSelect={true}
			/>
			}
			</Grid >
			<Grid align="center" item xs={12} sm={12} md={2} lg={2} >
				{(timeRange) &&
				<Datetime 
				className={gClasses.dateTimeBlock}
				inputProps={{className: (compareDate(time1.toDate(), time2.toDate()) > 0) ? gClasses.error : gClasses.dateTimeNormal}}
				timeFormat={false} 
				initialValue={time2}
				value={time2}
				dateFormat="DD/MM/yyyy"
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
		{(logArray.length > ROWSPERPAGE) &&
		<TablePagination
			align="right"
			rowsPerPageOptions={[ROWSPERPAGE]}
			component="div"
			labelRowsPerPage="Logs per page"
			count={logArray.length}
			rowsPerPage={ROWSPERPAGE}
			page={currentPage}
			onPageChange={handleChangePage}
			//onRowsPerPageChange={handleChangeRowsPerPage}
			//showFirstButton={true}
		/>
		}
		<ToastContainer />
		</div>
	);
}
 