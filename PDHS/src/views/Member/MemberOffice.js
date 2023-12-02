import React, { useState, useContext, useEffect } from 'react';
import {  CssBaseline } from '@material-ui/core';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from "react-tooltip";

import lodashCloneDeep from 'lodash/cloneDeep';
import lodashSortBy from "lodash/sortBy";
import lodashMap from "lodash/map";

import InfoIcon  from 	'@material-ui/icons/Info';

import VsButton from "CustomComponents/VsButton";
import VsCancel from "CustomComponents/VsCancel";
import VsRadio from "CustomComponents/VsRadio";
import VsRadioGroup from "CustomComponents/VsRadioGroup";
import VsCheckBox from "CustomComponents/VsCheckBox";
//import VsSelect from "CustomComponents/VsSelect";
//import VsTextFilter from "CustomComponents/VsTextFilter";
//import VsList from "CustomComponents/VsList";


import axios from "axios";
import Drawer from '@material-ui/core/Drawer';
import { useAlert } from 'react-alert'

import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import 'react-step-progress/dist/index.css';
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";

// styles
import globalStyles from "assets/globalStyles";
//import modalStyles from "assets/modalStyles";



//const BlankMemberData = {firstName: "", middleName: "", lastName: ""};

import {
	BlankArea,
	DisplayMemberHeader,
	PersonalOffice,
	DisplaySingleTip,
} from "CustomComponents/CustomComponents.js"

import {
	ADMIN,
  PADSTYLE,
	MEMBERTITLE, RELATION, SELFRELATION, GENDER, BLOODGROUP, MARITALSTATUS,
	DATESTR, MONTHNUMBERSTR,
	CASTE, HUMADSUBCASTRE,
} from "views/globals.js";


import { 
  displayType, getWindowDimensions,
  isMobile,
	getAdminInfo,
	getImageName,
	vsDialog,
	getMemberName,
	dispAge,
} from "views/functions.js";

import { 
	decrypt, dispMobile, dispEmail, disableFutureDt,
} from 'views/functions';
import {  } from 'views/functions';

//import { update } from 'lodash';
//import { updateCbItem } from 'typescript';


