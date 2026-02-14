import React from "react";
import axios from "axios";
// react plugin for creating charts

// @material-ui/core
import { useEffect, useState } from 'react';
import { makeStyles } from "@material-ui/core/styles";

// @material-ui/icons
import SportsHandballIcon from '@material-ui/icons/SportsHandball';
import TimelineIcon from '@material-ui/icons/Timeline';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import GroupIcon from '@material-ui/icons/Group';
import Button from '@material-ui/core/Button';
import Update from "@material-ui/icons/Update";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Accessibility from "@material-ui/icons/Accessibility";

import Typography from '@material-ui/core/Typography';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';

// core components
import Grid from "@material-ui/core/Grid";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
// import Table from "components/Table/Table.js";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';


import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import socketIOClient from "socket.io-client";
import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import globalStyles from "assets/globalStyles";
import { NoGroup, BlankArea } from 'CustomComponents/CustomComponents.js';
import { blue, orange, deepOrange}  from '@material-ui/core/colors';
import { getTsBuildInfoEmitOutputFilePath } from "typescript";

import VsButton from "CustomComponents/VsButton";

import Modal from 'react-modal';

const CardColor = "#ff9800";
const currencyChar = '₹';

import {setTab, setDisplayPage } from "CustomComponents/CricDreamTabs.js"

import { 
	dateString,
	getMemberName,
	getAdminInfo, getAdminRec,
	showSuccess, showError, showInfo,
} from "views/functions.js";


const IMAGESIZE = 75;
let first =  true;

//var countInfo = null;

