import React, { useState, useContext, useEffect, useRef } from 'react';
import {  CssBaseline } from '@material-ui/core';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Container from '@material-ui/core/Container';

import Divider from '@material-ui/core/Divider';
import Tooltip from "react-tooltip";
import Select from "@material-ui/core/Select";
import MenuItem from '@material-ui/core/MenuItem'; 
import Menu from '@material-ui/core/Menu'; 
//import SubMenu from '@material-ui/core/SubMenu'; 
//import Avatar from '@material-ui/core/Avatar';
import lodashCloneDeep from 'lodash/cloneDeep';
import lodashSortBy from "lodash/sortBy";
import lodashMap from "lodash/map";
//import IconButton from '@material-ui/core/IconButton';

import VsButton from "CustomComponents/VsButton";
import VsCancel from "CustomComponents/VsCancel";
import VsRadio from "CustomComponents/VsRadio";
import VsRadioGroup from "CustomComponents/VsRadioGroup";
import VsCheckBox from "CustomComponents/VsCheckBox";
import VsSelect from "CustomComponents/VsSelect";

//import { useLoading, Audio } from '@agney/react-loading';
import axios from "axios";
import Drawer from '@material-ui/core/Drawer';
//import { useAlert } from 'react-alert'

import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import 'react-step-progress/dist/index.css';
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// styles
import globalStyles from "assets/globalStyles";

//icons
//import MoveUp    from '@material-ui/icons/ArrowUpwardRounded';
//import MoveDown  from '@material-ui/icons/ArrowDownwardRounded';
//import InfoIcon  from 	'@material-ui/icons/Info';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import {
	BlankArea,
	DisplayMemberHeader, PersonalHeader, PersonalMember, DisplaySingleTip,
} from "CustomComponents/CustomComponents.js"

import {
	ADMIN, APPLICATIONTYPES, SELECTSTYLE,
  PADSTYLE,
	MEMBERTITLE, RELATION, SELFRELATION, GENDER, BLOODGROUP, MARITALSTATUS,
	STATUS_INFO,
} from "views/globals.js";


import { 
  displayType, getWindowDimensions,
	decrypt, dispMobile, dispEmail, disableFutureDt,
	isMobile, 
	dateString,
	getImageName,
	vsDialog, vsInfo,
	getMemberName,
	getRelation, dispAge, capitalizeFirstLetter,
	getMemberTip,
	getAdminInfo,
	applicationSuccess,
	showSuccess, showError,
} from "views/functions.js";

import SplitFamily from "views/Member/SplitFamily";
import CeasedMember from "views/Member/CeasedMember";
import TransferMember from "views/Member/TransferMember";
import NewHod from "views/Member/NewHod";
import MemberAddEdit from "views/Member/MemberAddEdit";

import {
	readAllMembers, memberGetByHidMany, memberUpdateMany,
} from "views/clientdbfunctions";



const InitialContextParams = {show: false, x: 0, y: 0};
var radioMid = -1;
//var familyCity = "";


export default function MemberPersonal(props) {
	//console.log(props);
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  const [dispType, setDispType] = useState("lg");
  
	const loginHid = parseInt(sessionStorage.getItem("hid"), 10);
	const loginMid = parseInt(sessionStorage.getItem("mid"), 10);
	const isMember = props.isMember;
	const adminInfo = getAdminInfo();
		
	const gClasses = globalStyles();
	//const alert = useAlert();

	const [hodRec, setHodRec] = useState({});
	const [memberArray, setMemberArray] = useState([])
	const [selMember, setSelMember] = useState({mid: 0});

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


	const [hodRadio, setHodRadio] = useState(1);
	const [emurList, setEmurList] = useState([]);
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
			var myMemArray = JSON.parse(sessionStorage.getItem("member_members"));
			setMemberArray(myMemArray);
			var ccc = myMemArray.find(x => x.mid === myHodRec.mid);
			if (!ccc) showError(`F.Head of family ${myHodRec.hid} not in list. May be ceased`);
		}

		getDetails();
		
		handleResize();
		window.addEventListener('resize', handleResize);
		let handler = (e) => {
			console.log("In handler");
			if (menuRef.current.contains(e.target)) {
				console.log("Inside");
				setContextParams({show: false});
				console.log(menuRef);		
			}
		}
		
    return () => window.removeEventListener('resize', handleResize);
    
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
        myMsg = `Unknown F.Head update error`;
        break;
			case 2001:
				myMsg = `No F.Head selected for new family`;
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

	// move up / down member 
	async function handleScrollUpMember(memRec) {
		//handleMemPerContextMenuClose();
		//console.log(radioMid);
		//let index = memberArray.findIndex(x => x.mid === memRec.mid);
		//let tmpArray = [].concat(memberArray);
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/member/scrollup/${memRec.mid}`
			var resp = await axios.get(myUrl);
			//showSuccess("Successfuly");
			setMemberArray(resp.data);
			memberUpdateMany(resp.data);
			sessionStorage.removeItem("member_members");
			sessionStorage.setItem("member_members", JSON.stringify(resp.data));
		} catch (e) {
			console.log(e);
			showError(`Error moving up member`);
		}	
	}

	async function handleScrollDownMember(memRec) {
		//handleMemPerContextMenuClose();
		//let index = radioRecord;
		//let index = memberArray.findIndex(x => x.mid === radioMid);
		//let tmpArray = [].concat(memberArray);
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/member/scrolldown/${memRec.mid}`
			var resp = await axios.get(myUrl);
			//showSuccess("Successfuly");
			//console.log(resp.data);
			setMemberArray(resp.data);
			memberUpdateMany(resp.data);
			sessionStorage.removeItem("member_members");
			sessionStorage.setItem("member_members", JSON.stringify(resp.data));
		} catch (e) {
			console.log(e);
			showError(`Error scrolling down member`);
		}	
	}



