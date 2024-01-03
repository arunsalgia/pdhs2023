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
import NewHod from "views/Member/NewHod";
import MemberAddEdit from "views/Member/MemberAddEdit";


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
			setHodRec(JSON.parse(sessionStorage.getItem("member_hod")));
			setMemberArray(JSON.parse(sessionStorage.getItem("member_members")));
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

	// move up / down member 
	async function handleMoveUpMember(memRec) {
		//handleMemPerContextMenuClose();
		//console.log(radioMid);
		//let index = memberArray.findIndex(x => x.mid === memRec.mid);
		//let tmpArray = [].concat(memberArray);
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/member/scrollup/${memRec.mid}`
			var resp = await axios.get(myUrl);
			//showSuccess("Successfuly");
			setMemberArray(resp.data);
			sessionStorage.setItem("member_members", JSON.stringify(resp.data));
		} catch (e) {
			console.log(e);
			showError(`Error moving up member`);
		}	
	}

	async function handleMoveDownMember(memRec) {
		//handleMemPerContextMenuClose();
		//let index = radioRecord;
		//let index = memberArray.findIndex(x => x.mid === radioMid);
		//let tmpArray = [].concat(memberArray);
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/member/scrolldown/${memRec.mid}`
			var resp = await axios.get(myUrl);
			//showSuccess("Successfuly");
			console.log(resp.data);
			setMemberArray(resp.data);
			sessionStorage.setItem("member_members", JSON.stringify(resp.data));
		} catch (e) {
			console.log(e);
			showError(`Error scrolling down member`);
		}	
	}


	async function handleEditPersonalSubmit() {

	}

	// add new member
	function handlePersonalAdd() {

	}

	// Transfer member to another family
	function handlePersonalTransfer() {
		setIsDrawerOpened("TRANSFER");
	}

	
	function handlePersonalMergeFamily() {
		setIsDrawerOpened("MERGEFAMILY");
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
		<MenuItem disabled={(myIndex == 0) || (!isFamilyMember && !admin)} onClick={() => {handleMemPerContextMenuClose(); handleMoveUpMember(memberRecord) } }>
			<Typography>Move Up</Typography>
		</MenuItem>	
		<MenuItem disabled={(myIndex == 0) || (myIndex == (memberArray.length -1)) || (!isFamilyMember && !admin) } onClick={() => {handleMemPerContextMenuClose();  handleMoveDownMember(memberRecord)} }>
			<Typography>Move Down</Typography>
		</MenuItem>	
		<MenuItem disabled={(myIndex == 0) || (!isFamilyMember && !admin)} onClick={() => { handleMemPerContextMenuClose(); newHOD(memberRecord) } }>
			<Typography>New Hod</Typography>
		</MenuItem>
		<MenuItem disabled={!isFamilyMember && !admin} onClick={() => {handleMemPerContextMenuClose(); ceasedMember(memberRecord); } } >
			<Typography>Ceased</Typography>
		</MenuItem>
		<MenuItem disabled={(myIndex == 0) || (!isFamilyMember && !admin) } onClick={() => {handleMemPerContextMenuClose(); handleSplitFamily("APPLYSPLIT", memberRecord) } } >
			<Typography>Split family</Typography>
		</MenuItem>
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
 
 function jumpFamily() { handleMemPerContextMenuClose(); console.log("Hello"); }
	
	function DisplayAllToolTips() {
	return(
		<div>
		{memberArray.map( t =>
			<DisplaySingleTip key={"MEMBERTIP"+t.mid} id={"MEMBER"+t.mid} />
		)}
		</div>
	)}
	
if (false) {
	//============= Junked  Start

	const junkhandlePrwsContextMenu = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
		e.preventDefault();
		setGrpAnchorEl(e.currentTarget);
		//console.log(e.currentTarget);
		//console.log(radioMid);
		const {pageX, pageY } = e;
		console.log(pageX, pageY);
		setContextParams({show: true, x: pageX, y: pageY});
	}
	
	 
	function junkedsplitFamily(cmd, selRecord) {
		let tmp = [];
		for(let i=1; i<memberArray.length; ++i) 
		tmp.push({
			hid: memberArray[i].hid, 
			mid: memberArray[i].mid, 
			name: getMemberName(memberArray[i]),
			transfer: (i === selRecord),
			hod: (i === selRecord)
		});
		setEmurList(tmp);
		setIsDrawerOpened(cmd);
	}

	async function handleApplySplitFamily() {
		let hodMid = memberArray[hodRadio].mid;
		//console.log(hodMid);
		//let midList = [];
		//for(let i=0; i<memberArray.length; ++i) {
		//	if (emurList[i]) midList.push({hid: memberArray[i].hid, mid: memberArray[i].mid,  ishod: memberArray[i].mid === hodMid });
		//}
		//console.log(midList);
		
		let tmp = encodeURIComponent(JSON.stringify({
			owner: 'PRWS',
			desc: APPLICATIONTYPES.splitFamily,
			name: sessionStorage.getItem("userName"),
			hid: loginHid,
			mid: loginMid,
			isMember: isMember,
			data: emurList.filter(x => x.transfer)
		}));
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/application/add/${tmp}`;
			let resp = await axios.get(myUrl);
			applicationSuccess(resp.data);
		} catch (e) {
			console.log(e);
			showError(`Error applying for split family`);
		}
		setIsDrawerOpened("");
	}
	
	async function handleUpdateSplitFamily() {
		
	}

	
	function updateSPtransfer(index, isSet) {	
		if (!isSet) {
			// check if this is the only person selected for transfer. 
			// If YES then no action. Min 1 member has to be transferred
			if (emurList.filter(x => x.transfer).length === 1) return;
			// no then uncheck this member
			let tmp = lodashCloneDeep(emurList);
			tmp[index].transfer = false;
			if (tmp[index].hod) {
				tmp[index].hod = false;
				for(var i=0; i<tmp.length; ++i) {
					if (tmp[i].transfer) { tmp[i].hod = true; break; }
				}
			}
			setEmurList(tmp);
		} else {
			let tmp = lodashCloneDeep(emurList);
			tmp[index].transfer = true;
			setEmurList(tmp);
		}
	}

	function updateSPhod(index, isSet) {
		console.log(emurList);
		// check if this person is selected for transfer. If not, cannot make him
		if (isSet && !emurList[index].transfer) return;
		let tmp = lodashCloneDeep(emurList);
		for(var i=0; i<tmp.length; ++i) {
			tmp[i].hod = (index === i);
		}
		setEmurList(tmp);
	}
	
	
	function handleNewFamilySubmit() {
		if (isDrawerOpened === "APPLYSPLIT")
			handleApplySplitFamily();
		else
			handleUpdateSplitFamily();
	}


	// display member personal details (buttons also if user belongs to current family or is admin)
	function JunkedDisplayPersonalButtons() {
		if (memberArray.length === 0) return null;
		
		let family = (memberArray[0].hid === loginHid);
		let admin = (adminInfo & (ADMIN.superAdmin | ADMIN.prwsAdmin) !== 0);
		let lastItemIndex =  memberArray.length-1;
		let showUp = true;
		let showDown = true;
		//console.log(radioRecord, lastItemIndex);
		if (radioRecord <= 1) showUp = false;
		if ((radioRecord === 0) || (radioRecord === lastItemIndex)) showDown = false;
	return(
	<div>
		{(family || admin) &&
			<div align="right">
				<VsButton name="Pjym" onClick={() => samitiMembership("PJYM") } />
				<VsButton name="Humad" onClick={() => samitiMembership("HUMAD") } />
				{ (false) &&
				<div>
        {(radioRecord == 0) &&
				<VsButton name="Merge Family" onClick={() => splitFamily("APPLYSPLIT", radioRecord) } />
        }
        {(radioRecord != 0) &&
				<VsButton name="Split Family" onClick={() => splitFamily("APPLYSPLIT", radioRecord) } />
        }
				<VsButton name="Ceased" disabled={radioRecord === 0} onClick={ceasedMember} />
				<VsButton name="New Hod" disabled={radioRecord === 0} onClick={() => newHOD("APPLYHOD") } />
				<VsButton name="Move Up" disabled={!showUp} onClick={handleMoveUpMember} />
				<VsButton name="Move Down" disabled={!showDown} onClick={handleMoveDownMember} />
				<VsButton name="Edit Details" onClick={handlePersonalEdit} />
				</div>
				}
			</div>
		}
		{(false) &&
			<div align="right">
			<VsButton name="Transfer Member" disabled={radioRecord === 0}  onClick={handlePersonalTransfer} />
			<VsButton name="Merge Family" onClick={handlePersonalMergeFamily} />
			<VsButton name="Split Family" onClick={() => splitFamily("EDITSPLIT") }  />
			<VsButton name="Add new Member" onClick={handlePersonalAdd} />
			<VsButton name="Ceased" disabled={radioRecord === 0} onClick={() => ceasedMember("EDITCEASED")} />
			<VsButton name="New Hod" disabled={radioRecord === 0} onClick={() => newHOD("EDITHOD")} />
			<VsButton name="Move Up" disabled={!showUp} onClick={handleMoveUpMember} />
			<VsButton name="Move Down" disabled={!showDown} onClick={handleMoveDownMember} />
			<VsButton name="Edit Details" onClick={handlePersonalEdit} />
			</div>
		}
	</div>
)}


	function handleCeasedMemberSubmit() {
		if (isDrawerOpened === "APPLYCEASED")
			handleApplyCeasedMember();
		else
			handleUpdateCeasedMember();
	}

	async function handleApplyCeasedMember() {
		let hodMid = memberArray[hodRadio].mid;
		console.log(hodMid);
		let ceasedData = {hid: memberArray[radioRecord].hid, mid: memberArray[radioRecord].mid, name: getMemberName(memberArray[radioRecord]), date: emurDate1.toDate()};
		
		let tmp = encodeURIComponent(JSON.stringify({
			owner: 'PRWS',
			desc: APPLICATIONTYPES.memberCeased,
			name: sessionStorage.getItem("userName"),
			hid: loginHid,
			mid: loginMid,
			isMember: isMember,
			data: ceasedData
		}));
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/application/add/${tmp}`;
			let resp = await axios.get(myUrl);
			applicationSuccess(resp.data);
		} catch (e) {
			console.log(e);
			showError(`Error applying for split family`);
		}
		setIsDrawerOpened("");
	}
	
	async function handleUpdateCeasedMember() {
		setIsDrawerOpened("");
		return;
		
		let tmpRec = memberArray.find(x => x.order === radioRecord);
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/member/ceased/${tmpRec.mid}/${emurDate1.toDate().toString()}`
			axios.post(myUrl);
			let tmpArray = memberArray.filter(x => x.order !== radioRecord);
			for(let i=0; i<tmpArray.length; ++i) {
				tmpArray[i].order = i;
			}
			setMemberArray(tmpArray);
			setRadioRecord(0);
			} catch (e) {
			console.log(e);
			showError(`Error setting member as ceased`);
		}	
	}
	
	
	async function ApplyNewHOD() {
		let m = memberArray.find(x => x.mid === radioMid);
		let newHODData = {hid: m.hid, mid: m.mid, name: getMemberName(m)};
		console.log(newHODData);
		
		let tmp = encodeURIComponent(JSON.stringify({
			owner: 'PRWS',
			desc: APPLICATIONTYPES.memberHOD,
			name: sessionStorage.getItem("userName"),
			hid: loginHid,
			mid: loginMid,
			isMember: isMember,
			data: newHODData
		}));
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/application/add/${tmp}`;
			let resp = await axios.get(myUrl);
			applicationSuccess(resp.data);
		} catch (e) {
			console.log(e);
			showError(`Error applying for new hod`);
		}
		setIsDrawerOpened("");
	}
	
	async function UpdateNewHOD() {
		return;
		
		let tmpRec = lodashCloneDeep(memberArray[radioRecord]);
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/member/sethod/${tmpRec.mid}`
			axios.post(myUrl);
			tmpRec.relation = "Self";
			let tmpArray = memberArray.filter(x => x.order !== radioRecord);
			tmpArray[0].relation ="Relative";
			tmpArray = [tmpRec].concat(tmpArray)
			for(let i=0; i<tmpArray.length; ++i) {
				tmpArray[i].order = i;
			}
			setMemberArray(tmpArray);
			setRadioRecord(0);				
		} catch (e) {
			console.log(e);
			showError(`Error fetching HOD details of ${hid}`);
			setCurrentHod({});
		}	
		
	}

	
	//============= Junked End
}

	// Split family
	
	function handleSplitFamily(cmd, selRecord) {
		setSelMember(selRecord);
		setIsDrawerOpened("SPLIT");
	}
	
	function handleSplitFamilyBack(sts) {
		if ((sts.msg !== "") && (sts.status === STATUS_INFO.ERROR)) showError(sts.msg); 
		else if ((sts.msg !== "") && (sts.status === STATUS_INFO.SUCCESS)) showSuccess(sts.msg); 
		
		if (sts.status == STATUS_INFO.SUCCESS) {
		}
		else {
			console.log("Yaha kaise aaya");
		}
		setIsDrawerOpened("");
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
		vsDialog("New HOD", `Are you sure you want to set ${getMemberName(rec)} as Hod?`,
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
	
	// edit member details
	
	function handlePersonalEdit(m) {
		/*//handleMemPerContextMenuClose();		
		//console.log(radioMid);
		//let m = memberArray.find(x => x.mid === radioMid);			//	memberArray[radioRecord];
		setEmurAddr1(m.title);
		setEmurAddr2(m.lastName);
		setEmurAddr3(m.firstName);
		setEmurAddr4(m.middleName);
		setEmurAddr5(m.alias)
		setEmurAddr6(m.relation);
		setEmurAddr7(m.gender)
		setEmurAddr8(m.emsStatus)
		setEmurAddr9(m.bloodGroup);
		setEmurDate1(moment(m.dob));
		setEmurAddr10(m.occupation);
		setEmurAddr11(m.mobile);
		setEmurAddr12(m.mobile1);
		setEmurAddr13(decrypt(m.email));*/
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
	<DisplayPersonalInformation />
	<DisplayAllToolTips />

	<Drawer style={{ width: "100%"}} anchor="top" variant="temporary" open={isDrawerOpened != ""} >
	<Container component="main" maxWidth="xs">	
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} style={{paddingLeft: "5px", paddingRight: "5px"}} >
	<VsCancel align="right" onClick={() => { setIsDrawerOpened("")}} />
	{((isDrawerOpened === "APPLYCEASED") || (isDrawerOpened === "EDITCEASED")) &&
		<Container component="main" maxWidth="xs">	
		<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} style={{paddingLeft: "5px", paddingRight: "5px"}} >
		<VsCancel align="right" onClick={() => { setIsDrawerOpened("")}} />
		<ValidatorForm align="left"  className={gClasses.form} onSubmit={handleCeasedMemberSubmit}>
		<Typography align="center" className={gClasses.title}>{((isDrawerOpened === "EDITCEASED") ? "Update" : "Apply") + " as ceased"}</Typography>
		<br />
		<br />
		<Grid key="ADEDITAPPLYCEASEDMEMBERPERSONAL" className={gClasses.noPadding} container  alignItems="flex-start" >
			<Grid item xs={5} sm={5} md={5} lg={5} >
				<Typography className={gClasses.patientInfo2Blue} >Name</Typography>
			</Grid>		
			<Grid item xs={7} sm={7} md={7} lg={7} >
				<Typography className={gClasses.patientInfo2} >{getMemberName(memberArray[radioRecord])}</Typography>
			</Grid>		
			<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
			<Grid item xs={5} sm={5} md={5} lg={5} >
				<Typography className={gClasses.patientInfo2Blue} >Ceased date</Typography>
			</Grid>
			<Grid item xs={7} sm={7} md={7} lg={7} >
				<Datetime 
					className={gClasses.dateTimeBlock}
					inputProps={{className: gClasses.dateTimeNormal}}
					timeFormat={false} 
					initialValue={emurDate1}
					dateFormat="DD/MM/yyyy"
					isValidDate={disableFutureDt}
					onClose={setEmurDate1}
					closeOnSelect={true}
				/>
			</Grid>
			<Grid style={{margin: "20px"}} item xs={12} sm={12} md={12} lg={12} />
		</Grid>
		<BlankArea />
		<BlankArea />
		<BlankArea />
		<VsButton align="center" name={(isDrawerOpened === "APPLYCEASED") ? "Apply" : "Update"} type="submit" />
		</ValidatorForm>
		</Box>
		</Container>
	}	
	{((isDrawerOpened === "ADDPERSONAL") || (isDrawerOpened === "EDITPERSONAL")) &&
		<Container component="main" maxWidth="xs">	
		<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} style={{paddingLeft: "5px", paddingRight: "5px"}} >
		<VsCancel align="right" onClick={() => { setIsDrawerOpened("")}} />
		<ValidatorForm align="left" className={gClasses.form} onSubmit={handleEditPersonalSubmit}>
		<Typography align="center" className={gClasses.title}>{"Edit details of "+getMemberName(memberArray[radioRecord])}</Typography>
		<br />
		<Grid key="ADEDITMEMBERPERSONAL" className={gClasses.noPadding} container  alignItems="flex-start" >
			<Grid item xs={5} sm={5} md={5} lg={5} >
				<Typography style={{paddingTop: "20px" }} className={gClasses.patientInfo2Blue} >Title</Typography>
			</Grid>
			<Grid item xs={7} sm={7} md={7} lg={7} >
        <VsSelect size="small" align="left" inputProps={{className: gClasses.dateTimeNormal}} style={{paddingLeft: "10px", paddingRight: "10px" }}
        options={MEMBERTITLE} value={emurAddr1} onChange={(event) => { setEmurAddr1(event.target.value); }} />
			</Grid>
			<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
			<Grid item xs={5} sm={5} md={5} lg={5} >
				<Typography style={{paddingTop: "20px" }} className={gClasses.patientInfo2Blue} >Last Name</Typography>
			</Grid>
			<Grid item xs={7} sm={7} md={7} lg={7} >
        <TextValidator required style={{paddingLeft: "10px", paddingRight: "10px" }} className={gClasses.vgSpacing} inputProps={{className: gClasses.dateTimeNormal}}
          label="Last Name" type="text" value={emurAddr2} onChange={(event) => { setEmurAddr2(event.target.value) }} />	
			</Grid>
			<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
			<Grid item xs={5} sm={5} md={5} lg={5} >
				<Typography style={{paddingTop: "20px" }} className={gClasses.patientInfo2Blue} >First Name</Typography>
			</Grid>
			<Grid item xs={7} sm={7} md={7} lg={7} >
        <TextValidator required style={{paddingLeft: "10px", paddingRight: "10px" }} className={gClasses.vgSpacing}
          inputProps={{className: gClasses.dateTimeNormal}} label="First Name" type="text" value={emurAddr3}
          onChange={(event) => { setEmurAddr3(event.target.value) }}			
        />	
			</Grid>
			<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
			<Grid item xs={5} sm={5} md={5} lg={5} >
				<Typography style={{paddingTop: "20px" }} className={gClasses.patientInfo2Blue} >Middle Name</Typography>
			</Grid>
			<Grid item xs={7} sm={7} md={7} lg={7} >
        <TextValidator required style={{paddingLeft: "10px", paddingRight: "10px" }} className={gClasses.vgSpacing}
          inputProps={{className: gClasses.dateTimeNormal}} label="Middle Name" type="text" value={emurAddr4}
          onChange={(event) => { setEmurAddr4(event.target.value) }}			
        />	
			</Grid>
			<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
			<Grid item xs={5} sm={5} md={5} lg={5} >
				<Typography style={{paddingTop: "20px" }} className={gClasses.patientInfo2Blue} >Relation</Typography>
			</Grid>
			<Grid item xs={7} sm={7} md={7} lg={7} >
        <VsSelect size="small" align="left"  style={{paddingLeft: "10px", paddingRight: "10px" }}
					inputProps={{className: gClasses.dateTimeNormal}} options={(radioRecord === 0) ? SELFRELATION : RELATION} 
					value={emurAddr6} onChange={(event) => { setEmurAddr6(event.target.value); }} 
				/>				
			</Grid>
			<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
			<Grid item xs={5} sm={5} md={5} lg={5} >
				<Typography style={{paddingTop: "20px" }} className={gClasses.patientInfo2Blue} >Gender</Typography>
			</Grid>
			<Grid item xs={7} sm={7} md={7} lg={7} >
        <VsSelect size="small" align="left"  style={{paddingLeft: "10px", paddingRight: "10px" }}
					inputProps={{className: gClasses.dateTimeNormal}} label="Gender" options={GENDER} 
					value={emurAddr7} onChange={(event) => { setEmurAddr7(event.target.value); }} 
				/>
			</Grid>
			<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
			<Grid item xs={5} sm={5} md={5} lg={5} >
				<Typography style={{paddingTop: "1px" }} className={gClasses.patientInfo2Blue} >Date of Birth</Typography>
			</Grid>
			<Grid item xs={7} sm={7} md={7} lg={7} >
        <Datetime 
          className={gClasses.dateTimeBlock}
          inputProps={{className: gClasses.dateTimeNormal}}
          timeFormat={false} 
          initialValue={emurDate1}
          dateFormat="DD/MM/yyyy"
          isValidDate={disableFutureDt}
          onClose={setEmurDate1}
          closeOnSelect={true}
        />
			</Grid>
			<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
			<Grid item xs={5} sm={5} md={5} lg={5} >
				<Typography style={{paddingTop: "20px" }} className={gClasses.patientInfo2Blue} >Gender</Typography>
			</Grid>
			<Grid item xs={7} sm={7} md={7} lg={7} >
        <VsSelect size="small" align="left"  style={{paddingLeft: "10px", paddingRight: "10px" }}
					inputProps={{className: gClasses.dateTimeNormal}} label="Gender" options={GENDER} 
					value={emurAddr7} onChange={(event) => { setEmurAddr7(event.target.value); }} 
				/>
			</Grid>
			<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
			<Grid item xs={5} sm={5} md={5} lg={5} >
				<Typography style={{paddingTop: "20px" }} className={gClasses.patientInfo2Blue} >Blood Group</Typography>
			</Grid>
			<Grid item xs={7} sm={7} md={7} lg={7} >
        <VsSelect size="small" align="left"  style={{paddingLeft: "10px", paddingRight: "10px" }}
					inputProps={{className: gClasses.dateTimeNormal}} label="BldGrp" options={BLOODGROUP} 
					value={emurAddr9} onChange={(event) => { setEmurAddr9(event.target.value); }} 
				/>
			</Grid>
			<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
			<Grid item xs={5} sm={5} md={5} lg={5} >
				<Typography style={{paddingTop: "20px" }} className={gClasses.patientInfo2Blue} >Marital Status</Typography>
			</Grid>
			<Grid item xs={7} sm={7} md={7} lg={7} >
        <VsSelect size="small" align="left"  style={{paddingLeft: "10px", paddingRight: "10px" }}
					inputProps={{className: gClasses.dateTimeNormal}} label="Marital Status" options={MARITALSTATUS} 
					value={emurAddr8} onChange={(event) => { setEmurAddr8(event.target.value); }} 
				/>			
			</Grid>
			<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
			<Grid item xs={5} sm={5} md={5} lg={5} >
				<Typography style={{paddingTop: "20px" }} className={gClasses.patientInfo2Blue} >Occupation</Typography>
			</Grid>
			<Grid item xs={7} sm={7} md={7} lg={7} >
        <TextValidator required className={gClasses.vgSpacing}
          inputProps={{className: gClasses.dateTimeNormal}}
          label="Occupation" type="text"
          value={emurAddr10}
          onChange={(event) => { setEmurAddr10(event.target.value) }}			
        />			
			</Grid>
			<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
			<Grid item xs={5} sm={5} md={5} lg={5} >
				<Typography style={{paddingTop: "20px" }} className={gClasses.patientInfo2Blue} >Mobile 1</Typography>
			</Grid>
			<Grid item xs={7} sm={7} md={7} lg={7} >
        <TextValidator className={gClasses.vgSpacing}
          inputProps={{className: gClasses.dateTimeNormal}}
          label="Mobile 1" type="number"
          value={emurAddr11}
          onChange={(event) => { setEmurAddr11(event.target.value) }}			
          validators={['minNumber:1000000000', 'maxNumber:9999999999']}
          errorMessages={['Invalid mobile number', 'Invalid mobile number']}			
        />
			</Grid>
			<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
			<Grid item xs={5} sm={5} md={5} lg={5} >
				<Typography style={{paddingTop: "20px" }} className={gClasses.patientInfo2Blue} >Mobile 2</Typography>
			</Grid>
			<Grid item xs={7} sm={7} md={7} lg={7} >
        <TextValidator className={gClasses.vgSpacing}
          inputProps={{className: gClasses.dateTimeNormal}}
          label="Mobile 2" type="number"
          value={emurAddr12}
          onChange={(event) => { setEmurAddr12(event.target.value) }}			
          validators={['minNumber:1000000000', 'maxNumber:9999999999']}
          errorMessages={['Invalid mobile number', 'Invalid mobile number']}			
        />
			</Grid>
			<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
			<Grid item xs={5} sm={5} md={5} lg={5} >
				<Typography style={{paddingTop: "20px" }} className={gClasses.patientInfo2Blue} >Email</Typography>
			</Grid>
			<Grid item xs={7} sm={7} md={7} lg={7} >
        <TextValidator className={gClasses.vgSpacing}
          inputProps={{className: gClasses.dateTimeNormal}}
          label="Email" type="email"
          value={emurAddr13}
          onChange={(event) => { setEmurAddr13(event.target.value) }}			
        />	
			</Grid>
			<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
			</Grid>
			<VsButton align="center" name="Update" type="submit" />		
		</ValidatorForm>
		</Box>
		</Container>
	}	
	{((isDrawerOpened === "ORGADDPERSONAL") || (isDrawerOpened === "ORGEDITPERSONAL")) &&
		<ValidatorForm align="left" className={gClasses.form} onSubmit={handleEditPersonalSubmit}>
		<Typography align="center" className={gClasses.title}>{"Edit details of "+getMemberName(memberArray[radioRecord])}</Typography>
		<br />
		<br />
		<Grid key="Name" className={gClasses.noPadding} container justify="left" alignItems="center" >
			<Grid  style={{marginTop: "12px" }}  item xs={3} sm={3} md={2} lg={2} >
        <VsSelect inputProps={{className: gClasses.dateTimeNormal}} style={{paddingLeft: "10px", paddingRight: "10px" }}
        label="Title" options={MEMBERTITLE} value={emurAddr1} onChange={(event) => { setEmurAddr1(event.target.value); }} />
			</Grid>
			<Grid item xs={6} sm={6} md={3} lg={3} >
        <TextValidator required style={{paddingLeft: "10px", paddingRight: "10px" }} className={gClasses.vgSpacing} inputProps={{className: gClasses.dateTimeNormal}}
          label="Last Name" type="text" value={emurAddr2} onChange={(event) => { setEmurAddr2(event.target.value) }} />	
      </Grid>
      {((dispType == "xm") || (dispType == "sm")) &&
        <Grid item xs={3} sm={3}  />      
      }
			<Grid item xs={6} sm={6} md={3} lg={3} >
        <TextValidator required style={{paddingLeft: "10px", paddingRight: "10px" }} className={gClasses.vgSpacing}
          inputProps={{className: gClasses.dateTimeNormal}}
          label="First Name" type="text"
          value={emurAddr3}
          onChange={(event) => { setEmurAddr3(event.target.value) }}			
        />	
			</Grid>
			<Grid item xs={6} sm={6} md={3} lg={3} >
        <TextValidator required style={{paddingLeft: "10px", paddingRight: "10px" }} className={gClasses.vgSpacing}
          inputProps={{className: gClasses.dateTimeNormal}}
          label="Middle Name" type="text"
          value={emurAddr4}
          onChange={(event) => { setEmurAddr4(event.target.value) }}			
        />	
			</Grid>
      <Grid item xs={2} sm={7} md={2} lg={2} />
    </Grid>
		<br />
		<Grid key="persInfo" className={gClasses.noPadding} container justify="center" alignItems="center" >
			<Grid  item xs={6} sm={6} md={3} lg={3} >
        <VsSelect inputProps={{className: gClasses.dateTimeNormal}} style={SELECTSTYLE} label="Relation" options={(radioRecord === 0) ? SELFRELATION : RELATION} value={emurAddr6} onChange={(event) => { setEmurAddr6(event.target.value); }} />				
      </Grid>
			<Grid  item xs={6} sm={6} md={1} lg={1} >
        <VsSelect inputProps={{className: gClasses.dateTimeNormal}} style={SELECTSTYLE} label="Gender" options={GENDER} value={emurAddr7} onChange={(event) => { setEmurAddr7(event.target.value); }} />
      </Grid>
			<Grid align="right" style={{paddingRight: "5px" }}  item xs={5} sm={5} md={2} lg={2} >
        <Typography className={gClasses.title}>Birth Date</Typography>
      </Grid>
			<Grid  item xs={7} sm={7} md={2} lg={2} >
        <Datetime 
          className={gClasses.dateTimeBlock}
          inputProps={{className: gClasses.dateTimeNormal}}
          timeFormat={false} 
          initialValue={emurDate1}
          dateFormat="DD/MM/yyyy"
          isValidDate={disableFutureDt}
          onClose={setEmurDate1}
          closeOnSelect={true}
        />
      </Grid>
      {((dispType == "md") || (dispType == "lg")) &&
        <Grid align="right"  item md={6} lg={6} />
      }
			<Grid  item xs={6} sm={6} md={1} lg={1} >
        <VsSelect inputProps={{className: gClasses.dateTimeNormal}} style={SELECTSTYLE} label="BldGrp" options={BLOODGROUP} value={emurAddr9} onChange={(event) => { setEmurAddr9(event.target.value); }} />
      </Grid>
			<Grid  item xs={6} sm={6} md={2} lg={2} >
        <VsSelect inputProps={{className: gClasses.dateTimeNormal}} style={SELECTSTYLE} label="Marital Status" options={MARITALSTATUS} value={emurAddr8} onChange={(event) => { setEmurAddr8(event.target.value); }} />			
      </Grid>
			<Grid align="right"  item xs={2} sm={7} md={9} lg={9} />
    </Grid>
		<Grid key="Mobile" className={gClasses.noPadding} container justify="center" alignItems="center" >
			<Grid  item xs={6} sm={6} md={3} lg={3} >
        <TextValidator required className={gClasses.vgSpacing}
          inputProps={{className: gClasses.dateTimeNormal}}
          label="Occupation" type="text"
          value={emurAddr10}
          onChange={(event) => { setEmurAddr10(event.target.value) }}			
        />			
      </Grid>
			<Grid  item xs={6} sm={6} md={3} lg={3} >
        <TextValidator className={gClasses.vgSpacing}
          inputProps={{className: gClasses.dateTimeNormal}}
          label="Mobile 1" type="number"
          value={emurAddr11}
          onChange={(event) => { setEmurAddr11(event.target.value) }}			
          validators={['minNumber:1000000000', 'maxNumber:9999999999']}
          errorMessages={['Invalid mobile number', 'Invalid mobile number']}			
        />
      </Grid>
			<Grid  item xs={6} sm={6} md={3} lg={3} >
        <TextValidator className={gClasses.vgSpacing}
          inputProps={{className: gClasses.dateTimeNormal}}
          label="Mobile 2" type="number"
          value={emurAddr12}
          onChange={(event) => { setEmurAddr12(event.target.value) }}			
          validators={['minNumber:1000000000', 'maxNumber:9999999999']}
          errorMessages={['Invalid mobile number', 'Invalid mobile number']}			
        />
      </Grid>
			<Grid  item xs={6} sm={6} md={3} lg={3} >
        <TextValidator className={gClasses.vgSpacing}
          inputProps={{className: gClasses.dateTimeNormal}}
          label="Email" type="email"
          value={emurAddr13}
          onChange={(event) => { setEmurAddr13(event.target.value) }}			
        />	
      </Grid>
    </Grid>
		<BlankArea />
		<VsButton align="center" name="Update" type="submit" />		
		</ValidatorForm>
	}	
	{((isDrawerOpened === "EDITSPLIT") ||  (isDrawerOpened === "APPLYSPLIT")) &&
	<div>
		<Typography align="center" style={PADSTYLE} className={gClasses.title}>{((isDrawerOpened === "EDITSPLIT") ? "Create" : "Apply") + " new family"}</Typography>
		<Typography align="center" style={PADSTYLE} className={gClasses.title}>(Select members and Hod for new family)</Typography>
		<br />
		<Grid key="ADEDITSPLITMEMBERPERSONALHDR" className={gClasses.noPadding} container  alignItems="flex-start" >
			<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
			<Grid item xs={8} sm={8} md={8} lg={8} >
				<Typography className={gClasses.titleOrange}>{"Member Name"}</Typography>
			</Grid>	
			<Grid item xs={2} sm={2} md={2} lg={2} >
				<Typography className={gClasses.titleOrange}>{"Transfer"}</Typography>
			</Grid>
			<Grid item xs={2} sm={2} md={2} lg={2} >
				<Typography className={gClasses.titleOrange}>{"HOD"}</Typography>
			</Grid>
			<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
		</Grid>	
		{emurList.map( (m, index) => {
			return (
				<Grid key={"ADEDITSPLITMEMBERPERSONALDATA"+index} className={gClasses.noPadding} container  alignItems="flex-start" >
				<Grid style={{marginTop: "10px"}}  item xs={8} sm={8} md={8} lg={8} >
					<Typography style={{marginLeft: "10px"}} className={gClasses.title}>{m.name}</Typography>
				</Grid>	
				<Grid item xs={2} sm={2} md={2} lg={2} >
					<VsCheckBox checked={emurList[index].transfer} onClick={() => updateSPtransfer(index, !emurList[index].transfer) }  />
				</Grid>
				<Grid item xs={2} sm={2} md={2} lg={2} >
					<VsRadio checked={emurList[index].hod} onClick={() => updateSPhod(index, !emurList[index].hod)}  />
				</Grid>
				</Grid>	
			)}
		)}
		<DisplayRegisterStatus />
		<BlankArea />
		<VsButton align="center" name="Create New Family" onClick={handleNewFamilySubmit} />
	</div>
	}
	{(isDrawerOpened === "SPLIT") &&
		<SplitFamily memberList={memberArray} hodMid={hodRec.mid} selectedMid={selMember.mid} onReturn={handleSplitFamilyBack} />
	}
	{(isDrawerOpened === "CEASED") &&
		<CeasedMember memberList={memberArray} hodMid={hodRec.mid} selectedMid={selMember.mid} onReturn={handleCeasedMemberBack} />
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
