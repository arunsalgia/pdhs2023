import React from 'react';
import ReactDOM from 'react-dom';
//import ReactTooltip from "react-tooltip";
import TextField from '@material-ui/core/TextField'; 
import Tooltip from "react-tooltip";
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
//import PDFViewer from 'pdf-viewer-reactjs';
import lodashSumBy from 'lodash/sumBy';
//import VsCancel from "CustomComponents/VsCancel";

import VsRadioSa from "CustomComponents/VsRadioSa";
import VsButton from "CustomComponents/VsButton";
import VsPdhsFilter from "CustomComponents/VsPdhsFilter";
import VsSelect from "CustomComponents/VsSelect";


import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import {red, blue, green, deepOrange, yellow} from '@material-ui/core/colors';
import {
  validateSpecialCharacters, validateEmail, validateMobile, validateInteger, validateUpi,
  encrypt, decrypt, 
	dateString,
  currentAPLVersion, latestAPLVersion,
	getImageName,
	dispOnlyAge, dispAge, dispEmail, dispMobile, capitalizeFirstLetter,
	getMemberName, getRelation,
	checkIfBirthday,
	ordinalSuffix,
} from "views/functions.js";

import {
	HOURSTR, MINUTESTR, DATESTR, MONTHNUMBERSTR, MONTHSTR, INR,
	APPLICATIONSTATUS, APPLICATIONTYPES,
	AppHeaderStyle, AppDataStyle,
  SELECTSTYLE, NORMALSELECTSTYLE,
} from "views/globals.js";


import globalStyles from "assets/globalStyles";

import InfoIcon from 			'@material-ui/icons/Info';
import CancelIcon from '@material-ui/icons/Cancel';
import EditIcon from 			'@material-ui/icons/Edit';
//import PreviewIcon from '@material-ui/icons/Preview';
import VisibilityIcon from '@material-ui/icons/Visibility';
import MoreVertIcon from '@material-ui/icons/MoreVert';



const useStyles = makeStyles((theme) => ({
  title: {
		fontSize: theme.typography.pxToRem(20),
		fontWeight: theme.typography.fontWeightBold,
		color: blue[300],
	},
	paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    //margin: theme.spacing(1),
		//paddingTop: '15%',
		marginTop: '15%',
    backgroundColor: theme.palette.secondary.main,
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  button: {
    margin: theme.spacing(0, 1, 0),
  },
  jumpButton: {
    // margin: theme.spacing(0, 1, 0),
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
    backgroundColor: '#FFFFFF',
    color: '#1A233E',
    fontWeight: theme.typography.fontWeightBold,
    fontSize: '16px',
    width: theme.spacing(20),
  },
  jumpButtonFull: {
    // margin: theme.spacing(0, 1, 0),
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
    backgroundColor: '#FFFFFF',
    color: '#1A233E',
    fontWeight: theme.typography.fontWeightBold,
    fontSize: '16px',
    width: theme.spacing(40),
  },
  groupName:  {
    // right: 0,
    fontSize: '14px',
    fontWeight: theme.typography.fontWeightBold,
    color: blue[300],
    // position: 'absolute',
    alignItems: 'center',
    marginTop: '0px',
  },
  balance:  {
    // right: 0,
    marginRight: theme.spacing(3),
    fontSize: '18px',
    fontWeight: theme.typography.fontWeightBold,
    color: blue[900],
    // // position: 'absolute',
    // alignItems: 'center',
    // marginTop: '0px',
  },
  version:  {
    //marginRight: theme.spacing(3),
    fontSize: '18px',
    color: blue[900],
  },
  error:  {
    // right: 0,
    fontSize: '12px',
    color: red[300],
    // position: 'absolute',
    alignItems: 'center',
    marginTop: '0px',
  },
  successMessage: {
    color: green[300],
  }, 
  failureMessage: {
    color: red[300],
  }, 
  table: {
    // minWidth: 650,
  },
  th: { 
    border: 5,
    align: "center",
    padding: "none",
		fontSize: theme.typography.pxToRem(13),
		fontWeight: theme.typography.fontWeightBold,
		//backgroundColor: '#FFA326',
		backgroundColor: deepOrange[200],
		borderWidth: 1,
		borderColor: 'black',
		borderStyle: 'solid',
  },
  td : {
    spacing: 0,
    // border: 5,
    align: "center",
    padding: "none",
    height: 10,
  },
	allBlue: {
		backgroundColor: blue[100],
	},
	tdBlue : {
    border: 5,
    align: "center",
    padding: "none",
		borderWidth: 1,
		backgroundColor: blue[100],
		borderColor: 'black',
		borderStyle: 'solid',
  },
	apptName: {
		fontSize: theme.typography.pxToRem(15),
		fontWeight: theme.typography.fontWeightBold,
		color: blue[300]
	},  
  ngHeader: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  ngCard: {
    backgroundColor: '#B3E5FC',
  },
  divider: {
    backgroundColor: '#000000',
    color: '#000000',
    fontWeight: theme.typography.fontWeightBold,
  }
}));

export class BlankArea extends React.Component {
  render() {return <h5></h5>;}
}



export class ValidComp extends React.Component {

  componentDidMount()  {
    // custom rule will have name 'isPasswordMatch'
    ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
      return (value === this.props.p1)
    });

    ValidatorForm.addValidationRule('minLength', (value) => {
      return (value.length >= 6)
    });

    ValidatorForm.addValidationRule('noSpecialCharacters', (value) => {
      // console.log("Special chars test for: ", value);
      return validateSpecialCharacters(value);
    });

    ValidatorForm.addValidationRule('isNumeric', (value) => {
      // console.log("string: ", value);
      // console.log(value.toString());
      return validateInteger(value.toString());
    });

    ValidatorForm.addValidationRule('isEmailOK', (value) => {
      return validateEmail(value);
    });

    ValidatorForm.addValidationRule('mobile', (value) => {
      return validateMobile(value);
    });

    ValidatorForm.addValidationRule('checkbalance', (value) => {
      return (value >= this.props.balance);
    });

    ValidatorForm.addValidationRule('isUpiOK', (value) => {
      return validateUpi(value);
    });
  }

  
  componentWillUnmount() {
    // remove rule when it is not needed
    ValidatorForm.removeValidationRule('isPasswordMatch');
    ValidatorForm.removeValidationRule('isEmailOK');
    ValidatorForm.removeValidationRule('mobile');
    ValidatorForm.removeValidationRule('minLength');
    ValidatorForm.removeValidationRule('noSpecialCharacters');   
    ValidatorForm.removeValidationRule('checkbalance'); 
    ValidatorForm.removeValidationRule('isNumeric');    
    ValidatorForm.removeValidationRule('isUpiOK');
  }

  render() {
    return <br/>;
  }

}


