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
	dateString,
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


export default function NewHod(props) {
	//const classes = useStyles();
	const gClasses = globalStyles();
	
	const [header, setHeader] = useState("");
	const [stage, setStage] = useState("STAGE1");
	const [stage2Req, setStage2Ref] = useState(false);
	const [ceasedName, setCeasedName] = useState("");
	
	const [emurDate1, setEmurDate1] = useState(moment());
	
	
	const [cbArray, setCbArray] = useState(Array(25).fill(""));
	const [memberList, setMemberList] = useState([]);
	const [selectedMemberList, setSelectedMemberList] = useState([]);
	const [relation, setRelation] = useState([]);
	const [newHod, setNewHod] = useState(0);
	const [newHodRec, setNewHodRec] = useState({});
	const [registerStatus, setRegisterStatus] = useState(0);
	
	// show in accordion
	const [expandedPanel, setExpandedPanel] = useState("");
	const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedPanel(isExpanded ? panel : false);
    setRegisterStatus(0);
  };


	useEffect(() => {
		let memRec = props.memberList.find(x => x.mid === props.selectedMid);
		setCeasedName(getMemberName(memRec, false, false));
		setHeader("Apply for ceased " + getMemberName(memRec, false, false) );
		if ((props.selectedMid === props.hodMid) && (props.memberList.length > 1)) {
			setStage2Ref(true);
			var tmp = props.memberList.filter (x => x.mid !== props.selectedMid);
			setMemberList(tmp);
			setNewHod(tmp[0]);
			setNewHod(tmp[0].mid);			
			setRelation(lodashMap(tmp, 'relation'));
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
			tmpRelations.push(memberList[i].relation);
			console.log(memberList[i].mid, memberList[i].relation);
		}
	}
	
	setSelectedMemberList([newHodRec].concat(otherArray));
	setRelation(tmpRelations);	
	setStage("STAGE3");
}

//function handleStage3() {
//	handleCeasedSubmit();
//}

