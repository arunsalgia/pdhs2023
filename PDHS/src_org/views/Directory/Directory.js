import React, { useEffect, useState, useContext } from 'react';
import { useAlert } from 'react-alert'
import { CssBaseline } from '@material-ui/core';
import axios from "axios";

import Box from '@material-ui/core/Box';
import TablePagination from '@material-ui/core/TablePagination';

import VsButton from "CustomComponents/VsButton";
//import VsCancel from "CustomComponents/VsCancel";
import VsTextSearch from "CustomComponents/VsTextSearch";


import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';


import Member from "views/Member/Member";

import {
	MemberStyle,
} from 'views/globals';

import { isMobile, encrypt,
	displayType, getWindowDimensions,
	dispOnlyAge, dispAge, dispEmail, dispMobile, checkIfBirthday,
	validateInteger,
	getAllPatients,
	vsDialog,
	disableFutureDt,
	getMemberName,
 } from "views/functions.js"


import {DisplayPageHeader, BlankArea, DisplayPatientBox,
	DisplayMemberHeader,
} from "CustomComponents/CustomComponents.js"

// styles
import globalStyles from "assets/globalStyles";
import {dynamicModal } from "assets/dynamicModal";


const drawerWidth=800;
const AVATARHEIGHT=4;
//const ROWSPERPAGE = isMobile() ? 8 : 36;



export default function Directory() {
	const gClasses = globalStyles();

	const [firstName, setFirstName] = useState("");
	const [middleName, setMiddleName] = useState("");
	const [lastName, setLastName] = useState("");
	
	const [currentMember, setCurrentMember] = useState("");
	const [currentMemberData, setcurrentMemberData] = useState({});

	const [currentSelection, setCurrentSelection] = useState("");
	
	const [memberArray, setMemberArray] = useState([]);
	const [memberMasterArray, setMemberMasterArray] = useState([]);
	
	// pagination
	const [page, setPage] = useState(0);



 const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
 const [ROWSPERPAGE, setROWSPERPAGE] = useState(3);
 const [dispType, setDispType] = useState("lg");
 
  useEffect(() => {
		function handleResize() {
			let myDim = getWindowDimensions();
      setWindowDimensions(myDim);
			let myRows = 0;
			let defHeight = 100;
      //console.log(displayType(myDim.width)) ;
      setDispType(displayType(myDim.width));
     
			switch (displayType(myDim.width)) {
				case 'xs': myRows = 10; break;
				case 'sm': myRows = 24; break;
				case 'md': myRows = 36; break;
				case 'lg': myRows = 48; break;
			}
			//console.log(myRows);
			setROWSPERPAGE(myRows);
		}
		
		const us = async () => {
		}
		getAllMembers();
		handleResize();
		window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
		
  }, [])

	async function getAllMembers() {
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/member/namelist/all`;
			let resp = await axios.get(myUrl);
			setMemberMasterArray(resp.data);
			sessionStorage.setItem("directory", JSON.stringify(resp.data));
			setMemberArray(resp.data);
		} catch (e) {
			alert.show("Error fetching member data");
			//setMemberArray([]);
		}
	}

	function handleSelectMember(pat) {
		setcurrentMemberData(pat);
		setCurrentMember(pat.displayName);
		//sessionStorage.setItem("memberName, getMemberName(pat));
		setCurrentSelection("");
	}

	
	function DisplayAllMembers() {
	return (
	<Grid className={gClasses.noPadding} key="AllMembers" container alignItems="center" >
	{memberArray.slice(page*ROWSPERPAGE, (page+1)*ROWSPERPAGE).map( (m, index) => 
		<Grid key={"MEM"+index} item xs={12} sm={6} md={4} lg={3} >
			{/*<Box onClick={() => handleSelectMember(m)} className={gClasses.boxStyle} borderColor="black" borderRadius={15} border={1} >*/}
			<Box onClick={() => handleSelectMember(m)} sx={MemberStyle}  >
			<div align="left">
			<Typography className={gClasses.patientInfo2Blue}>{getMemberName(m, false)}</Typography>
			</div>
		</Box>
		</Grid>
	)}
	</Grid>	
	)}
	
	
	function handleBack() {
		setcurrentMemberData({});
		setCurrentMember("");
	}


	// pagination function 
	const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
	
		function setFilter(fName, mName, lName) {
		//console.log(fName,"-",mName,"-",lName);
		let tmpArray = memberMasterArray;
		if (fName !== "") tmpArray = tmpArray.filter(x => x.firstName.toLowerCase().includes(fName));
		if (mName !== "") tmpArray = tmpArray.filter(x => x.middleName.toLowerCase().includes(mName));
		if (lName !== "") tmpArray = tmpArray.filter(x => x.lastName.toLowerCase().includes(lName));
		
		setPage(0);
		setMemberArray(tmpArray);
	}
	
	function updateFirstName(newName) {
		let tmp = newName.toLowerCase().trim();
		setFirstName(tmp);
		setFilter(tmp, middleName, lastName);
	}

	function updateMiddleName(newName) {
		let tmp = newName.toLowerCase().trim();
		setMiddleName(tmp);
		setFilter(firstName, tmp, lastName);
	}
	
	function updateLastName(newName) {
		let tmp = newName.toLowerCase().trim();
		setLastName(tmp);
		setFilter(firstName, middleName, tmp);
	}
	
  return (
  <div className={gClasses.webPage} align="center" key="main">
		{/*<Container component="main" maxWidth="lg">*/}
		<CssBaseline />
		{(currentMember === "") &&
			<div>
			<DisplayPageHeader headerName="Samaj Directory" groupName="" tournament=""/>
			<Box style={{paddingTop: "0px", paddingBottom: "0px", marginRight: "5px", marginLeft: "5px" }} align="center" key={"MEMBOXHDR"} className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={2} >
			<Grid  style={{paddingBottom: "5px", paddingRight: "5px", marginRight: "5px" }} align="center" key="PatientFilter" container alignItems="center" >
				<Grid style={{paddingBottom: "5px", paddingLeft: "5px", paddingRight: "5px", marginLeft: "5px", marginRight: "5px" }} item xs={12} sm={4} md={4} lg={4} >
				<VsTextSearch style={{paddingLeft: "5px", paddingRight: "5px" }}  label="Last name" value={lastName}
					onChange={(event) => { updateLastName(event.target.value);  }}
					onClear={() => updateLastName("")}
				/>
				</Grid>
				<Grid style={{paddingBottom: "5px", paddingLeft: "5px", paddingRight: "5px", marginLeft: "5px", marginRight: "5px" }} item xs={12} sm={4} md={4} lg={4} >
				<VsTextSearch style={{paddingLeft: "5px", paddingRight: "5px" }} label="First name" value={firstName}
					onChange={(event) => updateFirstName(event.target.value)}
					onClear={() => updateFirstName("")}
				/>
				</Grid>
				<Grid style={{paddingBottom: "5px", paddingLeft: "5px", marginLeft: "5px"}} item xs={12} sm={3} md={3} lg={3} >
				<VsTextSearch style={{paddingLeft: "5px", paddingRight: "5px" }} label="Middle name" value={middleName}
					onChange={(event) => updateMiddleName(event.target.value)}
					onClear={() => updateMiddleName("")}
				/>
				</Grid>
			</Grid>
			</Box>
			<DisplayAllMembers />
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
			</div>
		}
		{(currentMember !== "") &&
			<div>
			<VsButton align="right" name="Back to Member Directory" onClick={handleBack} />
			<Member hid={currentMemberData.hid} mid={currentMemberData.mid} />
			</div> 
		}
  </div>
  );    
}

