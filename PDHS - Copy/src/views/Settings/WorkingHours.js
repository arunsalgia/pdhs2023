import React, { useEffect, useState, useContext } from 'react';
import TextField from '@material-ui/core/TextField';
import { InputAdornment, makeStyles, Container, CssBaseline } from '@material-ui/core';
import axios from "axios";
import Checkbox from '@material-ui/core//Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import SwitchBtn from '@material-ui/core/Switch';
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import VsButton from "CustomComponents/VsButton";
import VsCancel from "CustomComponents/VsCancel";
import { useLoading, Audio } from '@agney/react-loading';
import Drawer from '@material-ui/core/Drawer';
import { useAlert } from 'react-alert';

import Grid from "@material-ui/core/Grid";
import GridItem from "components/Grid/GridItem.js";
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Select from "@material-ui/core/Select";
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Box from '@material-ui/core/Box';
import Modal from 'react-modal';
import { borders } from '@material-ui/system';
import {dynamicModal } from "assets/dynamicModal";
import cloneDeep from 'lodash/cloneDeep';

// styles
import globalStyles from "assets/globalStyles";
import modalStyles from "assets/modalStyles";

// icons
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
import CancelIcon from '@material-ui/icons/Cancel';
import EventNoteIcon from '@material-ui/icons/EventNote';
import AddIcon from '@material-ui/icons/AddCircleOutline';

import Switch from "@material-ui/core/Switch";


import Link from '@material-ui/core/Link';

// import Table from "components/Table/Table.js";
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Radio from '@material-ui/core/Radio';
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import Avatar from "@material-ui/core/Avatar"
// import CardAvatar from "components/Card/CardAvatar.js";
// import { useHistory } from "react-router-dom";
// import { UserContext } from "../../UserContext";

import {DisplayYesNo, DisplayPageHeader, ValidComp, BlankArea,
DisplayPatientDetails,
DisplayDocumentList,
DisplayImage, DisplayPDF,
LoadingMessage,
DisplayDocumentDetails,
} from "CustomComponents/CustomComponents.js"

import {
SupportedMimeTypes, SupportedExtensions,
str1by4, str1by2, str3by4,
WEEKSTR, SHORTWEEKSTR, BLOCKNUMBER, MINUTEBLOCK,
HOURSTR, MINUTESTR
} from "views/globals.js";

// icons
import FileCopyIcon from '@material-ui/icons/FileCopy';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
//import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Cancel';
import VisibilityIcon from '@material-ui/icons/Visibility';


//colours 
import { red, blue 
} from '@material-ui/core/colors';

import { callYesNo, 
	downloadVisit,
	encrypt, decrypt, 
	validateInteger,
	updatePatientByFilter,
	dispAge, dispEmail, dispMobile,
	getPatientDocument,
	stringToBase64,
} from "views/functions.js";

const useStyles = makeStyles((theme) => ({
	blueCheckBox: {
		color: 'blue',
	},
	blueCheckBoxLabel: {
		color: 'blue',
		fontSize: theme.typography.pxToRem(14),
		fontWeight: theme.typography.fontWeightBold,
	},
	selIndex: {
		color: 'blue',
		fontSize: theme.typography.pxToRem(18),
		fontWeight: theme.typography.fontWeightBold,
	},
	unselIndex: {
		fontSize: theme.typography.pxToRem(18),
		fontWeight: theme.typography.fontWeightBold,
	},
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
		normalAccordian: {
			backgroundColor: '#B2EBF2',
			fontSize: theme.typography.pxToRem(28),
			fontWeight: theme.typography.fontWeightBold,
		},
		selectedAccordian: {
			backgroundColor: '#FFE0B2',
			fontSize: theme.typography.pxToRem(28),
			fontWeight: theme.typography.fontWeightBold,
		},
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
		noPadding: {
			padding: '1px', 
		}
  }));

const addEditModal = dynamicModal('60%');
const yesNoModal = dynamicModal('60%');