export function OrgDisplayPageHeader (props) {
    let msg = "";
    if (props.groupName.length > 0) 
      msg = props.groupName + '-' + props.tournament;
    return (
    <div>
      <Typography align="center" component="h1" variant="h5">{props.headerName}</Typography>
      {/*<DisplayGroupName groupName={msg}/>*/}
    </div>
  );
}


export function DisplayPageHeader (props) {
	const gClasses = globalStyles();
	let _button1 = (props.button1 == null);
	let _button2 = (props.button2 == null);
	let _button3 = (props.button3 == null);
	let _button4 = (props.button4 == null);
	let _button5 = (props.button5 == null);
	return (
	<Grid container className={gClasses.noPadding} key="PAGEHEADER" >
	<Grid align="center" item xs={2} sm={2} md={2} lg={2} />
	<Grid align="center" item xs={8} sm={8} md={8} lg={8} >
		<Typography align="center" component="h1" variant="h5">{props.headerName}</Typography>
	</Grid>
	<Grid align="right" item xs={2} sm={2} md={2} lg={2} >
			{(!_button1) && props.button1}
			{(!_button2) && props.button2}
			{(!_button3) && props.button3}
			{(!_button4) && props.button4}
			{(!_button5) && props.button5}
	</Grid>
	</Grid>
	);
}

export function DisplayBalance (props) {
  const classes = useStyles();
  return (
	<div>
		<Typography align="right" className={classes.balance} >{`Wallet balance: ${props.wallet}`}</Typography>	
	</div>
  );
}


export function MessageToUser (props) {
  const classes = useStyles();
  // console.log(props.mtuMessage);
  let myClass = props.mtuMessage.toLowerCase().includes("success") ? classes.successMessage : classes.failureMessage;
  return (
    <Dialog aria-labelledby="simple-dialog-title" open={props.mtuOpen}
        onClose={() => {props.mtuClose(false)}} >
        <DialogTitle id="simple-dialog-title" className={myClass}>{props.mtuMessage}</DialogTitle>
    </Dialog>
  );
}


export class Copyright extends React.Component {
  render () {
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
        <Link color="inherit" href="https://material-ui.com/">
        Viraag Services
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  }
}


export function VsLogo () {
  let mylogo = `${process.env.PUBLIC_URL}/VS.ICO`;
  const classes = useStyles();
  return (
    <Avatar variant="square" className={classes.avatar}  src={mylogo}/>
);
}

export function DisplayVersion(props) {
  const classes = useStyles();
  let ver = props.version.toFixed(1);
  let msg =  `${props.text} ${ver}`;
  return <Typography align="center" className={classes.version} >{msg}</Typography>
}

export async function DisplayCurrentAPLVersion() {
  let version = await currentAPLVersion();
  return <DisplayVersion text="Current APL version" version={version}/>
}

export async function DisplayLatestAPLVersion() {
  let version = await latestAPLVersion();
  return <DisplayVersion text="Latest APL version" version={version}/>
}



export function DisplayGotraBox(props) {
	const gClasses = globalStyles();
	let _button1 = (props.button1 == null);
	let _button2 = (props.button2 == null);
	let _button3 = (props.button3 == null);
	let _button4 = (props.button4 == null);
	let _button5 = (props.button5 == null);
return (
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<div align="center" >
		<Typography>
		<span className={gClasses.patientName}>{props.gotra.name}</span>
		</Typography>
		</div>
		<BlankArea />
		<div align="right">
			{(!_button1) && props.button1}
			{(!_button2) && props.button2}
			{(!_button3) && props.button3}
			{(!_button4) && props.button4}
			{(!_button5) && props.button5}
		</div>
	</Box>
)}

export function DisplayPatientBox(props) {
	const gClasses = globalStyles();
	let _button1 = (props.button1 == null);
	let _button2 = (props.button2 == null);
	let _button3 = (props.button3 == null);
	let _button4 = (props.button4 == null);
	let _button5 = (props.button5 == null);
	return (
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<div align="center" >
		<Typography onClick={props.onClick} >
		<span className={gClasses.patientName} >{props.patient.displayName}</span>
		</Typography>
		</div>
		<div align="left" >
		<Typography onClick={props.onClick} >
			<span className={gClasses.patientInfo}>Id: </span>
			<span className={gClasses.patientInfo2}>{props.patient.pid}</span>
		</Typography>
		<Typography onClick={props.onClick} > 
			<span className={gClasses.patientInfo}>Age: </span>
			<span className={gClasses.patientInfo2}>{dispAge(props.patient.age, props.patient.gender)}</span>
		</Typography>
		<Typography onClick={props.onClick} > 
			<span className={gClasses.patientInfo}>Email: </span>
			<span className={gClasses.patientInfo2}>{dispEmail(props.patient.email)}</span>
		</Typography>
		<Typography onClick={props.onClick} > 
			<span className={gClasses.patientInfo}>Mob.: </span>
			<span className={gClasses.patientInfo2}>{dispMobile(props.patient.mobile)}</span>
		</Typography>
		<BlankArea />
		</div>
		<div align="right">
		{(!_button1) && props.button1}
		{(!_button2) && props.button2}
		{(!_button3) && props.button3}
		{(!_button4) && props.button4}
		{(!_button5) && props.button5}
		</div>
	</Box>
	)}

