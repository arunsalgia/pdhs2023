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
	SELFRELATION, RELATION, GENTSRELATION, LADIESRELATION, LADIES_INLAW_RELATION, GENTS_INLAW_RELATION,
	BLOODGROUP, ELIGIBLEMARRIAGEYEARS,
	STATUS_INFO,
} from 'views/globals';

import {
	getMemberName,
	hasPRWSpermission,
} from 'views/functions';



export default function MemberMarriage() {
	//const classes = useStyles();
	const gClasses = globalStyles();
	const myProps = JSON.parse(sessionStorage.getItem("family_personal_props"));
	//console.log(myProps);
	
	const [header, setHeader] = useState(`Apply for marriage of ${getMemberName(myProps.memberRec, false, false)}`);
	const [memberRec, setMemberRec] = useState(myProps.memberRec);
	const [spouseRec, setSpouseRec] = useState(null);
	const [spouseArray, setSpouseArray] = useState([]);
	const [isSpouseMember, setIsSpouseMember] = useState(true);
	const [isSpouseHumad, setIsSpouseHumad] = useState(true);
	const [spouseMemberRec, setSpouseMemberRec] = useState(null);
	
	const [eligibleList, setEligibleList] = useState([]);

	const [marriageDate, setMarriageDate] = useState(moment());
	const [spouseDob, setSpouseDob] = useState(moment().subtract(ELIGIBLEMARRIAGEYEARS, 'years'));
	const [firstName, setFirstName] = useState("");
	const [middleName, setMiddleName] = useState((myProps.memberRec.gender === "Male") ? myProps.memberRec.firstName : "");
	const [lastName, setLastName] = useState((myProps.memberRec.gender === "Male") ? myProps.memberRec.lastName : "");
	const [alias, setAlias] = useState((myProps.memberRec.gender === "Male") ? myProps.memberRec.alias : "");
	const [relation, setRelation] = useState((myProps.memberRec.gender === "Male") ? "Daughter in law" : "Son in law" );
	const [mobile, setMobile] = useState("");
	const [mobile1, setMobile1] = useState("");
	const [email, setEmail] = useState("");
	const [bloodGroup, setBloodGroup] = useState("");

	const [marriedFirstName, setMarriedFirstName] = useState((myProps.memberRec.gender === "Female") ? myProps.memberRec.firstName : "" );
	const [marriedMiddleName, setMarriedMiddleName] = useState((myProps.memberRec.gender === "Male") ? myProps.memberRec.firstName : "" );
	const [marriedLastName, setMarriedLastName] = useState((myProps.memberRec.gender === "Male") ? myProps.memberRec.lastName : "" );

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

	const [stayAtSelf, setStayAtSelf] = useState(true);
	
	useEffect(() => {
		async function getEligibleList() {
		// Now get the list of all HOD if not available with us
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/member/eligible/${(myProps.memberRec.gender === "Male") ? "Female" : "Male"}`;
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
      case -1001:
        myMsg = `Married name of female spouse not provided.`;
        break;
      case -1002:
        myMsg = `Spouse not selected from the list`;
        break;
			case -1003:
				myMsg = `Spouse personal details not proivded`;
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


function handleSubmit() {
	// do basic validation
	// 1st find out if the married name of the female required
	if (isMarriedNameRequired()) {
		if ( 
			(marriedFirstName === "") ||
			(marriedMiddleName === "") ||
			(marriedLastName === "")
		) {
			setRegisterStatus(-1001);
			return;
		}
	}
	
	// if spouse is memeber then confirm if spouse selected
	if ( isSpouseMember && !spouseMemberRec ){
		setRegisterStatus(-1002);
		return;
	}
	
	// if spouse non humad then confirm if spouse personal details required
	if (isSpousePersonalDetailsRequired()) {
		if ( 
			(firstName === "") ||
			(middleName === "") ||
			(lastName === "")
			) {
				setRegisterStatus(-1003);
				return;
			}
	}

	handleFinalSubmit();
}

async function handleFinalSubmit() {
	
	var myData = {
      hid: memberRec.hid,
		memberRec: memberRec,
		spouseMemberRec: spouseMemberRec,
		dom: marriageDate,
		isSpouseHumad: isSpouseHumad,
		isSpouseMember: isSpouseMember,
		isSpouseRelationRequired: isSpouseRelationRequired(),
		relation: relation,
		isMarriedNameRequired: isMarriedNameRequired(),
		marriedName: {
			firstName: marriedFirstName,
			lastName: marriedLastName,
			middleName: marriedMiddleName
		},
		isSpousePersonalDetailsRequired: isSpousePersonalDetailsRequired(),
		spousePersonalDetails: {
			firstName: firstName,
			lastName: lastName,
			middleName: middleName,
			alias: alias,
			dob: spouseDob,
			mobile: mobile,
			mobile1: mobile1,
			email: email,
			bloodGroup: bloodGroup
		}
	};	
	//console.log(myData);
	//console.log(myData.isSpousePersonalDetailsRequired);
	//return;
	
	let myMsg = '';
	let myStatus;
	let tmp = encodeURIComponent(JSON.stringify(myData));
	try {
		let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/apply/marriage/${myProps.hodMid}/${sessionStorage.getItem('mid')}/${tmp}`;
      console.log(myUrl);
		let resp = await axios.get(myUrl);
		myMsg = `Successfully applied for marriage. Application reference ${resp.data.id}.`;
		myStatus = STATUS_INFO.SUCCESS;
	} catch (e) {
		console.log(e);
		myMsg = `Error applying for marriage`;
		myStatus = STATUS_INFO.ERROR;
	}
	var returnStatus = {status: myStatus, msg: myMsg };
	sessionStorage.setItem("family_personal_returnstatus", JSON.stringify(returnStatus));
	sessionStorage.setItem("family_currentSelection", "Personal");
	setTab(process.env.REACT_APP_FAMILY);
	//myProps.onReturn.call(this, {status: myStatus,  msg: myMsg});
}


function Junk_Display_select_to_transfer() {
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

function Junk_Display_merge_or_create() {
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


function Junk_Display_select_merging_family() {
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


function Junk_Display_select_hod_for_new_family() {	
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


function handleCancel() {
	sessionStorage.setItem("family_currentSelection", "Personal");
	setTab(process.env.REACT_APP_FAMILY);
}

function getSpouseGender() {
	if (memberRec.gender === "Male") return "Female";
	if ( isSpouseMember ) return "Female";
	if ( isSpouseHumad ) return "Male";
	else return "";
}

function isSpouseRelationRequired() {
	if (memberRec.gender === "Male") return true;
	if ( isSpouseMember ) return true;
	if ( isSpouseHumad ) return true;
	else return false;
}

function isMarriedNameRequired() {
	if (memberRec.gender === "Female") return true;
	if (isSpouseMember) return true;
	return false;
}

function isSpousePersonalDetailsRequired() {
	if (isSpouseMember) return false;
	if (memberRec.gender === "Male") {
		return true;
	}
	else {
		return (isSpouseHumad) ? true : false;
	}
	showError("yeh kaya aagaye hum");
}

return (
	<div className={gClasses.webPage} >
	<Container component="main" maxWidth="xs">	
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} style={{paddingLeft: "5px", paddingRight: "5px"}} >
	<VsCancel align="right" onClick={handleCancel} />
	<Typography align="center" className={gClasses.pdhs_title}>{header}</Typography>
	{((memberRec.gender === "Female") && (isSpouseMember || isSpouseHumad)) &&
		<Typography align="center" className={gClasses.pdhs_title}>{`(Spouse will be added to ${memberRec.firstName}\`s family)`}</Typography>
	}
	<br />
	<ValidatorForm align="left" className={gClasses.form} onSubmit={handleSubmit}>
	<Accordion expanded={expandedPanel === "MARRIAGEDETAILS"} onChange={handleAccordionChange("MARRIAGEDETAILS")} >
		<Box align="right" className={(expandedPanel === "MARRIAGEDETAILS") ? gClasses.selectedAccordian : gClasses.normalAccordian} borderColor="black" borderRadius={7} border={1} >
		<AccordionSummary aria-controls="panel1a-content" id="panel1a-header" expandIcon={<ExpandMoreIcon />}>
			<Typography align="left" >{"Marriage Details"}</Typography>
		</AccordionSummary>
		</Box>
		<br />
		<Grid key="MARRIAGEDATE" className={gClasses.noPadding} container  alignItems="flex-start" >
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
			<br />
			<br />
			<Grid item xs={10} sm={10} md={10} lg={10} >
				<Typography className={gClasses.patientInfo2Blue} >Spouse PRWS / Humad / PJYM member</Typography>
			</Grid>
			<Grid item xs={2} sm={2} md={2} lg={2} >
				<Switch color="primary" checked={isSpouseMember} onChange={() => setIsSpouseMember(!isSpouseMember)} />
			</Grid>
			{((memberRec.gender === "Female") && !isSpouseMember) && <br />	}
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
			{(isSpouseRelationRequired())  &&
			<Grid style={{marginTop: "15px" }} item xs={6} sm={6} md={6} lg={6} >
				<Typography className={gClasses.patientInfo2Blue} >
				{`Relation of spouse with Family head`}
				</Typography>
			</Grid>
			}
			{(isSpouseRelationRequired())  &&
			<Grid item xs={6} sm={6} md={6} lg={6} >
				<Autocomplete
					disablePortal
					id="SOUSERELATION"
					value={relation}
					onChange={(event, values) => setRelation(values) }
					style={{paddingTop: "10px" }}
					options={(memberRec.gender === "Female") ? GENTS_INLAW_RELATION : LADIES_INLAW_RELATION}
					sx={{ width: 300 }}
					renderInput={(params) => <TextField {...params} />}
				/>	
			</Grid>			
			}
		</Grid>
		<br />
	</Accordion>
	<br />
	{(isSpouseMember) &&
	<div>
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
	<br />
	</div>
	}	
	{(isMarriedNameRequired()) &&
	<div>
	<Accordion expanded={expandedPanel === "MARRIEDNAME"} onChange={handleAccordionChange("MARRIEDNAME")} >
		<Box align="right" className={(expandedPanel === "MARRIEDNAME") ? gClasses.selectedAccordian : gClasses.normalAccordian} borderColor="black" borderRadius={7} border={1} >
		<AccordionSummary aria-controls="panel1a-content" id="panel1a-header" expandIcon={<ExpandMoreIcon />}>
			<Typography align="left" >{"Married Name (Female)"}</Typography>
		</AccordionSummary>
		</Box>
		<Grid key="MARRIEDNAMEDETAILS" className={gClasses.noPadding} container  alignItems="flex-start" >
			<Grid style={{marginTop: "10px" }} item xs={12} sm={12} md={12} lg={12} />	
		<Grid  item xs={5} sm={5} md={5} lg={5} >
				<Typography className={gClasses.patientInfo2Blue} >Female last name</Typography>
			</Grid>
			<Grid item xs={7} sm={7} md={7} lg={7} >
				<TextValidator key="DSPLASTNAME"  required style={{paddingLeft: "10px", paddingRight: "10px" }} className={gClasses.vgSpacing} inputProps={{className: gClasses.dateTimeNormal}}
				type="text" value={marriedLastName} onChange={(event) => { setMarriedLastName(event.target.value) }} />
			</Grid>
			<Grid style={{marginTop: "10px" }} item xs={12} sm={12} md={12} lg={12} />	
			<Grid  item xs={5} sm={5} md={5} lg={5} >
				<Typography className={gClasses.patientInfo2Blue} >Female first name</Typography>
			</Grid>
			<Grid item xs={7} sm={7} md={7} lg={7} >
				<TextValidator key="DSPFIRSTNAME"  required style={{paddingLeft: "10px", paddingRight: "10px" }} className={gClasses.vgSpacing} inputProps={{className: gClasses.dateTimeNormal}}
				type="text" value={marriedFirstName} onChange={(event) => { setMarriedFirstName(event.target.value) }} />
			</Grid>
			<Grid style={{marginTop: "10px" }} item xs={12} sm={12} md={12} lg={12} />	
			<Grid  item xs={5} sm={5} md={5} lg={5} >
				<Typography className={gClasses.patientInfo2Blue} >Female middle name</Typography>
			</Grid>
			<Grid item xs={7} sm={7} md={7} lg={7} >
				<TextValidator required style={{paddingLeft: "10px", paddingRight: "10px" }} className={gClasses.vgSpacing} inputProps={{className: gClasses.dateTimeNormal}}
				type="text" value={marriedMiddleName} onChange={(event) => { setMarriedMiddleName(event.target.value) }} />
			</Grid>
		</Grid>			
		<br />
	</Accordion>
	<br />
	</div>
	}
	{(isSpousePersonalDetailsRequired()) &&
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
	{(false && isSpousePersonalDetailsRequired()) &&
	<div>
	<Accordion expanded={expandedPanel === "SPOUSEOFFICEDETAILS"} onChange={handleAccordionChange("SPOUSEOFFICEDETAILS")} >
		<Box align="right" className={(expandedPanel === "SPOUSEOFFICEDETAILS") ? gClasses.selectedAccordian : gClasses.normalAccordian} borderColor="black" borderRadius={7} border={1} >
		<AccordionSummary aria-controls="panel1a-content" id="panel1a-header" expandIcon={<ExpandMoreIcon />}>
			<Typography align="left" >{"Spouse Office Details"}</Typography>
		</AccordionSummary>
		</Box>
		<Typography>office details to be implemnetd</Typography>
		<br />
	</Accordion>
	<br />
	</div>
	}	
	{(false && isSpouseMember) &&
	<Accordion expanded={expandedPanel === "NEWHOME"} onChange={handleAccordionChange("NEWHOME")} >
		<Box align="right" className={(expandedPanel === "NEWHOME") ? gClasses.selectedAccordian : gClasses.normalAccordian} borderColor="black" borderRadius={7} border={1} >
		<AccordionSummary aria-controls="panel1a-content" id="panel1a-header" expandIcon={<ExpandMoreIcon />}>
			<Typography align="left" >{"Couple to stay with family of"}</Typography>
		</AccordionSummary>
		</Box>
		<Grid key={"SELECTSELF"} className={gClasses.noPadding} container  alignItems="flex-start" >
		<Grid style={{marginTop: "10px"}}  item xs={10} sm={10} md={10} lg={10} >
			<Typography style={{marginLeft: "10px"}} className={gClasses.title}>{getMemberName(myProps.memberRec, false, false)}</Typography>
		</Grid>	
		<Grid item xs={2} sm={2} md={2} lg={2} >
			<VsRadio checked={stayAtSelf} onClick={() => setStayAtSelf(true) }  />
		</Grid>
		<Grid style={{marginTop: "10px"}}  item xs={10} sm={10} md={10} lg={10} >
			<Typography style={{marginLeft: "10px"}} className={gClasses.title}>{(spouseMemberRec) ? getMemberName(spouseMemberRec, false, false) : ""}</Typography>
		</Grid>	
		<Grid item xs={2} sm={2} md={2} lg={2} >
			<VsRadio checked={!stayAtSelf} onClick={() => setStayAtSelf(false) }  />
		</Grid>
		</Grid>	

		<br />
	</Accordion>
	}	
	<DisplayRegisterStatus />
	<br />
	<VsButton align="center" name="Submit" />
	<ToastContainer />
	</ValidatorForm>
	</Box>
	</Container>
	</div>
);
}
