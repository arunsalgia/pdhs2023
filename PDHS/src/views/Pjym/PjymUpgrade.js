import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
import { TextField, InputAdornment } from "@material-ui/core";
import { Switch } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { ValidatorForm, TextValidator, TextValidatorcvariant} from 'react-material-ui-form-validator';
import Drawer from '@material-ui/core/Drawer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';

import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Grid from "@material-ui/core/Grid";
import Divider from '@material-ui/core/Divider';

import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import BlueRadio from 'components/Radio/BlueRadio';
import { UserContext } from "../../UserContext";

import { 
	JumpButton, DisplayPageHeader, ValidComp, BlankArea,
	DisplayApplicationNameValue
} from 'CustomComponents/CustomComponents.js';

import lodashSortBy from "lodash/sortBy";
import lodashMap from "lodash/map";

import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";

import VsButton from "CustomComponents/VsButton"; 
import VsSelect from "CustomComponents/VsSelect";
import VsRadio from "CustomComponents/VsRadio";
import VsCheckBox from "CustomComponents/VsCheckBox";
import VsCancel from "CustomComponents/VsCancel";
import VsTextFilter from "CustomComponents/VsTextFilter";


import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import EditIcon from '@material-ui/icons/Edit';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import CancelIcon from '@material-ui/icons/Cancel';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SearchIcon from '@material-ui/icons/Search';



import { 
	showError, showSuccess, showInfo,
	disableFutureDt,
} from 'views/functions';

import globalStyles from "assets/globalStyles";

import {setTab } from "CustomComponents/CricDreamTabs.js"