const COUNTPERPAGE=10;


let test=[];
let medQty=[];
const timeArray=[1, 2, 3, 4, 5, 6, 7];
const unitArray=["Day", "Week", "Month", "Year"];

var customerData;
var userCid;
export default function WorkingHours() {
  
  const classes = useStyles();
	const gClasses = globalStyles();
	const alert = useAlert();
	
	const [defaultMorningSlots, setDefaultMorningSlots] = useState([]);
	const [defaultAfternoonSlots, setDefaultAfternoonSlots] = useState([]);
	const [defaultEveningSlots, setDefaultEveningSlots] = useState([]);
	
	const [workingArray, setWorkingArray] = useState([])
	const [currentIndex, setCurrentIndex] = useState(0);
	const [morningCB, setMorningCB] = useState(false);
	const [afternoonCB, setAfternoonCB] = useState(false);
	const [eveningCB, setEveningCB] = useState(false);
	
	const [modalIsOpen,setIsOpen] = useState("");
	function openModal(fun) { setIsOpen(fun); }
  function closeModal() { setIsOpen(""); }	
  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    //subtitle.style.color = '#f00';
  }
	
	
  useEffect(() => {	
		userCid = sessionStorage.getItem("cid");
		let w=[];
		for(let i=0; i<700; ++i) {
			w.push(false);
		}
		customerData = JSON.parse(sessionStorage.getItem("customerData"));
		//console.log(customerData.workingHours);
		for(let i=0; i<customerData.workingHours.length; ++i) {
			w[customerData.workingHours[i]] = true;
		}
		setWorkingArray(w);
		
		let allSlotStr = process.env.REACT_APP_DEFAULTMORNINGSLOTS;
		let allSlotSplit = allSlotStr.split(",");
		//console.log(allSlotSplit);
		let allSlotArray = [];
		for(let i=0; i<allSlotSplit.length; ++i) {
			allSlotArray.push(Number(allSlotSplit[i]));
		}
		//console.log(allSlotArray);
		setDefaultMorningSlots(allSlotArray);
			
		allSlotStr = process.env.REACT_APP_DEFAULTAFTERNOONSLOTS;
		allSlotSplit = allSlotStr.split(",");
		allSlotArray = [];
		for(let i=0; i<allSlotSplit.length; ++i) {
			allSlotArray.push(Number(allSlotSplit[i]));
		}
		setDefaultAfternoonSlots(allSlotArray);
			
		allSlotStr = process.env.REACT_APP_DEFAULTEVENINGSLOTS;
		allSlotSplit = allSlotStr.split(",");
		allSlotArray = [];
		for(let i=0; i<allSlotSplit.length; ++i) {
			allSlotArray.push(Number(allSlotSplit[i]));
		}
		setDefaultEveningSlots(allSlotArray);

  }, []);


  const [expandedPanel, setExpandedPanel] = useState(false);
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    // console.log({ event, isExpanded });
    setExpandedPanel(isExpanded ? panel : false);
  };
  
	function toggleCheckbox(index) {
		//console.log(index);
		let tmp = [].concat(workingArray);
		tmp[index] = !tmp[index]
		setWorkingArray(tmp);
	}
	
	function toggleAllCheckbox(slotType, start, end) {
		let current;
		switch (slotType) {
			case "MORNING": current = !morningCB; setMorningCB(!morningCB); break;
			case "AFTERNOON": current = !afternoonCB; setAfternoonCB(!afternoonCB); break;
			case "EVENING": current = !eveningCB; setEveningCB(!eveningCB); break;
		}
		//console.log(start, end);
		let tmp = [].concat(workingArray);
		for(let i=start; i<end; ++i) {
			tmp[i] = current;
		}
		setWorkingArray(tmp);
	}
	
	function DisplayDayDetails(props) {
	return (
		<div>
		<Grid maxWidth="100%" className={gClasses.noPadding} key={"DAYSLOT"+props.day} container alignItems="center" >
		{/* Morning Slots */}
		<Box maxWidth="100%" className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<Grid item xs={12} sm={12} md={12} lg={12} >
			<Typography>{"Working slots of morning"}</Typography>
		</Grid>
		</Box>
		{workingArray.slice(props.day*100 + BLOCKNUMBER.morningBlockStart,
			props.day*100 + BLOCKNUMBER.morningBlockEnd	+ 1).map( (w, index) => {
				let hour = Math.floor((BLOCKNUMBER.morningBlockStart + index ) / 4);
				let min = MINUTEBLOCK[(BLOCKNUMBER.morningBlockStart + index ) % 4];
			return (
			<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >			
			<Grid item xs={3} sm={3} md={3} lg={3} >
			<Typography>{HOURSTR[hour]+":"+MINUTESTR[min]+(w ? " Y" : " N")}</Typography>	
			</Grid>
			</Box>
			)}
		)}
		{/* afternoon Slots */}
		<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<Grid item xs={12} sm={12} md={12} lg={12} >
			<Typography>{"Working slots of afternoon"}</Typography>
		</Grid>
		</Box>
		{workingArray.slice(props.day*100 + BLOCKNUMBER.afternoonBlockStart,
			props.day*100 + BLOCKNUMBER.afternoonBlockEnd	+ 1).map( (w, index) => {
				let hour = Math.floor((BLOCKNUMBER.afternoonBlockStart + index ) / 4);
				let min = MINUTEBLOCK[(BLOCKNUMBER.afternoonBlockStart + index ) % 4];
			return (
			<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
			<Grid item xs={3} sm={3} md={3} lg={3} >
				<Typography>{"Aft "+HOURSTR[hour]+":"+MINUTESTR[min]+"is"+w}</Typography>	
			</Grid>
			</Box>
			)}
		)}
		{/* evening Slots */}
		<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<Grid item xs={12} sm={12} md={12} lg={12} >
			<Typography>{"Working slots of evening"}</Typography>
		</Grid>
		</Box>
		{workingArray.slice(props.day*100 + BLOCKNUMBER.eveningBlockStart,
			props.day*100 + BLOCKNUMBER.eveningBlockEnd	+1).map( (w, index) => {
				let hour = Math.floor((BLOCKNUMBER.eveningBlockStart + index )/ 4);
				let min = MINUTEBLOCK[(BLOCKNUMBER.eveningBlockStart + index ) % 4];
			return (
			<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
			<Grid item xs={3} sm={3} md={3} lg={3} >
			<Typography>{"EVE "+HOURSTR[hour]+":"+MINUTESTR[min]+"is"+w}</Typography>	
			</Grid>
			</Box>
			)}
		)}
	</Grid>
	</div>
	)}
	
	function setDefaultSlots(slotType, startNum, endNum) {
		let i, blockNumber;
		//console.log(defaultMorningSlots);
		//console.log(defaultAfternoonSlots);
		//console.log(defaultEveningSlots);
		//console.log(slotType);
		let tmpArray = [].concat(workingArray);
		for(i=startNum; i<=endNum; ++i) {
			blockNumber = i % 100;
			switch (slotType) {
				case "MORNING":
					tmpArray[i] = defaultMorningSlots.includes(blockNumber);
					//console.log(i,  tmpArray[i]);
					break;
				case "AFTERNOON":
					tmpArray[i] = defaultAfternoonSlots.includes(blockNumber); 
					break;
				case "EVENING":
					tmpArray[i] = defaultEveningSlots.includes(blockNumber); 
					break;
			}
		}
		//console.log(i,  tmpArray[i]);
		setWorkingArray(tmpArray);
	}
	
	function DisplayMorningSlots() {
	let startNum = currentIndex*100 + BLOCKNUMBER.morningBlockStart;
	let endNum = currentIndex*100 + BLOCKNUMBER.morningBlockEnd + 1;
	//console.log(startNum, endNum);
	return (
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
	<Grid className={classes.noPadding} key={"MED"+currentIndex} container alignItems="center"  >
	<Grid item xs={12} sm={6} md={6} lg={6} >
		<div align="center">
		<Typography className={classes.slotTitle}>{WEEKSTR[currentIndex]+" Morning slots"}</Typography>
		</div>
	</Grid>
	<Grid item xs={6} sm={3} md={3} lg={3} >
		{(sessionStorage.getItem("userType") === "Doctor") &&
			<VsButton name="Set default Morning Slots" onClick={() => {setDefaultSlots("MORNING", startNum, endNum)}} />
		}
	</Grid>
	<Grid item xs={6} sm={3} md={3} lg={3} >
	{(sessionStorage.getItem("userType") === "Doctor") &&
	 <FormControlLabel 
		control={
		 <Checkbox 
			key={"MorningCB"} 
			checked={morningCB} 
			onClick={() => {toggleAllCheckbox("MORNING", startNum, endNum)}}
			className={classes.blueCheckBox}
			/>
		} 
		 label={
			 <Typography className={classes.blueCheckBoxLabel}>
			 {"Select all morning slots"} 
			 </Typography>
		 }
		/>
	}
	</Grid>
	{workingArray.slice(startNum, endNum).map( (m, index) =>	{
		let tmp = BLOCKNUMBER.morningBlockStart + index;
		let hour = Math.floor(tmp / 4);
		let minute = MINUTEBLOCK[tmp % 4];
		return (
			<Grid key={"gr"+HOURSTR[hour]+":"+MINUTESTR[minute]} item xs={3} sm={2} md={1} lg={1} >	
			<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
				{(sessionStorage.getItem("userType") === "Doctor") &&
					<FormControlLabel 
					control={
					 <Checkbox 
						key={HOURSTR[hour]+":"+MINUTESTR[minute]} 
						checked={workingArray[startNum+index]} 
						onClick={() => {toggleCheckbox(startNum+index)}}
						className={classes.blueCheckBox}
						/>
					} 
					label={
					 <Typography className={classes.blueCheckBoxLabel}>
					 {HOURSTR[hour]+":"+MINUTESTR[minute]} 
					 </Typography>
					}
					/>
				}
				{(sessionStorage.getItem("userType") !== "Doctor") &&
					<FormControlLabel 
					control={
					 <Checkbox 
						key={HOURSTR[hour]+":"+MINUTESTR[minute]} 
						checked={workingArray[startNum+index]} 
						className={classes.blueCheckBox}
						/>
					} 
					label={
					 <Typography className={classes.blueCheckBoxLabel}>
					 {HOURSTR[hour]+":"+MINUTESTR[minute]} 
					 </Typography>
					}
					/>
				}
			</Box>
			</Grid>
		)}
	)}
	</Grid>
	</Box>
	)}
	
	function DisplayAfterNoonSlots() {
	let startNum = currentIndex*100 + BLOCKNUMBER.afternoonBlockStart;
	let endNum = currentIndex*100 + BLOCKNUMBER.afternoonBlockEnd + 1;
	return (
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
	<Grid className={classes.noPadding} key={"MED"+currentIndex} container alignItems="center"  >
	<Grid item xs={12} sm={6} md={6} lg={6} >
		<div align="center">
		<Typography className={classes.slotTitle}>{WEEKSTR[currentIndex]+" afternoon slots"}</Typography>
		</div>
	</Grid>
	<Grid item xs={6} sm={3} md={3} lg={3} >
		{(sessionStorage.getItem("userType") === "Doctor") &&
			<VsButton name="Set default Afternoon Slots" onClick={() => {setDefaultSlots("AFTERNOON", startNum, endNum)}} />
		}
	</Grid>
	<Grid item xs={6} sm={3} md={3} lg={3} >
	{(sessionStorage.getItem("userType") === "Doctor") &&
		 <FormControlLabel 
			control={
			 <Checkbox 
				key={"AfternoonCB"} 
				checked={afternoonCB} 
				onClick={() => {toggleAllCheckbox("AFTERNOON", startNum, endNum)}}
				className={classes.blueCheckBox}
				/>
			} 
			 label={
				 <Typography className={classes.blueCheckBoxLabel}>
				 {"Select all afternoon slots"} 
				 </Typography>
			 }
		/>
	}
	</Grid>
	{workingArray.slice(startNum, endNum).map( (m, index) =>	{
		let tmp = BLOCKNUMBER.afternoonBlockStart + index;
		let hour = Math.floor(tmp / 4);
		let minute = MINUTEBLOCK[tmp % 4];
		return (
			<Grid item xs={3} sm={2} md={1} lg={1} >	
			<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
				{(sessionStorage.getItem("userType") === "Doctor") &&
					<FormControlLabel 
						control={
						 <Checkbox 
							key={HOURSTR[hour]+":"+MINUTESTR[minute]} 
							checked={workingArray[startNum+index]} 
							onClick={() => {toggleCheckbox(startNum+index)}}
							className={classes.blueCheckBox}
							/>
							} 
						 label={
							 <Typography className={classes.blueCheckBoxLabel}>
							 {HOURSTR[hour]+":"+MINUTESTR[minute]} 
							 </Typography>
						 }
					/>
				}
				{(sessionStorage.getItem("userType") !== "Doctor") &&
					<FormControlLabel 
						control={
						 <Checkbox 
							key={HOURSTR[hour]+":"+MINUTESTR[minute]} 
							checked={workingArray[startNum+index]} 
							className={classes.blueCheckBox}
							/>
							} 
						 label={
							 <Typography className={classes.blueCheckBoxLabel}>
							 {HOURSTR[hour]+":"+MINUTESTR[minute]} 
							 </Typography>
						 }
					/>
				}
			</Box>
			</Grid>
		)}
	)}
	</Grid>
	</Box>
	)}

	function DisplayEveningSlots() {
	let startNum = currentIndex*100 + BLOCKNUMBER.eveningBlockStart;
	let endNum = currentIndex*100 + BLOCKNUMBER.eveningBlockEnd + 1;
	//console.log(startNum, endNum);
	return (
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
	<Grid className={classes.noPadding} key={"MED"+currentIndex} container alignItems="center"  >
	<Grid item xs={12} sm={6} md={6} lg={6} >
		<div align="center">
		<Typography className={classes.slotTitle}>{WEEKSTR[currentIndex]+" evening slots"}</Typography>
		</div>
	</Grid>
	<Grid item xs={6} sm={3} md={3} lg={3} >
		{(sessionStorage.getItem("userType") === "Doctor") &&
			<VsButton name="Set default Evening Slots" onClick={() => {setDefaultSlots("EVENING", startNum, endNum)}} />
		}
	</Grid>
	<Grid item xs={6} sm={3} md={3} lg={3} >
	{(sessionStorage.getItem("userType") === "Doctor") &&
	 <FormControlLabel 
		control={
		 <Checkbox 
			key={"evening"} 
			checked={eveningCB} 
			onClick={() => {toggleAllCheckbox("EVENING", startNum, endNum)}}
			className={classes.blueCheckBox}
			/>
		} 
		 label={
			 <Typography className={classes.blueCheckBoxLabel}>
			 {"Select all evening slots"} 
			 </Typography>
		 }
	/>
	}
	</Grid>
	{workingArray.slice(startNum, endNum).map( (m, index) =>	{
		let tmp = BLOCKNUMBER.eveningBlockStart + index;
		let hour = Math.floor(tmp / 4);
		let minute = MINUTEBLOCK[tmp % 4];
		return (
			<Grid item xs={3} sm={2} md={1} lg={1} >	
			<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
				{(sessionStorage.getItem("userType") === "Doctor") &&
					<FormControlLabel 
						control={
						 <Checkbox 
							key={HOURSTR[hour]+":"+MINUTESTR[minute]} 
							checked={workingArray[startNum+index]} 
							onClick={() => {toggleCheckbox(startNum+index)}}
							className={classes.blueCheckBox}
							/>
						} 
						label={
						 <Typography className={classes.blueCheckBoxLabel}>
						 {HOURSTR[hour]+":"+MINUTESTR[minute]} 
						 </Typography>
						}
					/>
				}
				{(sessionStorage.getItem("userType") !== "Doctor") &&
					<FormControlLabel 
						control={
						 <Checkbox 
							key={HOURSTR[hour]+":"+MINUTESTR[minute]} 
							checked={workingArray[startNum+index]} 
							className={classes.blueCheckBox}
							/>
						} 
						label={
						 <Typography className={classes.blueCheckBoxLabel}>
						 {HOURSTR[hour]+":"+MINUTESTR[minute]} 
						 </Typography>
						}
					/>
				}
			</Box>
			</Grid>
		)}
	)}
	</Grid>
	</Box>
	)}

	function DisplayDaySummary(props) {
	return (
	<Grid key={"MG"+props.day} container justify="center" alignItems="center" >
	<Grid item xs={10} sm={10} md={10} lg={10} >
		<div align="left">
		<Typography className={(expandedPanel !== "DAY"+props.day) ? classes.selectedAccordian : classes.normalAccordian}>
		{"Working hours of "+WEEKSTR[props.day]}
		</Typography>
		</div>
	</Grid>
	<Grid item xs={1} sm={1} md={1} lg={1} >
	</Grid>
	</Grid>
	)}
	
	function handleCategoryClick(day) {
		setCurrentIndex(day);
		setMorningCB(false);
		setAfternoonCB(false);
		setEveningCB(false);
	}
	
	function DisplayDaySelection() {
	return (
	<Box className={gClasses.boxStyle} borderRadius={7} border={1} >
	<Grid className={gClasses.noPadding} key="DOCTYPE" container alignItems="center" >
		<Grid key="DOCTYPETITLE" item xs={12} sm={12} md={12} lg={12} >
			<div align="center">
			<Typography className={classes.slotTitle} >{"Working Slots of Week day"}</Typography>
			</div>
		</Grid>		
		<Grid key={"LEFT"} item xs={false} sm={false} md={2} lg={2} />
		{[0,1,2,3,4,5,6].map( (index) => {
			let myClass = (index === currentIndex) ? classes.selIndex : classes.unselIndex;
			return (
				<Grid key={"DOC"+index} item xs={4} sm={3} md={1} lg={1} >
					<Typography className={myClass} 
						onClick={() => {handleCategoryClick(index)}}
					>
					{SHORTWEEKSTR[index]}
					</Typography>
				</Grid>
			)}
		)}
	</Grid>
	</Box>
	)}
	
	async function updateWorkingHours() {
		let workingslots = [];
		for(let i=0; i<700; ++i) {
			if (workingArray[i]) workingslots.push(i);
		}
		try {
			let tmp = JSON.stringify(workingslots);
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/customer/setworkinghours/${userCid}/${tmp}`;
			let resp = await axios.get(myUrl);
			// success
			alert.success("Successfully updated weekly working hours");
			customerData = resp.data;
			sessionStorage.setItem("customerData", JSON.stringify(customerData));
		} catch (e) {
			console.log(e);
			alert.error("Error update weekly working hours");
		}
	}
	
	
	return (
	<div className={gClasses.webPage} align="center" key="main">
	<DisplayPageHeader headerName="Configure weekly working slots" groupName="" tournament=""/>
	<Container component="main" maxWidth="lg">
	<CssBaseline />
	{(sessionStorage.getItem("userType") === "Doctor") &&
		<VsButton name="Update working hours" align="right" onClick={updateWorkingHours} />
	}
	<DisplayDaySelection />
	<DisplayMorningSlots />
	<DisplayAfterNoonSlots />
	<DisplayEveningSlots />
	</Container>			
  </div>
  );    


}
