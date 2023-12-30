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
	COMPACTRELATION,
	STATUS_INFO,
} from 'views/globals';

import {
	getMemberName,
} from 'views/functions';


export default function SplitFamily(props) {
	//const classes = useStyles();
	const gClasses = globalStyles();
	
	const [header, setHeader] = useState("");
	const [stage, setStage] = useState("STAGE1");
	const [stage2Req, setStage2Ref] = useState(false);
	
	const [emurDate1, setEmurDate1] = useState(moment());
	
	
	const [cbArray, setCbArray] = useState(Array(25).fill(""));
	const [memberList, setMemberList] = useState([]);
	const [selectedMemberList, setSelectedMemberList] = useState([]);
	const [relation, setRelation] = useState([]);
	const [newHod, setNewHod] = useState(props.selectedMid);
	const [registerStatus, setRegisterStatus] = useState(0);
	
	

	useEffect(() => {
		let memRec = props.memberList.find(x => x.mid === props.selectedMid);
		setHeader("Apply for ceased " + getMemberName(memRec) );
		if ((props.selectedMid === props.hodMid) && (props.memberList.length > 1)) {
			setStage2Ref(true);
			var tmp = props.memberList.filter (x => x.mid !== props.selectedMid);
			setMemberList(tmp);
			setNewHod(tmp[0].mid);
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


function handleNewRelation(rel, idx) {
	//console.log(rel, idx);	
	var tmp = [].concat(relation);
	tmp[idx] = rel;
	setRelation(tmp);
}

function handleStage1() {
	if (!stage2Req) return handleCeasedSubmit();
	setStage("STAGE2");
}

function handleStage2() {
	// Members selected. Now get the relation of members wrt HOD
	var newHodRec = memberList.find(x => x.mid === newHod);
	var otherArray = [];
	var tmpRelations = ["Self"]
	for (var i=0; i<memberList.length; ++i) {
		if (memberList[i].mid !== newHod) {
			otherArray.push(memberList[i]);
			tmpRelations.push((memberList[i].gender === "Male") ? "Brother" : "Sister");
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
	props.onReturn.call(this, {status: STATUS_INFO.ERROR, msg: `Error ceased member`});
	return;
}


return (
	<div>
		<br />
		<Typography align="center" className={gClasses.title}>{header}</Typography>
		<br />
		{ (stage === "STAGE1") &&
		<div>
			<Typography align="center" className={gClasses.title}>Step 1: Select ceased date</Typography>
			<br />
			<Grid key="SPLIT1" className={gClasses.noPadding} container  alignItems="flex-start" >
			<Grid item xs={5} sm={5} md={5} lg={5} >
				<Typography className={gClasses.patientInfo2Blue} >Ceased date</Typography>
			</Grid>
			<Grid item xs={7} sm={7} md={7} lg={7} >
				<Datetime 
					className={gClasses.dateTimeBlock}
					inputProps={{className: gClasses.dateTimeNormal}}
					timeFormat={false} 
					initialValue={emurDate1}
					value={emurDate1}
					dateFormat="DD/MM/yyyy"
					isValidDate={disableFutureDt}
					onClose={setEmurDate1}
					closeOnSelect={true}
				/>
			</Grid>
			</Grid>
			<DisplayRegisterStatus />
			<BlankArea />
			<VsButton align="center" name={(stage2Req) ? "Next" : "Submit"}  onClick={handleStage1} />
			<br />
		</div>
		}
		{ (stage === "STAGE2") &&
		<div>
			<Typography align="center" className={gClasses.title}>Step 2: Select Hod</Typography>
			<Grid key="SPLIT2" className={gClasses.noPadding} container  alignItems="flex-start" >
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
				return (
					<Grid key={"SPLITARRAY2"+index} className={gClasses.noPadding} container  alignItems="flex-start" >
					<Grid style={{marginTop: "10px"}}  item xs={8} sm={8} md={8} lg={8} >
						<Typography style={{marginLeft: "10px"}} className={gClasses.title}>{getMemberName(m, false)}</Typography>
					</Grid>	
					<Grid item xs={2} sm={2} md={2} lg={2} >
						<VsRadio checked={m.mid === newHod} onClick={() => handleNewHod(index)}  />
					</Grid>
					</Grid>	
				)}
			)}
			<DisplayRegisterStatus />
			<br />
			<Grid key={"SPLITARRAY2BUTTON"} className={gClasses.noPadding} container  alignItems="flex-start" >
				<Grid item xs={2} sm={2} md={2} lg={2} />
				<Grid item xs={3} sm={3} md={3} lg={3} >
					<VsButton align="right" name="Next" onClick={handleStage2} />
				</Grid>
				<Grid item xs={2} sm={2} md={2} lg={2} />
				<Grid item xs={3} sm={3} md={3} lg={3} >
					<VsButton align="right" name="Back" onClick={() => setStage("STAGE1") } />
				</Grid>
			</Grid>
			<br />
		</div>
		}
		{ (stage === "STAGE3") &&
		<div>
			<Typography align="center" className={gClasses.title}>Step 3: Select relation</Typography>
			<br />
			<Grid key="SPLIT3" className={gClasses.noPadding} container  alignItems="flex-start" >
				<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
				<Grid item xs={8} sm={8} md={8} lg={8} >
					<Typography style={{marginLeft: "10px"}} className={gClasses.titleOrange}>{"Member Name"}</Typography>
				</Grid>	
				<Grid item xs={4} sm={4} md={4} lg={4} >
					<Typography className={gClasses.titleOrange}>{"Relation"}</Typography>
				</Grid>
				<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
			</Grid>				
			<br />
			{selectedMemberList.map( (m, index) => {
				return (
					<Grid key={"SPLITARRAY3"+index} className={gClasses.noPadding} container  alignItems="flex-start" >
					<Grid style={{marginTop: "10px"}}  item xs={7} sm={7} md={7} lg={7} >
						<Typography style={{marginLeft: "10px", marginTop: "10px" }} className={gClasses.title}>{getMemberName(m, false)}</Typography>
					</Grid>	
					<Grid item xs={5} sm={5} md={5} lg={5} >
						<VsSelect size="small" align="left" inputProps={{className: gClasses.dateTimeNormal}} 
						options={(index === 0) ? ["Self"] : COMPACTRELATION} value={relation[index]} onChange={(event) => { handleNewRelation(event.target.value, index); }} />
					</Grid>
					</Grid>	
				)}
			)}			
			<br />
			<Grid key={"SPLITARRAY3BUTTON"} className={gClasses.noPadding} container  alignItems="flex-start" >
				<Grid item xs={2} sm={2} md={2} lg={2} />
				<Grid item xs={3} sm={3} md={3} lg={3} >
					<VsButton align="right" name="Submit" onClick={handleStage3} />
				</Grid>
				<Grid item xs={2} sm={2} md={2} lg={2} />
				<Grid item xs={3} sm={3} md={3} lg={3} >
					<VsButton align="right" name="Back" onClick={() => setStage("STAGE2") } />
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