export function DisplayMedicineDetails(props) {
	const gClasses = globalStyles();
	let _button1 = (props.button1 == null);
	let _button2 = (props.button2 == null);
	let _button3 = (props.button3 == null);
	let _button4 = (props.button4 == null);
	let _button5 = (props.button5 == null);
	//console.log(_button1, _button2, _button3, _button4, _button5);
return (
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<div key={"MEDDETAILS"+props.medicine.name}align="center" >
		<Typography>
		<span className={gClasses.patientName}>{props.medicine.name}</span>
		</Typography>
		</div>
		<div align="left" >
		<Typography>
			<span className={gClasses.patientInfo}>Description: </span>
			<span className={gClasses.patientInfo2}>{props.medicine.description}</span>
		</Typography>
		<Typography> 
			<span className={gClasses.patientInfo}>Precaution : </span>
			<span className={gClasses.patientInfo2}>{props.medicine.precaution}</span>
		</Typography>
		<BlankArea />
		<div align="right">
		{(!_button1) && props.button1}
		{(!_button2) && props.button2}
		{(!_button3) && props.button3}
		{(!_button4) && props.button4}
		{(!_button5) && props.button5}
		</div>
	</div>
	</Box>
)}


export function DisplayDocumentDetails(props) {
	const gClasses = globalStyles();
	let d = new Date(props.document.date);
	let myDate = DATESTR[d.getDate()] + "/" + MONTHNUMBERSTR[d.getMonth()] + "/" + d.getFullYear();
	let myTime = HOURSTR[d.getHours()] + ":" + MINUTESTR[d.getMinutes()];
	let _button1 = (props.button1 == null);
	let _button2 = (props.button2 == null);
	let _button3 = (props.button3 == null);
	let _button4 = (props.button4 == null);
	let _button5 = (props.button5 == null);
	//console.log(_button1, _button2, _button3, _button4, _button5);
	let _notbrief = (props.brief == null)
return (
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		{(_notbrief) &&
			<div>
			<div align="center" >
			<Typography>
			<span className={gClasses.patientName}>{props.document.title}</span>
			</Typography>
			</div>
			<div align="left" >
			<Typography>
				<span className={gClasses.patientInfo}>Date: </span>
				<span className={gClasses.patientInfo2}>{myDate+' '+myTime}</span>
			</Typography>
			<Typography>
				<span className={gClasses.patientInfo}>Desc: </span>
				<span className={gClasses.patientInfo2}>
					{(props.document.desc !== "ARUNANKIT") ? props.document.desc : ""}
				</span>
			</Typography>
			<Typography> 
				<span className={gClasses.patientInfo}>Type: </span>
				<span className={gClasses.patientInfo2}>{props.document.type}</span>
			</Typography>
			<BlankArea />
			</div>
			<div align="right">
				{(!_button1) && props.button1}
				{(!_button2) && props.button2}
				{(!_button3) && props.button3}
				{(!_button4) && props.button4}
				{(!_button5) && props.button5}
			</div>
			</div>
		}
		{(!_notbrief) &&
			<Typography>
			<span className={gClasses.patientName}>{props.document.title} {props.button1}</span>
			</Typography>
		}
	</Box>
)}


export function DisplayAppointmentDetails(props) {
	const gClasses = globalStyles();
	let d = new Date(props.appointment.apptTime);
	
	let myDate = DATESTR[d.getDate()] + "/" +
		MONTHNUMBERSTR[d.getMonth()] + "/" +
		d.getFullYear();
		
	let myTime = HOURSTR[d.getHours()] + ":" + MINUTESTR[d.getMinutes()];
		
	let _button1 = (props.button1 == null);
	let _button2 = (props.button2 == null);
	let _button3 = (props.button3 == null);
	let _button4 = (props.button4 == null);
	let _button5 = (props.button5 == null);
	//console.log(_button1, _button2, _button3, _button4, _button5);
return (
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<div align="center" >
		<Typography>
		<span className={gClasses.patientName}>{props.appointment.displayName}</span>
		</Typography>
		</div>
		<div align="left" >
		<Typography>
			<span className={gClasses.patientInfo}>Id: </span>
			<span className={gClasses.patientInfo2}>{props.appointment.pid}</span>
		</Typography>
		<Typography> 
			<span className={gClasses.patientInfo}>Date: </span>
			<span className={gClasses.patientInfo2}>{myDate}</span>
		</Typography>
		<Typography > 
			<span className={gClasses.patientInfo}>Time: </span>
			<span className={gClasses.patientInfo2}>{myTime}</span>
		</Typography>
		<BlankArea />
		<div align="right">
		{(!_button1) && props.button1}
		{(!_button2) && props.button2}
		{(!_button3) && props.button3}
		{(!_button4) && props.button4}
		{(!_button5) && props.button5}
		</div>
	</div>
	</Box>
)}


export function DisplayAppointmentBox(props) {
	const gClasses = globalStyles();
	let d = new Date(props.appointment.apptTime);
	
	let myDate = DATESTR[d.getDate()] + "/" +
		MONTHNUMBERSTR[d.getMonth()] + "/" +
		d.getFullYear();
		
	let myTime = HOURSTR[d.getHours()] + ":" + MINUTESTR[d.getMinutes()];
		
	let _button1 = (props.button1 == null);
	let _button2 = (props.button2 == null);
	let _button3 = (props.button3 == null);
	let _button4 = (props.button4 == null);
	let _button5 = (props.button5 == null);
	//console.log(_button1, _button2, _button3, _button4, _button5);
return (
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<Typography> 
		<span className={gClasses.patientName}>{"Appt.: "}</span>
		<span className={gClasses.patientInfo2}>{myDate+" "+myTime}</span>
		<span className={gClasses.patientInfo2}>
				{(!_button1) && props.button1}
				{(!_button2) && props.button2}
				{(!_button3) && props.button3}
				{(!_button4) && props.button4}
				{(!_button5) && props.button5}
		</span>
		</Typography>
	</Box>
)}