function DisplayPersonalInformation() {
	if (memberArray.length === 0) return false;
	return (
	<div key="MEMBERLIST">
	<PersonalHeader dispType={dispType} />
	{memberArray.map( (m, index) => {
		if (m.ceased) return null;
		return (
			<PersonalMember key={"MEMBER"+index} m={m} dispType={dispType}  index={index} 
					onClick={(event) => { radioMid = m.mid; handleMemberPersonalContextMenu(event); }}
					datatip={getMemberTip(m, dispType, props.city)} />
		)}
	)}
	{contextParams.show && <MemberPersonalContextMenu /> }		
	</div>	
	)}


 
	function MemberPersonalContextMenu() {
		//console.log(contextParams);
		var myStyle={top: `${contextParams.y}px` , left: `${contextParams.x}px` };
		var memberRecord = memberArray.find(x => x.mid === radioMid);
		if (!memberRecord) return;
		var myIndex = memberArray.findIndex(x => x.mid === radioMid);
		//console.log(myIndex);
		let isFamilyMember = (memberArray[0].hid === loginHid);
		let admin = ((adminInfo & (ADMIN.superAdmin | ADMIN.prwsAdmin)) !== 0); 
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
		onClose={handleMemPerContextMenuClose}
	>
		<Typography className={gClasses.patientInfo2Blue} style={{paddingLeft: "5px", paddingRight: "5px"}}>{memberRecord.firstName + " " + memberRecord.lastName}</Typography>
		<Divider />
		<MenuItem disabled={!isFamilyMember && !admin} onClick={() => { handleMemPerContextMenuClose(); handlePersonalEdit(memberRecord) } }>
			<Typography>Edit</Typography>
		</MenuItem>
		<MenuItem disabled={(myIndex <= 1) || (!isFamilyMember && !admin)} onClick={() => {handleMemPerContextMenuClose(); handleScrollUpMember(memberRecord) } }>
			<Typography>Scroll Up</Typography>
		</MenuItem>	
		<MenuItem disabled={(myIndex == 0) || (myIndex == (memberArray.length -1)) || (!isFamilyMember && !admin) } onClick={() => {handleMemPerContextMenuClose();  handleScrollDownMember(memberRecord)} }>
			<Typography>Scroll Down</Typography>
		</MenuItem>	
		<MenuItem disabled={(!isFamilyMember && !admin)} onClick={() => { handleMemPerContextMenuClose(); handlePersonalTransfer(memberRecord) } }>
			<Typography>Move</Typography>
		</MenuItem>
		<MenuItem disabled={!isFamilyMember && !admin} onClick={() => {handleMemPerContextMenuClose(); handleMarriage(memberRecord); } } >
			<Typography>Marriage</Typography>
		</MenuItem>
		<MenuItem disabled={(myIndex == 0) || (!isFamilyMember && !admin)} onClick={() => { handleMemPerContextMenuClose(); newHOD(memberRecord) } }>
			<Typography>New F.Head</Typography>
		</MenuItem>
		<MenuItem disabled={!isFamilyMember && !admin} onClick={() => {handleMemPerContextMenuClose(); ceasedMember(memberRecord); } } >
			<Typography>Ceased</Typography>
		</MenuItem>
		{/*<MenuItem disabled={(myIndex == 0) || (!isFamilyMember && !admin) } onClick={() => {handleMemPerContextMenuClose(); handleSplitFamily("APPLYSPLIT", memberRecord) } } >
			<Typography>Split family</Typography>
		</MenuItem>*/}
	</Menu>	
	</div>
	)}
	
	const handleMemberPersonalContextMenu = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
		//console.log("In handleMemberPersonalContextMenu");
		e.preventDefault();
		setGrpAnchorEl(e.currentTarget);
		//console.log(e.currentTarget);
		//console.log(radioMid);
		const {pageX, pageY } = e;
		//console.log(pageX, pageY);
		setContextParams({show: true, x: pageX, y: pageY});
	}
	
	 
 function handleMemPerContextMenuClose() { setContextParams({show: false, x: 0, y: 0}); }

	function DisplayAllToolTips() {
	return(
		<div>
		{memberArray.map( t =>
			<DisplaySingleTip key={"MEMBERTIP"+t.mid} id={"MEMBER"+t.mid} />
		)}
		</div>
	)}
	
	function handleMarriage(memRec) {
		console.log("In marriage option");
		showInfo("Marriage setting to be shifted to Spouse page");
	}
	

	// Ceased Member
	function ceasedMember(memRec) {
		//let m = memberArray.find(x => x.mid === memRec.mid);
		vsDialog("Ceased", `Are you sure you want to set ${getMemberName(memRec)} as ceased?`,
		{label: "Yes", onClick: () => ceasedMemberConfirm(memRec) },
		{label: "No" }
		);
	}
	
	function ceasedMemberConfirm(m) {
		setSelMember(m);
		setIsDrawerOpened("CEASED");
	}

	function handleCeasedMemberBack(sts) {
		if (sts.status === STATUS_INFO.ERROR) 
			showError(sts.msg); 
		else if (sts.status === STATUS_INFO.SUCCESS) {
			showSuccess(sts.msg); 
			// update member list
		}
		else if (sts.status === STATUS_INFO.INFO) {
			console.log("In info");
			vsInfo("Applied for ceased", sts.msg,
				{label: "Okay"}
			);
		}
		setIsDrawerOpened("");
	}
				

	
	// --- New Hod
	
	function newHOD(rec) {
		vsDialog("New F.Head", `Are you sure you want to set ${getMemberName(rec)} as F.Head?`,
		{label: "Yes", onClick: () => newHODConfirm(rec) },
		{label: "No" }
		);
	} 

	function newHODConfirm(rec) {	
		setSelMember(rec);
		setIsDrawerOpened("NEWHOD");
	}

	function handleNewHodBack(sts) {
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
	
	
		// Transfer member(s) to another family
	function handlePersonalTransfer(rec) {
		setSelMember(rec);
		setIsDrawerOpened("TRANSFER");
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
	// edit member details

	/// Add new member or edit member
	function handlePersonalAdd() {
		setSelMember(null);
		setIsDrawerOpened("ADD");
	}
	
	// edit personal details
	function handlePersonalEdit(m) {
		setSelMember(m);
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
	
	//console.log(isDrawerOpened);
	return (
	<div className={gClasses.webPage} align="center" key="main">
	<Typography align="right" style={{paddingRight: "10px"}}  className={gClasses.patientInfo2Blue} onClick={handlePersonalAdd} >Add Member</Typography>
	<DisplayPersonalInformation />
	<DisplayAllToolTips />
	<Drawer style={{ width: "100%"}} anchor="top" variant="temporary" open={isDrawerOpened != ""} >
	<Container component="main" maxWidth="xs">	
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} style={{paddingLeft: "5px", paddingRight: "5px"}} >
	<VsCancel align="right" onClick={() => { setIsDrawerOpened("")}} />
	{(isDrawerOpened === "CEASED") &&
		<CeasedMember memberList={memberArray} hodMid={hodRec.mid} selectedMid={selMember.mid} onReturn={handleCeasedMemberBack} />
	}
	{(isDrawerOpened === "TRANSFER") &&
		<TransferMember memberList={memberArray} hodMid={hodRec.mid} selectedMid={selMember.mid} onReturn={handlePersonalTransferBack} />
	}
	{(isDrawerOpened === "NEWHOD") &&
		<NewHod memberList={memberArray} hodMid={hodRec.mid} selectedMid={selMember.mid} onReturn={handleNewHodBack} />
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
