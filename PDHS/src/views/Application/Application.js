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

import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";


//import VsRadioGroup from "CustomComponents/VsRadioGroup";

import lodashSortBy from 'lodash/sortBy';
import lodashReverse from 'lodash/reverse';
import lodashCloneDeep from 'lodash/cloneDeep';

// icons
import CancelIcon from '@material-ui/icons/Cancel';
import EditIcon from '@material-ui/icons/Edit';
import InfoIcon   from 	'@material-ui/icons/Info';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';

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
	NONMOBROWSPERPAGE,
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
	disableFutureDt, compareDate,
	hasAnyAdminPermission, hasPRWSpermission, hasPJYMpermission, hasHumadpermission,
	showError, showSuccess,
} from "views/functions.js";

import { getMemberName, dateString, dateStringMMM } from 'views/functions';

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
	{fun: APPLICATIONTYPES.guestMembership, code: process.env.REACT_APP_APPLICATION_GUESTMEMBERSHIP},
];


export default function Application(props) {
	const gClasses = globalStyles();	
	sessionStorage.removeItem("application_appRec");
	const loginHid = parseInt(sessionStorage.getItem("hid"), 10);
	const loginMid = parseInt(sessionStorage.getItem("mid"), 10)
  const prwsLogin = sessionStorage.getItem("prwsLogin");
   
	var adminRec = JSON.parse(sessionStorage.getItem("adminRec"));
   const prwsPerm = adminRec.superAdmin || adminRec.superduper || adminRec.prwsAdmin;
   const humadPerm = adminRec.superAdmin || adminRec.superduper || adminRec.humadAdmin;
   const pjymPerm = adminRec.superAdmin || adminRec.superduper || adminRec.pjymAdmin;
   //console.log(adminRec);
   
	var userType = 'user';

	var DefaultFilterCond = {
		status: APPLICATIONSTATUS.pending,
		adminRec: adminRec,
		timeRange: false,
		mid: loginMid,
		name: prwsLogin,
		owner: OWNER.prws,  // currently ignore
		startDate: new Date(),
		endDate: new Date(),
		currentPage: 0,
		pageSize: NONMOBROWSPERPAGE
	};
	
	if ("application_condition" in sessionStorage) {
		DefaultFilterCond = JSON.parse(sessionStorage.getItem("application_condition"));
		sessionStorage.removeItem("application_condition");
	} 

	const [applicationMasterArray, setApplicationMasterArray] = useState([]);	
    const [applicationArray, setApplicationArray] = useState([]);	
	const [hodName, setHodName] = useState("");

	const [filterCond, setFilterCond] = useState(DefaultFilterCond)
	const [totalCount, setTotalCount] = useState(0);
	const [ROWSPERPAGE, setROWSPERPAGE] = useState(NONMOBROWSPERPAGE);
	const [currentPage, setCurrentPage] = useState(DefaultFilterCond.currentPage);
	
	const [applicationRec, setApplicationRec] = useState(null);
	
	const [currentSelection, setCurrentSelection] = useState(DefaultFilterCond.owner);
	const [onlyPending, setOnlyPending] = useState(false);
	
	const [editApplRec, setEditApplRec] = useState(null);
	const [approve, setApprove] = useState("Application Rejected");
	
	const [radOpts, setRadOpts] = useState(DefaultFilterCond.status);
	
	const [isDrawerOpened, setIsDrawerOpened] = useState("");
	const [emurRemarks, setEmurRemarks] = useState("");
	
	const [emurData1, setEmurData1] = useState("");
	const [emurData11, setEmurData11] = useState("");
	const [emurData2, setEmurData2] = useState("");
	const [emurData3, setEmurData3] = useState("");
	
	const [emurCB1, setEmurCB1] = useState(false);
	const [emurCB2, setEmurCB2] = useState(false);
	
	const [timeRange, setTimeRange] = useState(DefaultFilterCond.timeRange);
	const [time1, setTime1] = useState(moment(DefaultFilterCond.startDate));
	const [time2, setTime2] = useState(moment(DefaultFilterCond.endDate));
	

	
  useEffect(() => {	
		//DefaultFilterCond.adminPermission = hasAnyAdminPermission();
		getAllApplication(DefaultFilterCond);
		if ("application_returnstatus" in sessionStorage) {
			//console.log("has return status");
			var sts = JSON.parse(sessionStorage.getItem("application_returnstatus"));
			//console.log(sts);
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

   function hasButtonPermission(appRec, mode) {
      return true;
      
      var perm = false;
      if ((appRec.mid == loginMid) || ((appRec.owner == OWNER.prws) && prwsPerm))
         perm = true;
      else if ((appRec.mid == loginMid) || ((appRec.owner == OWNER.humad) && humadPerm))
         perm = true;
      else if ((appRec.mid == loginMid) || ((appRec.owner == OWNER.pjym) && pjymPerm))
         perm = true;
      
      return perm;
   }
	async  function getAllApplication(filterCond) {
		//console.log(filterCond);
		setFilterCond(filterCond);
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/apply/filterlist/${JSON.stringify(filterCond)}`;
			let resp = await axios.get(myUrl);
			setApplicationArray(resp.data.data);
			setTotalCount(resp.data.totalCount);
			//console.log(resp.data);
		} catch (e) {
			console.log(e);
		}	
	}


	async  function oldgetAllApplication() {
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

	function handleOwnerChange(newOwner) {
		setCurrentSelection(newOwner);
		setCurrentPage(0);
		
		var tmp = lodashCloneDeep(filterCond);
		tmp.owner = newOwner;
		tmp.currentPage = 0;
		var hasPermission = false;
		switch (newOwner) {
			case OWNER.prws:   hasPermission = hasPRWSpermission(); break;
			case OWNER.pjym:   hasPermission = hasPJYMpermission(); break;
			case OWNER.humad:   hasPermission = hasHumadpermission(); break;
			default:		hasPermission = false; break;			
		}
		tmp.adminPermission = hasPermission;
		getAllApplication(tmp);
	}
	
	function DisplayFunctionItem(props) {
		let itemName = props.item;
		return (
		<Grid key={"BUT"+itemName} item xs={6} sm={3} md={2} lg={2} >	
		<Typography onClick={() => handleOwnerChange(itemName)}>
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

	// pagination function 
	async function handleChangePage(event, newPage)  {
    setCurrentPage(newPage);
		
		var tmp = lodashCloneDeep(filterCond);
		tmp.currentPage = newPage;
		//console.log(tmp);
		getAllApplication(tmp);
  };


	function DisplayFunctionHeader() {
	return (
	<Grid className={gClasses.noPadding} key="AllOptions" container align="center">
		{/*<DisplayFunctionItem item="All" />*/}
		<DisplayFunctionItem item={OWNER.prws} />
		<DisplayFunctionItem item={OWNER.pjym} />
		<DisplayFunctionItem item={OWNER.humad} />
	</Grid>	
	)}

	function enableTimeRange(newState) {
		setTimeRange(newState);
		setCurrentPage(0);
		var tmp = lodashCloneDeep(filterCond);
		tmp.timeRange = newState;
		tmp.currentPage = 0;
		//console.log(tmp);
		getAllApplication(tmp);
	}

	function enableDate1(newTime) {
		//console.log(newTime);
		setTime1(newTime);
		setCurrentPage(0);
		var tmp = lodashCloneDeep(filterCond);
		tmp.startDate = newTime.toDate().toString();
		tmp.currentPage = 0;
		//console.log(tmp);
		getAllApplication(tmp);
		
	}

	function enableDate2(newTime) {
		//console.log(newTime);
		setTime2(newTime);
		setCurrentPage(0);
		var tmp = lodashCloneDeep(filterCond);

		tmp.endDate = newTime.toDate().toString();
		tmp.currentPage = 0;
		//console.log(tmp);
		getAllApplication(tmp);
	}
	
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
		<Typography className={gClasses.patientInfo2Brown} >Hod</Typography>
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
		return (
		<TableRow key={"MEMGRID"+index}  className={((index % 2) == 0) ? gClasses.boxStyleEven : gClasses.boxStyleOdd} >
		<TableCell style={{padding: "0px" }} align="center">
			<Typography className={gClasses.patientInfo2}><span>{dateStringMMM(a.date)}</span></Typography>
		</TableCell>
		<TableCell style={{padding: "0px" }} align="center">
			<Typography className={gClasses.patientInfo2}>{a.id}</Typography>
		</TableCell>
		<TableCell style={{padding: "0px" }} align="center">
			<Typography className={gClasses.patientInfo2}>{a.desc}</Typography>
		</TableCell>
		<TableCell style={{padding: "0px" }} align="center">
			<Typography className={gClasses.patientInfo2}>{a.hodName}</Typography>
		</TableCell>
		<TableCell style={{padding: "0px" }} align="center">
			<Typography className={gClasses.patientInfo2}>{a.name}</Typography>
		</TableCell>
		<TableCell style={{padding: "0px" }} align="center">
			<Typography className={gClasses.patientInfo2}>{a.status}</Typography>
		</TableCell>
		<TableCell style={{padding: "0px" }} align="center">
         <IconButton disabled={!hasButtonPermission(a, 'EDIT')} size="small" color="primary" onClick={() => editApplicationPage(a)}  >
            <VisibilityIcon />
         </IconButton>			
         <IconButton size="small" color='primary' disabled={!hasButtonPermission(a, 'DELETE')} onClick={() => deleteApplication(a)} >
            <DeleteIcon  />
         </IconButton>
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
			let myUrl =  `${process.env.REACT_APP_AXIOS_BASEPATH}/apply/delete/${loginMid}/${appRec.id}`;
			let resp = await axios.get(myUrl);
			showSuccess(`Successfully deleted application with id ${appRec.id}`);
			getAllApplication(filterCond);
			
			//setApplicationArray(applicationArray.filter(x => x.id !== appRec.id));
			//setApplicationMasterArray(applicationMasterArray.filter(x => x.id !== appRec.id));
			// Get the current page from  backend
			
		} catch (e) {
			console.log(e);
			showError(`Error deleting application with id ${appRec.id}`);
		}	
	}
	
	function submitChangeOpt(opt) {
		//setSelection(applicationMasterArray, currentSelection, opt)
		setRadOpts(opt);
		setCurrentPage(0);
		var tmp = lodashCloneDeep(filterCond)
		tmp.status = opt;
		tmp.currentPage = 0;
		getAllApplication(tmp)
	}		
		// edit application by admin
	async function editApplicationPage(appRec) {
		var myRec = funCodeTable.find(x => x.fun === appRec.desc);
		//console.log(JSON.parse(appRec.data));
		//return;
		if (myRec) {
			//console.log("myRec found");
			sessionStorage.setItem("application_condition", JSON.stringify(filterCond));
			sessionStorage.setItem("application_appRec", JSON.stringify({applicationRec: appRec}));
			sessionStorage.setItem("application_caller", process.env.REACT_APP_APPLICATION);
			setTab(myRec.code);
			return;
		}
		else {
			//console.log("myRec not found");
			sessionStorage.setItem("application_appRec", appRec);
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
			//console.log(sts.applicationRec);
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
		<Grid key={"FILTER"} className={gClasses.noPadding} container justifyContent="center" alignItems="center" >
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
	<VsRadioGroup radioList={RadioList} value={radOpts} onChange={() => submitChangeOpt(event.target.value) } />
	<DisplayAllApplication />
	<TablePagination
		align="right"
		rowsPerPageOptions={[ROWSPERPAGE]}
		component="div"
		labelRowsPerPage="Applications per page"
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
 