export default function Dashboard() {
  const gClasses = globalStyles();
  //const classes = useStyles();
  //const dashClasses = useDashStyles();

   const [countInfo, setCountInfoLocal] = useState(null);
	const [loginUserRec, setLoginUserRec] = useState(JSON.parse(sessionStorage.getItem("memberRec")));
   const [userName, setuserName] = useState(sessionStorage.getItem("userName"));
	const [applMsg, setApplMsg] = useState("");
	const adminData = getAdminInfo();
   console.log(adminData);
	
  useEffect(() => {
		async function getMemberCount() {
         var myMid = sessionStorage.getItem("mid");
         console.log(typeof myMid);
         console.log(myMid);
         if (myMid === '0') myMid = sessionStorage.getItem("prwsLogin");
			try {
				var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/member/count/all/${myMid}`;
				var resp = await axios.get(myUrl);
				setCountInfoLocal(resp.data);
				console.log(resp.data);
				setApplMsg(resp.data.application + " application" + ((resp.data.application > 1) ? "s" : ""));
			}
			catch (e) {
				showError("Unable to get member counts for Dashboard");
			}
		}
		
		getMemberCount();	
	}, []);


   
	function jumpToPrws() {
		setTab(process.env.REACT_APP_PRWS);
	}

	function jumpToPjym() {
		setTab(process.env.REACT_APP_PJYM);
	}

	function jumpToHumad() {
		setTab(process.env.REACT_APP_HUMAD);
	}

	function jumpToFamily() {
		setDisplayPage(process.env.REACT_APP_FAMILY, 0, 0);
	}

	function jumpToApplication() {
		setDisplayPage(process.env.REACT_APP_APPLICATION, 0, 0);
	}

	function jumpToContactUs() {
      setTab(process.env.REACT_APP_CONTACTUS);
	}

	function jumpToGotra() {
		setDisplayPage(process.env.REACT_APP_GOTRA, 0, 0);
	}
	
	function jumpToCity() {
		setDisplayPage(process.env.REACT_APP_CITY, 0, 0);		
	}
	
	function jumpToAdmin() {
		setDisplayPage(process.env.REACT_APP_ADMIN, 0, 0);
	}
	
	function jumpToTestValidator() {
		setDisplayPage(process.env.REACT_APP_VALIDATOR, 0, 0);
	}

   function applyMembership(mType) {
     console.log(mType);
     var myData = JSON.stringify({
       calledFrom: process.env.REACT_APP_DASH,
       membershipType:  mType
     });
     console.log(myData)
     sessionStorage.setItem("membershipApplication", myData);
     setTab(process.env.REACT_APP_NEWMEMBERSHIP)
   }
   
	console.log(countInfo);
	if (!countInfo) return false;
	return (
	<div style={{padding: "10px"}} >
      <GridContainer key="db_gc_ub0">
        <GridItem align= "right" key="db_buttons1" xs={12} sm={12} md={12} lg={12} >
           {((userName === "Guest") || (!loginUserRec.prwsMember && !loginUserRec.humadMember && !loginUserRec.pjymMember)) &&
             <VsButton name="Apply for membership" onClick={() => {applyMembership("PRWS"); } } />
           }
           {/*{((userName === "Guest") || (!loginUserRec.prwsMember && !loginUserRec.humadMember)) &&
             <VsButton name="Apply for Humad" onClick={() => {applyMembership("HUMAD"); } }  />
           }
           {((userName === "Guest") || (!loginUserRec.prwsMember && !loginUserRec.pjymMember)) &&
             <VsButton name="Apply for PJYM" onClick={() => {applyMembership("PJYM"); } } />
           } */ }   
        </GridItem>  
        <GridItem key="db_gi_ub1" xs={12} sm={6} md={4} lg={3}>
					<a href='/' > 
          <Card key="db_card_ub1" onClick={jumpToPrws} >
            <CardHeader key="db_chdr_ub1" color="warning" stats icon>
              <CardIcon color="warning">
               <img src={process.env.PUBLIC_URL + 'image/PRWS.JPG'} height={IMAGESIZE} width={IMAGESIZE} /> 
              </CardIcon>
               <div>
                  <button className={gClasses.dashText} >PRWS</button>
                  <h5 align="right" color="blue"  className={gClasses.cardTitle} >{`${countInfo.prws} members`}</h5>
               </div>
            </CardHeader>
            <CardFooter key="db_cftr_ub1" stats>
               <Typography className={gClasses.patientInfo2Blue} >Pratapgarh Rajasthan Welfare Samiti</Typography>
            </CardFooter>
          </Card>
          </a>
        </GridItem>
        <GridItem key="db_gi_ub2" xs={12} sm={6} md={4} lg={3}>
          <a href='/' > 
          <Card key="db_card_ub2" onClick={jumpToPjym} >
            <CardHeader key="db_chdr_ub2" color="success" stats icon>
              <CardIcon color="success">
							<img src={process.env.PUBLIC_URL + 'image/PJYM.JPG'} height={IMAGESIZE} width={IMAGESIZE} /> 
              </CardIcon>
              <button className={gClasses.dashText} >PJYM</button>
							<h5 color="blue"  className={gClasses.cardTitle} >{`${countInfo.pjym} members`}</h5>
            </CardHeader>
            <CardFooter key="db_cftr_ub2" stats> 
							<Typography className={gClasses.patientInfo2Blue} >Pratapgarh Jain Yuva Manch</Typography>
            </CardFooter>
          </Card>
					</a>
        </GridItem>
        <GridItem key="db_gi_ub3" xs={12} sm={6} md={4} lg={3} >
					<a href='/' > 
          <Card key="db_card_ub3" onClick={jumpToHumad} >
            <CardHeader key="db_chdr_ub3" color="info" stats icon>
              <CardIcon color="info">
								<img src={process.env.PUBLIC_URL + 'image/HUMAD.JPG'} height={IMAGESIZE} width={IMAGESIZE} /> 
              </CardIcon>
              <button className={gClasses.dashText} >Humad</button>
							<h5 align="right" color="blue"  className={gClasses.cardTitle} >{`${countInfo.humad} members`}</h5>
            </CardHeader>
            <CardFooter key="db_cftr_ub3" stats>
							<Typography className={gClasses.patientInfo2Blue} >Humad Jain Samaj (Mumbai)</Typography>
            </CardFooter>
          </Card>
					</a>
        </GridItem>
        <GridItem key="db_gi_ub4" xs={12} sm={6} md={4} lg={3} >
					<a href='/' > 
          <Card key="db_card_ub4" onClick={jumpToFamily} >
            <CardHeader key="db_chdr_ub4" color="info" stats icon>
              <CardIcon color="info">
							<img src={process.env.PUBLIC_URL + 'image/FAMILY.JPG'} height={IMAGESIZE} width={IMAGESIZE} /> 							
              </CardIcon>
              <button className={gClasses.dashText} >Family</button>
							<h5 align="right" color="blue"  className={gClasses.cardTitle} >{`${countInfo.family} family members`}</h5>
            </CardHeader>
            <CardFooter key="db_cftr_ub4" stats>
							<Typography className={gClasses.patientInfo2Blue} >{(loginUserRec.mid) ? `Family of ${getMemberName(loginUserRec, false, false)}` : 'No info of family'}</Typography>
            </CardFooter>
          </Card>
					</a>
        </GridItem>
        <GridItem key="db_gi_ub5" xs={12} sm={6} md={4} lg={3} >
					<a href='/' > 
          <Card key="db_card_ub5" onClick={jumpToApplication}>
            <CardHeader key="db_chdr_ub5" color="primary" stats icon>
              <CardIcon color="primary">
							<img src={process.env.PUBLIC_URL + 'image/APPLICATION.JPG'} height={IMAGESIZE} width={IMAGESIZE} /> 							
              </CardIcon>
              <button className={gClasses.dashText} >Application</button>
							<h5 align="right" color="blue"  className={gClasses.cardTitle} >{applMsg}</h5>
            </CardHeader>
            <CardFooter key="db_cftr_ub5" stats>
							<Typography className={gClasses.patientInfo2Blue} >{`Pending applications`}</Typography>
            </CardFooter>
          </Card>
					</a>
        </GridItem>
        <GridItem key="db_gi_ub51" xs={12} sm={6} md={4} lg={3} >
					<a href='/' > 
          <Card key="db_card_ub51" onClick={jumpToContactUs}>
            <CardHeader key="db_chdr_ub5" color="warning" stats icon>
              <CardIcon color="warning">
							<img src={process.env.PUBLIC_URL + 'image/CONTACTUS.JPG'} height={IMAGESIZE} width={IMAGESIZE} /> 							
              </CardIcon>
              <button className={gClasses.dashText} >Contact Us</button>
							<h5 align="right" color="blue"  className={gClasses.cardTitle} ></h5>
            </CardHeader>
            <CardFooter key="db_cftr_ub51" stats>
							<Typography className={gClasses.patientInfo2Blue} >Contact us</Typography>
            </CardFooter>
          </Card>
            </a>
        </GridItem>
        {(adminData > 0) &&
        <GridItem key="admin_item" xs={12} sm={6} md={4} lg={3} >
					<a href='/' > 
          <Card key="admin_card" onClick={jumpToAdmin}>
            <CardHeader key="admin_header" color="info" stats icon>
              <CardIcon color="info">
							<img src={process.env.PUBLIC_URL + 'image/ADMIN.JPG'} height={IMAGESIZE} width={IMAGESIZE} /> 							
              </CardIcon>
             <button className={gClasses.dashText} >Admin</button>
							<h5 align="right" color="blue"  className={gClasses.cardTitle} ></h5>
            </CardHeader>
            <CardFooter key="admin_footer" stats>
							<Typography className={gClasses.patientInfo2Blue} >{`Admin functions`}</Typography>
            </CardFooter>
          </Card>
					</a>
        </GridItem>
				}
				
      </GridContainer>  
      <ToastContainer />
		</div>
);		
}
