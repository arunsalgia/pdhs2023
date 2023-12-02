import React, { useState, useContext, useEffect } from 'react';
import { makeStyles, Container, CssBaseline } from '@material-ui/core';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Divider from '@material-ui/core/Divider';
import lodashCloneDeep from 'lodash/cloneDeep';
import lodashSortBy from "lodash/sortBy"

import VsButton from "CustomComponents/VsButton";
import VsCancel from "CustomComponents/VsCancel";
import VsList from "CustomComponents/VsList";
import VsRadio from "CustomComponents/VsRadio";
import VsTextFilter from "CustomComponents/VsTextFilter";

//import { useLoading, Audio } from '@agney/react-loading';
import axios from "axios";
import Drawer from '@material-ui/core/Drawer';
import { useAlert } from 'react-alert'

import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import 'react-step-progress/dist/index.css';

// styles
import globalStyles from "assets/globalStyles";
//import modalStyles from "assets/modalStyles";

// icons
import IconButton from '@material-ui/core/IconButton';
import LeftIcon from '@material-ui/icons/ChevronLeft';
import RightIcon from '@material-ui/icons/ChevronRight';
import EditIcon from '@material-ui/icons/Edit';
import ArrowUpwardRounded from '@material-ui/icons/ArrowUpwardRounded';
import ArrowDownwardRounded from '@material-ui/icons/ArrowDownwardRounded';

const BlankMemberData = {firstName: "", middleName: "", lastName: ""};

import {
	BlankArea,
	DisplayMemberHeader,
} from "CustomComponents/CustomComponents.js"

import {
//SupportedMimeTypes, SupportedExtensions,
//str1by4, str1by2, str3by4,
//HOURSTR, MINUTESTR, 
DATESTR, MONTHNUMBERSTR, MONTHSTR,
MAGICNUMBER,
} from "views/globals.js";





//colours 
import { red, blue 
} from '@material-ui/core/colors';

import { 
	vsDialog,
	getMemberName,
} from "views/functions.js";
import { dispMobile } from 'views/functions';
import { dispEmail } from 'views/functions';

const useStyles = makeStyles((theme) => ({
	slotTitle: {
		color: 'green',
		fontSize: theme.typography.pxToRem(28),
		fontWeight: theme.typography.fontWeightBold,
		padding: "10px 10px", 
		margin: "10px 10px", 
	},
	patientName: {
		fontSize: theme.typography.pxToRem(16),
		fontWeight: theme.typography.fontWeightBold,	
		color: 'blue',
	},
	patientInfo: {
		fontSize: theme.typography.pxToRem(14),
	},
	murItem: {
		fontSize: theme.typography.pxToRem(15),
		fontWeight: theme.typography.fontWeightBold,
		paddingRight: '10px',
	},
    root: {
      width: '100%',
    }, 
    info: {
        color: blue[700],
    },     
    header: {
			color: '#D84315',
    }, 
    error:  {
      // right: 0,
      fontSize: '12px',
      color: red[700],
      // position: 'absolute',
      alignItems: 'center',
      marginTop: '0px',
		},
		editdelete: {
			marginLeft:  '50px',
			marginRight: '50px',
		},
		NoMedicines: {
			fontSize: theme.typography.pxToRem(20),
			fontWeight: theme.typography.fontWeightBold,
			color: blue[700]
		},  
		radio: {
			fontSize: theme.typography.pxToRem(20),
			fontWeight: theme.typography.fontWeightBold,
			color: "blue",
		},
		medicine: {
			fontSize: theme.typography.pxToRem(15),
			fontWeight: theme.typography.fontWeightBold,
			color: blue[700]
		},  
		modalHeader: {
			fontSize: theme.typography.pxToRem(20),
			fontWeight: theme.typography.fontWeightBold,
			color: blue[700]
		},
		messageText: {
			color: '#4CC417',
			fontSize: 12,
			// backgroundColor: green[700],
    },
    symbolText: {
        color: '#4CC417',
        // backgroundColor: green[700],
    },
    button: {
			margin: theme.spacing(0, 1, 0),
    },
		title: {
			fontSize: theme.typography.pxToRem(15),
			fontWeight: theme.typography.fontWeightBold,
			color: blue[700],
		},
    heading: {
			fontSize: theme.typography.pxToRem(15),
			fontWeight: theme.typography.fontWeightBold,
		},
		selectedAccordian: {
			//backgroundColor: '#B2EBF2',
		},
		normalAccordian: {
			backgroundColor: '#FFE0B2',
		},
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
		noPadding: {
			padding: '1px', 
		}
  }));



