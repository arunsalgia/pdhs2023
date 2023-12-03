import React, { useState, useContext, useEffect } from 'react';
import {  CssBaseline } from '@material-ui/core';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Link from '@material-ui/core/Link';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import lodashCloneDeep from 'lodash/cloneDeep';
import lodashSortBy from "lodash/sortBy";
import lodashMap from "lodash/map";

import VsButton from "CustomComponents/VsButton";
import VsCancel from "CustomComponents/VsCancel";
import VsRadio from "CustomComponents/VsRadio";
import VsRadioGroup from "CustomComponents/VsRadioGroup";
import VsCheckBox from "CustomComponents/VsCheckBox";

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


import {
	BlankArea,
	DisplayMemberHeader,
} from "CustomComponents/CustomComponents.js"

import {
MARITALSTATUS, ADMIN, APPLICATIONTYPES,
DATESTR, MONTHNUMBERSTR,
} from "views/globals.js";


import { 
	getImageName,
	vsDialog, applicationSuccess,
	getMemberName,
	dispAge, getAdminInfo, dateString,
	decrypt, dispMobile, dispEmail, disableFutureDt, 
} from "views/functions.js";


export default function MemberSpouse(props) {
	const loginHid = parseInt(sessionStorage.getItem("hid"), 10);
	const loginMid = parseInt(sessionStorage.getItem("mid"), 10);
	const isMember = props.isMember;
	//console.log(loginHid, isMember);
	const adminInfo = getAdminInfo();
	
	const gClasses = globalStyles();
	const alert = useAlert();

	const [memberArray, setMemberArray] = useState(props.list);
	const [directory, setDirectory] = useState(JSON.parse(sessionStorage.getItem("MemberData")));
	
	const [coupleArray, setCoupleArray] = useState([]);
	const [unLinkedMembers, setUnLinkedMembers] = useState([]);
	const [brideOrGroomArray, setBrideOrGroomArray] = useState([]);
	const [emurCoupleArray, setEmurCoupleArray] = useState([]);
	const [newCoupleMember, setNewCoupleMember] = useState("");
	const [currentIndex, setCurrentIndex] = useState(0);
	
	const [isDrawerOpened, setIsDrawerOpened] = useState("");
	const [isLeftDrawerOpened, setIsLeftDrawerOpened] = useState("");
	const [registerStatus, setRegisterStatus] = useState(0);

	

	
  useEffect(() => {	

		const getMarriageDetails = async () => {	
		
			// first get list of all married men in family
			let allGrooms = memberArray.filter(x => 
				x.emsStatus.toUpperCase() === 'MARRIED' &&
				x.gender.toUpperCase() === 'MALE'
			);
			let myCouples = [];
			for(var i=0; i<allGrooms.length; ++i) {
				let bTmp = directory.find(x => x.mid === allGrooms[i].spouseMid);
				let bName = (bTmp) ? getMemberName(bTmp, false) : "";
				let bMid = (bTmp) ? bTmp.mid : 0;
				myCouples.push({
					gMid: allGrooms[i].mid, gName: getMemberName(allGrooms[i], false),
					bMid: bMid, bName: bName,
					dom: allGrooms[i].dateOfMarriage, momentDom: moment(allGrooms[i].dateOfMarriage),
				});
			}
			
			let ladiesMid = lodashMap(myCouples.filter(x => x.bMid !== 0), 'bMid');
			//console.log(ladiesMid);
			let balanceBrides = memberArray.filter(x => 
				x.emsStatus === 'Married'  && 
				x.gender === 'Female' &&
				!ladiesMid.includes(x.mid)
			);
			//console.log(balanceBrides);
			
			for(var i=0; i<balanceBrides.length; ++i) {
				let gTmp = directory.find(x => x.mid === balanceBrides[i].spouseMid);
				let gName = (gTmp) ? getMemberName(gTmp, false) : "";
				let gMid = (gTmp) ? gTmp.mid : 0;
				myCouples.push({
					gMid: gMid, gName: gName,
					bMid: balanceBrides[i].mid , bName: getMemberName(balanceBrides[i], false),
					dom: balanceBrides[i].dateOfMarriage, momentDom: moment(balanceBrides[i].dateOfMarriage),
				});
			}
			//console.log(myCouples);
			setCoupleArray(myCouples);
		}

		getMarriageDetails();
		
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

	async function handleEditSpouse() {
		let spouseDetails = {couple: emurCoupleArray, single: unLinkedMembers};
		let tmp = encodeURIComponent(JSON.stringify({
			owner: 'PRWS',
			desc: APPLICATIONTYPES.spouseDetails,
			name: sessionStorage.getItem("userName"),
			hid: loginHid,
			mid: loginMid,
			isMember: isMember,
			data: spouseDetails
		}));
		try {
			let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/application/add/${tmp}`;
			let resp = await axios.get(myUrl);
			applicationSuccess(resp.data);
		} catch (e) {
			console.log(e);
			alert.error(`Error applying for spouse details`);
		}
		setIsDrawerOpened("");
	}


	function selectBrideGroom(index, whoIsIt) {
		//console.log(whoIsIt);
		let tmpArray = unLinkedMembers.filter(x => x.type === whoIsIt);
		if (tmpArray.length === 0) return alert.error(`No ${whoIsIt} available`);
		setBrideOrGroomArray(tmpArray);
		setNewCoupleMember(tmpArray[0].mid);
		setCurrentIndex(index);
		setIsLeftDrawerOpened(whoIsIt);
	}

	function handleAddBrideOrGroomConfirm() {
		//console.log(currentIndex);
		let myRec = unLinkedMembers.find(x => x.mid === newCoupleMember);
		//console.log(myRec);
		let tmpArray = lodashCloneDeep(emurCoupleArray);
		if (myRec.type === 'Groom') {
			tmpArray[currentIndex].gMid = myRec.mid;
			tmpArray[currentIndex].gName = myRec.name;
		} else {
			tmpArray[currentIndex].bMid = myRec.mid;
			tmpArray[currentIndex].bName = myRec.name;
		}
		setEmurCoupleArray(tmpArray);
		setUnLinkedMembers(unLinkedMembers.filter(x => x.mid !== myRec.mid));
		setIsLeftDrawerOpened("");
	}
	
	
	function handleAddNewCouple() {
		//console.log(unLinkedMembers.length);
		setNewCoupleMember(unLinkedMembers[0].mid);
		setIsLeftDrawerOpened("ADDNEW");
	}

	function handleAddCoupleMemberConfirm() {
		let selRec = unLinkedMembers.find(x => x.mid === newCoupleMember);
		let tmp = {
			gMid: (selRec.type === 'Groom') ?	selRec.mid : 0,
			gName: (selRec.type === 'Groom') ?	selRec.name : "",
			bMid: (selRec.type === 'Bride') ?	selRec.mid : 0,
			bName: (selRec.type === 'Bride') ?	selRec.name : "",
			dom: new Date(2000, 0, 1), 
			momentDom: moment(new Date(2000, 0, 1)),
		};
		setEmurCoupleArray(emurCoupleArray.concat([tmp]));
		setUnLinkedMembers(unLinkedMembers.filter(x => x.mid !== newCoupleMember));
		setIsLeftDrawerOpened("");
	}

	function handleRemoveRelation(index, whoIsIt) {
		//console.log(index, whoIsIt);
		
		let myMid = (whoIsIt === 'Groom') ? emurCoupleArray[index].gMid : emurCoupleArray[index].bMid;
		let myName = (whoIsIt === 'Groom') ? emurCoupleArray[index].gName : emurCoupleArray[index].bName;
		
		let tmp = [{mid: myMid, name: myName, type: whoIsIt}].concat(unLinkedMembers);
		//console.log(tmp);
		setUnLinkedMembers(tmp);
		
		// unlink the selected member
		let tmpArray = lodashCloneDeep(emurCoupleArray);
		if  (whoIsIt === 'Groom') {
			if (tmpArray[index].bMid === 0)
				tmpArray = tmpArray.filter(x => x.gMid !== myMid);
			else {
				tmpArray[index].gMid = 0;
				tmpArray[index].gName = "";
			}
		} else {
			if (tmpArray[index].gMid === 0)
				tmpArray = tmpArray.filter(x => x.bMid !== myMid);
			else {
				tmpArray[index].bMid = 0;
				tmpArray[index].bName = "";
			}
		}
		//console.log(tmpArray);
		setEmurCoupleArray(tmpArray);
	}

	function setSpouseEdit(action) {
		setEmurCoupleArray(lodashCloneDeep(coupleArray));
		//setDomMomemtArray(lodashMap(coupleArray, 'momentDom'));
		setIsDrawerOpened(action);
		setUnLinkedMembers([]);
	}


	function updateDom(index, e) {
		let tmpArray = lodashCloneDeep(emurCoupleArray);
		tmpArray[index].momentDom = e;
		setEmurCoupleArray(tmpArray);
		/*
		console.log(index);
		console.log(e);
		let tmp = [].concat(domMomemtArray);
		tmp[index] = e;
		setDomMomemtArray(tmp);
		*/
	}

	function DisplaySpouseButtons() {
		let owner = (memberArray[0].hid === loginHid);
		let admin = (adminInfo & (ADMIN.superAdmin | ADMIN.prwsAdmin) !== 0);
		if (admin || owner)
			return <VsButton align="right" name="Apply Spouse Relationship" onClick={() => setSpouseEdit("APPLYSPOUSE")} />
		else
			return null;
	}
	
	function DisplaySpouseInformation() {
		let hands = getImageName("MARRIAGEHANDS");
		return (
		<div>
		<Grid key={"MEMGRIDHDR"} className={gClasses.noPadding} container align="center" alignItems="center" >
		<Grid item xs={5} sm={5} md={5} lg={5} >
			<Typography className={gClasses.patientInfo2Brown}>Groom</Typography>
		</Grid>
		<Grid item xs={2} sm={2} md={2} lg={2} >
		</Grid>
		<Grid item xs={5} sm={5} md={5} lg={5} >
			<Typography className={gClasses.patientInfo2Brown}>Bride</Typography>
		</Grid>
		</Grid>
		{coupleArray.map( (c, index) => {
			let myDate = dateString(c.dom);
			if (myDate === "") myDate = "N.A.";
			return (
				<Box  key={"SPOUSE"+index} className={((index % 2) == 0) ? gClasses.boxStyleEven : gClasses.boxStyleOdd} borderColor="black" borderRadius={7} border={1} >
				<Grid key={"MEMGRID"+index} className={gClasses.noPadding} container align="center" alignItems="center" >
				<Grid item xs={5} sm={5} md={5} lg={5} >
					<Typography className={gClasses.patientInfo2Blue}>{c.gName}</Typography>
				</Grid>
				<Grid item xs={2} sm={2} md={2} lg={2} >
					<Avatar size="small" variant="circular" src={hands} />
					<Typography className={gClasses.patientInfo2Green}>
						{myDate}
					</Typography>
				</Grid>
				<Grid item xs={5} sm={5} md={5} lg={5} >
					<Typography className={gClasses.patientInfo2Blue}>{c.bName}</Typography>
				</Grid>
				</Grid>
				</Box>					
			)}
		)}	
		</div>
	)}

	return (
	<div className={gClasses.webPage} align="center" key="main">
	<DisplaySpouseButtons />
	<DisplaySpouseInformation />
	{(isDrawerOpened !== "") &&
	<Drawer key="TOP" anchor="top" variant="temporary" open={isDrawerOpened != ""}>
	<Container component="main" maxWidth="xs">	
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} style={{paddingLeft: "5px", paddingRight: "5px"}} >
	<VsCancel align="right" onClick={() => { setIsDrawerOpened("")}} />
	{((isDrawerOpened === "EDITSPOUSE") || (isDrawerOpened === "APPLYSPOUSE")) &&
		<div style={{paddingLeft: "10px", paddingRight: "10px" }}  >
		<Typography align="center" className={gClasses.title}>{((isDrawerOpened === "EDITSPOUSE") ? "Edit" : "Application") + " for Spouse relationship"}</Typography>
		<br />
		{emurCoupleArray.map( (c, index) => {
			//console.log(c);
			return (
			<div>
			<Box style={{paddingLeft: "10px", paddingRight: "10px" }}   className={gClasses.boxStyle} borderColor="black" borderRadius={15} border={1} >
			<Grid key={"MEMGRID1"+index} className={gClasses.noPadding} container align="center" alignItems="center" >
			<Grid align="left" item xs={11} sm={11} md={11} lg={11} >
				{(c.gName !== '') &&
					<Typography className={gClasses.patientInfo2Brown}>{c.gName}</Typography>
				}
				{(c.gName === '') &&
					<VsButton align="center"  name="Select Groom" onClick={() => selectBrideGroom(index, 'Groom')} />
				}
			</Grid>
			<Grid item xs={1} sm={1} md={1} lg={1} >
				{(c.gName !== "") &&
					<VsCancel onClick={() => handleRemoveRelation(index, 'Groom')} />	
				}		
			</Grid>
			</Grid>
			<Grid key={"MEMGRID2"+index} className={gClasses.noPadding} container align="center" alignItems="center" >
			<Grid align="center" item xs={3} sm={2} md={2} lg={2} >
				<Typography className={gClasses.patientInfo2Green}>DOM</Typography>
			</Grid>
			<Grid item xs={false} sm={1} md={1} lg={1} />
			<Grid align="left" item xs={3} sm={3} md={3} lg={3} >
				<Datetime 
					className={gClasses.dateTimeBlock}
					inputProps={{className: gClasses.dateTimeNormal}}
					timeFormat={false} 
					value={c.momentDom}
					dateFormat="DD/MM/yyyy"
					isValidDate={disableFutureDt}
					onClose={(event) => updateDom(index, event)}
					closeOnSelect={true}
				/>
			</Grid>
			</Grid>
			<Grid key={"MEMGRID3"+index} className={gClasses.noPadding} container align="center" alignItems="center" >
			<Grid align="left" item xs={11} sm={11} md={11} lg={11} >
				{(c.bName !== "") &&
					<Typography className={gClasses.patientInfo2Brown}>{c.bName}</Typography>
				}
				{(c.bName === "") &&
					<VsButton align="center" name="Select Bride" onClick={() => selectBrideGroom(index, 'Bride')} />
				}
			</Grid>
			<Grid item xs={1} sm={1} md={1} lg={1} >
				{(c.bName !== "") &&
					<VsCancel onClick={() => handleRemoveRelation(index, 'Bride')} />	
				}		
			</Grid>
			</Grid>
			</Box>
			<br />
			</div>
			)}
		)}
		{(unLinkedMembers.length > 0) &&
		 <Link href="#" onClick={handleAddNewCouple} variant="body2">Add Couple</Link>
		}
		<br />
		<DisplayRegisterStatus />
		<BlankArea />
		<VsButton align="center" name={(isDrawerOpened === "EDITSPOUSE") ? "Update" : "Apply"} 
		onClick={handleEditSpouse} />
		</div>
	}	
	</Box>
	</Container>
	</Drawer>
	}
	<Drawer key="LEFT" anchor="left" variant="temporary" open={isLeftDrawerOpened != ""}>
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
	<VsCancel align="right" onClick={() => { setIsLeftDrawerOpened("")}} />	
	{(isLeftDrawerOpened === "ADDNEW") &&
	<div>
		<Typography align="center" className={gClasses.patientInfo2Brown}>Add new  Couple </Typography>
		<br />
		<br />
		{unLinkedMembers.map( (m, index) => {
			return (
				<Grid className={gClasses.noPadding} key={"NEWCouple"+index} container alignItems="center" align="center">
				<Grid align="left"  item xs={11} sm={11} md={11} lg={11} >
					<Typography className={gClasses.title}>{m.name}</Typography>
				</Grid>	
				<Grid item xs={1} sm={1} md={1} lg={1} >
					<VsRadio checked={newCoupleMember === m.mid} onClick={() => setNewCoupleMember(m.mid)}  />
				</Grid>
				</Grid>	
			)}
		)}
		<BlankArea />
		<VsButton align="center" name="Add Couple Member" onClick={handleAddCoupleMemberConfirm} />
	</div>
	}
	{((isLeftDrawerOpened === "Groom") || (isLeftDrawerOpened === "Bride")) &&
	<div>
		<Typography align="center" className={gClasses.patientInfo2Brown}>{"Select "+isLeftDrawerOpened}</Typography>
		<br />
		{brideOrGroomArray.map( (m, index) => {
			return (
				<Grid className={gClasses.noPadding} key={"NEWCouple"+index} container alignItems="center" align="center">
				<Grid align="left"  item xs={11} sm={11} md={11} lg={11} >
					<Typography className={gClasses.title}>{m.name}</Typography>
				</Grid>	
				<Grid item xs={1} sm={1} md={1} lg={1} >
					<VsRadio checked={newCoupleMember === m.mid} onClick={() => setNewCoupleMember(m.mid)}  />
				</Grid>
				</Grid>	
			)}
		)}
		<BlankArea />
	<VsButton align="center" name={"Add "+isLeftDrawerOpened} onClick={handleAddBrideOrGroomConfirm} />
	</div>
	}
	</Box>
	</Drawer>
	</div>
  );    
}
