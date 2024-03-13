import React, { useState, useContext, useEffect, useRef } from 'react';
import {  CssBaseline } from '@material-ui/core';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Divider from '@material-ui/core/Divider';
import Container from '@material-ui/core/Container';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from "react-tooltip";

import MenuItem from '@material-ui/core/MenuItem'; 
import Menu from '@material-ui/core/Menu'; 

import lodashCloneDeep from 'lodash/cloneDeep';
import lodashSortBy from "lodash/sortBy";
import lodashMap from "lodash/map";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import InfoIcon  from 	'@material-ui/icons/Info';

import VsButton from "CustomComponents/VsButton";
import VsCancel from "CustomComponents/VsCancel";
import VsRadio from "CustomComponents/VsRadio";
import VsRadioGroup from "CustomComponents/VsRadioGroup";
import VsCheckBox from "CustomComponents/VsCheckBox";
//import VsSelect from "CustomComponents/VsSelect";
//import VsTextFilter from "CustomComponents/VsTextFilter";
//import VsList from "CustomComponents/VsList";


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

 import MemberAddEdit from "views/Member/MemberAddEdit";
 

//const BlankMemberData = {firstName: "", middleName: "", lastName: ""};

import {
	BlankArea,
	DisplayMemberHeader,
	PersonalOffice,
	DisplaySingleTip,
} from "CustomComponents/CustomComponents.js"

import {
	ADMIN,
  PADSTYLE,
	MEMBERTITLE, RELATION, SELFRELATION, GENDER, BLOODGROUP, MARITALSTATUS,
	DATESTR, MONTHNUMBERSTR,
	CASTE, HUMADSUBCASTRE,
	STATUS_INFO,
} from "views/globals.js";


import { 
  displayType, getWindowDimensions,
  isMobile,
	getAdminInfo,
	getImageName,
	vsDialog,
	getMemberName, getMemberTip, getOfficeTip,
	dispAge, 
	showSuccess, showError, showInfo,
} from "views/functions.js";

import { 
	decrypt, dispMobile, dispEmail, disableFutureDt,
} from 'views/functions';
import {  } from 'views/functions';

//import { update } from 'lodash';
//import { updateCbItem } from 'typescript';

const InitialContextParams = {show: false, x: 0, y: 0};


