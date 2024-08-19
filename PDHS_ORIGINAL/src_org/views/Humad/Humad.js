import React, { useState, useContext, useEffect } from 'react';
import { Container, CssBaseline } from '@material-ui/core';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Divider from '@material-ui/core/Divider';
import TablePagination from '@material-ui/core/TablePagination';
import ReactTooltip from "react-tooltip";

//import lodashCloneDeep from 'lodash/cloneDeep';
//import lodashSortBy from "lodash/sortBy"
//import lodashMap from "lodash/map";

import VsButton from "CustomComponents/VsButton";
import VsCancel from "CustomComponents/VsCancel";
import VsTextSearch from "CustomComponents/VsTextSearch";
import VsRadioGroup from "CustomComponents/VsRadioGroup";
import VsRolodex from 'CustomComponents/VsRolodex';

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

import InfoIcon   from 	'@material-ui/icons/Info';
import Upgrade from 	'@material-ui/icons/ArrowUpwardOutlined';
import EditRoundedIcon from '@material-ui/icons/EditRounded';

const BlankMemberData = {firstName: "", middleName: "", lastName: ""};

import {
	BlankArea, DisplayPageHeader,
} from "CustomComponents/CustomComponents.js"

import {
	ADMIN, HUMADCATEGORY,
} from "views/globals.js";

import { 
	isMobile,
	dateString,
	vsDialog,
	getMemberName,
	dispAge,
	getAdminInfo,
	disableFutureDt,
} from "views/functions.js";


/*
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
*/


const ROWSPERPAGE = isMobile() ? 7 : 12;

