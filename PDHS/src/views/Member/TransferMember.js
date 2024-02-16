import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';

import { ValidatorForm, TextValidator, TextValidatorcvariant} from 'react-material-ui-form-validator';
import Drawer from '@material-ui/core/Drawer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';

import Box from '@material-ui/core/Box';
import Grid from "@material-ui/core/Grid";
import Divider from '@material-ui/core/Divider';

import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import BlueRadio from 'components/Radio/BlueRadio';
import { UserContext } from "../../UserContext";
import { JumpButton, DisplayPageHeader, ValidComp, BlankArea} from 'CustomComponents/CustomComponents.js';

import lodashSortBy from "lodash/sortBy";
import lodashMap from "lodash/map";

import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";

import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import EditIcon from '@material-ui/icons/Edit';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import CancelIcon from '@material-ui/icons/Cancel';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

//import { NoGroup, JumpButton, DisplayPageHeader, MessageToUser } from 'CustomComponents/CustomComponents.js';
import { 
	showError, showSuccess, showInfo,
	disableFutureDt,
} from 'views/functions';

import globalStyles from "assets/globalStyles";

import {setTab} from "CustomComponents/CricDreamTabs.js"

import VsButton from "CustomComponents/VsButton"; 
import VsSelect from "CustomComponents/VsSelect";
import VsRadio from "CustomComponents/VsRadio";
import VsCheckBox from "CustomComponents/VsCheckBox";
//import VsRadioGroup from "CustomComponents/VsRadioGroup";


import {
	SELFRELATION, RELATION, GENTSRELATION, LADIESRELATION,
	STATUS_INFO,
} from 'views/globals';

import {
	getMemberName,
	hasPRWSpermission,
} from 'views/functions';

const MERGECREATEARRAY = [
{msg: "Merge with existing family", value: "MERGE"},
{msg: "Create new family", value: "CREATE"}
];
const MERGEINDEX = 0;
const CREATEINDEX = 1;

const header = "Apply to transfer member(s)";