export default function MemberOffice(props) {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  const [dispType, setDispType] = useState("lg");
  
	const loginHid = parseInt(sessionStorage.getItem("hid"), 10);
	const loginMid = parseInt(sessionStorage.getItem("mid"), 10);
	const isMember = props.isMember;
	const adminInfo = getAdminInfo();
	
	const gClasses = globalStyles();
	const alert = useAlert();

	const [memberArray, setMemberArray] = useState([])

	const [currentMemberData, setCurrentMemberData] = useState({});
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
	const [currentSelection, setCurrentSelection] = useState("");

	const [emurGroomArray, setEmurGroomArray] = useState([]);
	const [emurBrideArray, setEmurBrideArray] = useState([]);
	const [emurDomArray, setEmurDomArray] = useState([]);

	const [selMember, setSelMember] = useState({mid: 0});
	const [hodRec, setHodRec] = useState({});

	const [hodRadio, setHodRadio] = useState(1);
	const [cbList, setCbList] = useState([]);
	const [isDrawerOpened, setIsDrawerOpened] = useState("");
	
	const [emurGotra, setEmurGotra] = useState("");
	const [emurVillage, setEmurVillage] = useState("");
	const [emurPinCode, setEmurPincCode] = useState("");
	const [emurResPhone1, setEmurResPhone1] = useState("");
	const [emurResPhone2, setEmurResPhone2] = useState("");
	const [emurPinResp, setEmurPinResp] = useState({});

	const [emurAddr1, setEmurAddr1] = useState("");
	const [emurAddr2, setEmurAddr2] = useState("");
	const [emurAddr3, setEmurAddr3] = useState("");
	const [emurAddr4, setEmurAddr4] = useState("");
	const [emurAddr5, setEmurAddr5] = useState("");
	const [emurAddr6, setEmurAddr6] = useState("");
	const [emurAddr7, setEmurAddr7] = useState("");
	const [emurAddr8, setEmurAddr8] = useState("");
	const [emurAddr9, setEmurAddr9] = useState("");
	const [emurAddr10, setEmurAddr10] = useState("");
	const [emurAddr11, setEmurAddr11] = useState("");
	const [emurAddr12, setEmurAddr12] = useState("");
	const [emurAddr13, setEmurAddr13] = useState("");

	const [registerStatus, setRegisterStatus] = useState(0);

	const [contextParams, setContextParams] = useState(InitialContextParams);
	const [grpAnchorEl, setGrpAnchorEl] = React.useState(null);
	const grpOpen = Boolean(grpAnchorEl);
	let menuRef = useRef();

	
  useEffect(() => {	
    function handleResize() {
			let myDim = getWindowDimensions();
      setWindowDimensions(myDim);
      //console.log(displayType(myDim.width));
      setDispType(displayType(myDim.width));
		}
		const getDetails = async () => {	
			var myHodRec = JSON.parse(sessionStorage.getItem("member_hod"));
			setHodRec(myHodRec);		
			setMemberArray(JSON.parse(sessionStorage.getItem("member_members")));
		}
		getDetails();
		handleResize();
		window.addEventListener('resize', handleResize);
    
  }, []);


	function DisplayRegisterStatus() {
    // console.log(`Status is ${registerStatus}`);
		let regerr = true;
    let myMsg;
    switch (registerStatus) {
      case 0:
        myMsg = "";
				regerr = false;
        break;
      case 1001:
        myMsg = `Invalid Pin Code`;
        break;
      case 1002:
        myMsg = `Unknown HOD update error`;
        break;
			case 2001:
				myMsg = `No HOD selected for new family`;
				break;
			case 2002:
				myMsg = `No member(s) selected for new family`;
				break;
				default:
          myMsg = "Unknown Error";
          break;
    }
    return(
      <div>
        <Typography className={(regerr) ? gClasses.error : gClasses.nonerror}>{myMsg}</Typography>
      </div>
    )
  }

	function handlePersonalTransferBack(sts) {
		if ((sts.msg !== "") && (sts.status === STATUS_INFO.ERROR)) showError(sts.msg); 
		else if ((sts.msg !== "") && (sts.status === STATUS_INFO.SUCCESS)) showSuccess(sts.msg); 
		
		if (sts.status == STATUS_INFO.SUCCESS) {
		}
		else {
			console.log("Yaha kaise aaya");
		}
		setIsDrawerOpened("");
	}
	
	function DisplayOfficeButtons() {
		//console.log("Curent", radioRecord);
		if (memberArray.length === 0) return null;
		let edit = (memberArray[0].hid === loginHid);
		if ((adminInfo & ADMIN.superAdmin) !== 0)  edit = true;
		if  (!edit) return null;
	return(
	<div align="right">
		<VsButton name="Edit Details" onClick={handleOfficeEdit} />
	</div>
	)}

	function old_handleOfficeEdit() {
		handleOfficeContextMenuClose()
		let m = memberArray.find(x => x.order === radioRecord);
		//console.log(m);
		setEmurAddr1(m.education);
		setEmurAddr2(m.officeName)
		setEmurAddr3(m.officePhone)
		setEmurAddr4(getMemberName(m));
		
		
		setIsDrawerOpened("EDIT");
	}

	function handleOfficeEdit() {
		handleOfficeContextMenuClose()
		let m = memberArray.find(x => x.order === radioRecord);
		setSelMember(m);
		
		//console.log(m);
/*
		setEmurAddr1(m.education);
		setEmurAddr2(m.officeName)
		setEmurAddr3(m.officePhone)
		setEmurAddr4(getMemberName(m));
		setIsDrawerOpened("EDITOFFICE");			// "EDITOFFICE" is old. TO be finally discarded
*/

		setIsDrawerOpened("EDIT");
	}

	function handleAddEditBack(sts) {
		console.log(sts);
		if ((sts.msg !== "") && (sts.status === STATUS_INFO.ERROR)) showError(sts.msg); 
		else if ((sts.msg !== "") && (sts.status === STATUS_INFO.SUCCESS)) showSuccess(sts.msg); 
		
		if (sts.status == STATUS_INFO.SUCCESS) {
		}
		else {
			console.log("Yaha kaise aaya");
		}
		setIsDrawerOpened("");
	}
	
	function handleEditOfficeSubmit() {
		let m = memberArray.find(x => x.order === radioRecord);
		m.education = emurAddr1;
		m.officeName = emurAddr2;
		m.officePhone = emurAddr3;
		setIsDrawerOpened("");
		alert.success("Updated. Press 'Update office Details' once office details of all member are done");
	}

	function DisplayAllToolTips() {
	return(
		<div>
		{memberArray.map( t =>
			<DisplaySingleTip key={"MEMBER"+t.mid} id={"MEMBER"+t.mid} />
		)}
		</div>
	)}
  
	const handleMemberOfficeContextMenu = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
		e.preventDefault();
		setGrpAnchorEl(e.currentTarget);
		const {pageX, pageY } = e;
		//console.log(pageX, pageY);
		setContextParams({show: true, x: pageX, y: pageY});
	}
		
	function handleOfficeContextMenuClose() { setContextParams({show: false, x: 0, y: 0}); }
 
  
	function MemberOfficeContextMenu() {
		/*let family = (memberArray[0].hid === loginHid);
		let admin = ((adminInfo & (ADMIN.superAdmin | ADMIN.prwsAdmin)) !== 0);
		//console.log(myIndex, family, admin);
		if (!family && !admin) return;
		
		
		if (!tmp) return;
		var myIndex = memberArray.findIndex(x => x.mid === radioMid);
		//console.log(memberArray[0].hid, loginHid);
		
    let myName = tmp.firstName + " " + tmp.lastName;
		//console.log(contextParams);
		var myStyle={top: `${contextParams.y}px` , left: `${contextParams.x}px` };
		//console.log(myStyle);
		//console.log(grpAnchorEl);
		//anchorEl={grpAnchorEl}	
		//console.log(myIndex);*/
		//console.log(memberArray, radioRecord);
		var tmp = memberArray.find(x => x.order === radioRecord);
		var myIndex = 2;
		var myStyle={top: `${contextParams.y}px` , left: `${contextParams.x}px` };
	return(
	<div ref={menuRef} className='absolute z-20' style={myStyle}>
	<Menu
		id="memberpersonal-menu"
		anchorEl={grpAnchorEl}
		anchorOrigin={{
			vertical: 'top',
			horizontal: 'center',
		}}
		// keepMounted
		transformOrigin={{
			vertical: 'top',
			horizontal: 'center',
		}}
		open={contextParams.show}
		onClose={handleOfficeContextMenuClose}
	>
		<Typography className={gClasses.patientInfo2Blue} style={{paddingLeft: "5px", paddingRight: "5px"}}>{tmp.firstName + " " + tmp.lastName}</Typography>
		<Divider />
		<MenuItem onClick={handleOfficeEdit}>
			<Typography>Edit</Typography>
		</MenuItem>
	</Menu>	
	</div>
	)}
	
	function DisplayOfficeInformation() {
		let lastItemIndex =  memberArray.length-1;
    //console.log(dispType);
		if (memberArray.length === 0) return null;
		let edit = (memberArray[0].hid === loginHid);
		if ((adminInfo & ADMIN.superAdmin) !== 0) edit = true;
		return (
		<div>
		{memberArray.map( (m, index) => {
			let myInfo = getMemberTip(m, dispType, props.city);		// + "<br />" + getOfficeTip(m, dispType);
			return (
				<PersonalOffice key={"Office"+m.mid} m={m} dispType={dispType}  index={index} 
					checked={radioRecord == m.order} onClick={(event) => { setRadioRecord(m.order); handleMemberOfficeContextMenu(event); } }
					datatip={myInfo} 
				/>
			)}
		)}	
		{contextParams.show && <MemberOfficeContextMenu /> }	
		</div>	
	)}
	
	function handleDate1(d) {
		setEmurDate1(d);
	}

	function handleDateArray(index, e) {
		console.log(index);
		console.log(e);
		let tmp = [].concat(domMomemtArray);
		tmp[index] = e;
		setDomMomemtArray(tmp);
	}


	function updateCbItem(index) {
		let tmp = [].concat(cbList);
		tmp[index] = !tmp[index];
		setCbList(tmp);
		if ((!tmp[index]) && (hodRadio === index))
		setHodRadio(0);
	}

	function updateHodRadio(index) {
		if (cbList[index])
			setHodRadio(index);
	}
	
	
	return (
	<div className={gClasses.webPage} align="center" key="main">
		{/*<DisplayOfficeButtons />*/}
	<DisplayOfficeInformation />
	<DisplayAllToolTips />
	<Drawer style={{ width: "100%"}} anchor="top" variant="temporary" open={isDrawerOpened != ""} >
	<Container component="main" maxWidth="xs">	
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} style={{paddingLeft: "5px", paddingRight: "5px"}} >
	<VsCancel align="right" onClick={() => { setIsDrawerOpened("")}} />
	{(isDrawerOpened === "EDITOFFICE") &&
		<Container component="main" maxWidth="xs">	
		<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} style={{paddingLeft: "5px", paddingRight: "5px"}} >
		<VsCancel align="right" onClick={() => { setIsDrawerOpened("")}} />
		<ValidatorForm align="left" className={gClasses.form} onSubmit={handleEditOfficeSubmit}>
		<Typography align="center" style={PADSTYLE} className={gClasses.title}>{"Edit office details of "+emurAddr4}</Typography>
		<BlankArea />
			<Grid key="ADEDITMEMBERGENERAL" className={gClasses.noPadding} container  alignItems="flex-start" >
			<Grid style={{margin: "20px"}} item xs={12} sm={12} md={12} lg={12} />
			<Grid item xs={4} sm={4} md={4} lg={4} >
				<Typography style={{marginTop: "20px"}} className={gClasses.patientInfo2Blue} >Qualification</Typography>
			</Grid>
			<Grid align="left" item xs={8} sm={8} md={8} lg={8} >
				<TextValidator fullWidth className={gClasses.vgSpacing}
					label="Qualification" type="text"
					value={emurAddr1}
					onChange={(event) => { setEmurAddr1(event.target.value) }}			
				/>
			</Grid>
			<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />

			<Grid item xs={4} sm={4} md={4} lg={4} >
				<Typography style={{marginTop: "20px"}} className={gClasses.patientInfo2Blue} >Office Details</Typography>
			</Grid>
			<Grid align="left" item xs={8} sm={8} md={8} lg={8} >
				<TextValidator  fullWidth className={gClasses.vgSpacing}
					label="Office Details" type="text"
					value={emurAddr2}
					onChange={(event) => { setEmurAddr2(event.target.value) }}			
				/>
			</Grid>
			<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />

			<Grid item xs={4} sm={4} md={4} lg={4} >
				<Typography style={{marginTop: "20px"}}  className={gClasses.patientInfo2Blue} >Office Phone</Typography>
			</Grid>
			<Grid align="left" item xs={8} sm={8} md={8} lg={8} >
				<TextValidator className={gClasses.vgSpacing}
					label="Office Phone" type="text"
					value={emurAddr3}
					onChange={(event) => { setEmurAddr3(event.target.value) }}			
				/>
			</Grid>
			<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
		</Grid>
		<br />
		<VsButton align="center" name="Update" type="submit" />
		<br />
		</ValidatorForm>
		</Box>
		</Container>
	}	
	{((isDrawerOpened === "ADD") || (isDrawerOpened === "EDIT")) &&
		<MemberAddEdit mode={isDrawerOpened} hodMid={hodRec.mid} memberRec={selMember} onReturn={handleAddEditBack}/>
	}
	</Box>
	</Container>
	</Drawer>
	<ToastContainer />	
  </div>
  );    
}