export function DisplayHolidayDetails(props) {
	const gClasses = globalStyles();
	
	let myDate = ordinalSuffix(props.holiday.date) + " " + MONTHSTR[props.holiday.month] + " " + props.holiday.year;
		
	let _button1 = (props.button1 == null);
	let _button2 = (props.button2 == null);
	let _button3 = (props.button3 == null);
	let _button4 = (props.button4 == null);
	let _button5 = (props.button5 == null);
	//console.log(_button1, _button2, _button3, _button4, _button5);
return (
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<div align="center">
			<Typography>
			<span className={gClasses.patientName}>{myDate}</span>
			</Typography>
		</div>
		<div align="left">
			<Typography > 
			<span className={gClasses.patientInfo}>Desc: </span>
			<span className={gClasses.patientInfo2}>{props.holiday.desc}</span>
		</Typography>
		</div>
		<div align="right">
			{(!_button1) && props.button1}
			{(!_button2) && props.button2}
			{(!_button3) && props.button3}
			{(!_button4) && props.button4}
			{(!_button5) && props.button5}
		</div>
	</Box>
)}


export function DisplayPatientName(props) {
	let myText = props.name;
	if (props.id) myText + " (Id: " + props.id
return (
<Typography></Typography>
)}


	
export function DisplayUserDetails(props) {
	const gClasses = globalStyles();
	let _button1 = (props.button1 == null);
	let _button2 = (props.button2 == null);
	let _button3 = (props.button3 == null);
	let _button4 = (props.button4 == null);
	let _button5 = (props.button5 == null);
	//console.log(_button1, _button2, _button3, _button4, _button5);
return (
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<div align="center" >
		<Typography>
		<span className={gClasses.patientName}>{props.user.displayName}</span>
		</Typography>
		</div>
		<div align="left" >
		<Typography > 
			<span className={gClasses.patientInfo}>Email: </span>
			<span className={gClasses.patientInfo2}>{dispEmail(props.user.email)}</span>
		</Typography>
		<Typography > 
			<span className={gClasses.patientInfo}>Mob.: </span>
			<span className={gClasses.patientInfo2}>{dispMobile(props.user.mobile)}</span>
		</Typography>
		<BlankArea />
		<div align="right">
		{(!_button1) && props.button1}
		{(!_button2) && props.button2}
		{(!_button3) && props.button3}
		{(!_button4) && props.button4}
		{(!_button5) && props.button5}
		</div>
	</div>
	</Box>
)}

export function DisplayImage(props) {
const classes = useStyles();
//console.log(props);
return(	
<Box align="center" width="100%">
	<Typography className={classes.title}>{"Medical Report Title: "+props.title}</Typography>
	<BlankArea />
	<img src={`data:${props.mime};base64,${props.file}`}/>
</Box>
)}
	
/*export function DisplayPDF(props) {
	const classes = useStyles();
	return(	
	<Box align="center" width="100%">
		<Typography className={classes.title}>{"Medical Report Title: "+props.title}</Typography>
		<BlankArea />
		<PDFViewer 
			document={{base64: props.file }}
		/>
	</Box>
	)}*/

export function LoadingMessage() {
return(
<div align="center">
	<Typography>Sorry to keep you waiting. Just give a moment. Loading information from server.....</Typography>
</div>
)}


