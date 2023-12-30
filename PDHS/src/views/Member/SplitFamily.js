import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
// import { Switch, Route, Link } from 'react-router-dom';
import { ValidatorForm, TextValidator, TextValidatorcvariant} from 'react-material-ui-form-validator';
import Drawer from '@material-ui/core/Drawer';
//import Tooltip from "react-tooltip";
//import ReactTooltip from 'react-tooltip'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Box from '@material-ui/core/Box';
import Grid from "@material-ui/core/Grid";


import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import BlueRadio from 'components/Radio/BlueRadio';
import { UserContext } from "../../UserContext";
import { JumpButton, DisplayPageHeader, ValidComp, BlankArea} from 'CustomComponents/CustomComponents.js';

import lodashSortBy from "lodash/sortBy";

import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import EditIcon from '@material-ui/icons/Edit';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import CancelIcon from '@material-ui/icons/Cancel';

//import { NoGroup, JumpButton, DisplayPageHeader, MessageToUser } from 'CustomComponents/CustomComponents.js';
import { isMobile, getWindowDimensions, displayType, decrypt, encrypt,
	showError, showSuccess, showInfo,
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
	const [cbArray, setCbArray] = useState(Array(25).fill(""));
	const [memberList, setMemberList] = useState([]);
	const [selectedMemberList, setSelectedMemberList] = useState([]);
	const [relation, setRelation] = useState([]);
	const [newHod, setNewHod] = useState(props.selectedMid);
	const [registerStatus, setRegisterStatus] = useState(0);
	const [stage, setStage] = useState("STAGE1");
	
	

	useEffect(() => {
		setHeader("Apply for Split family");
		var tmpList = props.memberList.filter(x => x.mid !== props.hodMid);
		var tmpCbArray = [];
		for(var i=0; i<tmpList.length; ++i) {
			tmpCbArray.push( (tmpList[i].mid === props.selectedMid) ? tmpList[i].mid : "");
		}
		setCbArray(tmpCbArray);
		setMemberList(tmpList);
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
	//console.log(index, memberList[index].mid, newHod);
	if (cbArray[index] !== "") {
		setNewHod(memberList[index].mid);
	}
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

async function handleNewFamilySubmit() {
	props.onReturn.call(this, {status: STATUS_INFO.ERROR, msg: `Error Splitting family`});
	return;
}

function handleStage1() {
	// Members selected. Now get the relation of members wrt HOD
	var newHodRec = memberList.find(x => x.mid === newHod);
	var otherArray = [];
	var tmpRelations = ["Self"]
	for (var i=0; i<memberList.length; ++i) {
		if ((cbArray[i] !== "") && (cbArray[i] !== newHod)) {
			otherArray.push(memberList[i]);
			tmpRelations.push((memberList[i].gender === "Male") ? "Brother" : "Sister");
		}
	}
	setSelectedMemberList([newHodRec].concat(otherArray));
	setRelation(tmpRelations);
	setStage("STAGE2");
	
}

function handleNewRelation(rel, idx) {
	console.log(rel, idx);	
	var tmp = [].concat(relation);
	tmp[idx] = rel;
	setRelation(tmp);
}

return (
	<div>
		<br />
		<Typography align="center" className={gClasses.title}>{header}</Typography>
		<br />
		{ (stage === "STAGE1") &&
		<div>
			<Typography align="center" className={gClasses.title}>Step 1: Select members and Hod</Typography>
			<Grid key="SPLIT1" className={gClasses.noPadding} container  alignItems="flex-start" >
				<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
				<Grid item xs={8} sm={8} md={8} lg={8} >
					<Typography style={{marginLeft: "10px"}} className={gClasses.titleOrange}>{"Member Name"}</Typography>
				</Grid>	
				<Grid item xs={2} sm={2} md={2} lg={2} >
					<Typography className={gClasses.titleOrange}>{"Transfer"}</Typography>
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
						<VsCheckBox checked={cbArray[index] !== ""} onClick={() => handleFamilyMember(index) }  />
					</Grid>
					<Grid item xs={2} sm={2} md={2} lg={2} >
						<VsRadio checked={m.mid === newHod} onClick={() => handleNewHod(index)}  />
					</Grid>
					</Grid>	
				)}
			)}
			<DisplayRegisterStatus />
			<BlankArea />
			<VsButton align="center" name="Next" onClick={handleStage1} />
			<br />
		</div>
		}
		{ (stage === "STAGE2") &&
		<div>
			<Typography align="center" className={gClasses.title}>Step 2: Select relation</Typography>
			<Grid key="SPLIT2" className={gClasses.noPadding} container  alignItems="flex-start" >
				<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
				<Grid item xs={8} sm={8} md={8} lg={8} >
					<Typography style={{marginLeft: "10px"}} className={gClasses.titleOrange}>{"Member Name"}</Typography>
				</Grid>	
				<Grid item xs={4} sm={4} md={4} lg={4} >
					<Typography className={gClasses.titleOrange}>{"Relation"}</Typography>
				</Grid>
				<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
			</Grid>	
			{selectedMemberList.map( (m, index) => {
				return (
					<Grid key={"SPLITARRAY2"+index} className={gClasses.noPadding} container  alignItems="flex-start" >
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
			<DisplayRegisterStatus />
			<BlankArea />
			<Grid key={"SPLITARRAY2BUTTON"} className={gClasses.noPadding} container  alignItems="flex-start" >
				<Grid item xs={2} sm={2} md={2} lg={2} />
				<Grid item xs={3} sm={3} md={3} lg={3} >
					<VsButton align="right" name="Submit" onClick={handleNewFamilySubmit} />
				</Grid>
				<Grid item xs={2} sm={2} md={2} lg={2} />
				<Grid item xs={3} sm={3} md={3} lg={3} >
		<VsButton align="right" name="Back" onClick={() => setStage("STAGE1") } />
				</Grid>
			</Grid>
			<br />
		</div>
		}
		<ToastContainer />
	</div>
	)
}