var userCid;
export default function Member(props) {
  
  const classes = useStyles();
	const gClasses = globalStyles();
	const alert = useAlert();

	const [memberArray, setMemberArray] = useState([])
	const [currentMember, setCurrentMember] = useState("");
	const [currentMemberData, setCurrentMemberData] = useState(BlankMemberData);
	const [currentHod, setCurrentHod] = useState({});
	const [ceasedArray, setCeasedArray] = useState([]);

	const [radioRecord, setRadioRecord] = useState(0);

	const [currentSelection, setCurrentSelection] = useState("Symptom");
	const [remember, setRemember] = useState(false);
	
	const [isDrawerOpened, setIsDrawerOpened] = useState("");
	//const [isListDrawer, setIsListDrawer] = useState("");

	
	const [filterItem, setFilterItem] = useState("");
	const [filterItemText, setFilterItemText] = useState("");
	const [filterItemArray, setFilterItemArray] = useState([]);
	
	const [symptomArray, setSymptomArray] = useState([]);
	const [diagnosisArray, setDiagnosisArray] = useState([]);

	const [diagnosisDbArray, setDiagnosisDbArray] = useState([]);
	const [symptomDbArray, setSymptomDbArray] = useState([]);
	
	//const [emurVisitNumber, setEmurIndex] = useState(0);
	//const [emurNumber, setEmurNumber] = useState(0);
	const [emurName, setEmurName] = useState("");

	const [modalRegister, setModalRegister] = useState(0);

	

	
  useEffect(() => {	
		const getDetails = async () => {	
			getHodMembers(props.member.hid);
			getHod(props.member.hid);
			setCurrentMemberData(props.member)
		}
		//setCurrentMember(getMemberName(props.member));
		getDetails();
  }, []);


	async function getHod(hid) {
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/hod/get/${hid}`
			let resp = await axios.get(myUrl);
			setCurrentHod(resp.data);
		} catch (e) {
			console.log(e);
			alert.error(`Error fetching HOD details of ${hid}`);
			setCurrentHod({});
		}	
	}

	async function getHodMembers(hid) {
		//console.log("Hi");
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/member/hod/${hid}`
			let resp = await axios.get(myUrl);
			//let tmp = resp.data.find(x => (x.mid % 100) === 1);
			//setCurrentMemberData(tmp);
			setMemberArray(resp.data);
			//setCurrentMember()
		} catch (e) {
			console.log(e);
			alert.error(`Error fetching Member details of HOD ${hid}`);
			setMemberArray([]);
		}	
	}


		

	function DisplayFunctionItem(props) {
		let itemName = props.item;
		return (
		<Grid key={"BUT"+itemName} item xs={4} sm={4} md={2} lg={2} >	
		<Typography onClick={() => setSelection(itemName)}>
			<span 
				className={(itemName === currentSelection) ? gClasses.functionSelected : gClasses.functionUnselected}>
			{itemName}
			</span>
		</Typography>
		</Grid>
		)}
	
	async function setSelection(item) {
		setRadioRecord(0);
		setCurrentSelection(item);
	}
	
	
	function DisplayFunctionHeader() {
	return (
	<Box  className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
	<Grid className={gClasses.noPadding} key="AllPatients" container align="center">
		<DisplayFunctionItem item="General" />
		<DisplayFunctionItem item="Personal" />
		<DisplayFunctionItem item="Office" />
	</Grid>	
	</Box>
	)}


	function ModalResisterStatus() {
    // console.log(`Status is ${modalRegister}`);
		let regerr = true;
    let myMsg;
    switch (modalRegister) {
      case 0:
        myMsg = "";
				regerr = false;
        break;
      case 1001:
        myMsg = `Selected Symptom already added`;
        break;
      case 2001:
        myMsg = `Selected Diagnosis already added`;
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



	function DisplaySingleLine(props) {
	return(
		<Grid className={gClasses.noPadding} key={props.msg1+props.msg2} container align="center">
		<Grid align="left"  item xs={4} sm={4} md={2} lg={2} >
			<Typography className={gClasses.patientInfo2Blue}>{props.msg1}</Typography>
		</Grid>	
		<Grid align="left"  item xs={8} sm={8} md={10} lg={10} >
			<Typography className={gClasses.patientInfo2}>{props.msg2}</Typography>
		</Grid>	
		</Grid>

	)} 


	function editgeneralDetials() {
		alert.info("TO be implemented");
	}

	function handleEditMember(m) {

	}
	

	function handleMoveUpMember() {
		//let fIndex = index - 1;
		//let sIndex = index;
		let index = radioRecord;
		let tmpArray = [].concat(memberArray);
		let tmp = tmpArray[index-1].order;
		tmpArray[index-1].order = tmpArray[index].order;
		tmpArray[index].order = tmp;
		setMemberArray(lodashSortBy(tmpArray, 'order'));
		setRadioRecord(index-1);
		//alert.info("MOve up");
	}

	function handleMoveDownMember() {
		let index = radioRecord;
		let tmpArray = [].concat(memberArray);
		let tmp = tmpArray[index].order;
		tmpArray[index].order = tmpArray[index+1].order;
		tmpArray[index+1].order = tmp;
		setMemberArray(lodashSortBy(tmpArray, 'order'));
		setRadioRecord(index+1);
	}

	function handlePersonalAdd() {

	}

	function handlePersonalEdit() {

	}


	function DisplayGeneralInformation() {
		console.log(currentHod);
	return (
	<Box  className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<VsButton name="Edit General Details" align="right" onClick={editgeneralDetials} />
		<DisplaySingleLine msg1="Gotra" msg2={currentHod.gotra} />
		<BlankArea />
		<DisplaySingleLine msg1="Village" msg2={currentHod.village} />
		<BlankArea />
		<DisplaySingleLine msg1="Res. Addr." msg2={currentHod.resAddr1} />
		{(currentHod.resAddr2 !== "") &&
		<DisplaySingleLine msg1="" msg2={currentHod.resAddr2} />
		}
		{(currentHod.resAddr3 !== "") &&
		<DisplaySingleLine msg1="" msg2={currentHod.resAddr3} />
		}
		{(currentHod.resAddr4 !== "") &&
		<DisplaySingleLine msg1="" msg2={currentHod.resAddr4} />
		}
		{(currentHod.resAddr5 !== "") &&
		<DisplaySingleLine msg1="" msg2={currentHod.resAddr5} />
		}
		<BlankArea />
		<DisplaySingleLine msg1="Suburb" msg2={currentHod.suburb} />
		<BlankArea />
		<DisplaySingleLine msg1="City" msg2={currentHod.city} />
		<BlankArea />
		<DisplaySingleLine msg1="Pin Code" msg2={currentHod.pinCode} />
		<BlankArea />
		<DisplaySingleLine msg1="District" msg2={currentHod.district} />
		<BlankArea />
		<DisplaySingleLine msg1="State" msg2={currentHod.state} />
		<BlankArea />
		<DisplaySingleLine msg1="Res. Phone1" msg2={currentHod.resPhone1} />
		<BlankArea />
		<DisplaySingleLine msg1="Res. Phone2" msg2={currentHod.resPhone2} />
		<BlankArea />
	</Box>	
	)}
	
	function handleCancelMember(m) {
		vsDialog("Remove Member", `Are you sure you want to remove ${m.lastName} ${m.firstName} ${m.middleName}?`,
		{label: "Yes", onClick: () => handleCancelMemberConfrim(d) },
		{label: "No" }
		);
	}
	
	function handleCancelMemberConfrim(m) {
		setMemberArray(memberArray.filter(x => x.mid !== m.mid));
	}	

	function handleCeasedMember() {
		let m = memberArray[radioRecord];
		vsDialog("Member Ceased", `Are you sure you want to declare ${m.lastName} ${m.firstName} ${m.middleName} as ceased?`,
		{label: "Yes", onClick: handleCeasedMemberConfirm },
		{label: "No" }
		);
	}

	function handleCeasedMemberConfirm() {
		let tmpArray = [].concat(ceasedArray);
		let casedRec = lodashCloneDeep(memberArray[radioRecord]);
		tmpArray.push(casedRec);
		setCeasedArray(tmpArray)
		tmpArray = memberArray.filter(x => x.order !== radioRecord);
		for(let i=0; i<tmpArray.length; ++i) {
			tmpArray[i].order = i;
		}
		setMemberArray(tmpArray);
		setRadioRecord(0);
	}
	
	

	function handleMemberAsHod() {
		let m = memberArray[radioRecord];
		vsDialog("Member Ceased", `Are you sure you want to declare ${m.lastName} ${m.firstName} ${m.middleName} as Hod?`,
		{label: "Yes", onClick: handleMemberAsHodConfirm },
		{label: "No" }
		);
	}

	function handleMemberAsHodConfirm() {
		let tmpRec = lodashCloneDeep(memberArray[radioRecord]);
		let tmpArray = memberArray.filter(x => x.order !== radioRecord);
		tmpArray = [tmpRec].concat(tmpArray)
		for(let i=0; i<tmpArray.length; ++i) {
			tmpArray[i].order = i;
		}
		setMemberArray(tmpArray);
		setRadioRecord(0);
	}



	function DisplayPersonalButtons() {
		//console.log("Curent", radioRecord);
		let lastItemIndex =  memberArray.length-1;
		let showUp = true;
		let showDown = true;
		if (radioRecord <= 1) showUp = false;
		if ((radioRecord === 0) || (radioRecord === lastItemIndex)) showDown = false;
	return(
	<div>
		<VsButton name="Add new Member" onClick={handlePersonalAdd} />
		<VsButton name="Edit member" onClick={handlePersonalEdit} />
		<VsButton name="Scroll Up" disabled={!showUp} onClick={handleMoveUpMember} />
		<VsButton name="Scroll Down" disabled={!showDown} onClick={handleMoveDownMember} />
		<VsButton name="Ceased" disabled={radioRecord === 0} onClick={handleCeasedMember} />
		<VsButton name="Set Hod" disabled={radioRecord === 0} onClick={handleMemberAsHod} />
	</div>
	)}

	function DisplayOfficeButtons() {
		//console.log("Curent", radioRecord);
		let lastItemIndex =  memberArray.length-1;
		let showUp = true;
		let showDown = true;
		if (radioRecord <= 1) showUp = false;
		if ((radioRecord === 0) || (radioRecord === lastItemIndex)) showDown = false;
	return(
	<div>
		<VsButton name="Add new Member" onClick={handlePersonalAdd} />
		<VsButton name="Edit member" onClick={handlePersonalEdit} />
		<VsButton name="Scroll Up" disabled={!showUp} onClick={handleMoveUpMember} />
		<VsButton name="Scroll Down" disabled={!showDown} onClick={handleMoveDownMember} />
	</div>
	)}

	function DisplayPersonalInformation() {
	let lastItemIndex =  memberArray.length-1;
	return (
	<div>
	{memberArray.map( (m, index) => {
		let dobStr = "";
		let d = new Date(m.dob);
		let myYear = d.getFullYear() ;
		if (myYear !== 1900) {
			dobStr = DATESTR[d.getDate()]+'/'+MONTHNUMBERSTR[d.getMonth()]+"/"+(myYear % 100) + " " + m.bloodGroup;
		}
		if (m.ceased) return null;
		let showUp = false;
		let showDown = false;
		if (index >= 2) showUp = true;
		if ((index !== 0) && (index !== lastItemIndex)) showDown = true;
		return (
		<Box  key={"MEMBOX"+index} className={gClasses.boxStyle} borderColor="black" borderRadius={30} border={1} >
		<Grid key={"MEMGRID"+index} className={gClasses.noPadding} key={"SYM"+index} container justify="center" alignItems="center" >
			<Grid align="left" item xs={8} sm={3} md={3} lg={3} >
				{(index === 0) &&
				<Typography className={gClasses.patientInfo2Brown}>{m.patientInfo2}
					{m.title+" "+m.lastName + " " + m.firstName + " " + m.middleName +((m.alias !== "") ? "("+m.alias+")" : "")}
				</Typography>
				}
				{(index > 0) &&
				<Typography className={gClasses.patientInfo2Blue}>{m.patientInfo2}
					{m.title+" "+m.lastName + " " + m.firstName + " " + m.middleName +((m.alias !== "") ? "("+m.alias+")" : "")}
				</Typography>
				}				
			</Grid>
			<Grid align="left" item xs={2} sm={6} md={1} lg={1} >
				<Typography className={gClasses.patientInfo2}>{m.patientInfo2}{m.relation}</Typography>
			</Grid>
			<Grid align="left" item xs={2} sm={6} md={1} lg={1} >
				<Typography className={gClasses.patientInfo2}>
					{m.patientInfo2}{m.gender}
				</Typography>
			</Grid>
			<Grid align="left" item xs={4} sm={6} md={1} lg={1} >
				<Typography className={gClasses.patientInfo2}>{m.patientInfo2}{m.emsStatus}</Typography>
			</Grid>
			<Grid align="left" item xs={4} sm={6} md={1} lg={1} >
				<Typography className={gClasses.patientInfo2}>{m.patientInfo2}{dobStr}</Typography>
			</Grid>
			{/*<Grid item xs={6} sm={6} md={1} lg={1} >
				<Typography className={gClasses.patientInfo2}>{m.patientInfo2}{m.bloodGroup}</Typography>
			</Grid>*/}
			<Grid align="left" item xs={4} sm={6} md={1} lg={1} >
				<Typography className={gClasses.patientInfo2}>{m.patientInfo2}{m.occupation}</Typography>
			</Grid>
			<Grid align="left"  item xs={6} sm={6} md={1} lg={1} >
				<Typography className={gClasses.patientInfo2}>{m.patientInfo2}{dispMobile(m.mobile)}</Typography>
				<Typography className={gClasses.patientInfo2}>{m.patientInfo2}{dispMobile(m.mobile1)}</Typography>
			</Grid>
			<Grid align="left" item xs={6} sm={6} md={2} lg={2} >
				<Typography className={gClasses.patientInfo2}>{m.patientInfo2}{dispEmail(m.email)}</Typography>
				<Typography className={gClasses.patientInfo2}>{m.patientInfo2}{dispEmail(m.email1)}</Typography>
			</Grid>
			<Grid item xs={1} sm={1} md={1} lg={1} >
				<div>	
					{(false) &&
					<div>
					{(showUp) &&
						<ArrowUpwardRounded color="primary" size="small" onClick={() => handleMoveUpMember(index)} />
					}
					{(!showUp) &&
						<ArrowUpwardRounded size="small"  />
					}
					{(showDown) &&
						<ArrowDownwardRounded color="primary" size="small" onClick={() => handleMoveDownMember(index)} />
					}
					{(!showDown) &&
						<ArrowDownwardRounded size="small"  />
					}
					<EditIcon color="primary" size="small" onClick={() => handleEditMember(m)} />
					{((index !== 0) && false) &&
					<VsCancel onClick={() => handleCancelMember(m)} />
					}
					{((index === 0) && false) &&
					<VsCancel disabled/>
					}
					</div>
					}
					<VsRadio checked={radioRecord === m.order} onClick={() => setRadioRecord(m.order)}  />
				</div>
			</Grid>
		</Grid>
		</Box>
		)}
	)}	
	</div>	
	)}

	function DisplayOfficeInformation() {
		let lastItemIndex =  memberArray.length-1;
		console.log(memberArray);
		return (
		<div>
		{memberArray.map( (m, index) => {
			let dobStr = "";
			let d = new Date(m.dob);
			let myYear = d.getFullYear() ;
			if (myYear !== 1900) {
				dobStr = DATESTR[d.getDate()]+'/'+MONTHNUMBERSTR[d.getMonth()]+"/"+(myYear % 100) + " " + m.bloodGroup;
			}
			let showUp = false;
			let showDown = false;
			if (index >= 2) showUp = true;
			if ((index !== 0) && (index !== lastItemIndex)) showDown = true;
			return (
			<Box  key={"MEMBOX"+index} className={gClasses.boxStyle} borderColor="black" borderRadius={30} border={1} >
			<Grid key={"MEMGRID"+index} className={gClasses.noPadding} key={"SYM"+index} container justify="center" alignItems="center" >
				<Grid align="left" item xs={8} sm={2} md={3} lg={3} >
					{(index === 0) &&
					<Typography className={gClasses.patientInfo2Brown}>{m.patientInfo2}
						{m.title+" "+m.lastName + " " + m.firstName + " " + m.middleName +((m.alias !== "") ? "("+m.alias+")" : "")}
					</Typography>
					}
					{(index > 0) &&
					<Typography className={gClasses.patientInfo2Blue}>{m.patientInfo2}
						{m.title+" "+m.lastName + " " + m.firstName + " " + m.middleName +((m.alias !== "") ? "("+m.alias+")" : "")}
					</Typography>
					}				
				</Grid>
				<Grid align="left" item xs={2} sm={6} md={1} lg={1} >
					<Typography className={gClasses.patientInfo2}>{m.patientInfo2}{m.education}</Typography>
				</Grid>
				<Grid align="left" item xs={12} sm={12} md={5} lg={5} >
					<Typography className={gClasses.patientInfo2}>
						{m.patientInfo2}{m.officeName}
					</Typography>
				</Grid>
				{/*<Grid align="left" item xs={2} sm={6} md={3} lg={3} >
					<Typography className={gClasses.patientInfo2}>
						{m.patientInfo2}{m.officeAddr1}
					</Typography>
				</Grid>*/}
				<Grid align="left" item xs={4} sm={6} md={1} lg={1} >
					<Typography className={gClasses.patientInfo2}>{m.patientInfo2}{m.officePhone}</Typography>
				</Grid>
				<Grid item xs={12} sm={12} md={2} lg={2} >
					<div>	
						{/*
						{(showUp) &&
							<ArrowUpwardRounded color="primary" size="small" onClick={() => handleMoveUpMember(index)} />
						}
						{(!showUp) &&
							<ArrowUpwardRounded size="small"  />
						}
						{(showDown) &&
							<ArrowDownwardRounded color="primary" size="small" onClick={() => handleMoveDownMember(index)} />
						}
						{(!showDown) &&
							<ArrowDownwardRounded size="small"  />
						}
					*/}
						{/*
						<EditIcon color="primary" size="small" onClick={() => handleEditMember(m)} />
						{((index !== 0) && false) &&
						<VsCancel onClick={() => handleCancelMember(m)} />
						}
						{((index === 0) && false) &&
						<VsCancel disabled/>
						}
					*/}
					<VsRadio checked={radioRecord === m.order} onClick={() => setRadioRecord(m.order)}  />
					</div>
				</Grid>
			</Grid>
			</Box>
			)}
		)}	
		</div>	
		)}
	
	return (
	<div className={gClasses.webPage} align="center" key="main">
	<CssBaseline />
	<DisplayMemberHeader member={currentMemberData} />
	<Divider className={gClasses.divider} />
	<DisplayFunctionHeader />
	{(currentSelection === "General") &&
		<DisplayGeneralInformation />
	}
	{(currentSelection === "Personal") &&
		<div>
		<DisplayPersonalButtons />
		<DisplayPersonalInformation />
		</div>
	}
	{(currentSelection === "Office") &&
		<div>
		<DisplayOfficeButtons />
		<DisplayOfficeInformation />
		</div>
	}
  </div>
  );    
}