export function DisplayProfChargeBalance(props) {
	const gClasses = globalStyles();	
	//console.log(props.balance);
	return (
		<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1}>
		<Grid container className={gClasses.noPadding} key="BALANCE" >
			<Grid key={"BAL1"} align="center" item xs={4} sm={4} md={4} lg={4} >
				<Typography className={gClasses.indexSelection} >
					{"Billing: "+INR+props.balance.billing}
				</Typography>
			</Grid>
			<Grid key={"BAL2"} align="center" item xs={4} sm={4} md={4} lg={4} >
				<Typography className={gClasses.indexSelection} >
					{"Collection: "+INR+props.balance.payment}
				</Typography>
			</Grid>
			<Grid key={"BAL3"} align="center" item xs={4} sm={4} md={4} lg={4} >
				<Typography className={gClasses.indexSelection} >
					{"Due: "+INR+Math.abs(props.balance.due)+((props.balance.due < 0) ? " (Cr)" : "")}
				</Typography>
			</Grid>
			<Grid key={"BAL11"} align="center" item xs={12} sm={12} md={12} lg={12} >
				<Typography className={gClasses.patientInfo2Green} >{"(balance details as on date)"}</Typography>
			</Grid>
		</Grid>	
		</Box>
	);
}

	
export function DisplayProfCharge(props) {
	const gClasses = globalStyles();	
	let _edit =   (props.handleEdit == null);
	let _cancel = (props.handleCancel == null);
	let tmp = props.profChargeArray.filter(x => x.amount > 0);
	let myCollection = lodashSumBy(tmp, 'amount');
	tmp = props.profChargeArray.filter(x => x.amount < 0);
	let myBilling = Math.abs(lodashSumBy(tmp, 'amount'));
	return (
		<div>
		<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1}>
		<div>
		<Grid  key={"HDR"} container alignItems="center" >
			<Grid item  align="left" xs={2} sm={2} md={1} lg={1} >
				<Typography className={gClasses.patientInfo2Blue}>Date</Typography>
			</Grid>
			<Grid item align="left" xs={3} sm={3} md={3} lg={3} >
				<Typography className={gClasses.patientInfo2Blue}>Name</Typography>
			</Grid>
			<Grid item align="left" xs={4} sm={4} md={4} lg={4} >
				<Typography className={gClasses.patientInfo2Blue}>Description</Typography>
			</Grid>
			<Grid item  align="center" xs={1} sm={1} md={1} lg={1} >
				<Typography className={gClasses.patientInfo2Blue}>Mode</Typography>
			</Grid>
			<Grid item align="right" xs={1} sm={1} md={1} lg={1} >
				<Typography className={gClasses.patientInfo2Blue}>Billing</Typography>
			</Grid>
			<Grid item  xs={1} sm={1} md={1} lg={1} >
			<Typography align="right" className={gClasses.patientInfo2Blue}>Collection</Typography>
			</Grid>
			<Grid item xs={1} sm={1} md={1} lg={1} >
			</Grid>
		</Grid>
		{props.profChargeArray.map( (p, index) => {
		let d = new Date(p.date);
		let myDate = `${DATESTR[d.getDate()]}/${MONTHNUMBERSTR[d.getMonth()]}/${d.getFullYear()}`;
		//myDate += ` ${HOURSTR[d.getHours()]}:${MINUTESTR[d.getMinutes()]}`;
		let isBilling = (p.treatment !== "");
		let myInfo = "";
		let tmp = props.patientArray.find(x => x.pid === p.pid);
		let myName = tmp.displayName;
		for(let i=0; i<p.treatmentDetails.length; ++i) {
			myInfo += p.treatmentDetails[i].name + ": "+p.treatmentDetails[i].amount + "<br />";
		}
		let myMode = "-";
		if ((p.paymentMode) && (p.paymentMode !== ""))
			myMode =  p.paymentMode;
		let myDesc = (p.description !== "") ? p.description : "Payment by patient"
		//console.log(myMode);
		//console.log(myDesc);
		return (
			<Grid  key={"PAY"+index} container alignItems="center" align="center">
			<Grid item align="left" xs={2} sm={2} md={1} lg={1} >
				<Typography className={gClasses.patientInfo2}>{myDate}</Typography>
			</Grid>
			<Grid item align="left" xs={4} sm={4} md={3} lg={3} >
			<Typography className={gClasses.patientInfo2}>{myName}</Typography>
			</Grid>
			<Grid item align="left" xs={4} sm={4} md={4} lg={4} >
				<Typography >
				<span className={gClasses.patientInfo2}>{myDesc}</span>
				{(isBilling) &&
					<span align="left"
						data-for={"TREAT"+p.tid}
						data-tip={myInfo}
						data-iscapture="true"
					>
					<InfoIcon color="primary" size="small"/>
					</span>
				}
				</Typography>
			</Grid>
			<Grid item align="center" xs={1} sm={1} md={1} lg={1} >
				<Typography className={gClasses.patientInfo2}>{myMode}</Typography>
			</Grid>
			<Grid item align="right" xs={1} sm={1} md={1} lg={1} >
				{(p.amount <= 0) &&
				<Typography className={gClasses.patientInfo2}>{INR+Math.abs(p.amount)}</Typography>
				}
			</Grid>
			<Grid item align="right" xs={1} sm={1} md={1} lg={1} >
				{(p.amount > 0) &&
				<Typography className={gClasses.patientInfo2}>{INR+p.amount}</Typography>
				}
			</Grid>
			<Grid item xs={1} sm={1} md={1} lg={1} >
				{(!isBilling) &&
				<div>
					{(!_edit) &&  
						<EditIcon color="primary" size="small" onClick={() =>  props.handleEdit(p)}  />
					}
					{(!_cancel) &&  
						<CancelIcon color="secondary" size="small" onClick={() =>  props.handleCancel(p)}  />
					}
				</div>
				}
			</Grid>
			</Grid>
		)}
		)}
		<Grid  key={"SUM"} container alignItems="center" align="center">
			<Grid item align="right" xs={9} sm={9} md={9} lg={9} >
				<Typography className={gClasses.patientInfo2Green}>{"Grand Total"}</Typography>
			</Grid>
			<Grid item align="right" xs={1} sm={1} md={1} lg={1} >
				<Typography className={gClasses.patientInfo2Green}>{INR+myBilling}</Typography>
			</Grid>
			<Grid item align="right" xs={1} sm={1} md={1} lg={1} >
				<Typography className={gClasses.patientInfo2Green}>{INR+myCollection}</Typography>
			</Grid>
		</Grid>
		</div>
		</Box>
		<DisplayAllToolTips profChargeArray={props.profChargeArray} />
		</div>
)}

export function DisplayAllToolTips(props) {
	let myArray = props.profChargeArray.filter(x => x.treatment !== "");
	return(
		<div>
		{myArray.map( t =>
			<ReactTooltip type="info" effect="float" id={"TREAT"+t.tid} multiline={true}/>
		)}
		</div>
	)}	

export function DisplayMemberHeader(props) {
if (props.member === null) return null;
const gClasses = globalStyles();	
let patRec = props.member;
//console.log(props);
//console.log("It is null",(patRec === null) ? true : false);
return (
<Box  style={{marginLeft: "5px", marginRight: "5px", marginBottom: "5px" }} className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1}>
<Grid className={gClasses.noPadding} key="AllPatients" container align="left">
	<Grid key={"PAT0"} item xs={12} sm={6} md={4} lg={4} >
		<Typography style={{ paddingLeft: "5px" }}>
			<span className={gClasses.patientInfo2Green}>{patRec.title+" "+patRec.lastName+" "+patRec.firstName+" "+patRec.middleName}</span>
		</Typography>
	</Grid>
</Grid>	
</Box>
)}	

