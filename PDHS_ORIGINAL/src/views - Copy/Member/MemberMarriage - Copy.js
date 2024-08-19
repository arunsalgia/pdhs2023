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
import { JumpButton, DisplayPageHeader, ValidComp, BlankArea} from 'CustomComponents/CustomComponents.js';

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


//import { NoGroup, JumpButton, DisplayPageHeader, MessageToUser } from 'CustomComponents/CustomComponents.js';
import { 
	showError, showSuccess, showInfo,
	disableFutureDt,
} from 'views/functions';

import globalStyles from "assets/globalStyles";

import {setTab} from "CustomComponents/CricDreamTabs.js"


//import VsRadioGroup from "CustomComponents/VsRadioGroup";


import {
	SELFRELATION, RELATION, GENTSRELATION, LADIESRELATION, LADIES_INLAW_RELATION,
	BLOODGROUP, ELIGIBLEMARRIAGEYEARS,
	STATUS_INFO,
} from 'views/globals';

import {
	getMemberName,
	hasPRWSpermission,
} from 'views/functions';




export default function MemberMarriage(props) {
	//const classes = useStyles();
	const gClasses = globalStyles();
	
	const [header, setHeader] = useState(`Apply for marriage of ${getMemberName(props.memberRec, false, false)}`);
	const [memberRec, setMemberRec] = useState(props.memberRec);
	const [spouseRec, setSpouseRec] = useState(null);
	const [spouseArray, setSpouseArray] = useState([]);
	const [isSpouseMember, setIsSpouseMember] = useState(true);
	const [isSpouseHumad, setIsSpouseHumad] = useState(true);
	const [spouseMemberRec, setSpouseMemberRec] = useState(null);
	
	const [eligibleList, setEligibleList] = useState([]);

	const [marriageDate, setMarriageDate] = useState(moment());
	const [spouseDob, setSpouseDob] = useState(moment().subtract(ELIGIBLEMARRIAGEYEARS, 'years'));
	const [firstName, setFirstName] = useState("");
	const [middleName, setMiddleName] = useState((props.memberRec.gender === "Male") ? props.memberRec.firstName : "");
	const [lastName, setLastName] = useState((props.memberRec.gender === "Male") ? props.memberRec.lastName : "");
	const [alias, setAlias] = useState((props.memberRec.gender === "Male") ? props.memberRec.alias : "");
	const [relation, setRelation] = useState("Daughter In Law");
	const [mobile, setMobile] = useState("");
	const [mobile1, setMobile1] = useState("");
	const [email, setEmail] = useState("");
	const [bloodGroup, setBloodGroup] = useState("");


	const [stage, setStage] = useState("PREFINALSTAGE");
	
	const [cbArray, setCbArray] = useState(Array(25).fill(""));
	const [memberList, setMemberList] = useState([]);
	const [transferMemberList, setTransferMemberList] = useState([]);
	const [balanceMemberList, setBalanceMemberList] = useState([]);
	const [hodMemberList, setHodMemberList] = useState([]);
	//const [onlyHodNameList, setOnlyHodNameList] = useState([]);
	
	const [hodTransfer, setHodTransfer] = useState(false);
	const [familyHodjunked, setFamilyHodjunked] = useState("");
	//const [mergedOrCreate, setMergeOrCreate] = useState(MERGECREATEARRAY[1].value);

	// If create new family
	const [newHod, setNewHod] = useState(props.selectedMid);

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
		async function getEligibleList() {
		// Now get the list of all HOD if not available with us
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/member/eligible/${(props.memberRec.gender === "Male") ? "Female" : "Male"}`;
			var resp = await axios.get(myUrl);
			var tmpList = [].concat(resp.data);
			for (var i=0; i<tmpList.length; ++i) {
				tmpList[i]["mergedName"] = getMemberName(tmpList[i], false, false);
			}
			tmpList = lodashSortBy(tmpList, 'mergedName');
			setEligibleList(tmpList);
		} catch (e) {
			console.log(e);
			showError("Unable to fetch Eligible list");
		}	
	}		

		getEligibleList();
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

function orghandleMergeOrCreate(newValue) {
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

function handleMergeOrCreate() {
	var newValue = (mergedOrCreate === "CREATE") ? "MERGE" : "CREATE";
	
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
	showInfo("To be implemenetd");
	return;
	
	preFinalStage();
	setStage("FINALSTAGE");
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
		hid: props.memberList[0].hid,
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
			var tmpRec = props.memberList.find(x => x.mid === cbArray[i]);
			myData.transferMidList.push(tmpRec.mid);
			myData.transferNameList.push(getMemberName(tmpRec, false, false));
			myData.transferRelation.push(((mergedOrCreate === "CREATE") && (tmpRec.mid === newHod)) ? "Self" : relation[i]);
		}
	}
	
	if (myData.createNewFamily) {
		myData.newHodMid = newHod;
		var tmpRec = props.memberList.find(x => x.mid === newHod);
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
		var tmpRec = props.memberList.find(x => x.mid === balanceHod);
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
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/apply/movemember/${props.hodMid}/${sessionStorage.getItem('mid')}/${tmp}`;

			let resp = await axios.get(myUrl);
			myMsg = `Successfully applied moving members. Application reference ${resp.data.id}.`;
			myStatus = STATUS_INFO.SUCCESS;
		} catch (e) {
			console.log(e);
			myMsg = `Error Moving members`;
			myStatus = STATUS_INFO.ERROR;
		}
		props.onReturn.call(this, {status: myStatus,  msg: myMsg});
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

/*
function Junked_Display_select_merging_family_working() {
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
*/
/*
function arun(event, values) {
console.log(values);
}
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

//====


function DisplayOfficeRelation() {
return (
	<Typography>TO be impelmnetd</Typography>
)};



return (
	<ValidatorForm align="left" className={gClasses.form} onSubmit={handleSubmit}>
	<Typography align="center" className={gClasses.pdhs_title}>{header}</Typography>
	<br />
	<Accordion expanded={expandedPanel === "MARRIAGEDETAILS"} onChange={handleAccordionChange("MARRIAGEDETAILS")} >
		<Box align="right" className={(expandedPanel === "MARRIAGEDETAILS") ? gClasses.selectedAccordian : gClasses.normalAccordian} borderColor="black" borderRadius={7} border={1} >
		<AccordionSummary aria-controls="panel1a-content" id="panel1a-header" expandIcon={<ExpandMoreIcon />}>
			<Typography align="left" >{"Marriage Details"}</Typography>
		</AccordionSummary>
		</Box>
		<Grid key="MARRIAGEDATE" className={gClasses.noPadding} container  alignItems="flex-start" >
			<Grid style={{marginTop: "10px" }} item xs={12} sm={12} md={12} lg={12} />	
			{(memberRec.gender === "Male") &&
			<Grid style={{marginTop: "15px" }} item xs={6} sm={6} md={6} lg={6} >
				<Typography className={gClasses.patientInfo2Blue} >Relation with Family head</Typography>
			</Grid>
			}
			{(memberRec.gender === "Male") &&
			<Grid item xs={6} sm={6} md={6} lg={6} >
				<Autocomplete
					disablePortal
					id="SOUSERELATION"
					value={relation}
					onChange={(event, values) => setRelation(values) }
					style={{paddingTop: "10px" }}
					options={LADIES_INLAW_RELATION}
					sx={{ width: 300 }}
					renderInput={(params) => <TextField {...params} />}
				/>	
			</Grid>			
			}
			<Grid style={{marginTop: "10px" }} item xs={12} sm={12} md={12} lg={12} />	
			<Grid  item xs={6} sm={6} md={6} lg={6} >
				<Typography className={gClasses.patientInfo2Blue} >Marriage Date</Typography>
			</Grid>
			<Grid item xs={6} sm={6} md={6} lg={6} >
				<Datetime 
					className={gClasses.dateTimeBlock}
					inputProps={{className: gClasses.dateTimeNormal}}
					timeFormat={false} 
					initialValue={marriageDate}
					value={marriageDate}
					dateFormat="DD/MM/yyyy"
					isValidDate={disableFutureDt}
					onClose={setMarriageDate}
					closeOnSelect={true}
				/>
			</Grid>
			<Grid style={{marginTop: "10px" }} item xs={12} sm={12} md={12} lg={12} />	
			<Grid item xs={10} sm={10} md={10} lg={10} >
				<Typography className={gClasses.patientInfo2Blue} >Spouse PRWS / Humad / PJYM member</Typography>
			</Grid>
			<Grid item xs={2} sm={2} md={2} lg={2} >
				<Switch color="primary" checked={isSpouseMember} onChange={() => setIsSpouseMember(!isSpouseMember)} />
			</Grid>
			{((memberRec.gender === "Female") && !isSpouseMember) &&
				<Grid style={{marginTop: "10px" }} item xs={12} sm={12} md={12} lg={12} />	
			}
			{((memberRec.gender === "Female") && !isSpouseMember) &&
				<Grid item xs={10} sm={10} md={10} lg={10} >
					<Typography className={gClasses.patientInfo2Blue} >Spouse Humad</Typography>
				</Grid>
			}
			{((memberRec.gender === "Female") && !isSpouseMember) &&
				<Grid item xs={2} sm={2} md={2} lg={2} >
					<Switch color="primary" checked={isSpouseHumad} onChange={() => setIsSpouseHumad(!isSpouseHumad)} />
				</Grid>
			}
		</Grid>
	</Accordion>
	<br />
	{(isSpouseMember) &&
	<Accordion expanded={expandedPanel === "SPOUSEDETAILS1"} onChange={handleAccordionChange("SPOUSEDETAILS1")} >
		<Box align="right" className={(expandedPanel === "SPOUSEDETAILS1") ? gClasses.selectedAccordian : gClasses.normalAccordian} borderColor="black" borderRadius={7} border={1} >
		<AccordionSummary aria-controls="panel1a-content" id="panel1a-header" expandIcon={<ExpandMoreIcon />}>
			<Typography align="left" >{"Spouse Details"}</Typography>
		</AccordionSummary>
		</Box>
		<Grid key="MARRIAGEDATE" className={gClasses.noPadding} container  alignItems="flex-start" >
			<Grid style={{marginTop: "10px" }} item xs={12} sm={12} md={12} lg={12} />	
			<Grid style={{marginTop: "10px" }}  item xs={4} sm={4} md={4} lg={4} >
				<Typography className={gClasses.patientInfo2Blue} >Spouse name</Typography>
			</Grid>
			<Grid item xs={8} sm={8} md={8} lg={8} >
				<Autocomplete
					disablePortal
					id="HODNAME"
					value={spouseMemberRec}
					onChange={(event, values) => setSpouseMemberRec(values) }
					style={{paddingTop: "10px" }}
					getOptionLabel={(option) => option.mergedName || ""}
					options={eligibleList}
					sx={{ width: 300 }}
					renderInput={(params) => <TextField {...params} />}
				/>
			</Grid>			
		</Grid>			
		<br />
	</Accordion>
	}
	{(!isSpouseMember) &&
	<div>
	<Accordion expanded={expandedPanel === "SPOUSEDETAILS2"} onChange={handleAccordionChange("SPOUSEDETAILS2")} >
		<Box align="right" className={(expandedPanel === "SPOUSEDETAILS2") ? gClasses.selectedAccordian : gClasses.normalAccordian} borderColor="black" borderRadius={7} border={1} >
		<AccordionSummary aria-controls="panel1a-content" id="panel1a-header" expandIcon={<ExpandMoreIcon />}>
			<Typography align="left" >{"Spouse Personal Details"}</Typography>
		</AccordionSummary>
		</Box>
		<Grid key="NEWSPOUSENAMEDOB" className={gClasses.noPadding} container  alignItems="flex-start" >
			<Grid style={{marginTop: "10px" }} item xs={12} sm={12} md={12} lg={12} />	
			<Grid  item xs={5} sm={5} md={5} lg={5} >
				<Typography className={gClasses.patientInfo2Blue} >Spouse birth date</Typography>
			</Grid>
			<Grid item xs={7} sm={7} md={7} lg={7} >
				<Datetime 
					className={gClasses.dateTimeBlock}
					inputProps={{className: gClasses.dateTimeNormal}}
					timeFormat={false} 
					initialValue={spouseDob}
					value={spouseDob}
					dateFormat="DD/MM/yyyy"
					isValidDate={(current) => {
					 return current < moment().subtract(ELIGIBLEMARRIAGEYEARS, 'years');
					 }}
					 onClose={setSpouseDob}
					closeOnSelect={true}
				/>
			</Grid>
			<Grid style={{marginTop: "10px" }} item xs={12} sm={12} md={12} lg={12} />	
			<Grid  item xs={5} sm={5} md={5} lg={5} >
				<Typography className={gClasses.patientInfo2Blue} >Spouse last name</Typography>
			</Grid>
			<Grid item xs={7} sm={7} md={7} lg={7} >
				<TextValidator key="DSPLASTNAME"  required style={{paddingLeft: "10px", paddingRight: "10px" }} className={gClasses.vgSpacing} inputProps={{className: gClasses.dateTimeNormal}}
				type="text" value={lastName} onChange={(event) => { setLastName(event.target.value) }} />
			</Grid>
			<Grid style={{marginTop: "10px" }} item xs={12} sm={12} md={12} lg={12} />	
			<Grid  item xs={5} sm={5} md={5} lg={5} >
				<Typography className={gClasses.patientInfo2Blue} >Spouse first name</Typography>
			</Grid>
			<Grid item xs={7} sm={7} md={7} lg={7} >
				<TextValidator key="DSPFIRSTNAME"  required style={{paddingLeft: "10px", paddingRight: "10px" }} className={gClasses.vgSpacing} inputProps={{className: gClasses.dateTimeNormal}}
				type="text" value={firstName} onChange={(event) => { setFirstName(event.target.value) }} />
			</Grid>
			<Grid style={{marginTop: "10px" }} item xs={12} sm={12} md={12} lg={12} />	
			<Grid  item xs={5} sm={5} md={5} lg={5} >
				<Typography className={gClasses.patientInfo2Blue} >Spouse middle name</Typography>
			</Grid>
			<Grid item xs={7} sm={7} md={7} lg={7} >
				<TextValidator required style={{paddingLeft: "10px", paddingRight: "10px" }} className={gClasses.vgSpacing} inputProps={{className: gClasses.dateTimeNormal}}
				type="text" value={middleName} onChange={(event) => { setMiddleName(event.target.value) }} />
			</Grid>
			<Grid style={{marginTop: "10px" }} item xs={12} sm={12} md={12} lg={12} />	
			<Grid  item xs={5} sm={5} md={5} lg={5} >
				<Typography className={gClasses.patientInfo2Blue} >Spouse alias name</Typography>
			</Grid>
			<Grid item xs={7} sm={7} md={7} lg={7} >
				<TextValidator style={{paddingLeft: "10px", paddingRight: "10px" }} className={gClasses.vgSpacing} inputProps={{className: gClasses.dateTimeNormal}}
				type="text" value={alias} onChange={(event) => { setAlias(event.target.value) }} />
			</Grid>
			<Grid style={{marginTop: "10px" }} item xs={12} sm={12} md={12} lg={12} />	
			<Grid  item xs={5} sm={5} md={5} lg={5} >
				<Typography className={gClasses.patientInfo2Blue} >Spouse blood group</Typography>
			</Grid>
			<Grid item xs={7} sm={7} md={7} lg={7} >
				<Autocomplete
					disablePortal
					id="BLOODGROUP"
					defaultValue={bloodGroup}
					onChange={(event, values) => setBloodGroup(values) }
					style={{paddingTop: "10px" }}
					options={BLOODGROUP}
					sx={{ width: 300 }}
					renderInput={(params) => <TextField {...params} />}
				/>	
			</Grid>
			<Grid style={{marginTop: "10px" }} item xs={12} sm={12} md={12} lg={12} />	
			<Grid  item xs={5} sm={5} md={5} lg={5} >
				<Typography className={gClasses.patientInfo2Blue} >Spouse mobile 1</Typography>
			</Grid>
			<Grid item xs={7} sm={7} md={7} lg={7} >
				<TextValidator style={{paddingLeft: "10px", paddingRight: "10px" }} className={gClasses.vgSpacing} inputProps={{className: gClasses.dateTimeNormal}}
				type="text" value={mobile} onChange={(event) => { setMobile(event.target.value) }} />
			</Grid>
			<Grid style={{marginTop: "10px" }} item xs={12} sm={12} md={12} lg={12} />	
			<Grid  item xs={5} sm={5} md={5} lg={5} >
				<Typography className={gClasses.patientInfo2Blue} >Spouse mobile 2</Typography>
			</Grid>
			<Grid item xs={7} sm={7} md={7} lg={7} >
				<TextValidator style={{paddingLeft: "10px", paddingRight: "10px" }} className={gClasses.vgSpacing} inputProps={{className: gClasses.dateTimeNormal}}
				type="text" value={mobile} onChange={(event) => { setMobile1(event.target.value) }} />
			</Grid>
			<Grid style={{marginTop: "10px" }} item xs={12} sm={12} md={12} lg={12} />	
			<Grid item xs={5} sm={5} md={5} lg={5} >
				<Typography style={{paddingTop: "10px" }} className={gClasses.patientInfo2Blue} >Spouse email</Typography>
			</Grid>
			<Grid item xs={7} sm={7} md={7} lg={7} >
				<TextValidator className={gClasses.vgSpacing}
					inputProps={{className: gClasses.dateTimeNormal}} type="email" value={email}
					onChange={(event) => { setEmail(event.target.value) }}			
				/>	
			</Grid>
			<Grid style={{marginTop: "10px" }} item xs={12} sm={12} md={12} lg={12} />	
		</Grid>
		<br />
	</Accordion>
	<br />
	</div>
	}
	{(!isSpouseMember) &&
	<Accordion expanded={expandedPanel === "SPOUSEOFFICEDETAILS"} onChange={handleAccordionChange("SPOUSEOFFICEDETAILS")} >
		<Box align="right" className={(expandedPanel === "SPOUSEOFFICEDETAILS") ? gClasses.selectedAccordian : gClasses.normalAccordian} borderColor="black" borderRadius={7} border={1} >
		<AccordionSummary aria-controls="panel1a-content" id="panel1a-header" expandIcon={<ExpandMoreIcon />}>
			<Typography align="left" >{"Spouse Office Details"}</Typography>
		</AccordionSummary>
		</Box>
		<Typography>TO be implemnetd</Typography>
		<br />
	</Accordion>
	}	
	<br />
	<VsButton align="center" name="Submit" />
	<ToastContainer />
	</ValidatorForm>
);
}
