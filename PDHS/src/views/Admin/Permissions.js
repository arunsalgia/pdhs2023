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
import VsRadioGroup from "CustomComponents/VsRadioGroup";
import VsSelect from "CustomComponents/VsSelect";


//import TextField from '@material-ui/core/TextField';
import Grid from "@material-ui/core/Grid";
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Drawer from '@material-ui/core/Drawer';
import { useAlert } from 'react-alert'

import lodashSortBy from 'lodash/sortBy';

// icons
import CancelIcon from '@material-ui/icons/Cancel';
import EditIcon from '@material-ui/icons/Edit';

// styles
import globalStyles from "assets/globalStyles";


import {
	DisplayPageHeader, ValidComp, BlankArea,
	DisplayApplicationName, DisplayApplicationNameValue,
} from "CustomComponents/CustomComponents.js"


import { 
	isMobile,
	vsDialog,
} from "views/functions.js";
import { getMemberName } from 'views/functions';

import {
  PADSTYLE,
} from "views/globals.js";


export default function Permissions() {
	//const classes = useStyles();
	const gClasses = globalStyles();
	const alert = useAlert();
	
  const [adminArray, setAdminArray] = useState([]);	
	const [memberArray, setMemberArray] = useState([]);
	const [isDrawerOpened, setIsDrawerOpened] = useState("");
	const [rename, setRename] = useState(false);
	
	const [emurName, setEmurName] = useState("");
	const [emurOrigRec, setEmurOrigRec] = useState("");
	const [registerStatus, setRegisterStatus] = useState(0);

	const [isPjym, setIsPjym] = useState(false);
	const [isPrws, setIsPrws] = useState(false);
	const [isHumad, setIsHumad] = useState(false);
	const [isSuper, setIsSuper] = useState(false);
	
	
  useEffect(() => {		
		getAllAdmin();
		getHodMembers();
  }, []);

	async  function getAllAdmin() {
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/pdhsadm/list`;
			let resp = await axios.get(myUrl);
			//console.log(resp.data);
			setAdminArray(resp.data.filter(x => !x.superduper));
		} catch (e) {
			setAdminArray([]);
		}	
	}
		
	
	async  function getHodMembers() {
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/member/hod/all`;
			let resp = await axios.get(myUrl);
			var myList = [].concat(resp.data);
			for (var i=0; i<myList.length; ++i) {
				myList[i].mergedName = getMemberName(myList[i], false, false);
			}
			//console.log(myList);
			setMemberArray(myList);
		} catch (e) {
			setMemberArray([]);
		}	
	}
		
	
	function ShowResisterStatus() {
		let myMsg = "";
		switch (registerStatus) {
			case 0:  myMsg = ""; break;
			case 1001: myMsg = "Member is already configured as Admin"; break;
			case 1002: myMsg = "Member should be Admin of atleast 1 group"; break;
			case 1003: myMsg = "Invalid Member Id"; break;
			default:  myMsg = "Unknown error"; break;
		}
		return (
		<div>
			<Typography className={(registerStatus != 0) ? gClasses.error : gClasses.nonerror}>{myMsg}</Typography>
		</div>
		);
	}
	

	function addAdmin() {
		//console.log(memberArray);
		setRegisterStatus(0); 
		setEmurName(memberArray[0].mergedName);
		setIsPjym(false);
		setIsPrws(false);
		setIsHumad(false);
		setIsSuper(false);
		setIsDrawerOpened("ADD");  
	}
	
	function editAdmin(adminRec) {
		console.log(adminRec);
		var myMemberRec = memberArray.find(x => x.mid === adminRec.mid);
		setRegisterStatus(0);
		setEmurName(`${adminRec.title} ${adminRec.name}`);
		setEmurOrigRec(adminRec);
		setIsSuper(adminRec.superAdmin);
		setIsPjym(adminRec.pjymAdmin);
		setIsPrws(adminRec.prwsAdmin);
		setIsHumad(adminRec.humadAdmin);
		setIsDrawerOpened("EDIT");  
	}
	
	function handleAddEditAdmin() {
		if (isDrawerOpened === "ADD")
			addAdminSubmit();
		else
			editAdminSubmit();
	}
	
	async function  addAdminSubmit()  {
		if (!isSuper && !isPjym && !isPrws && !isHumad) return setRegisterStatus(1002);	

		let tmp = emurOrigRec;	//   adminArray.find(x => x.mid === emurName);
		if (tmp) return setRegisterStatus(1001);	
		
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/pdhsadm/add/${emurName}/${isSuper}/${isPjym}/${isHumad}/${isPrws}/false`;
			console.log(myUrl);
			return;
			let resp = await axios.get(myUrl);
			let tmpArray = [resp.data].concat(adminArray);
			setAdminArray(lodashSortBy(tmpArray, 'name'));
		} catch (error) {
			if (error.response) {
				switch (error.response.status) {
					case 601: return setRegisterStatus(1001);	
					case 602: return setRegisterStatus(1003);	 
				}
			}
			alert.error("Error adding new Admin")
		}
		setIsDrawerOpened("");
	};
  
		
	async function  editAdminSubmit()  {
		if (!isSuper && !isPjym && !isPrws && !isHumad) return setRegisterStatus(1002);	

		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/pdhsadm/update/${emurOrigRec}/${isSuper}/${isPjym}/${isHumad}/${isPrws}/false`;
			let resp = await axios.get(myUrl);
			let tmpArray = [resp.data].concat(adminArray.filter(x => x.mid !== emurOrigRec));
			setAdminArray(lodashSortBy(tmpArray, 'name'));
		} catch (e) {
			console.log(e);
			alert.error("Error updating Admin permissions");
		}
		setIsDrawerOpened("");
	};
	

	function deleteAdmin(adminRec) {
		let myName = adminRec.title + " " + adminRec.name;
		vsDialog("Delete Admin", `Are you sure you want to remove ${myName} as Admin?`,
		{label: "Yes", onClick: () => handleDelAdminConfirm(adminRec) },
		{label: "No" }
		);
	}
	
	async function handleDelAdminConfirm(adminRec) {
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/pdhsadm/delete/${adminRec.mid}`;
			await axios.get(myUrl);
			let tmpArray = adminArray.filter(x => x.mid !== adminRec.mid);
			setAdminArray(tmpArray);
		} catch (e) {
			console.log(e);
			alert.error(`Error deleting admin`);
		}
	}

	function DisplayPermHeader() {
	return (	
		<TableHead>
		<TableRow key={"MEMGRIDHDR0"}  className={gClasses.boxStyleOdd} >
			<TableCell style={{padding: "2px" }} align="left">
				<Typography style={{paddingLeft: "10px"}} className={gClasses.patientInfo2Brown} >Name (Member Id)</Typography>
			</TableCell>
			<TableCell style={{padding: "2px" }} align="center">
				<Typography className={gClasses.patientInfo2Brown} >PJYM Admin</Typography>
			</TableCell>
			<TableCell style={{padding: "2px" }} align="center">
				<Typography className={gClasses.patientInfo2Brown} >Humad Admin</Typography>
			</TableCell>
			<TableCell style={{padding: "2px" }} align="center">
				<Typography className={gClasses.patientInfo2Brown} >PRWSAdmin</Typography>
			</TableCell>
			<TableCell style={{padding: "2px" }} align="center">
			</TableCell>
			<TableCell style={{padding: "2px" }} align="center">
			</TableCell>
		</TableRow>
		</TableHead>
	)}
	
	function DisplayAllAdmin() {
		//console.log(adminArray);
	return (
	<TableBody>
		{adminArray.map( (a, index) => 
		<TableRow key={"MEMGRID"+index}  className={((index % 2) == 0) ? gClasses.boxStyleEven : gClasses.boxStyleOdd} >
		<TableCell style={{padding: "0px" }} align="left">
			<Typography style={{paddingLeft: "10px"}} className={gClasses.patientInfo2}>{a.title + ' ' + a.name + ' ('+a.mid+')'}</Typography>
		</TableCell>
		<TableCell style={{padding: "0px" }} align="center">
			<Typography className={gClasses.patientInfo2}>{(a.pjymAdmin) ? "YES" : "-"}</Typography>
		</TableCell>
		<TableCell style={{padding: "0px" }} align="center">
			<Typography className={gClasses.patientInfo2}>{(a.humadAdmin) ? "YES" : "-"}</Typography>
		</TableCell>
		<TableCell style={{padding: "0px" }} align="center">
			<Typography className={gClasses.patientInfo2}>{(a.prwsAdmin) ? "YES" : "-"}</Typography>
		</TableCell>
		<TableCell style={{padding: "0px" }} align="center">
		</TableCell>
		<TableCell style={{padding: "0px" }} align="center">
			<EditIcon   color="primary"   size="small" onClick={() => editAdmin(a)} />
			<CancelIcon color="secondary" size="small" onClick={() => deleteAdmin(a)} />
		</TableCell>
		</TableRow>
		)}
	</TableBody>
	)}
	
	return (
		<div className={gClasses.webPage} align="center" key="main">
		<CssBaseline />
		<DisplayPageHeader headerName="Admin Maintenance" groupName="" tournament=""/>
		<br />
		<VsButton align="right" name="Add new Admin" onClick={addAdmin} />	
		<Box key="BOXPRWSFILTERTABLE"className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<TableContainer>
		<Table style={{padding: "2px" }} >
		<DisplayPermHeader />
		<DisplayAllAdmin />
		</Table>
		</TableContainer>
		</Box>	
		<Drawer anchor="top" variant="temporary" open={isDrawerOpened !== ""}>
		<Container component="main" maxWidth="xs">	
		<Box style={PADSTYLE} className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<VsCancel align="right" onClick={() => {setIsDrawerOpened("")}} />
		<Typography align="center" className={gClasses.title}>{(isDrawerOpened === "ADD") ? "Add new Admin" : `Edit Admin permissions`}</Typography>
		<br />
		<ValidatorForm className={gClasses.form} onSubmit={handleAddEditAdmin}>
		<Grid key="ADEDITPERM" className={gClasses.noPadding} container  alignItems="flex-start" >
		{(isDrawerOpened === "ADD") &&
			<Grid item xs={4} sm={4} md={4} lg={4} >
		<DisplayApplicationName name="Name" value="" style={{paddingTop: "20px" }}  />
			</Grid>
		}
		{(isDrawerOpened === "ADD") &&
			<Grid item xs={8} sm={8} md={8} lg={8} >
				<VsSelect size="small" align="left" inputProps={{className: gClasses.dateTimeNormal}} 
				field="mergedName" options={memberArray} value={emurName} onChange={(event) => { setEmurName(event.target.value); }} />
			</Grid>
		}
		{(isDrawerOpened === "EDIT") &&
			<Grid item xs={12} sm={12} md={12} lg={12} >
				<DisplayApplicationNameValue name="Name" value={emurName} style={{paddingTop: "5px" }}  />
			</Grid>
		}
		{/*<Grid item xs={5} sm={5} md={5} lg={5} >
			<DisplayApplicationName name="Super Admin" value="" style={{paddingTop: "5px" }}  />
		</Grid>
		<Grid item xs={7} sm={7} md={7} lg={7} >
			<VsCheckBox align="left" checked={isSuper} onClick={() => setIsSuper(!isSuper)} />
		</Grid>*/}
		<Grid item xs={5} sm={5} md={5} lg={5} >
			<DisplayApplicationName name="PJYM Admin" value="" style={{paddingTop: "5px" }}  />
		</Grid>
		<Grid item xs={7} sm={7} md={7} lg={7} >
				<VsCheckBox align="left" checked={isPjym} onClick={() => setIsPjym(!isPjym)} />
		</Grid>
		<Grid item xs={5} sm={5} md={5} lg={5} >
			<DisplayApplicationName name="Humad Admin" value="" style={{paddingTop: "5px" }}  />
		</Grid>
		<Grid item xs={7} sm={7} md={7} lg={7} >
				<VsCheckBox align="left" checked={isHumad} onClick={() => setIsHumad(!isHumad)} />
		</Grid>
		<Grid item xs={5} sm={5} md={5} lg={5} >
			<DisplayApplicationName name="PRWS Admin" value="" style={{paddingTop: "5px" }}  />
		</Grid>
		<Grid item xs={7} sm={7} md={7} lg={7} >
				<VsCheckBox align="left" checked={isPrws} onClick={() => setIsPrws(!isPrws)} />
		</Grid>
		</Grid>
		<ShowResisterStatus/>
		<VsButton align="center" name={((isDrawerOpened === "ADD") ? "Add" : "Update") + " Administrator permissions"} />
		</ValidatorForm>
		</Box>
		</Container>
		</Drawer>
		</div>
	);
}
 