export function ApplHeader_org(props) {
	const gClasses = globalStyles();
	let mylogo = `${process.env.PUBLIC_URL}/VS.ICO`;
	let myStyle={
		borderLeftColor: 'green',
		borderLeft: 1,
	}
	return (
	<div>
	<Typography align="center" component="h1" variant="h5">{"Application"}</Typography>
	<Box sx={AppHeaderStyle} >
		<Grid container className={gClasses.noPadding} key="APPHDR" >
			<Grid align="center" display="flex" item xs={2} sm={2} md={2} lg={1} >
			<br />
			<br />
			<Avatar variant="square" className={gClasses.avatar}  src={mylogo}/>
			</Grid>
		<Grid item xs={3} sm={3} md={2} lg={1} >
			<Typography className={gClasses.patientInfo2Brown}>Name: </Typography>
			<Typography className={gClasses.patientInfo2Brown}>Mem.Id: </Typography>
			<Typography className={gClasses.patientInfo2Brown}>Hod: </Typography>
			<Typography className={gClasses.patientInfo2Brown}>App.Desc: </Typography>
			<Typography className={gClasses.patientInfo2Brown}>App.Date: </Typography>
		</Grid>
		<Grid item xs={7} sm={7} md={8} lg={10} >
			<Typography className={gClasses.patientInfo2Blue}>{props.appl.name}</Typography>
			<Typography className={gClasses.patientInfo2Blue}>{props.appl.mid}</Typography>
			<Typography className={gClasses.patientInfo2Blue}>{props.appl.hid}</Typography>
			<Typography className={gClasses.patientInfo2Blue}>{props.appl.desc}</Typography>
			<Typography className={gClasses.patientInfo2Blue}>{dateString(props.appl.date)}</Typography>
		</Grid>		
		</Grid>
	</Box>
	</div>
  );
}

export function ApplHeader(props) {
	const gClasses = globalStyles();
	let myStyle={
		borderLeftColor: 'green',
		borderLeft: 1,
	}
	return (
	<div>
	<Typography align="center" component="h1" variant="h5">{"Application"}</Typography>
	<Box sx={AppHeaderStyle} >
		<div style={{marginLeft: 10}}>
			<Typography > 
			<span className={gClasses.patientInfo2Brown}>Applicant: </span>
			<span className={gClasses.patientInfo2Blue}>{props.appl.name + ((!props.appl.isMember) ? ' (Admin)' : '')}</span>
			</Typography>
		<Typography > 
			<span className={gClasses.patientInfo2Brown}>Appl.Id. : </span>
			<span className={gClasses.patientInfo2Blue}>{props.appl.id}</span>
		</Typography>
		{/*<Typography > 
			<span className={gClasses.patientInfo2Brown}>Mem.Id. : </span>
			<span className={gClasses.patientInfo2Blue}>{props.appl.mid}</span>
		</Typography>	*/}	
		<Typography > 
			<span className={gClasses.patientInfo2Brown}>Fam.Hod. : </span>
			<span className={gClasses.patientInfo2Blue}>{props.hodName}</span>
		</Typography>
		</div>
	</Box>
	</div>
  );
}

export function ApplStatus(props) {
	const gClasses = globalStyles();
	let statusTtyle;
	if (props.appl.status === APPLICATIONSTATUS.approved) {
			statusTtyle = gClasses.patientInfo2Green;
	} else if (props.appl.status === APPLICATIONSTATUS.rejected) {
			statusTtyle = gClasses.patientInfo2Red;
	} else {
		statusTtyle = gClasses.patientInfo2Blue;
	}
	return (
	<Box align="left" className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
	<Grid container className={gClasses.noPadding} key="APPSTATUS" >
		<Grid align="right" item xs={4} sm={4} md={3} lg={2} >
			<Typography className={gClasses.patientInfo2} >Application Status :</Typography>
		</Grid>
		<Grid align="left" item xs={8} sm={8} md={9} lg={10} >
			<Typography className={statusTtyle} >{props.appl.status}</Typography>
		</Grid>
	</Grid>
	</Box>
  );
}

export function ApplCommand(props) {
	const gClasses = globalStyles();
	let statusTtyle;
	if (props.appl.status === APPLICATIONSTATUS.approved) {
			statusTtyle = gClasses.patientInfo2Green;
	} else if (props.appl.status === APPLICATIONSTATUS.rejected) {
			statusTtyle = gClasses.patientInfo2Red;
	} else {
		statusTtyle = gClasses.patientInfo2Blue;
	}
	return (
	<Grid container className={gClasses.noPadding} key="APPSTATUS" >
		<Grid align="right" item xs={4} sm={4} md={3} lg={2} >
		</Grid>
		<Grid align="left" item xs={2} sm={2} md={1} lg={1} />
		<Grid align="left" item xs={6} sm={6} md={8} lg={9} >
			<VsButton name="Approve" onClick={() => props.command(true)} />
			<VsButton name="Reject" onClick={() => props.command(false)} />
		</Grid>
	</Grid>
  );
}

export function PersonalHeader(props) {
	const gClasses = globalStyles();
	var dispType = props.dispType;
	return (
	<Box  key={"MEMBOXHDR"} className={gClasses.boxStyleOdd} borderColor="black" borderRadius={30} border={1} >
		<Grid key={"MEMGRIDHDR"} className={gClasses.noPadding} container justifyContent="center" alignItems="center" >
			<Grid align="left" item xs={8} sm={8} md={5} lg={4} >
				<Typography style={{marginLeft: "0px", paddingLeft: "0px" }} className={gClasses.patientInfo2Brown } >
					Member Name
				</Typography>		
			</Grid>

			{((dispType !== "xs") && (dispType !== "sm"))  &&
			<Grid item md={1} lg={1} >
				<Typography className={gClasses.patientInfo2Brown}>
					Relation
				</Typography>
			</Grid>
			}
			{((dispType !== "xs") && (dispType !== "sm"))  &&
			<Grid  item md={1} lg={1} >
				<Typography className={gClasses.patientInfo2Brown}>
					Mar. Sts
				</Typography>
			</Grid>
			}
			{((dispType !== "xs") && (dispType !== "sm"))  &&
			<Grid  item md={1} lg={1} >
				<Typography className={gClasses.patientInfo2Brown}>
					Blood Grp.
				</Typography>
			</Grid>
			}
			{((dispType !== "xs") && (dispType !== "sm") && (dispType !== "md")) &&
				<Grid  item lg={1} >
					<Typography className={gClasses.patientInfo2Brown}>
						Occupation
					</Typography>
				</Grid>
			}
			<Grid  item xs={3} sm={3} md={3} lg={3} >
				<Typography className={gClasses.patientInfo2Brown}>
					Mobile
				</Typography>
			</Grid>
			<Grid  item xs={1} sm={1} md={1} lg={1} >
			<Typography className={gClasses.patientInfo2Brown}></Typography>
			</Grid>
		</Grid>
	</Box>
);}