import {
	HUMADCATEGORY,
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

const header = "Apply to move member(s)";

export default function PjymUpgrade() {
	//const classes = useStyles();
	const gClasses = globalStyles();
	const myProps = JSON.parse(sessionStorage.getItem("pjym_props"));
	//console.log(myProps);
	
	const [hodRec, setHodRec] = useState(null);
	const [remarks, setRemarks] = useState("");
	const [newUpgrade, setNewUpgrade] = useState(myProps.selectedMid);
	const [upgradeArray, setUpgradeArray] = useState([]);
	
	//const [header, setHeader] = useState("");
	const [stage, setStage] = useState("PREFINALSTAGE");
	
	//const [cbArray, setCbArray] = useState(Array(25).fill(""));
	//const [memberList, setMemberList] = useState([]);
	//const [transferMemberList, setTransferMemberList] = useState([]);
	//const [balanceMemberList, setBalanceMemberList] = useState([]);
	//const [hodMemberList, setHodMemberList] = useState([]);
	//const [onlyHodNameList, setOnlyHodNameList] = useState([]);
	
	const [hodTransfer, setHodTransfer] = useState(false);
	const [familyHodjunked, setFamilyHodjunked] = useState("");
	const [familyHodRec, setFamilyHodRec] = useState(null);
	const [mergedOrCreate, setMergeOrCreate] = useState(MERGECREATEARRAY[1].value);
	const [relation, setRelation] = useState([]);

	// If create new family
	const [newHod, setNewHod] = useState(myProps.selectedMid);

  const [balanceHod, setBalanceHod] = useState(0)	
	
	//const [destFamilyHeadName, setDestFamilyHeadName] = useState("");
	const [msg1,  setMsg1] = useState("");
	const [msg2,  setMsg2] = useState("");
	const [registerStatus, setRegisterStatus] = useState(0);
	
	const [textInput, setTextInput] = useState("xxxx");
	
	// show in accordion
	const [expandedPanel, setExpandedPanel] = useState("");
	const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedPanel(isExpanded ? panel : false);
    setRegisterStatus(0);
  };

	const [isDrawerOpened, setIsDrawerOpened] = useState("");

	useEffect(() => {
		
		async function getHodRec() {
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/hod/get/${myProps.memberRec.hid}`;
			var resp = await axios.get(myUrl);
			setHodRec(resp.data);
		} catch (e) {
			console.log(e);
			showError("Unable to fetch HOD Record");
		}	
	}		

		// Get HOD record
		getHodRec();

		// Update humad upgrade details
		
		if (myProps.humadRec) {
			var myArray = HUMADCATEGORY.slice(0, HUMADCATEGORY.map(e => e.short).indexOf(myProps.humadRec.membershipNumber.substr(0, 1))); 
			setUpgradeArray(myArray);
			setNewUpgrade(myArray[myArray.length-1].desc);
			setRemarks(myProps.humadRec.remarks);
		}
		else {
			// This is for new members ship
			setUpgradeArray(HUMADCATEGORY);
			setNewUpgrade(HUMADCATEGORY[HUMADCATEGORY.length-1].desc);		
		}

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
      <div align="center">
        <Typography className={(regerr) ? gClasses.error : gClasses.nonerror}>{myMsg}</Typography>
      </div>
    )
  }


async function handlHumadUpgradeSubmit() {
	console.log(HUMADCATEGORY);
	console.log(newUpgrade);
	var myData = {
		hid: myProps.memberRec.hid,
		humadRec: myProps.humadRec,
		memberRec: myProps.memberRec,
		newUpgrade: newUpgrade,
		upgradeDate: new Date(),
		remarks: remarks,
	};
	console.log(myData);

	let myMsg = '';
	let myStatus = STATUS_INFO.SUCCESS;
	var myTmp = encodeURIComponent(JSON.stringify(myData));
	try {
		let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/apply/humadupgrade/${hodRec.mid}/${sessionStorage.getItem('mid')}/${myTmp}`;
		let resp = await axios.get(myUrl);
		myMsg = `Successfully applied for Humad upgrade. Application reference ${resp.data.id}.`;
		myStatus = STATUS_INFO.SUCCESS;
	} 
	catch (e) {
		console.log(e);
		myMsg = `Error applying for Humad upgrade`;
		myStatus = STATUS_INFO.ERROR;
	}
	var returnStatus = {status: myStatus,  msg: myMsg};
	sessionStorage.setItem("humad_returnstatus", JSON.stringify(returnStatus));
	//sessionStorage.setItem("family_currentSelection", myProps.calledFrom);
	setTab(myProps.calledFrom);

	return;

	
	myProps.onReturn.call(this, {status: STATUS_INFO.ERROR, msg: `Error Humad upgrade`});
	return;
}

function preFinalStage() {	
	if (mergedOrCreate === "MERGE") {
		setMsg1(`Transfer members to family of`);
		setMsg2(`${(familyHodRec) ? familyHodRec.mergedName : ""}`);
	}
	else {
		setMsg1('Transfer members to new family');
		//var tmp = memberList.find(x => x.mid === newHod);
		//setMsg2(`${tmp.mergedName} as F.Head`);
		setMsg2("");
	}
}


function handleSubmit() {
	if ((mergedOrCreate === "MERGE") && (!familyHodRec)) {
		showInfo("Family not selected");
		return;
	}
	
	preFinalStage();
	setStage("FINALSTAGE");
}




function handleSelectRelationSubmit() {
	preFinalStage();	
	setStage("FINALSTAGE");
}

function handleSelectRelationBack() {
	setStage("SELECTFAMILY");
}

function JUnkedhandleSelectHodSubmit() {
	var tmpRelation = [];
	for(var i=0; i<transferMemberList.length; ++i) {
		tmpRelation.push((transferMemberList[i].mid === familyHodjunked) ? "Self" : transferMemberList[i].relation)
	}
	setRelation(tmpRelation);
	setStage("NEWRELATION");
}




async function handleFinalStageSubmit() {
	
	var myData = {
		hid: myProps.memberList[0].hid,
		transferMidList: [],
		transferNameList: [],
		transferRelation: [],
		createNewFamily:  (mergedOrCreate === "CREATE"),
		// Required if CREATE
		newHodMid: 0,						
		newHodName: "",
		// Required if MERGED		
		mergedFamilyHid: 0, 	
		mergedFamilyHeadName: "",
		// Required if HOD also transfer
		balanceFamilyHodMid: 0,
		balanceFamilyHodName: "",
		balanceFamilyMid: [],
		balanceFamilyName: [],
		balanceFamilyRelation: []
	};
	
	for(var i=0; i< cbArray.length; ++i) {
		if (cbArray[i] !== 0) {
			var tmpRec = myProps.memberList.find(x => x.mid === cbArray[i]);
			myData.transferMidList.push(tmpRec.mid);
			myData.transferNameList.push(getMemberName(tmpRec, false, false));
			myData.transferRelation.push(((mergedOrCreate === "CREATE") && (tmpRec.mid === newHod)) ? "Self" : relation[i]);
		}
	}
	
	if (myData.createNewFamily) {
		myData.newHodMid = newHod;
		var tmpRec = myProps.memberList.find(x => x.mid === newHod);
		myData.newHodName = getMemberName(tmpRec, false, false);
	}
	else {
		//var tmpRec = hodMemberList.find(x => x.mergedName === familyHod);
		//myData.mergedFamilyHid = tmpRec.hid;
		myData.mergedFamilyHeadName = familyHodRec.mergedName;		
	}
	
	if (cbArray.includes(newHod)) {
		// if HOD is also getting transferred then
		myData.balanceFamilyHodMid = balanceHod;
		var tmpRec = myProps.memberList.find(x => x.mid === balanceHod);
		myData.balanceFamilyHodName = getMemberName(tmpRec, false, false);
		//console.log(memberList);
		//console.log(balanceHod, tmpRec);
		for(var i=0; i<memberList.length; ++i) {
			if (!cbArray.includes(memberList[i].mid)) {
				myData.balanceFamilyMid.push(memberList[i].mid);
				myData.balanceFamilyName.push(memberList[i].mergedName);
				myData.balanceFamilyRelation.push((memberList[i].mid === balanceHod) ? "Self" : relation[i]);
				
			}
		}
		
	}
	console.log(myData);

	let myMsg = '';
	let myStatus;
	let tmp = encodeURIComponent(JSON.stringify(myData));
	try {
		let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/apply/movemember/${myProps.hodMid}/${sessionStorage.getItem('mid')}/${tmp}`;

		let resp = await axios.get(myUrl);
		myMsg = `Successfully applied moving members. Application reference ${resp.data.id}.`;
		myStatus = STATUS_INFO.SUCCESS;
	} catch (e) {
		console.log(e);
		myMsg = `Error Moving members`;
		myStatus = STATUS_INFO.ERROR;
	}
	var returnStatus = {status: myStatus, msg: myMsg };
	sessionStorage.setItem("family_personal_returnstatus", JSON.stringify(returnStatus));
	sessionStorage.setItem("family_currentSelection", "Personal");
	setTab(process.env.REACT_APP_FAMILY);
	//myProps.onReturn.call(this, {status: myStatus,  msg: myMsg});
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
{/*
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
*/}
	<Grid style={{marginTop: "5px", marginBottom: "5px" }} className={gClasses.noPadding} key="LOGINOPTION" container align="center">
		<Grid item xs={5} sm={5} md={5} lg={5} >
			<Typography style={{marginTop: "10px"  }} className={gClasses.title}>{`Merge with family`}</Typography>
		</Grid>
		<Grid item xs={2} sm={2} md={2} lg={2} >
			<Switch color="primary" checked={mergedOrCreate === "CREATE"} onChange={handleMergeOrCreate} />
		</Grid>
		<Grid item xs={5} sm={5} md={5} lg={5} >
			<Typography style={{marginTop: "10px"  }} className={gClasses.title}>{`Create new family`}</Typography>
		</Grid>
	</Grid>	

</div>	
)}


function Display_select_merging_family() {
return (
<div>
	<Typography align="center" className={gClasses.title}>Select Family</Typography>
	<Grid key="SELECTFAMILY" className={gClasses.noPadding} container  alignItems="flex-start" >
		<Grid item xs={4} sm={4} md={4} lg={4} >
			<Typography style={{paddingTop: "20px" }} className={gClasses.patientInfo2Blue} >Family Head</Typography>
		</Grid>
		<Grid item xs={8} sm={8} md={8} lg={8} >
			<Autocomplete
				disablePortal
				id="HODNAME"
				defaultValue={familyHodRec}
				onChange={(event, values) => setFamilyHodRec(values) }
				style={{paddingTop: "10px" }}
				getOptionLabel={(option) => option.mergedName || ""}
				options={hodMemberList}
				sx={{ width: 300 }}
				renderInput={(params) => <TextField {...params} />}
			/>			
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
			<Typography className={gClasses.titleOrange}>{"FamilyHead"}</Typography>
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
	<Grid style={{marginTop: "10px" }}key="Display_select_relation_with_hod" className={gClasses.noPadding} container  alignItems="flex-start" >
		<Grid item xs={8} sm={8} md={8} lg={8} >
			<Typography style={{marginLeft: "10px"}} className={gClasses.titleOrange}>{"Member Name"}</Typography>
		</Grid>	
		<Grid item xs={4} sm={4} md={4} lg={4} >
			<Typography className={gClasses.titleOrange}>{"Relation"}</Typography>
		</Grid>
	</Grid>				
	{memberList.map( (m, index) => {
			//console.log(m.mid);
			if (!cbArray.includes(m.mid)) return;
			var tmpRelation = "";
			//console.log(mergedOrCreate, getMemberName(m, false, false), relation[index]);
			if (mergedOrCreate === "CREATE") {
				tmpRelation = (m.mid === newHod) ? "Self" : relation[index];
			}
			else { // for merge family		
				if (relation[index] === "Self") { 
					tmpRelation = (m.gender === "Male") ? "Brother" : "Sister";
				}
				else
					tmpRelation = relation[index];
			}
			
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
					{/*<VsSelect size="small" align="left" inputProps={{className: gClasses.dateTimeNormal}} 
					options={tmpRelationList} value={tmpRelation} onChange={(event) => { handleNewRelation(event.target.value, index); }} />
					*/}
					<Autocomplete
						disablePortal
						id={"ORGFAMILYRELATIONSEL"+index}
						defaultValue={tmpRelation}
						onChange={(event,values) => { handleNewRelation(values, index); }}
						style={{paddingTop: "10px" }}
						options={tmpRelationList}
						sx={{ width: 300 }}
						renderInput={(params) => <TextField {...params} />}
					/>
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
					{/*<VsSelect size="small" align="left" inputProps={{className: gClasses.dateTimeNormal}} 
					options={tmpRelationList} value={tmpRelation} onChange={(event) => { handleNewRelation(event.target.value, index); }} />
					*/}
					<Autocomplete
						disablePortal
						id={"NEWFAMILYRELATIONSEL"+index}
						defaultValue={tmpRelation}
						onChange={(event,values) => { handleNewRelation(values, index); }}
						style={{paddingTop: "10px" }}
						options={tmpRelationList}
						sx={{ width: 300 }}
						renderInput={(params) => <TextField {...params} />}
					/>
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
			<Typography className={gClasses.titleOrange}>{"FamilyHead"}</Typography>
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

function handleCancel() {
	//sessionStorage.setItem("family_currentSelection", "Personal");
	setTab(myProps.calledFrom);
}


return (
	<div className={gClasses.webPage} >
	<Container component="main" maxWidth="xs">	
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} style={{paddingLeft: "5px", paddingRight: "5px"}} >
	<VsCancel align="right" onClick={handleCancel} />
	<Typography align="center"  className={gClasses.pdhs_title} >{(myProps.humadRec) ? "PJYM Membership" : "New Humad Membership"}</Typography>
	<br />
	<div>
		<br />
		<Typography align="center"  className={gClasses.pdhs_title} >{getMemberName(myProps.memberRec, false, false)}</Typography>
		<br />
		{(myProps.humadRec) &&
		<div align="center" >
			<DisplayApplicationNameValue name="Current membership" value={`${myProps.humadRec.membershipNumber}`}  />
			<br />		
		</div>
		}	
		{upgradeArray.map( (u, index) => {
			return (
			<Grid key={"BALMEM"+index} className={gClasses.noPadding} container  alignItems="flex-start" >
			<Grid style={{marginTop: "10px"}}  item xs={6} sm={6} md={6} lg={6} >
				<Typography style={{marginLeft: "10px"}} className={gClasses.title}>{u.desc}</Typography>
			</Grid>	
			<Grid item xs={2} sm={2} md={2} lg={2} >
				<VsRadio checked={u.desc == newUpgrade} onClick={() => setNewUpgrade(u.desc)}  />
			</Grid>
			</Grid>	

		)})}
		<br />	
		<Grid key={"HUMREMARKS"} className={gClasses.noPadding} container  alignItems="flex-start" >
		<Grid style={{marginTop: "10px"}}  item xs={6} sm={6} md={6} lg={6} >
			<Typography style={{marginLeft: "10px"}} className={gClasses.title}>Remarks</Typography>
		</Grid>	
		<Grid item xs={5} sm={5} md={5} lg={5} >
			<TextField id="outlined-required" label={myProps.inputName}
				value={remarks}  autoFocus
				onChange={(event) => { setRemarks(event.target.value); }}
			/>			
		</Grid>
		</Grid>			
		<br />	
		<VsButton align="center" name="Submit" onClick={handlHumadUpgradeSubmit} />
		<br />
	</div>

	<ToastContainer />
	</Box>
	</Container>
	</div>
	)
}
