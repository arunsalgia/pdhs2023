import React,{useState, useEffect } from 'react';
import { CssBaseline } from '@material-ui/core';
import axios from 'axios';
import Container from '@material-ui/core/Container';

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


import {DisplayPageHeader, ValidComp, BlankArea,
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
	const [emurOrigName, setEmurOrigName] = useState("");
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
		setEmurName(myMemberRec.mergedName);
		setEmurOrigName(adminRec.mid);
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
		let tmp = adminArray.find(x => x.mid === emurName);
		if (tmp) return setRegisterStatus(1001);	
		if (!isSuper && !isPjym && !isPrws && !isHumad) return setRegisterStatus(1002);	

		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/pdhsadm/add/${emurName}/${isSuper}/${isPjym}/${isHumad}/${isPrws}/false`;
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
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/pdhsadm/update/${emurOrigName}/${isSuper}/${isPjym}/${isHumad}/${isPrws}/false`;
			let resp = await axios.get(myUrl);
			let tmpArray = [resp.data].concat(adminArray.filter(x => x.mid !== emurOrigName));
			setAdminArray(lodashSortBy(tmpArray, 'name'));
		} catch (e) {
			console.log(e);
			alert.error("Error updating Admin permissions");
		}
		setIsDrawerOpened("");
	};
	

	function deleteAdmin(adminRec) {
		let myName = adminRec.title + " " + adminRec.name;
		vsDialog("Delete Admin", `Are you sure you want to delete ${myName}?`,
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

	function DisplayAllAdmin() {
		//console.log(adminArray);
	return (
	<div>
		<Box  style={PADSTYLE}  key={"MEMBOXHDR"} className={gClasses.boxStyle} borderColor="black" borderRadius={30} border={1} >
		<Grid key={"MEMGRIDHDR"} className={gClasses.noPadding} container align="center" alignItems="center" >
		{(!isMobile()) &&
		<Grid align="left" key={"H1"} item xs={12} sm={12} md={6} lg={6} >
			<Typography style={{paddingLeft: "10px"}} className={gClasses.patientInfo2Brown} >Name of the Member</Typography>
			<Typography style={{paddingLeft: "10px"}} className={gClasses.patientInfo2Brown} >(Member Id)</Typography>
		</Grid>
		}
		{(isMobile()) &&
		<Grid align="left" key={"H1"} item xs={12} sm={12} md={6} lg={6} >
			<Typography className={gClasses.patientInfo2Brown} >Name of the Member (Member Id)</Typography>
		</Grid>
		}
		<Grid align="center" key={"H2"} item xs={2} sm={2} md={1} lg={1} >
			<Typography className={gClasses.patientInfo2Brown} >Super</Typography>
			<Typography className={gClasses.patientInfo2Brown} >Admin</Typography>
		</Grid>
		<Grid align="center" key={"H3"} item xs={2} sm={2} md={1} lg={1} >
			<Typography className={gClasses.patientInfo2Brown} >PJYM</Typography>
			<Typography className={gClasses.patientInfo2Brown} >Admin</Typography>
		</Grid>
		<Grid align="center" key={"H4"} item xs={2} sm={2} md={1} lg={1} >
			<Typography className={gClasses.patientInfo2Brown} >Humad</Typography>
			<Typography className={gClasses.patientInfo2Brown} >Admin</Typography>
		</Grid>
		<Grid align="center" key={"H5"} item xs={2} sm={2} md={1} lg={1} >
			<Typography className={gClasses.patientInfo2Brown} >PRWS</Typography>
			<Typography className={gClasses.patientInfo2Brown} >Admin</Typography>
		</Grid>
		<Grid align="center" key={"H6"} item xs={2} sm={2} md={1} lg={1} >
			<Typography className={gClasses.patientInfo2Brown} >Future</Typography>
			<Typography className={gClasses.patientInfo2Brown} >Admin</Typography>
		</Grid>
		<Grid align="center" key={"H7"} item xs={2} sm={2} md={1} lg={1} >
			<Typography></Typography>
		</Grid>
		</Grid>
		</Box>
		{adminArray.map( (a, index) => 
			<Box  key={"DOC0Box"+index} className={gClasses.boxStyle} borderColor="black" borderRadius={30} border={1} >
			<Grid key={"DOC0GRD"+index} className={gClasses.noPadding} container align="center" alignItems="center" >
			<Grid align="left" key={"DOC1"+index} item xs={12} sm={12} md={6} lg={6} >
				<Typography style={{paddingLeft: "10px"}} className={gClasses.patientInfo2}>{a.title + ' ' + a.name + ' ('+a.mid+')'}</Typography>
			</Grid>
			<Grid align="center" key={"DOC2"+index} item xs={2} sm={2} md={1} lg={1} >
				<Typography className={gClasses.patientInfo2}>{(a.superAdmin) ? "YES" : "-"}</Typography>
			</Grid>
			<Grid align="center" key={"DOC3"+index} item xs={2} sm={2} md={1} lg={1} >
				<Typography className={gClasses.patientInfo2}>{(a.pjymAdmin) ? "YES" : "-"}</Typography>
			</Grid>
			<Grid align="center" key={"DOC4"+index} item xs={2} sm={2} md={1} lg={1} >
				<Typography className={gClasses.patientInfo2}>{(a.humadAdmin) ? "YES" : "-"}</Typography>
			</Grid>
			<Grid align="center" key={"DOC5"+index} item xs={2} sm={2} md={1} lg={1} >
				<Typography className={gClasses.patientInfo2}>{(a.prwsAdmin) ? "YES" : "-"}</Typography>
			</Grid>
			<Grid align="center" key={"DOC6"+index} item xs={2} sm={2} md={1} lg={1} >
				<Typography className={gClasses.patientInfo2}>{"-"}</Typography>
			</Grid>
			<Grid align="center" key={"DOC7"+index} item xs={2} sm={2} md={1} lg={1} >
				<EditIcon   color="primary"   size="small" onClick={() => editAdmin(a)} />
				<CancelIcon color="secondary" size="small" onClick={() => deleteAdmin(a)} />
			</Grid>
			</Grid>
			</Box>
		)}
	</div>
	)}
	
	return (
		<div className={gClasses.webPage} align="center" key="main">
		<CssBaseline />
		<DisplayPageHeader headerName="Admin Maintenance" groupName="" tournament=""/>
		<br />
		<VsButton align="right" name="Add new Admin" onClick={addAdmin} />	
		<DisplayAllAdmin />
		<Drawer anchor="top" variant="temporary" open={isDrawerOpened !== ""}>
		<Container component="main" maxWidth="xs">	
		<Box style={PADSTYLE} className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<VsCancel align="right" onClick={() => {setIsDrawerOpened("")}} />
		<Typography align="center" className={gClasses.title}>{(isDrawerOpened === "ADD") ? "Add new Admin" : `Edit permissions of ${emurName}`}</Typography>
		<br />
		<ValidatorForm className={gClasses.form} onSubmit={handleAddEditAdmin}>
		<Grid key="ADEDITPERM" className={gClasses.noPadding} container  alignItems="flex-start" >
		<Grid item xs={4} sm={4} md={4} lg={4} >
			<Typography style={{paddingTop: "20px" }} className={gClasses.patientInfo2Blue} >Name</Typography>
		</Grid>
		<Grid item xs={8} sm={8} md={8} lg={8} >
			<div>
			{(isDrawerOpened === "ADD") &&
				<VsSelect size="small" align="left" inputProps={{className: gClasses.dateTimeNormal}} 
				field="mergedName" options={memberArray} value={emurName} onChange={(event) => { setEmurName(event.target.value); }} />
			}
			{(isDrawerOpened !== "ADD") &&
				<Typography style={{paddingTop: "20px" }} className={gClasses.patientInfo2Blue}  >{emurName}</Typography>
			}			
			</div>
		</Grid>
		<Grid item xs={4} sm={4} md={4} lg={4} >
			<Typography style={{paddingTop: "10px" }} className={gClasses.patientInfo2Blue} >Super Admin</Typography>
		</Grid>
		<Grid item xs={8} sm={8} md={8} lg={8} >
			<VsCheckBox align="left" checked={isSuper} onClick={() => setIsSuper(!isSuper)} />
		</Grid>
		<Grid item xs={4} sm={4} md={4} lg={4} >
			<Typography style={{paddingTop: "10px" }} className={gClasses.patientInfo2Blue} >PJYM Admin</Typography>
		</Grid>
		<Grid item xs={8} sm={8} md={8} lg={8} >
				<VsCheckBox align="left" checked={isPjym} onClick={() => setIsPjym(!isPjym)} />
		</Grid>
		<Grid item xs={4} sm={4} md={4} lg={4} >
			<Typography style={{paddingTop: "10px" }} className={gClasses.patientInfo2Blue} >Humad Admin</Typography>
		</Grid>
		<Grid item xs={8} sm={8} md={8} lg={8} >
				<VsCheckBox align="left" checked={isHumad} onClick={() => setIsHumad(!isHumad)} />
		</Grid>
		<Grid item xs={4} sm={4} md={4} lg={4} >
			<Typography style={{paddingTop: "10px" }} className={gClasses.patientInfo2Blue} >PRWS Admin</Typography>
		</Grid>
		<Grid item xs={8} sm={8} md={8} lg={8} >
				<VsCheckBox align="left" checked={isPrws} onClick={() => setIsPrws(!isPrws)} />
		</Grid>
		</Grid>
		<ShowResisterStatus/>
		<VsButton align="center" name={"Add new Administrator"} />
		</ValidatorForm>
		</Box>
		</Container>
		</Drawer>
		</div>
	);
}
 