/*<Box  key={"MEMBOX"+props.index} className={((props.index % 2) == 0) ? gClasses.boxStyleEven : gClasses.boxStyleOdd} 
	borderColor="black" borderRadius={30} border={1} 
	onContextMenu={props.onContextMenu}	
>*/
export function PersonalMember(props) {
const gClasses = globalStyles();
var dispType = props.dispType;
var m = props.m;
return (

<Box  key={"MEMBOX"+props.index} 
  className={((props.index % 2) == 0) ? gClasses.boxStyleEven : gClasses.boxStyleOdd} 
	borderColor="black" borderRadius={30} border={1} 
>
<Grid key={"MEMGRID"+props.index} className={gClasses.noPadding} container justifyContent="center" alignItems="center" >
	<Grid align="left" item xs={8} sm={8} md={5} lg={4} >
		<Typography>
			{/*<span><VsRadioSa checked={props.checked}  onClick={props.onClick}  /></span>*/}
			<span style={{marginLeft: "0px", paddingLeft: "0px" }} className={gClasses.patientInfo2Blue } >{getMemberName(m)+" ("+dispAge(m.dob, m.gender)+")"}</span>
				<span align="left" data-for={"MEMBER"+m.mid} data-tip={props.datatip} data-iscapture="true" >
				<InfoIcon color="primary" size="small"/>
				</span>
		</Typography>		
	</Grid>
	{((false) && (dispType !== "xs") && (dispType !== "sm")) &&
		<Grid align="center" item md={1} lg={1} >
			<Typography className={gClasses.patientInfo2}>
				<span>{m.patientInfo2}{dispAge(m.dob, m.gender)}</span>
			 </Typography>
		</Grid>
	}
	{((dispType !== "xs") && (dispType !== "sm"))  &&
		<Grid align="center" item md={1} lg={1} >
			<Typography className={gClasses.patientInfo2}>{getRelation(m.relation)}</Typography>
		</Grid>
	}
	{((dispType !== "xs") && (dispType !== "sm"))  &&
		<Grid  item md={1} lg={1} >
			<Typography className={gClasses.patientInfo2}>{capitalizeFirstLetter(m.emsStatus)}</Typography>
		</Grid>
	}
	{((dispType !== "xs") && (dispType !== "sm"))  &&
		<Grid  item md={1} lg={1} >
			<Typography className={gClasses.patientInfo2}>{m.bloodGroup.toUpperCase()}</Typography>
		</Grid>
	}
	{((dispType !== "xs") && (dispType !== "sm") && (dispType !== "md")) &&
		<Grid  item lg={1} >
			<Typography className={gClasses.patientInfo2}>{m.occupation}</Typography>
		</Grid>
	}
	<Grid align="center"  item xs={3} sm={3} md={3} lg={3} >
		{(m.mobile !== "") &&
			<Typography className={gClasses.patientInfo2}>{m.mobile}</Typography>
		}
	</Grid>
	<Grid  item xa={1} sm={1} md={1} lg={1} >
		<Typography>
		 <span><MoreVertIcon color="primary" size="small" onClick={props.onClick}	 /></span>
		</Typography>
	</Grid>
</Grid>
</Box>

);}

export function OrgPersonalOffice(props) {
const gClasses = globalStyles();
var dispType = props.dispType;
var m = props.m;
return (
<Box  key={"MEMBOX"+props.index} className={((props.index % 2) == 0) ? gClasses.boxStyleEven : gClasses.boxStyleOdd} borderColor="black" borderRadius={30} border={1} >
<Grid key={"MEMGRID"+props.index} className={gClasses.noPadding} container justifyContent="center" alignItems="center" >
	<Grid align="left" item xs={8} sm={8} md={5} lg={4} >
		<Typography>
			{/*<span><VsRadioSa checked={props.checked}  onClick={props.onClick}  /></span>*/}
			<span><MoreVertIcon color="primary" size="small" onClick={props.onClick}	 /></span>
			<span style={{marginLeft: "0px", paddingLeft: "0px" }} className={gClasses.patientInfo2Blue } >{getMemberName(m)+" ("+dispAge(m.dob, m.gender)+")"}</span>
			<span align="left" data-for={"MEMBER"+m.mid} data-tip={props.datatip} data-iscapture="true" >
				<InfoIcon color="primary" size="small"/>
			</span>
		</Typography>		
	</Grid>
	{((dispType != "xs") && (dispType != "sm"))  &&
		<Grid align="left" item md={2} lg={2} >
			<Typography className={gClasses.patientInfo2}>{m.education}</Typography>
		</Grid>
	}
	{((dispType !== "xs") && (dispType !== "sm"))  &&
		<Grid align="left" item md={5} lg={5} >
			<Typography className={gClasses.patientInfo2}>{m.officeName}</Typography>
		</Grid>
	}
	<Grid align="left" item xs={4} sm={4} md={1} lg={1} >
		<Typography className={gClasses.patientInfo2}>{m.officePhone}</Typography>
	</Grid>
</Grid>
</Box>
);}