export default function Humad() {
	const adminInfo = getAdminInfo();
	const humadAdmin = ((adminInfo & (ADMIN.superAdmin | ADMIN.humadAdmin)) !== 0);
	//console.log(adminInfo, humadAdmin);
	
	const mobileVersion = isMobile();
	const gClasses = globalStyles();
	const alert = useAlert();

	const [humadArray, setHumadArray] = useState([]);
	const [humadMasterArray, setHumadMasterArray] = useState([]);
	const [memberArray, setMemberArray] = useState([])
	const [currentHumad, setCurrentHumad] = useState(null);
	
	const [upgradeCount, setUpgradeCount] = useState(-1);
	
	const [newCategory, setNewCategory] = useState("");
	
	const [firstName, setFirstName] = useState("");
	const [middleName, setMiddleName] = useState("");
	const [lastName, setLastName] = useState("");

	const [modalRegister, setModalRegister] = useState(0);

	const [isDrawerOpened, setIsDrawerOpened] = useState("");
	
	// pagination
	const [page, setPage] = useState(0);	
	const [currentChar, setCurrentChar] = useState('A');
	
  useEffect(() => {	
		getHumad('A');
  }, []);
	
	async function getHumad(chrStr) {
		try {
			//console.log('in humad fetch', chrStr )
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/humad/listbyalphabet/${chrStr}`;
			let resp = await axios.get(myUrl);
			
			setHumadArray(resp.data.humad);
			setMemberArray(resp.data.member);

			setCurrentChar(chrStr);
		} catch (e) {
			console.log(e);
			alert.error(`Error fetching Humad details`);
			setMemberArray([]);
			setHumadArray([]);
		}	
	}


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

	async function newPage(newChar) {
		setPage(0);
		await getHumad(newChar);
		//console.log(num)
	}
	
	// pagination function 
	const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
	
	function upgradeHumad(humadRec) {
		let  myIndex = -1;  
		for(var i = 0; i < HUMADCATEGORY.length; i++) {
			if (HUMADCATEGORY[i].short === humadRec.membershipNumber.substr(0, 1)) {
					myIndex = i;
					break;
			}
    }
		if (myIndex >= 0) {
			setNewCategory(HUMADCATEGORY[myIndex-1].desc);
			setUpgradeCount(myIndex);
			setCurrentHumad(humadRec);
			setIsDrawerOpened("Upgrade");
		}
	}
		
	async function upgradeHumadSubmit() {
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/humad/upgrade/${currentHumad.mid}/${newCategory}`;
			let resp = await axios.get(myUrl);
			setHumadArray([resp.data].concat(humadArray.filter(x => x.mid !== currentHumad.mid)));
		} catch (e) {
			console.log(e);
			alert.error(`Error updating Humad category`);
		}			
	}
	
	
	function DisplayAllHumad() {
		if (memberArray.length === 0) return null;
		return (
		<div>
		<Box  key={"MEMHDRBOX"} className={gClasses.boxStyle} borderColor="black" borderRadius={30} border={1} >
		<Grid key={"MEMHDRGRID"} className={gClasses.noPadding} container align="center" alignItems="center" >
		<Grid align="left" item md={5} lg={5} >
			<Typography className={gClasses.patientInfo2Brown}>Name</Typography>
		</Grid>
		<Grid align="center" item md={1} lg={1} >
			<Typography className={gClasses.patientInfo2Brown}>Mem. No.</Typography>
		</Grid>
		<Grid align="center" item md={1} lg={1} >
			<Typography className={gClasses.patientInfo2Brown}>Mobile</Typography>
		</Grid>
		<Grid align="center" item md={1} lg={1} >
			<Typography className={gClasses.patientInfo2Brown}>Mem. Id</Typography>
		</Grid>
		<Grid align="center" item md={1} lg={1} >
			<Typography className={gClasses.patientInfo2Brown}>Mem. Date</Typography>
		</Grid>
		<Grid align="center" item md={2} lg={2} >
			<Typography className={gClasses.patientInfo2Brown}>Remarks</Typography>
		</Grid>
		<Grid align="center" item md={1} lg={1} >
		</Grid>
		</Grid>
		</Box>
		{memberArray.slice(page*ROWSPERPAGE, (page+1)*ROWSPERPAGE).map( (m, index) => {
			let h = humadArray.find(x => x.mid === m.mid);
			if (!h) return null;
			let memDateStr = dateString(h.membershipDate);
			return (
			<Box  style={{paddingLeft: "5px", paddingRight: "5px" }} className={gClasses.boxStyle} borderColor="black" borderRadius={30} border={1} >
			<Grid key={"MEMGRID"+index} className={gClasses.noPadding} container align="center" alignItems="center" >
				<Grid align="left" item md={5} lg={5} >
					<Typography className={gClasses.patientInfo2}>{getMemberName(m)+"(" + dispAge(m.dob, m.gender) + ")"}</Typography>
				</Grid>
				<Grid align="center" item md={1} lg={1} >
					<Typography className={gClasses.patientInfo2}>{h.membershipNumber}</Typography>
				</Grid>
				<Grid align="center" item md={1} lg={1} >
					<Typography className={gClasses.patientInfo2}>{m.mobile}</Typography>
				</Grid>
				<Grid align="center" item md={1} lg={1} >
					<Typography className={gClasses.patientInfo2}>{m.mid}</Typography>
				</Grid>
				<Grid align="center" item md={1} lg={1} >
					<Typography className={gClasses.patientInfo2}>{memDateStr}</Typography>
				</Grid>
				<Grid align="center" item md={2} lg={2} >
					<Typography className={gClasses.patientInfo2}>{h.remarks}</Typography>
				</Grid>
				<Grid align="center" item md={1} lg={1} >
				{((humadAdmin) && (h.membershipNumber.substr(0, 1) !== HUMADCATEGORY[0].short)) &&
          <div>
					<EditRoundedIcon color='primary'  onClick={() => upgradeHumad(h) } />
					<Upgrade color='primary'  onClick={() => upgradeHumad(h) } />
          </div>
				}
				</Grid>
			</Grid>
			</Box>
			)}
		)}	
		</div>	
		)}
	
	function DisplayMobileHumad() {
		if (memberArray.length === 0) return null;
		return (
		<div>
		<Box  key={"MEMHDRBOX"} className={gClasses.boxStyle} borderColor="black" borderRadius={30} border={1} >
		<Grid key={"MEMHDRGRID"} className={gClasses.noPadding} container align="center" alignItems="center" >
		<Grid align="left" item xs={9} sm={10} md={6} lg={6} >
			<Typography className={gClasses.patientInfo2Brown}>Name</Typography>
		</Grid>
		<Grid align="center" item xs={3} sm={2} md={1} lg={1} >
			<Typography className={gClasses.patientInfo2Brown}>Mobile</Typography>
		</Grid>
		</Grid>
		</Box>
		{memberArray.slice(page*ROWSPERPAGE, (page+1)*ROWSPERPAGE).map( (m, index) => {
			let h = humadArray.find(x => x.mid === m.mid);
			if (!h) return null;
			let memDateStr = dateString(h.membershipDate);
			let myInfo = "Mem.Id. : " + h.mid + "<br />";
			myInfo +=    "Mem.No. : " +  h.membershipNumber + "<br />";
			myInfo +=    "Mem.Date: " +  dateString(h.membershipDate);
			if (h.remarks !== "")
				myInfo +=  "<br />" + "Remarks:  " + h.remarks;
			return (
			<Box  key={"MEMBOX"+index} className={gClasses.boxStyle} borderColor="black" borderRadius={30} border={1} >
			<Grid key={"MEMGRID"+index} className={gClasses.noPadding} container align="center" alignItems="center" >
				<Grid align="left" item xs={9} sm={10}>
					<Typography >
					<span className={gClasses.patientInfo2}>{getMemberName(m)+"(" + dispAge(m.dob, m.gender) + ")"}</span>
					{(humadAdmin) &&
						<span align="left"
							data-for={"HUMAD"+h.mid}
							data-tip={myInfo}
							data-iscapture="true"
						>
							<InfoIcon color="primary" size="small"/>
						</span>
					}
					</Typography>
				</Grid>
				<Grid align="center" item xs={3} sm={2} >
					<Typography className={gClasses.patientInfo2}>{m.mobile}</Typography>
				</Grid>
				</Grid>
			</Box>
			)}
		)}	
		</div>	
	)}
	
	function DisplayAllToolTips() {
	return(
		<div>
		{memberArray.slice(page*ROWSPERPAGE, (page+1)*ROWSPERPAGE).map( t =>
			<ReactTooltip key={"HUMAD"+t.mid} type="info" effect="float" id={"HUMAD"+t.mid} multiline={true}/>
		)}
		</div>
	)}	

	return (
	<div className={gClasses.webPage} align="center" key="main">
	<CssBaseline />
	<DisplayPageHeader headerName="Humad Members" groupName="" tournament=""/>
	<br />
	<Box  key={"CHARS"} className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<VsRolodex label="Last name with: " current={currentChar} onClick={newPage} />
	</Box>
	{ (mobileVersion) &&
		<DisplayMobileHumad />
	}
	{ (!mobileVersion) &&
		<DisplayAllHumad />
	}
	{(memberArray.length > ROWSPERPAGE) &&
		<TablePagination
			align="right"
			rowsPerPageOptions={[ROWSPERPAGE]}
			component="div"
			labelRowsPerPage="Members per page"
			count={memberArray.length}
			rowsPerPage={ROWSPERPAGE}
			page={page}
			onPageChange={handleChangePage}
			//onRowsPerPageChange={handleChangeRowsPerPage}
			//showFirstButton={true}
		/>
	}
	<DisplayAllToolTips />
	<Drawer anchor="right" variant="temporary" open={isDrawerOpened != ""} >
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
	<VsCancel align="right" onClick={() => { setIsDrawerOpened("")}} />
	{(isDrawerOpened === "Upgrade") &&
	<div style={{paddingLeft: "5px", paddingRight: "5px" }}>
		<br />
		<Typography className={gClasses.patientInfo2Blue}>Upgrade Humad membership category</Typography>
		<br />
		<VsRadioGroup 
			value={newCategory} onChange={(event) => setNewCategory(event.target.value)}
			radioList={HUMADCATEGORY.slice(0, upgradeCount)} radioField="desc"
		/>
		<br />
		<VsButton align="center" name="Upgrade" onClick={upgradeHumadSubmit} />
	</div>
	}
	</Box>
	</Drawer>
  </div>
  );    
}