async function handleCeasedSubmit() {
	var myInfo = {
		hid:  props.memberList[0].hid,
		ceasedMid: props.selectedMid,
		ceasedName: ceasedName,
		ceasedDate: emurDate1.toDate(),
		newHodMid: 0,
		newHodName: "",
		midList: [],
		nameList: [],
		oldRelationList: [],
		relationList: []
	}
	
	//console.log(midList);
	//console.log(relation);

	if (props.hodMid === props.selectedMid) {
		var nameList = [];
		for(var i=0; i<memberList.length; ++i) {
			nameList.push(getMemberName(memberList[i], false, false));
			// If new HOD then save the same also
			if (memberList[i].mid === newHod)
				myInfo.newHodName = getMemberName(memberList[i], false, false);
		}

		myInfo.newHodMid = newHod;
		myInfo.midList = lodashMap(memberList, 'mid');;
		myInfo.nameList = nameList;
		myInfo.oldRelationList = lodashMap(memberList, 'relation');
		myInfo.relationList = relation;
	}
	console.log(myInfo);
	//return;
	
	myInfo = encodeURIComponent(JSON.stringify(myInfo));
	//${process.env.REACT_APP_AXIOS_BASEPATH}/apply/updategotra/${currentHod.mid}/${loginMid}/${tmp}`;
	try {
 		// apply for both admin and member
		let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/apply/ceased/${props.hodMid}/${sessionStorage.getItem("mid")}/${myInfo}`;
		var resp = await axios.get(myUrl);
		
		props.onReturn.call(this, {
			status: STATUS_INFO.SUCCESS,
			data: resp.data,
			msg: `Successfully applied for ${ceasedName} as ceased. Your application id ref. ${resp.data.id}`
		});
	} catch (e) {
		console.log(e);
		props.onReturn.call(this, {status: STATUS_INFO.ERROR,  msg: `Error setting ${ceasedName} as ceased.`});
	}	
	return;
}

function Display_select_ceased_date() {
return (	
<div>
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
	<br />
</div>
)}


function Display_select_new_hod() {
return (	
<div>
	<Grid key="select_new_hod" className={gClasses.noPadding} container  alignItems="flex-start" >
		<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
		<Grid item xs={8} sm={8} md={8} lg={8} >
			<Typography style={{marginLeft: "10px"}} className={gClasses.titleOrange}>{"Member Name"}</Typography>
		</Grid>	
		<Grid item xs={2} sm={2} md={2} lg={2} >
			<Typography className={gClasses.titleOrange}>{"F.Head"}</Typography>
		</Grid>
		<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
	</Grid>	
	{memberList.map( (m, index) => {
		return (
			<Grid key={"SPLITARRAY2"+index} className={gClasses.noPadding} container  alignItems="flex-start" >
			<Grid style={{marginTop: "10px"}}  item xs={8} sm={8} md={8} lg={8} >
				<Typography style={{marginLeft: "10px"}} className={gClasses.title}>{getMemberName(m, false, false)}</Typography>
			</Grid>	
			<Grid item xs={2} sm={2} md={2} lg={2} >
				<VsRadio checked={m.mid === newHod} onClick={() => handleNewHod(index)}  />
			</Grid>
			</Grid>	
		)}
	)}
</div>
)}

function Display_select_new_relation() {
return (	
<div>
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
	{memberList.map( (m, index) => {
		var tmpRelation = ( (m.mid === newHod)) ? "Self" : relation[index];
		
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
			<Grid key={"SPLITARRAY3"+index} className={gClasses.noPadding} container  alignItems="flex-start" >
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

function DisplayButtons() {
return (
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
)}

console.log(newHod);
return (
	<div>
		<br />
		<Typography align="center" className={gClasses.title}>{header}</Typography>
		<br />
		<Accordion expanded={expandedPanel === "ceased_date"} onChange={handleAccordionChange("ceased_date")}>
			<Box align="right" className={(expandedPanel === "ceased_date") ? gClasses.selectedAccordian : gClasses.normalAccordian} borderColor="black" borderRadius={7} border={1} >
			<AccordionSummary aria-controls="panel1a-content" id="panel1a-header" expandIcon={<ExpandMoreIcon />}>
				<Typography align="left" >{"Ceased date " + dateString(emurDate1)}</Typography>
			</AccordionSummary>
			</Box>
			<Display_select_ceased_date />
		</Accordion>
		<br />
		{stage2Req &&
		<div>
		<Accordion expanded={expandedPanel === "new_hod"} onChange={handleAccordionChange("new_hod")}>
			<Box align="right" className={(expandedPanel === "new_hod") ? gClasses.selectedAccordian : gClasses.normalAccordian} borderColor="black" borderRadius={7} border={1} >
			<AccordionSummary aria-controls="panel1a-content" id="panel1a-header" expandIcon={<ExpandMoreIcon />}>
				<Typography align="left" >{"New F.Head " + getMemberName(memberList.find(x => x.mid === newHod), false, false)}</Typography>
			</AccordionSummary>
			</Box>
			<Display_select_new_hod />
		</Accordion>
		<br />
		<Accordion expanded={expandedPanel === "new_relation"} onChange={handleAccordionChange("new_relation")}>
			<Box align="right" className={(expandedPanel === "new_relation") ? gClasses.selectedAccordian : gClasses.normalAccordian} borderColor="black" borderRadius={7} border={1} >
			<AccordionSummary aria-controls="panel1a-content" id="panel1a-header" expandIcon={<ExpandMoreIcon />}>
				<Typography align="left" >{"Relation with " + getMemberName(memberList.find(x => x.mid === newHod), false, false)}</Typography>
			</AccordionSummary>
			</Box>
			<Display_select_new_relation />
		</Accordion>
		<br />
		</div>
		}
		<VsButton align="center" name="Apply" onClick={handleCeasedSubmit} />
		<br />
		<ToastContainer />
	</div>
	)
}