export function PersonalOffice(props) {
const gClasses = globalStyles();
var dispType = props.dispType;
var m = props.m;
return (
<Box  key={"MEMBOX"+props.index} className={((props.index % 2) == 0) ? gClasses.boxStyleEven : gClasses.boxStyleOdd} borderColor="black" borderRadius={30} border={1} >
<Grid key={"MEMGRID"+props.index} className={gClasses.noPadding} container justifyContent="center" alignItems="center" >
	<Grid align="left" item xs={8} sm={8} md={4} lg={4} >
		<Typography>
			{/*<span><VsRadioSa checked={props.checked}  onClick={props.onClick}  /></span>*/}
			<span style={{marginLeft: "0px", paddingLeft: "0px" }} className={gClasses.patientInfo2Blue } >{getMemberName(m)+" ("+dispAge(m.dob, m.gender)+")"}</span>
			<span align="left" data-for={"MEMBER"+m.mid} data-tip={props.datatip} data-iscapture="true" >
				<InfoIcon color="primary" size="small"/>
			</span>
		</Typography>		
	</Grid>
	{((dispType != "xs") && (dispType != "sm"))  &&
		<Grid align="left" item md={3} lg={3} >
			<Typography className={gClasses.patientInfo2}>{m.education}</Typography>
		</Grid>
	}
	{((dispType !== "xs") && (dispType !== "sm"))  &&
		<Grid align="left" item md={3} lg={3} >
			<Typography className={gClasses.patientInfo2}>{m.officeName}</Typography>
		</Grid>
	}
	<Grid align="left" item xs={3} sm={3} md={1} lg={1} >
		<Typography className={gClasses.patientInfo2}>{m.officePhone}</Typography>
	</Grid>
	<Grid align="left" item xs={1} sm={1} md={1} lg={1} >
		<span><MoreVertIcon color="primary" size="small" onClick={props.onClick}	 /></span>
	</Grid>
</Grid>
</Box>
);}



export function DisplaySingleTip(props) {
//console.log(props.id);
const gClasses = globalStyles();
return <Tooltip id={props.id} className={gClasses.tooltip} backgroundColor='#42EEF9' borderColor='black' arrowColor='blue' textColor='black' key={props.id} type="info" effect="float" id={props.id} multiline={true}/>
}

var inputFilterMode = false;

export 	function DisplayPrwsFilter(props) {
	const gClasses = globalStyles();
	return(
		<Box key="BOXPRWSFILTER" className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
			<Grid key="GRIDPRWSFILTER" className={gClasses.noPadding} container>
				<Grid align="left" item xs={10} sm={10} md={11} lg={11} >
					<div>
					{(!props.inputFilterMode) &&
						<Typography style={{paddingLeft: "5px"}}>
						{props.filterList.map( (m, index) => {
							return (
								<span key={"FILTER"+index} style={{marginLeft: "5px", paddingLeft: "5px"}} className={gClasses.filterItem} >
									{m.item}: {m.value}
									<CancelIcon size="small" style={{paddingTop: "8px"}} color="secondary" onClick={() => props.removeFilter(m.item)} />
								</span>
							)
						})}
						</Typography>
					}
					{(props.inputFilterMode) &&
						<div>
							{ (props.inputInfo.options) &&
								<VsSelect 
									inputProps={{className: gClasses.dateTimeNormal}} style={NORMALSELECTSTYLE} 
									label={props.inputName} options={props.inputInfo.options} value={props.inputValue} 
									onChange={props.selectClick} 
								/>				
							}
							{ (!props.inputInfo.options) &&
								<div>
									<TextField id="outlined-required" label={props.inputName}
										value={props.inputValue} type={props.inputInfo.type} autoFocus
										onChange={(event) => { props.setInputValue(event.target.value); }}
									/>
									<VsButton  name="Apply"  onClick={props.applyClick} />
									<VsButton name="Cancel" onClick={props.cancelClick } />
								</div>
							}
						</div>
					}
					</div>
				</Grid>
				<Grid align="left" item xs={2} sm={2} md={1} lg={1} >
					<div style={{paddingLeft: "5px", paddingRight: "5px"}} >
					<VsPdhsFilter style={SELECTSTYLE} options={props.balanceFilterList} field="item"
					value={props.lastFilter} onChange={props.pdhsFilter} />			
					</div>
				</Grid>
			</Grid>			
		</Box>
	)
};
	
export function DisplayApplicationNameValue(props) {
	const gClasses = globalStyles();
return (	
	<Grid key={"APPLLINE"+props.name} className={gClasses.noPadding} container  alignItems="flex-start" >
		<Grid item xs={5} sm={5} md={5} lg={5} >
			<Typography style={(props.style) ? props.style : {}} className={gClasses.pdhs_name} >{props.name}</Typography>
		</Grid>
		<Grid item xs={7} sm={7} md={7} lg={7} >
			<Typography style={(props.style) ? props.style : {}} className={gClasses.pdhs_value} >{props.value}</Typography>
		</Grid>
	</Grid>
)}

export function DisplayApplicationName(props) {
	const gClasses = globalStyles();
return (	
	<Typography style={(props.style) ? props.style : {}} className={gClasses.pdhs_name} >{props.name}</Typography>
)}

export function DisplayApplicationValue(props) {
	const gClasses = globalStyles();
return (	
	<Typography style={(props.style) ? props.style : {}} className={gClasses.pdhs_value} >{props.value}</Typography>
)}


export function ApplicationHeader (props) {
	const gClasses = globalStyles();
	//console.log(props);
return (
	<div>
	<Typography align="center"  className={gClasses.pdhs_title} >{props.header}</Typography>
	<br />
	<DisplayApplicationNameValue name="Appl. Id." value={props.applicationRec.id} style={{paddingTop: "5px" }}  />
	<DisplayApplicationNameValue name="Appl. Date" value={dateString(props.applicationRec.date)} style={{paddingTop: "5px" }}  />
	<DisplayApplicationNameValue name="Appl. Status" value={props.applicationRec.status} style={{paddingTop: "5px" }}  />
	<DisplayApplicationNameValue name="Applicant" value={props.applicationRec.name} style={{paddingTop: "5px" }}  />
	<DisplayApplicationNameValue name="Family Head" value={props.applicationRec.hodName} style={{paddingTop: "5px" }}  />
	{(props.applicationRec.status !== "Pending") &&
	<DisplayApplicationNameValue name="Remarks" value={props.applicationRec.comments} style={{paddingTop: "5px" }}  />	
	}
	<br />
	<Divider style={{ paddingTop: "2px", backgroundColor: 'black', padding: 'none' }} />
	
	</div>
)}