export default function TransferMember(props) {
	//const classes = useStyles();
	const gClasses = globalStyles();
	
	//const [header, setHeader] = useState("");
	const [stage, setStage] = useState("PREFINALSTAGE");
	
	const [cbArray, setCbArray] = useState(Array(25).fill(""));
	const [memberList, setMemberList] = useState([]);
	const [transferMemberList, setTransferMemberList] = useState([]);
	const [balanceMemberList, setBalanceMemberList] = useState([]);
	const [hodMemberList, setHodmemberList] = useState([]);
	
	const [hodTransfer, setHodTransfer] = useState(false);
	const [familyHod, setFamilyHod] = useState("");
	const [mergedOrCreate, setMergeOrCreate] = useState(MERGECREATEARRAY[1].value);
	const [relation, setRelation] = useState([]);

	// If create new family
	const [newHod, setNewHod] = useState(props.selectedMid);

  const [balanceHod, setBalanceHod] = useState(0)	
	
	//const [destFamilyHeadName, setDestFamilyHeadName] = useState("");
	const [msg1,  setMsg1] = useState("");
	const [msg2,  setMsg2] = useState("");
	const [registerStatus, setRegisterStatus] = useState(0);
	
	// show in accordion
	const [expandedPanel, setExpandedPanel] = useState("");
	const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedPanel(isExpanded ? panel : false);
    setRegisterStatus(0);
  };


	useEffect(() => {
		async function fetchFamilyHodNames() {
		// Now get the list of all HOD if not available with us
		try {
			if (hodMemberList.length === 0) {
				let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/member/hod/all`;
				var resp = await axios.get(myUrl);
				var tmpList = [].concat(resp.data);
				for (var i=0; i<tmpList.length; ++i) {
					tmpList[i]["mergedName"] = getMemberName(tmpList[i], false, false);
				}
				tmpList = lodashSortBy(tmpList, 'mergedName');
				setHodmemberList(tmpList);
				setFamilyHod(tmpList[0].mergedName);
			}
			else {
				setFamilyHod(hodMemberList[0].mergedName);
			}
		} catch (e) {
			console.log(e);
			showError("Unable to fetch HOD Member list");
		}	
	}		

		//setHeader((hasPRWSpermission()) ? "Transfer member(s)" : "Apply to transfer member(s)" );
		
		var tmp = [].concat(props.memberList);
		var tmpRelation = [];
		for(var i=0; i<tmp.length; ++i) {
			tmp[i]["mergedName"] = getMemberName(tmp[i], false, false);	
			tmpRelation.push(tmp[i].relation);
		}
		setMemberList(tmp);
		setRelation(tmpRelation);
		var tmpCbArray = [];
		for(var i=0; i< props.memberList.length; ++i) {
			tmpCbArray.push( (props.memberList[i].mid === props.selectedMid) ? props.selectedMid : 0);
		}
		setCbArray(tmpCbArray);
		
		// Is HOD selected for transfer then set accordingly
		if (props.selectedMid === props.hodMid) {
			setHodTransfer(true);
			//setMergeOrCreate("MERGE");
			//set
		}
		else {
			setHodTransfer(false);
		}
		
		fetchFamilyHodNames();				// required for merge
		
		//console.log(props.selectedMid);
		//console.log(props.memberList);
		//console.log(props.memberList.filter(x => x.mid !== props.selectedMid));
		setTransferMemberList(props.memberList.filter(x => x.mid === props.selectedMid));
		var tmpBalance = props.memberList.filter(x => x.mid !== props.selectedMid);
		if (tmpBalance.length > 0) 
			setBalanceHod(tmpBalance[0].mid);
		setBalanceMemberList (tmpBalance);
		//setStage("SELECTMEMBERS");
	}, [])


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
        myMsg = `Minimum 1 member has to be selected`;
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
      <div align="center">
        <Typography className={(regerr) ? gClasses.error : gClasses.nonerror}>{myMsg}</Typography>
      </div>
    )
  }

// new functions

// Member selected / deselected for transfer
function handleSelectMemberCb(idx) {
	
	// Minimum 1 member to be selected
	// If member to be deselected and only member selected then error
	if (cbArray[idx] !== 0)
	if (cbArray.filter( x => x !== 0).length === 1) {
		setRegisterStatus(1001);
		return;
	}
	setRegisterStatus(0);
	
	var tmpArray = [].concat(cbArray);
	tmpArray[idx] = (tmpArray[idx] !== 0) ? 0 : memberList[idx].mid	
	setCbArray(tmpArray);
	if (tmpArray.includes(props.hodMid)) {
		setHodTransfer(true);
		//setMergeOrCreate("MERGE");
	}
	else {		
		setHodTransfer(false);
	}
	
	// If this was new hod (required for create new family), select by default at member
	//console.log(newHod, tmpArray[idx], tmpArray);
	if ((cbArray[idx] === newHod) && (tmpArray[idx] === 0)) {
		var tmp = tmpArray.find(x => x !== 0);
		//console.log(tmp);
		setNewHod(tmp);
	}
	
	setTransferMemberList(memberList.filter(x => tmpArray.includes(x.mid)));
	var tmpBalance = memberList.filter(x => !tmpArray.includes(x.mid))
	//console.log(tmpBalance);
	setBalanceMemberList (tmpBalance);
	if (tmpBalance.length > 0) 
		setBalanceHod(tmpBalance[0].mid);
	else
		setMergeOrCreate("MERGE");		// All the members selected. Has to be merge only
}

function handleMergeOrCreate(newValue) {
	if ((balanceMemberList.length === 0) && (newValue === "CREATE")) {
		showInfo("Create new family not permitted if all members selected for transfer");
	}
	else {
		if (newValue === "CREATE") {
			var tmp = cbArray.find(x => x !== 0);
			//console.log(tmp);
			setNewHod(tmp);
		}
		setMergeOrCreate(newValue);
	}
}


function preFinalStage() {	
	if (mergedOrCreate === "MERGE") {
		setMsg1(`Transfer members to family of`);
		setMsg2(`${familyHod}`);
	}
	else {
		setMsg1('Transfer members to new family');
		//var tmp = memberList.find(x => x.mid === newHod);
		//setMsg2(`${tmp.mergedName} as hod`);
		setMsg2("");
	}
}


function handleSubmit() {
	preFinalStage();
	setStage("FINALSTAGE");
}


// old functions
function junkhandleNewHod(index) {
		setNewHod(memberList[index].mid);
}

function junkhandleStage2() {
	// Members selected. Now get the relation of members wrt HOD
	var newHodRec = memberList.find(x => x.mid === newHod);
	var otherArray = [];
	var tmpRelations = ["Self"]
	for (var i=0; i<memberList.length; ++i) {
		if (memberList[i].mid !== newHod) {
			otherArray.push(memberList[i]);
			tmpRelations.push(memberList[i].relation);
			console.log(memberList[i].mid, memberList[i].relation);
		}
	}
	
	setSelectedMemberList([newHodRec].concat(otherArray));
	setRelation(tmpRelations);	
	setStage("STAGE3");
}

function junkhandleStage3() {
	handleCeasedSubmit();
}

async function junkhandleCeasedSubmit() {
	var midList = lodashMap(memberList, 'mid');
	var myInfo = {
		hid:  props.memberList[0].hid,
		ceasedMid: props.selectedMid,
		ceasedDate: emurDate1.toDate(),
		newHod: 0,
		midList: [],
		relationList: []
	}
	if (props.hodMid === props.selectedMid) {
		myInfo.newHod = newHod;
		myInfo.midList = midList;
		myInfo.relationList = relation;
	}
	console.log(myInfo);
	myInfo = encodeURIComponent(JSON.stringify(myInfo));
	try {
		// if admin then update else apply
		//let myUrl = "";
		//let mode = "";
		
		let myUrl = (hasPRWSpermission()) 
			? `${process.env.REACT_APP_AXIOS_BASEPATH}/member/ceased/${myInfo}`
			: `${process.env.REACT_APP_AXIOS_BASEPATH}/apply/ceased/${sessionStorage.getItem("mid")}/${myInfo}`;
		var resp = await axios.get(myUrl);
		
		props.onReturn.call(this, {
			status: (hasPRWSpermission() ? STATUS_INFO.SUCCESS : STATUS_INFO.INFO),
			data: resp.data,
			msg: (hasPRWSpermission() ? `Successfully set ${ceasedName} as ceased.` : `Successfully applied for ${ceasedName} as ceased. Your application id ref. ${resp.data.id}`)
		});
	} catch (e) {
		console.log(e);
		props.onReturn.call(this, {status: STATUS_INFO.ERROR,  msg: `Error setting ${ceasedName} as ceased.`});
	}	
	
	//props.onReturn.call(this, {status: STATUS_INFO.ERROR, msg: `Error ceased member`});
	return;
}

// Transfer functions



function handleNewRelation(rel, idx) {
	//console.log(rel, idx);	
	var tmp = [].concat(relation);
	tmp[idx] = rel;
	setRelation(tmp);
}


function handleSelectMemberSubmit() {
	//setTransferMemberList(memberList.filter(x => cbArray.includes(x.mid)));
	//setBalanceMemberList (memberList.filter(x => !cbArray.includes(x.mid)));
	if (cbArray.includes(props.hodMid)) {
		setHodTransfer(true);
		fetchFamilyHodNames();
		// HOD also selected for transfer. Thus it will be merged only. Option for new family not available
		setStage("SELECTFAMILY");    
	}
	else {
		setHodTransfer(false);
		setStage("MERGEORCREATE");		// Select member to be merged with existing family or create new family
	}
}

async function handleMergeOrCreateSubmit() {
	setMergeOrCreate(mergedOrCreate);
	if (mergedOrCreate === "MERGE") {
		await fetchFamilyHodNames();
		setStage("SELECTFAMILY");
	}
	else {
		setFamilyHod(transferMemberList[0].mid);
		setStage("SELECTHOD");
	}
}

function handleSelectFamilySubmit() {
	var tmpRelation = [];
	for(var i=0; i<transferMemberList.length; ++i) {
		tmpRelation.push((transferMemberList[i].relation !== "Self") ? transferMemberList[i].relation : "Brother");
	}
	setRelation(tmpRelation);
	setStage("SELECTRELATION");
}

function handleSelectFamilyBack() {
	console.log("SFB",hodTransfer)
	if (hodTransfer)  setStage("SELECTMEMBERS");
	else              setStage("MERGEORCREATE");
}


function handleSelectRelationSubmit() {
	preFinalStage();	
	setStage("FINALSTAGE");
}

function handleSelectRelationBack() {
	setStage("SELECTFAMILY");
}

function handleSelectHodSubmit() {
	var tmpRelation = [];
	for(var i=0; i<transferMemberList.length; ++i) {
		tmpRelation.push((transferMemberList[i].mid === familyHod) ? "Self" : transferMemberList[i].relation)
	}
	setRelation(tmpRelation);
	setStage("NEWRELATION");
}




async function handleFinalStageSubmit() {
	var myData = {
		hid: props.memberList[0].hid,
		transferMidList: cbArray.filter(x => x !== 0),
		newFamilyMode:  mergedOrCreate
	}
	
	let myMsg = '';
	let myStatus;
	let tmp = encodeURIComponent(JSON.stringify(myData));
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/apply/transfermember/${props.hodMid}/${sessionStorage.getItem('mid')}/${tmp}`;

			let resp = await axios.get(myUrl);
			myMsg = `Successfully applied for Gotra, Caste change. Application reference ${resp.data.id}.`;
			myStatus = STATUS_INFO.SUCCESS;
		} catch (e) {
			console.log(e);
			myMsg = `Error Transferring members`;
			myStatus = STATUS_INFO.ERROR;
		}
		props.onReturn.call(this, {status: myStatus,  msg: myMsg});
}

function junkhandleFinalStageBack() {
	if (mergedOrCreate === "MERGE")
		setStage("SELECTRELATION");
	else
		setStage("NEWRELATION");
}

function Display_select_to_transfer() {
return (	
<div>
	<Grid key="SELECTMEMBERS" className={gClasses.noPadding} container  alignItems="flex-start" >
		<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
		<Grid item xs={8} sm={8} md={8} lg={8} >
			<Typography style={{marginLeft: "10px"}} className={gClasses.titleOrange}>{"Member Name"}</Typography>
		</Grid>	
		<Grid item xs={2} sm={2} md={2} lg={2} >
			<Typography className={gClasses.titleOrange}>{"Transfer"}</Typography>
		</Grid>
		<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
	</Grid>	
	{memberList.map( (m, index) => {
		return (
			<Grid key={"SELECTMEMBERS"+index} className={gClasses.noPadding} container  alignItems="flex-start" >
			<Grid style={{marginTop: "10px"}}  item xs={8} sm={8} md={8} lg={8} >
				<Typography style={{marginLeft: "10px"}} className={gClasses.title}>{getMemberName(m, false, false)}</Typography>
			</Grid>	
			<Grid item xs={2} sm={2} md={2} lg={2} >
				<VsCheckBox checked={cbArray[index] !== 0} onClick={() => handleSelectMemberCb(index) }  />
			</Grid>
			</Grid>	
		)}
	)}
	<DisplayRegisterStatus />
	<br />
</div>
)}

function Display_merge_or_create() {
return (
<div>
	{MERGECREATEARRAY.map( (m, index) => {
		return (
			<Grid key={"MERGEORCREATEITEM"+index} className={gClasses.noPadding} container  alignItems="flex-start" >
			<Grid style={{marginTop: "10px"}}  item xs={8} sm={8} md={8} lg={8} >
				<Typography style={{marginLeft: "10px"}} className={gClasses.title}>{m.msg}</Typography>
			</Grid>	
			<Grid item xs={2} sm={2} md={2} lg={2} >
				<VsRadio checked={mergedOrCreate === m.value} onClick={() => handleMergeOrCreate(m.value) }  />
			</Grid>
			</Grid>	
		)}
	)}
</div>	
)}

/*
		<Typography align="center" className={gClasses.title}>{`Select relation with ${familyHod}`}</Typography>
		<br />
		<Grid key="SPLIT3" className={gClasses.noPadding} container  alignItems="flex-start" >
			<Grid item xs={8} sm={8} md={8} lg={8} >
				<Typography style={{marginLeft: "10px"}} className={gClasses.titleOrange}>{"Member Name"}</Typography>
			</Grid>	
			<Grid item xs={4} sm={4} md={4} lg={4} >
				<Typography className={gClasses.titleOrange}>{"Relation"}</Typography>
			</Grid>
		</Grid>				
		{memberList.map( (m, index) => {
			if (!cbArray.includes(m.mid)) return;

			var tmpRelationList = RELATION;
			if (relation[index] === "Self")
				tmpRelationList = SELFRELATION;
			else if (m.gender === "Male")
				tmpRelationList = GENTSRELATION;
			else if (m.gender === "Female")
				tmpRelationList = LADIESRELATION;
			else
				tmpRelationList = RELATION;
			return (
				<Grid key={"SPLITARRAY3"+index} className={gClasses.noPadding} container  alignItems="flex-start" >
				<Grid style={{marginTop: "10px"}}  item xs={7} sm={7} md={7} lg={7} >
					<Typography style={{marginLeft: "10px", marginTop: "10px" }} className={gClasses.title}>{getMemberName(m, false, false)}</Typography>
				</Grid>	
				<Grid item xs={5} sm={5} md={5} lg={5} >
					<VsSelect size="small" align="left" inputProps={{className: gClasses.dateTimeNormal}} 
					options={tmpRelationList} value={relation[index]} onChange={(event) => { handleNewRelation(event.target.value, index); }} />
				</Grid>
				</Grid>	
			)}
		)}	

*/

function Display_select_merging_family() {
return (
<div>
	<Typography align="center" className={gClasses.title}>Select Family</Typography>
	<Grid key="SELECTFAMILY" className={gClasses.noPadding} container  alignItems="flex-start" >
		<Grid item xs={4} sm={4} md={4} lg={4} >
			<Typography style={{paddingTop: "20px" }} className={gClasses.patientInfo2Blue} >Family Head</Typography>
		</Grid>
		<Grid item xs={8} sm={8} md={8} lg={8} >
			<VsSelect size="small" align="left" inputProps={{className: gClasses.dateTimeNormal}} style={{paddingRight: "5px" }}
			options={hodMemberList} field="mergedName"  value={familyHod} onChange={(event) => setFamilyHod(event.target.value) } />
		</Grid>
	</Grid>
	<br />
</div>	
)}

function Display_select_hod_for_new_family() {
return (
<div>
	<Grid key="SELECTHODHDR" className={gClasses.noPadding} container  alignItems="flex-start" >
		<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
		<Grid item xs={8} sm={8} md={8} lg={8} >
			<Typography style={{marginLeft: "10px"}} className={gClasses.titleOrange}>{"Member Name"}</Typography>
		</Grid>	
		<Grid item xs={2} sm={2} md={2} lg={2} >
			<Typography className={gClasses.titleOrange}>{"HOD"}</Typography>
		</Grid>
		<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
	</Grid>	
	{memberList.map( (m, index) => {
		if (!cbArray.includes(m.mid)) return; 
		return (
			<Grid key={"SELECTHOD2"+index} className={gClasses.noPadding} container  alignItems="flex-start" >
			<Grid style={{marginTop: "10px"}}  item xs={8} sm={8} md={8} lg={8} >
				<Typography style={{marginLeft: "10px"}} className={gClasses.title}>{m.mergedName}</Typography>
			</Grid>	
			<Grid item xs={2} sm={2} md={2} lg={2} >
				<VsRadio checked={m.mid === newHod} onClick={() => setNewHod(m.mid)}  />
			</Grid>
			</Grid>	
		)}
	)}	
</div>
)}

function Display_select_relation_with_hod() {
return (	
<div>
	<Grid key="Display_select_relation_with_hod" className={gClasses.noPadding} container  alignItems="flex-start" >
		<Grid item xs={8} sm={8} md={8} lg={8} >
			<Typography style={{marginLeft: "10px"}} className={gClasses.titleOrange}>{"Member Name"}</Typography>
		</Grid>	
		<Grid item xs={4} sm={4} md={4} lg={4} >
			<Typography className={gClasses.titleOrange}>{"Relation"}</Typography>
		</Grid>
	</Grid>				
	<br />
	{memberList.map( (m, index) => {
			//console.log(m.mid);
			if (!cbArray.includes(m.mid)) return;
			var tmpRelation = ((mergedOrCreate === "CREATE") && (m.mid === newHod)) ? "Self" : relation[index];
			
			// Select relation list based on Gender
			var tmpRelationList = RELATION;
			if (tmpRelation === "Self")
				tmpRelationList = SELFRELATION;
			else if (m.gender === "Male")
				tmpRelationList = GENTSRELATION;
			else if (m.gender === "Female")
				tmpRelationList = LADIESRELATION;
			else
				tmpRelationList = RELATION;
			
			return (
				<Grid key={"NEWFAMILYRELATION"+index} className={gClasses.noPadding} container  alignItems="flex-start" >
				<Grid style={{marginTop: "10px"}}  item xs={7} sm={7} md={7} lg={7} >
					<Typography style={{marginLeft: "10px", marginTop: "10px" }} className={gClasses.title}>{getMemberName(m, false, false)}</Typography>
				</Grid>	
				<Grid item xs={5} sm={5} md={5} lg={5} >
					<VsSelect size="small" align="left" inputProps={{className: gClasses.dateTimeNormal}} 
					options={tmpRelationList} value={tmpRelation} onChange={(event) => { handleNewRelation(event.target.value, index); }} />
				</Grid>
				</Grid>	
			)}
		)}			
	<br />	
</div>
)}


function Display_select_balance_family_relation_with_hod() {
return (	
<div>
	<Grid key="Display_balance_select_relation_with_hod" className={gClasses.noPadding} container  alignItems="flex-start" >
		<Grid item xs={8} sm={8} md={8} lg={8} >
			<Typography style={{marginLeft: "10px"}} className={gClasses.titleOrange}>{"Member Name"}</Typography>
		</Grid>	
		<Grid item xs={4} sm={4} md={4} lg={4} >
			<Typography className={gClasses.titleOrange}>{"Relation"}</Typography>
		</Grid>
	</Grid>				
	<br />
	{memberList.map( (m, index) => {
			if (cbArray.includes(m.mid)) return;
			//console.log(m.mid);
			var tmpRelation = ( (m.mid === balanceHod)) ? "Self" : relation[index];
			
			// Select relation list based on Gender
			var tmpRelationList = RELATION;
			if (tmpRelation === "Self")
				tmpRelationList = SELFRELATION;
			else if (m.gender === "Male")
				tmpRelationList = GENTSRELATION;
			else if (m.gender === "Female")
				tmpRelationList = LADIESRELATION;
			else
				tmpRelationList = RELATION;
			
			return (
				<Grid key={"NEWFAMILYRELATION"+index} className={gClasses.noPadding} container  alignItems="flex-start" >
				<Grid style={{marginTop: "10px"}}  item xs={7} sm={7} md={7} lg={7} >
					<Typography style={{marginLeft: "10px", marginTop: "10px" }} className={gClasses.title}>{getMemberName(m, false, false)}</Typography>
				</Grid>	
				<Grid item xs={5} sm={5} md={5} lg={5} >
					<VsSelect size="small" align="left" inputProps={{className: gClasses.dateTimeNormal}} 
					options={tmpRelationList} value={tmpRelation} onChange={(event) => { handleNewRelation(event.target.value, index); }} />
				</Grid>
				</Grid>	
			)}
		)}			
	<br />	
</div>
)}

function Display_select_hod_for_balance_family() {
	//console.log(balanceMemberList);
return (
<div>
	<Grid key="SELECTHODHDR" className={gClasses.noPadding} container  alignItems="flex-start" >
		<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
		<Grid item xs={8} sm={8} md={8} lg={8} >
			<Typography style={{marginLeft: "10px"}} className={gClasses.titleOrange}>{"Member Name"}</Typography>
		</Grid>	
		<Grid item xs={2} sm={2} md={2} lg={2} >
			<Typography className={gClasses.titleOrange}>{"HOD"}</Typography>
		</Grid>
		<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
	</Grid>	
	{balanceMemberList.map( (m, index) => {
		//if (!cbArray.includes(m.mid)) return; 
		return (
			<Grid key={"BALMEM"+index} className={gClasses.noPadding} container  alignItems="flex-start" >
			<Grid style={{marginTop: "10px"}}  item xs={8} sm={8} md={8} lg={8} >
				<Typography style={{marginLeft: "10px"}} className={gClasses.title}>{m.mergedName}</Typography>
			</Grid>	
			<Grid item xs={2} sm={2} md={2} lg={2} >
				<VsRadio checked={m.mid === balanceHod} onClick={() => setBalanceHod(m.mid)}  />
			</Grid>
			</Grid>	
		)}
	)}	
</div>
)}

function getTransferMembers() {
	var myData = [];
	for(var i=0; i<memberList.length; ++i) {
		if (cbArray[i] !== 0) myData.push(memberList[i].firstName);
	}
	return myData.join(", ");
}

function getHodName(midNumber) {
	//console.log(midNumber);
	var myRec = memberList.find(x => x.mid === midNumber);
	//console.log(myRec); 
	var tmp = (myRec) ? getMemberName(myRec, false, false) : "";
	//console.log(tmp);
	return  tmp;
}

return (
<div>
	<Typography align="center" className={gClasses.pdhs_title}>{header}</Typography>
	<br />
	{(stage !== "FINALSTAGE") &&
	<div>
		<Accordion expanded={expandedPanel === "members_to_transfer"} onChange={handleAccordionChange("members_to_transfer")}>
			<Box align="right" className={(expandedPanel === "members_to_transfer") ? gClasses.selectedAccordian : gClasses.normalAccordian} borderColor="black" borderRadius={7} border={1} >
			<AccordionSummary aria-controls="panel1a-content" id="panel1a-header" expandIcon={<ExpandMoreIcon />}>
				<Typography align="left" >{"Transfer " + getTransferMembers()}</Typography>
			</AccordionSummary>
			</Box>
			<Display_select_to_transfer />
		</Accordion>
		<br />
		<Accordion expanded={expandedPanel === "create_or_merge"} onChange={handleAccordionChange("create_or_merge")}>
			<Box align="right" className={(expandedPanel === "create_or_merge") ? gClasses.selectedAccordian : gClasses.normalAccordian} borderColor="black" borderRadius={7} border={1} >
			<AccordionSummary aria-controls="panel1a-content" id="panel1a-header" expandIcon={<ExpandMoreIcon />}>
				<Typography align="left" >{(mergedOrCreate === "MERGE") ? "Selected to merge with existing family" : "Selected to create new family"}</Typography>
			</AccordionSummary>
			</Box>
			<Display_merge_or_create />
		</Accordion>
		<br />
		{/* If merge then select family with whom  to be merged */}
		{(mergedOrCreate === "MERGE") &&
		<Accordion expanded={expandedPanel === "merge_with_family"} onChange={handleAccordionChange("merge_with_family")}>
		<Box align="right" className={(expandedPanel === "merge_with_family") ? gClasses.selectedAccordian : gClasses.normalAccordian} borderColor="black" borderRadius={7} border={1} >
		<AccordionSummary aria-controls="panel1a-content" id="panel1a-header" expandIcon={<ExpandMoreIcon />}>
			<Typography align="left">{"Merge with family of " + familyHod}</Typography>
		</AccordionSummary>
		</Box>
		<Display_select_merging_family />
		</Accordion>
		}
		{(mergedOrCreate === "CREATE") &&
		<Accordion expanded={expandedPanel === "select_hod_for_new_family"} onChange={handleAccordionChange("select_hod_for_new_family")}>
		<Box align="right" className={(expandedPanel === "select_hod_for_new_family") ? gClasses.selectedAccordian : gClasses.normalAccordian} borderColor="black" borderRadius={7} border={1} >
		<AccordionSummary aria-controls="panel1a-content" id="panel1a-header" expandIcon={<ExpandMoreIcon />}>
			<Typography align="left">{"New family HOD " + getHodName(newHod)}</Typography>
		</AccordionSummary>
		</Box>
		<Display_select_hod_for_new_family />
		</Accordion>		
		}
		<br />
		<Accordion expanded={expandedPanel === "select_relation_with_hod"} onChange={handleAccordionChange("select_relation_with_hod")}>
		<Box align="right" className={(expandedPanel === "select_relation_with_hod") ? gClasses.selectedAccordian : gClasses.normalAccordian} borderColor="black" borderRadius={7} border={1} >
		<AccordionSummary aria-controls="panel1a-content" id="panel1a-header" expandIcon={<ExpandMoreIcon />} >
			<Typography align="left" >{"Relation with "+ ((mergedOrCreate === "MERGE") ? familyHod : getHodName(newHod))}</Typography>
		</AccordionSummary>
		</Box>
		<Display_select_relation_with_hod />
		</Accordion>
		<br />
		{(hodTransfer && (balanceMemberList.length > 0)) &&
		<Accordion expanded={expandedPanel === "hodTransfer"} onChange={handleAccordionChange("hodTransfer")}>
		<Box align="right" className={(expandedPanel === "hodTransfer") ? gClasses.selectedAccordian : gClasses.normalAccordian} borderColor="black" borderRadius={7} border={1} >
		<AccordionSummary aria-controls="panel1a-content" id="panel1a-header" expandIcon={<ExpandMoreIcon />}>
			<Typography align="left">{"Balance family HOD " + getHodName(balanceHod)}</Typography>
		</AccordionSummary>
		</Box>
		<Display_select_hod_for_balance_family />
		</Accordion>		
		}
		<br />
		{(hodTransfer && (balanceMemberList.length > 0)) &&
		<Accordion expanded={expandedPanel === "select_balance_relation_with_hod"} onChange={handleAccordionChange("select_balance_relation_with_hod")}>
		<Box align="right" className={(expandedPanel === "select_balance_relation_with_hod") ? gClasses.selectedAccordian : gClasses.normalAccordian} borderColor="black" borderRadius={7} border={1} >
		<AccordionSummary aria-controls="panel1a-content" id="panel1a-header" expandIcon={<ExpandMoreIcon />} >
			<Typography align="left" >{"Balance family relation with " + getHodName(balanceHod)}</Typography>
		</AccordionSummary>
		</Box>
		<Display_select_balance_family_relation_with_hod />
		</Accordion>
		}
		<br />
		<VsButton align="center" name="Submit" onClick={handleSubmit} />
		<br />
		</div>
	}
	{ (stage === "FINALSTAGE") &&
	<div>
		<Typography align="center" className={gClasses.title}>{msg1}</Typography>
		<Typography align="center" className={gClasses.title}>{msg2}</Typography>
		<br />
		{memberList.map( (m, index) => {
			if (!cbArray.includes(m.mid)) return;
			//if (m.mid === newHod) return;
			var myRelation = ((m.mid === newHod) &&  (mergedOrCreate === "CREATE")) ? 'Self' : relation[index];
			//
			return (
				<Typography key={"MEMREL"+index} style={{marginLeft: "10px", marginTop: "10px" }} className={gClasses.title}>{`${m.mergedName} as ${myRelation}`}</Typography>
			)}
		)}			
		<br />
		<Grid key={"FINALSTAGEBUTTON"} className={gClasses.noPadding} container  alignItems="flex-start" >
			<Grid item xs={5} sm={5} md={5} lg={5} >
				<VsButton align="right" name={(hasPRWSpermission()) ? "Submit" : "Apply"}  onClick={handleFinalStageSubmit} />
			</Grid>
			<Grid item xs={2} sm={2} md={2} lg={2} />
			<Grid item xs={5} sm={5} md={5} lg={5} >
				<VsButton align="left" name="Back" onClick={() => setStage("") } />
			</Grid>
		</Grid>
		<DisplayRegisterStatus />
		<br />
	</div>
	}
	<ToastContainer />
	</div>
	)
}