export default function MemberOffice(props) {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  const [dispType, setDispType] = useState("lg");
  
	const loginHid = parseInt(sessionStorage.getItem("hid"), 10);
	const loginMid = parseInt(sessionStorage.getItem("mid"), 10);
	const isMember = props.isMember;
	const adminInfo = getAdminInfo();
	
	const gClasses = globalStyles();
	const alert = useAlert();

	const [memberArray, setMemberArray] = useState(props.list)

	const [currentMemberData, setCurrentMemberData] = useState({});
	const [currentHod, setCurrentHod] = useState({});
	const [gotraArray, setGotraArray] = useState([]);
	const [gotraFilterArray, setGotraFilterArray] = useState([]);
	//const [ceasedArray, setCeasedArray] = useState([]);
	const [hodNamesArray, setHodNamesArray] = useState([])
	const [groomArray, setGroomArray] = useState([])
	const [brideArray, setBrideArray] = useState([])
	const [domArray, setDomArray] = useState([])
	const [domMomemtArray, setDomMomemtArray] = useState([])
	const [unLinkedLadies, setUnLinkedLadies] = useState([]);
	const [radioRecord, setRadioRecord] = useState(0);
	const [emurDate1, setEmurDate1] = useState(moment());
	const [currentSelection, setCurrentSelection] = useState("");

	const [emurGroomArray, setEmurGroomArray] = useState([]);
	const [emurBrideArray, setEmurBrideArray] = useState([]);
	const [emurDomArray, setEmurDomArray] = useState([]);


	const [hodRadio, setHodRadio] = useState(1);
	const [cbList, setCbList] = useState([]);
	const [isDrawerOpened, setIsDrawerOpened] = useState("");
	
	const [emurGotra, setEmurGotra] = useState("");
	const [emurVillage, setEmurVillage] = useState("");
	const [emurPinCode, setEmurPincCode] = useState("");
	const [emurResPhone1, setEmurResPhone1] = useState("");
	const [emurResPhone2, setEmurResPhone2] = useState("");
	const [emurPinResp, setEmurPinResp] = useState({});

	const [emurAddr1, setEmurAddr1] = useState("");
	const [emurAddr2, setEmurAddr2] = useState("");
	const [emurAddr3, setEmurAddr3] = useState("");
	const [emurAddr4, setEmurAddr4] = useState("");
	const [emurAddr5, setEmurAddr5] = useState("");
	const [emurAddr6, setEmurAddr6] = useState("");
	const [emurAddr7, setEmurAddr7] = useState("");
	const [emurAddr8, setEmurAddr8] = useState("");
	const [emurAddr9, setEmurAddr9] = useState("");
	const [emurAddr10, setEmurAddr10] = useState("");
	const [emurAddr11, setEmurAddr11] = useState("");
	const [emurAddr12, setEmurAddr12] = useState("");
	const [emurAddr13, setEmurAddr13] = useState("");

	const [registerStatus, setRegisterStatus] = useState(0);

	

	
  useEffect(() => {	
    function handleResize() {
			let myDim = getWindowDimensions();
      setWindowDimensions(myDim);
      //console.log(displayType(myDim.width));
      setDispType(displayType(myDim.width));
		}
		const getDetails = async () => {	
		}
		getDetails();
		handleResize();
		window.addEventListener('resize', handleResize);
    
  }, []);


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


	function DisplayOfficeButtons() {
		//console.log("Curent", radioRecord);
		if (memberArray.length === 0) return null;
		let edit = (memberArray[0].hid === loginHid);
		if ((adminInfo & ADMIN.superAdmin) !== 0)  edit = true;
		if  (!edit) return null;
	return(
	<div align="right">
		<VsButton name="Edit Details" onClick={handleOfficeEdit} />
	</div>
	)}

	function handleOfficeEdit() {
		let m = memberArray.find(x => x.order === radioRecord);
		console.log(m);
		setEmurAddr1(m.education);
		setEmurAddr2(m.officeName)
		setEmurAddr3(m.officePhone)
		setEmurAddr4(getMemberName(m));
		setIsDrawerOpened("EDITOFFICE");
	}

	function handleEditOfficeSubmit() {
		let m = memberArray.find(x => x.order === radioRecord);
		m.education = emurAddr1;
		m.officeName = emurAddr2;
		m.officePhone = emurAddr3;
		setIsDrawerOpened("");
		alert.success("Updated. Press 'Update office Details' once office details of all member are done");
	}

	function DisplayAllToolTips() {
	return(
		<div>
		{memberArray.map( t =>
			<DisplaySingleTip id={"MEMBER"+t.mid} />
		)}
		</div>
	)}
  
	function DisplayOfficeInformation() {
		let lastItemIndex =  memberArray.length-1;
    //console.log(dispType);
		if (memberArray.length === 0) return null;
		let edit = (memberArray[0].hid === loginHid);
		if ((adminInfo & ADMIN.superAdmin) !== 0) edit = true;
		return (
		<div>
		{memberArray.map( (m, index) => {
      let myInfo = getMemberName(m) + "<br />";;
      myInfo +=  "Mem.Id.: " + m.mid + "<br />";
      if ((dispType !== "lg")) {
        myInfo +=  "Education: " +  m.education + "<br />";
        if (m.officeName != "") myInfo +=  "Company : " +  m.officeName + "<br />";
        if (m.officePhone != "") myInfo +=  "Phone : " +  m.officePhone + "<br />";
      } 
    //myInfo +=  "Email Id : " +  dispEmail(m.email);
			return (
				<PersonalOffice m={m} dispType={dispType}  index={index} 
					checked={radioRecord == m.order} onClick={() => setRadioRecord(m.order)}
					datatip={myInfo} 
				/>
			)}
		)}	
		</div>	
	)}
	
	function handleDate1(d) {
		setEmurDate1(d);
	}

	function handleDateArray(index, e) {
		console.log(index);
		console.log(e);
		let tmp = [].concat(domMomemtArray);
		tmp[index] = e;
		setDomMomemtArray(tmp);
	}


	function updateCbItem(index) {
		let tmp = [].concat(cbList);
		tmp[index] = !tmp[index];
		setCbList(tmp);
		if ((!tmp[index]) && (hodRadio === index))
		setHodRadio(0);
	}

	function updateHodRadio(index) {
		if (cbList[index])
			setHodRadio(index);
	}
	

	
	return (
	<div className={gClasses.webPage} align="center" key="main">
	<DisplayOfficeButtons />
	<DisplayOfficeInformation />
	<DisplayAllToolTips />
	<Drawer 
		anchor="right"
		variant="temporary"
		open={isDrawerOpened != ""}
	>
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
	<VsCancel align="right" onClick={() => { setIsDrawerOpened("")}} />
	{(isDrawerOpened === "EDITOFFICE") &&
		<ValidatorForm align="left" className={gClasses.form} onSubmit={handleEditOfficeSubmit}>
		<Typography style={PADSTYLE} className={gClasses.title}>{"Edit office details of "+emurAddr4}</Typography>
		<BlankArea />
		<TextValidator fullWidth className={gClasses.vgSpacing}
			label="Qualification" type="text"
			value={emurAddr1}
			onChange={(event) => { setEmurAddr1(event.target.value) }}			
		/>
		<TextValidator  fullWidth className={gClasses.vgSpacing}
			label="Office Details" type="text"
			value={emurAddr2}
			onChange={(event) => { setEmurAddr2(event.target.value) }}			
		/>
		<TextValidator className={gClasses.vgSpacing}
			label="Office Phone" type="text"
			value={emurAddr3}
			onChange={(event) => { setEmurAddr3(event.target.value) }}			
		/>
		<BlankArea />
		<VsButton align="center" name="Update" type="submit" />
		</ValidatorForm>
	}	
	</Box>
	</Drawer>
  </div>
  );    
}
