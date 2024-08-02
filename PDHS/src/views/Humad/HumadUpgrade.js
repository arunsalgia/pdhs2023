import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';

import { ValidatorForm, TextValidator, TextValidatorcvariant} from 'react-material-ui-form-validator';
import TextField from '@material-ui/core/TextField'; 
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
import { 
	JumpButton, DisplayPageHeader, ValidComp, BlankArea,
	ApplicationHeader, DisplayApplicationNameValue,

} from 'CustomComponents/CustomComponents.js';

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
	SELFRELATION, RELATION, GENTSRELATION, LADIESRELATION,
	HUMADCATEGORY,
	STATUS_INFO,
} from 'views/globals';

import {
	getMemberName,
} from 'views/functions';


export default function HumadUpgrade(props) {
	//const classes = useStyles();
	const gClasses = globalStyles();
	
	const [memberRec, setMemberRec] = useState(null);
	const [remarks, setRemarks] = useState("");
	
	const [header, setHeader] = useState("Humad upgrade");
	const [stage, setStage] = useState("STAGE1");
	const [stage2Req, setStage2Ref] = useState(false);

	const [upgradeArray, setUpgradeArray] = useState([]);
	
	const [emurDate1, setEmurDate1] = useState(moment());
	
	
	const [cbArray, setCbArray] = useState(Array(25).fill(""));
	const [memberList, setMemberList] = useState([]);
	const [selectedMemberList, setSelectedMemberList] = useState([]);
	const [relation, setRelation] = useState([]);
	const [newUpgrade, setNewUpgrade] = useState(props.selectedMid);
	const [registerStatus, setRegisterStatus] = useState(0);
	
	useEffect(() => {
		
		
		if (props.humadRec) {
			var myArray = HUMADCATEGORY.slice(0, HUMADCATEGORY.map(e => e.short).indexOf(props.humadRec.membershipNumber.substr(0, 1))); 
			setUpgradeArray(myArray);
			setNewUpgrade(myArray[myArray.length-1].desc);
			setRemarks(props.humadRec.remarks);
		}
		else {
			// This is for new members ship
			setUpgradeArray(HUMADCATEGORY);
			setNewUpgrade(HUMADCATEGORY[HUMADCATEGORY.length-1].desc);		
		}
		//console.log(props.memberRec);
		//console.log(props.humadRec);
	}, [])



function handleNewRelation(rel, idx) {
	//console.log(rel, idx);	
	var tmp = [].concat(relation);
	tmp[idx] = rel;
	setRelation(tmp);
}


async function handleNewHodSubmit() {
	props.onReturn.call(this, {status: STATUS_INFO.ERROR, msg: `Error Humad upgrade`});
	return;
}


return (
	<div>
		<br />
		<Typography align="center"  className={gClasses.pdhs_title} >
			{(props.humadRec) ?
			"Upgrade of Humad Membership" :
			"New Humad Membership"
			}
		</Typography>
		<Typography align="center"  className={gClasses.pdhs_title} >{getMemberName(props.memberRec, false, false)}</Typography>
		<br />
		{(props.humadRec) &&
		<div align="center" >
			<DisplayApplicationNameValue name="Current membership" value={`${props.humadRec.membershipNumber}`}  />
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
			<TextField id="outlined-required" label={props.inputName}
				value={remarks}  autoFocus
				onChange={(event) => { setRemarks(event.target.value); }}
			/>			
		</Grid>
		</Grid>			
		<br />	
		<VsButton align="center" name="Submit" onClick={handleNewHodSubmit} />
		<br />
	</div>
	)
}
