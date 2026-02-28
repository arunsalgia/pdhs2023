import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';

import { TextField, InputAdornment } from "@material-ui/core";
import { ValidatorForm, TextValidator, TextValidatorcvariant} from 'react-material-ui-form-validator';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Drawer from '@material-ui/core/Drawer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';

import Container from '@material-ui/core/Container';
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
import VsCancel from "CustomComponents/VsCancel";
import VsSelect from "CustomComponents/VsSelect";
import VsRadio from "CustomComponents/VsRadio";
import VsCheckBox from "CustomComponents/VsCheckBox";
import VsRadioGroup from "CustomComponents/VsRadioGroup";


import {
	SELFRELATION, RELATION, GENTSRELATION, LADIESRELATION,
	STATUS_INFO,
	CASTE, HUMADSUBCASTRE,
	APPLICATIONTYPES,
} from 'views/globals';

import {
	getMemberName,
	hasPRWSpermission,
} from 'views/functions';


export default function MemberEditGotra() {
	const gClasses = globalStyles();
	const myProps = JSON.parse(sessionStorage.getItem("family_personal_props"));
	//console.log(myProps);
	
	const [header, setHeader] = useState("Apply to change Gotra and Caste");
//	const [newHodRec, setNewHodRec] = useState({});
//	const [oldHodRec, setOldHodRec] = useState({});
//	const [relation, setRelation] = useState([]);
//	const [memberList, setMemberList] = useState([]);

	const [existingGotra, setExistingGotra] = useState(true);
	const [currentGotraRec, setCurrentGotraRec] = useState(null);
	const [currentGotra, setCurrentGotra] = useState(myProps.hodRec.gotra);
	const [hodRec, setHodRec] = useState(myProps.hodRec);
	const [caste, setCaste] = useState(myProps.hodRec.caste);
	const [subCaste, setSubCaste] = useState(myProps.hodRec.subCaste);

	const [registerStatus, setRegisterStatus] = useState(0);
	
	// show in accordion
	const [expandedPanel, setExpandedPanel] = useState("");
	const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedPanel(isExpanded ? panel : false);
    setRegisterStatus(0);
  };


	useEffect(() => {
		//setHeader(`Apply for update Gotra` );
		//setCurrentGotra(currentHod.gotra);
		var tmp = myProps.gotraList.find(x => x.gotra === myProps.hodRec.gotra);
		setCurrentGotraRec(tmp);
		setExistingGotra(tmp !== null);		
		//setCaste(currentHod.caste);
		//setSubCaste(currentHod.subCaste);
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


	async function handleEditGotraSubmit() {	
		var myGotra = (existingGotra) ? currentGotraRec.gotra : currentGotra;
		var myTmp = myProps.gotraList.find(x => x.gotra === myGotra);	
		var myData = {
			hid: myProps.hodRec.hid,
			oldData: {
				gotra: myProps.hodRec.gotra,
				caste: myProps.hodRec.caste,
				subCaste: myProps.hodRec.subCaste
			},
			newData: {
				gotra: myGotra,
				caste: caste,
				subCaste: subCaste,				
				existingGotra: (myTmp != null),
			}
		};
		console.log(myData);

		let myMsg = '';
		let myStatus = STATUS_INFO.SUCCESS;
		myTmp = encodeURIComponent(JSON.stringify(myData));
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/apply/editgotra/${myProps.hodRec.mid}/${sessionStorage.getItem('mid')}/${myTmp}`;
			let resp = await axios.get(myUrl);
			myMsg = `Successfully applied for gotra/caste/subcaste change. Application reference ${resp.data.id}.`;
			myStatus = STATUS_INFO.SUCCESS;
		} 
		catch (e) {
			console.log(e);
			myMsg = `Error applying for gotra/caste/subcaste change`;
			myStatus = STATUS_INFO.ERROR;
		}
		var returnStatus = {status: myStatus,  msg: myMsg};
		sessionStorage.setItem("family_personal_returnstatus", JSON.stringify(returnStatus));
		sessionStorage.setItem("family_currentSelection", myProps.calledFrom);
		setTab(process.env.REACT_APP_FAMILY);

		return;
		
		let tmp = encodeURIComponent(JSON.stringify({
			hid: hodRec.hid,
			gotra: emurAddr1, 
			caste: caste, 
			subCaste: subCaste
		}));

		try {
			let myUrl = (isAdmin) 
				? `${process.env.REACT_APP_AXIOS_BASEPATH}/hod/updategotra/${tmp}`
				: `${process.env.REACT_APP_AXIOS_BASEPATH}/apply/updategotra/${hodRec.mid}/${loginMid}/${tmp}`;

			let resp = await axios.get(myUrl);
			if (isAdmin) 
				showSuccess("Successfully updated Gotra, Caste");
			else
				vsInfo("Application Success", `Successfully applied for Gotra, Caste change. Application reference ${resp.data.id}.`,
					{label: "Okay" }
				);
		} 
		catch (e) {
			console.log(e);
			showError(`Error applying for Gotra/Caste change`);
		}
		setIsDrawerOpened("");
	}
	

function handleCancel() {
	sessionStorage.setItem("family_currentSelection", myProps.calledFrom);
	setTab(process.env.REACT_APP_FAMILY);
}


	
return (
	<div className={gClasses.webPage} >
	<Container component="main" maxWidth="xs">	
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} style={{paddingLeft: "5px", paddingRight: "5px"}} >
	<VsCancel align="right" onClick={handleCancel} />
	<Typography align="center" className={gClasses.title}>{header}</Typography>
	<br />
	<ValidatorForm align="left" className={gClasses.form} onSubmit={handleEditGotraSubmit}>
		<Grid key="EDITGOTRA" className={gClasses.noPadding} container  alignItems="flex-start" >
		<Grid item xs={12} sm={12} md={12} lg={12} >
			<VsCheckBox align="left" label="Existing Gotra" checked={existingGotra} onClick={() => setExistingGotra(!existingGotra) }  />
		</Grid>
		<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
		<Grid item xs={4} sm={4} md={4} lg={4} >
			<Typography style={{paddingTop: "20px" }} className={gClasses.patientInfo2Blue} >Gotra</Typography>
		</Grid>
		<Grid align="left" item xs={8} sm={8} md={8} lg={8} >
		{(existingGotra) &&
			<Autocomplete
				disablePortal
				id="GOTRANAME"
				value={currentGotraRec}
				onChange={(event, values) => setCurrentGotraRec(values) }
				style={{paddingTop: "10px" }}
				getOptionLabel={(option) => option.gotra || ""}
				options={myProps.gotraList}
				sx={{ width: 300 }}  
				renderInput={(params) => <TextField {...params} />}
			/>			
		}
		{(!existingGotra) &&
			<TextValidator required className={gClasses.vgSpacing}
				label="Gotra" type="text"
				value={currentGotra}
				onChange={(event) => { setCurrentGotra(event.target.value) }}			
			/>	
		}
		</Grid>
		<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
		<Grid item xs={4} sm={4} md={4} lg={4} >
			<Typography style={{paddingTop: "10px" }} className={gClasses.patientInfo2Blue} >Caste</Typography>
		</Grid>
		<Grid item xs={8} sm={8} md={8} lg={8} >
			<VsRadioGroup
				value={caste} onChange={(event) => setCaste(event.target.value)}
				radioList={CASTE}
			/>
		</Grid>
		<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
		<Grid item xs={4} sm={4} md={4} lg={4} >
			{(caste === "Humad") &&
			<Typography style={{paddingTop: "10px" }} className={gClasses.patientInfo2Blue} >Sub Caste</Typography>
			}
		</Grid>
		<Grid item xs={8} sm={8} md={8} lg={8} >
			{(caste === "Humad") &&
			<VsRadioGroup 
				value={subCaste} onChange={(event) => setSubCaste(event.target.value)}
				radioList={HUMADSUBCASTRE}
			/>
			}
		</Grid>
		<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
		</Grid>			
		<DisplayRegisterStatus />
		<BlankArea />
		<VsButton align="center" name={"Apply"} type="submit" />
	</ValidatorForm>
	<ToastContainer />
	</Box>
	</Container>
	</div>
	)
}
