import React,{useState, useEffect } from 'react';
import { CssBaseline } from '@material-ui/core';
import axios from 'axios';
import VsButton from "CustomComponents/VsButton"; 
import VsCancel from "CustomComponents/VsCancel";
import VsCheckBox from "CustomComponents/VsCheckBox";
import VsRadioGroup from "CustomComponents/VsRadioGroup";

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


export default function PDHSAdmin() {
	//const classes = useStyles();
	const gClasses = globalStyles();
	const alert = useAlert();
	
  const [adminArray, setAdminArray] = useState([]);	
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
		setRegisterStatus(0); 
		setEmurName("")
		setIsPjym(false);
		setIsPrws(false);
		setIsHumad(false);
		setIsSuper(false);
		setIsDrawerOpened("ADD");  
	}
	
	function editAdmin(adminRec) {
		//console.log(adminRec);
		setRegisterStatus(0);
		setEmurName(adminRec.title + " " + adminRec.name);
		setEmurOrigName(adminRec.mid);
		setIsSuper(adminRec.superAdmin);
		setIsPjym(adminRec.pjymAdmin);
		setIsPrws(adminRec.prwsAdmin);
		setIsHumad(adminRec.humadAdmin);
		setIsDrawerOpened("EDIT");  
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
		<Drawer anchor="right" variant="temporary" open={isDrawerOpened !== ""}>
		<Box style={PADSTYLE} className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
			<VsCancel align="right" onClick={() => {setIsDrawerOpened("")}} />
			{(isDrawerOpened === "ADD") &&   
				<ValidatorForm className={gClasses.form} onSubmit={addAdminSubmit}>
				<Typography className={gClasses.title}>Add new Administrator</Typography>
				<br />
				<TextValidator fullWidth required className={gClasses.vgSpacing}
					label="Member Id" type="number"
					value={emurName}
					onChange={(event) => { setEmurName(Number(event.target.value)) }}
				/>
				<br />
				<div style={{paddingLeft: "10px"}} >
				<VsCheckBox align="left" label="Super Admin" checked={isSuper} onClick={() => setIsSuper(!isSuper)} />
				<br />
				<VsCheckBox align="left" label="PJYM Admin" checked={isPjym} onClick={() => setIsPjym(!isPjym)} />
				<br />
				<VsCheckBox align="left" label="Humad Admin" checked={isHumad} onClick={() => setIsHumad(!isHumad)} />
				<br />
				<VsCheckBox align="left" label="PRWS Admin" checked={isPrws} onClick={() => setIsPrws(!isPrws)} />
				<br />
				</div>
				<ShowResisterStatus/>
				<BlankArea />
				<VsButton align="center" name={"Add new Administrator"} />
				</ValidatorForm>
			}
			{(isDrawerOpened === "EDIT") &&   
				<ValidatorForm className={gClasses.form} onSubmit={editAdminSubmit}>
				<Typography align="center" className={gClasses.title}>Edit Administrator permissions</Typography>
				<Typography align="center" className={gClasses.title}>for</Typography>
				<Typography align="center" className={gClasses.title}>{emurName}</Typography>
				<br />
				<div style={{paddingLeft: "10px"}} >
				<VsCheckBox align="left" label="Super Admin" checked={isSuper} onClick={() => setIsSuper(!isSuper)} />
				<br />
				<VsCheckBox align="left" label="PJYM Admin" checked={isPjym} onClick={() => setIsPjym(!isPjym)} />
				<br />
				<VsCheckBox align="left" label="Humad Admin" checked={isHumad} onClick={() => setIsHumad(!isHumad)} />
				<br />
				<VsCheckBox align="left" label="PRWS Admin" checked={isPrws} onClick={() => setIsPrws(!isPrws)} />
				<br />
				</div>
				<ShowResisterStatus/>
				<BlankArea />
				<VsButton align="center" name={"Update Administrator permissions"} />
				</ValidatorForm>
			}
		</Box>
		</Drawer>
		</div>
	);
}
 