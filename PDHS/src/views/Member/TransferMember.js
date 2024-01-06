import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';

import { ValidatorForm, TextValidator, TextValidatorcvariant} from 'react-material-ui-form-validator';
import Drawer from '@material-ui/core/Drawer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Box from '@material-ui/core/Box';
import Grid from "@material-ui/core/Grid";


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
	RELATION,
	STATUS_INFO,
} from 'views/globals';

import {
	getMemberName,
	hasPRWSpermission,
} from 'views/functions';

const MERGECREATEARRAY = [
{msg: "Merge with existing family", value: "MERGE"},
{msg: "Create new family", value: "CREATE"}
]
const MERGEINDEX = 0;
const CREATEINDEX = 1;


export default function TransferMember(props) {
	//const classes = useStyles();
	const gClasses = globalStyles();
	
	const [header, setHeader] = useState("");
	const [stage, setStage] = useState("");
	
	const [cbArray, setCbArray] = useState(Array(25).fill(""));
	const [memberList, setMemberList] = useState([]);
	const [transferMemberList, setTransferMemberList] = useState([]);
	const [balanceMemberList, setBalanceMemberList] = useState([]);
	const [hodMemberList, setHodmemberList] = useState([]);
	
	const [hodTransfer, setHodTransfer] = useState(false);
	const [familyHod, setFamilyHod] = useState(0);
	const [mergedOrCreate, setMergeOrCreate] = useState(MERGECREATEARRAY[0].value);
	const [relation, setRelation] = useState([]);
	
	const [msg1,  setMsg1] = useState("");
	const [msg2,  setMsg2] = useState("");
	const [registerStatus, setRegisterStatus] = useState(0);



/*	
	
	
	
	
	const [selectedMemberList, setSelectedMemberList] = useState([]);

	const [newHod, setNewHod] = useState(props.selectedMid);*/
	
	

	useEffect(() => {
		setHeader((hasPRWSpermission()) ? "Transfer member(s)" : "Apply to transfer member(s)" );
		var tmp = [].concat(props.memberList);
		for(var i=0; i<tmp.length; ++i) {
			tmp[i]["mergedName"] = getMemberName(tmp[i], false, false);	
		}
		setMemberList(tmp);
		var tmpCbArray = [];
		for(var i=0; i< props.memberList.length; ++i) {
			tmpCbArray.push( (props.memberList[i].mid === props.selectedMid) ? props.selectedMid : 0);
		}
		setCbArray(tmpCbArray);
		setStage("SELECTMEMBERS");
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

function handleNewHod(index) {
		setNewHod(memberList[index].mid);
}

function handleFamilyMember(index) {
	//console.log(index, cbArray);
	if (cbArray[index] === "") {
		// Not yet selected
		var clonedArray = [].concat(cbArray);
		clonedArray[index] = memberList[index].mid;
		setCbArray(clonedArray);
	}
	else if (memberList[index].mid !== newHod) {
		// Selected but not set has new HOD
		var clonedArray = [].concat(cbArray);
		clonedArray[index] = "";
		setCbArray(clonedArray);

	}
}


function handleStage2() {
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

function handleStage3() {
	handleCeasedSubmit();
}

async function handleCeasedSubmit() {
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


function handleNewRelation(rel, idx) {
	//console.log(rel, idx);	
	var tmp = [].concat(relation);
	tmp[idx] = rel;
	setRelation(tmp);
}


function handleSelectMemberCb(idx) {
	// Make sure at least 1 member is select
	var tmpArray = [].concat(cbArray);
	if (tmpArray[idx] !== 0) {
		if (tmpArray.filter( x => x !== 0).length > 1)
			tmpArray[idx] = 0;
		else {
			setRegisterStatus(1001);
			return;
		}
	}
	else {
		tmpArray[idx] = memberList[idx].mid		
	}
	setRegisterStatus(0);
	setCbArray(tmpArray);
}

function handleSelectMemberSubmit() {
	setTransferMemberList(memberList.filter(x => cbArray.includes(x.mid)));
	setBalanceMemberList (memberList.filter(x => !cbArray.includes(x.mid)));
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

function handleSelectHodBack() {
	setStage("MERGEORCREATE");
}

function handleNewRelationSubmit() {
	preFinalStage();
	setStage("FINALSTAGE");
}

function handleNewRelationBack() {
	setStage("SELECTHOD");
}

function preFinalStage() {
	if (mergedOrCreate === "MERGE") {
		setMsg1(`Transfer members to family of`);
		setMsg2(`${familyHod}`);
	}
	else {
		var tmp = transferMemberList.find(x => x.mid === familyHod);
		setMsg1('Transfer members to new family with');
		setMsg2(`${tmp.mergedName} as hod`);
	}
}

function handleFinalStageSubmit() {
	props.onReturn.call(this, {status: STATUS_INFO.ERROR,  msg: `Error Transferring members`});
}

function handleFinalStageBack() {
	if (mergedOrCreate === "MERGE")
		setStage("SELECTRELATION");
	else
		setStage("NEWRELATION");
}



return (
	<div>
		<br />
		<Typography align="center" className={gClasses.title}>{header}</Typography>
		<br />
		{(stage === "SELECTMEMBERS") &&
		<div>
			<Typography align="center" className={gClasses.title}>Select Member(s) to transfer</Typography>
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
			<VsButton align="center" name="Next" onClick={handleSelectMemberSubmit} />
			<br />
		</div>
		}
		{ (stage === "MERGEORCREATE") &&
		<div>
			<Typography align="center" className={gClasses.title}>Create new family or merge</Typography>
			{MERGECREATEARRAY.map( (m, index) => {
				return (
					<Grid key={"MERGEORCREATEITEM"+index} className={gClasses.noPadding} container  alignItems="flex-start" >
					<Grid style={{marginTop: "10px"}}  item xs={8} sm={8} md={8} lg={8} >
						<Typography style={{marginLeft: "10px"}} className={gClasses.title}>{m.msg}</Typography>
					</Grid>	
					<Grid item xs={2} sm={2} md={2} lg={2} >
						<VsRadio checked={mergedOrCreate === m.value} onClick={() => setMergeOrCreate(m.value) }  />
					</Grid>
					</Grid>	
				)}
			)}
			<DisplayRegisterStatus />
			<br />
			<Grid key={"MERGEORCREATEBUTTON"} className={gClasses.noPadding} container  alignItems="flex-start" >
				<Grid item xs={2} sm={2} md={2} lg={2} />
				<Grid item xs={3} sm={3} md={3} lg={3} >
					<VsButton align="right" name="Next" onClick={handleMergeOrCreateSubmit} />
				</Grid>
				<Grid item xs={2} sm={2} md={2} lg={2} />
				<Grid item xs={3} sm={3} md={3} lg={3} >
					<VsButton align="left" name="Back" onClick={() => setStage("SELECTMEMBERS") } />
				</Grid>
			</Grid>
			<br />
		</div>
		}
		{ (stage === "SELECTFAMILY") &&
		<div>
			<Typography align="center" className={gClasses.title}>Select Family</Typography>
			<br />
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
			<Grid key={"SELECTFAMILYBUTTON"} className={gClasses.noPadding} container  alignItems="flex-start" >
				<Grid item xs={2} sm={2} md={2} lg={2} />
				<Grid item xs={3} sm={3} md={3} lg={3} >
					<VsButton align="right" name="Next" onClick={handleSelectFamilySubmit} />
				</Grid>
				<Grid item xs={2} sm={2} md={2} lg={2} />
				<Grid item xs={3} sm={3} md={3} lg={3} >
					<VsButton align="left" name="Back" onClick={handleSelectFamilyBack} />
				</Grid>
			</Grid>
			<br />
		</div>
		}
		{ (stage === "SELECTRELATION") &&
		<div>
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
			<br />
			{transferMemberList.map( (m, index) => {
				return (
					<Grid key={"SPLITARRAY3"+index} className={gClasses.noPadding} container  alignItems="flex-start" >
					<Grid style={{marginTop: "10px"}}  item xs={7} sm={7} md={7} lg={7} >
						<Typography style={{marginLeft: "10px", marginTop: "10px" }} className={gClasses.title}>{getMemberName(m, false, false)}</Typography>
					</Grid>	
					<Grid item xs={5} sm={5} md={5} lg={5} >
						<VsSelect size="small" align="left" inputProps={{className: gClasses.dateTimeNormal}} 
						options={RELATION} value={relation[index]} onChange={(event) => { handleNewRelation(event.target.value, index); }} />
					</Grid>
					</Grid>	
				)}
			)}			
			<br />
			<Grid key={"SELECTRELATIONBUTTON"} className={gClasses.noPadding} container  alignItems="flex-start" >
				<Grid item xs={2} sm={2} md={2} lg={2} />
				<Grid item xs={3} sm={3} md={3} lg={3} >
					<VsButton align="right" name="Next" onClick={handleSelectRelationSubmit} />
				</Grid>
				<Grid item xs={2} sm={2} md={2} lg={2} />
				<Grid item xs={3} sm={3} md={3} lg={3} >
					<VsButton align="left" name="Back" onClick={handleSelectRelationBack} />
				</Grid>
			</Grid>
			<br />
		</div>
		}
		{ (stage === "SELECTHOD") &&
		<div>
			<Typography align="center" className={gClasses.title}>Select Hod for new family</Typography>
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
			{transferMemberList.map( (m, index) => {
				return (
					<Grid key={"SELECTHOD2"+index} className={gClasses.noPadding} container  alignItems="flex-start" >
					<Grid style={{marginTop: "10px"}}  item xs={8} sm={8} md={8} lg={8} >
						<Typography style={{marginLeft: "10px"}} className={gClasses.title}>{m.mergedName}</Typography>
					</Grid>	
					<Grid item xs={2} sm={2} md={2} lg={2} >
						<VsRadio checked={m.mid === familyHod} onClick={() => setFamilyHod(m.mid)}  />
					</Grid>
					</Grid>	
				)}
			)}
			<DisplayRegisterStatus />
			<br />
			<Grid key={"SELECTHODBUTTON"} className={gClasses.noPadding} container  alignItems="flex-start" >
				<Grid item xs={2} sm={2} md={2} lg={2} />
				<Grid item xs={3} sm={3} md={3} lg={3} >
					<VsButton align="right" name="Next" onClick={handleSelectHodSubmit} />
				</Grid>
				<Grid item xs={2} sm={2} md={2} lg={2} />
				<Grid item xs={3} sm={3} md={3} lg={3} >
					<VsButton align="right" name="Back" onClick={handleSelectHodBack} />
				</Grid>
			</Grid>
			<br />
		</div>
		}
		{ (stage === "NEWRELATION") &&
		<div>
			<Typography align="center" className={gClasses.title}>{`Select relation of new family`}</Typography>
			<br />
			<Grid key="NEWRELATIONHDR" className={gClasses.noPadding} container  alignItems="flex-start" >
				<Grid item xs={8} sm={8} md={8} lg={8} >
					<Typography style={{marginLeft: "10px"}} className={gClasses.titleOrange}>{"Member Name"}</Typography>
				</Grid>	
				<Grid item xs={4} sm={4} md={4} lg={4} >
					<Typography align="left" className={gClasses.titleOrange}>{"Relation"}</Typography>
				</Grid>
			</Grid>				
			<br />
			{transferMemberList.map( (m, index) => {
				return (
					<Grid key={"NEWRELATION2"+index} className={gClasses.noPadding} container  alignItems="flex-start" >
					<Grid style={{marginTop: "10px"}}  item xs={7} sm={7} md={7} lg={7} >
						<Typography style={{marginLeft: "10px", marginTop: "10px" }} className={gClasses.title}>{getMemberName(m, false, false)}</Typography>
					</Grid>	
					<Grid item xs={5} sm={5} md={5} lg={5} >
						<VsSelect size="small" align="left" inputProps={{className: gClasses.dateTimeNormal}} 
						options={(m.mid === familyHod) ? ["Self"] : RELATION} value={relation[index]} onChange={(event) => { handleNewRelation(event.target.value, index); }} />
					</Grid>
					</Grid>	
				)}
			)}			
			<br />
			<Grid key={"NEWRELATIONBUTTON"} className={gClasses.noPadding} container  alignItems="flex-start" >
				<Grid item xs={2} sm={2} md={2} lg={2} />
				<Grid item xs={3} sm={3} md={3} lg={3} >
					<VsButton align="right" name="Next" onClick={handleNewRelationSubmit} />
				</Grid>
				<Grid item xs={2} sm={2} md={2} lg={2} />
				<Grid item xs={3} sm={3} md={3} lg={3} >
					<VsButton align="left" name="Back" onClick={handleNewRelationBack} />
				</Grid>
			</Grid>
			<br />
		</div>
		}
		{ (stage === "FINALSTAGE") &&
		<div>
			<Typography align="center" className={gClasses.title}>{msg1}</Typography>
			<Typography align="center" className={gClasses.title}>{msg2}</Typography>
			<br />
			{transferMemberList.map( (m, index) => {
				if (m.mid === familyHod) return;
				return (
					<Typography key={"MEMREL"+index} style={{marginLeft: "10px", marginTop: "10px" }} className={gClasses.title}>{`${m.mergedName} as ${relation[index]}`}</Typography>
				)}
			)}			
			<br />
			<Grid key={"FINALSTAGEBUTTON"} className={gClasses.noPadding} container  alignItems="flex-start" >
				<Grid item xs={5} sm={5} md={5} lg={5} >
					<VsButton align="right" name={(hasPRWSpermission()) ? "Submit" : "Apply"}  onClick={handleFinalStageSubmit} />
				</Grid>
				<Grid item xs={2} sm={2} md={2} lg={2} />
				<Grid item xs={5} sm={5} md={5} lg={5} >
					<VsButton align="left" name="Back" onClick={handleFinalStageBack} />
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
