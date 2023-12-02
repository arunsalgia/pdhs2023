import React, { useState, useContext, useEffect } from 'react';
import { makeStyles, Container, CssBaseline } from '@material-ui/core';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';

import Button from '@material-ui/core/Button';

import Typography from '@material-ui/core/Typography';
import InputAdornment  from '@material-ui/core/InputAdornment';
import globalStyles from "assets/globalStyles";

import red from '@material-ui/core/colors/red';
import { cdRefresh, encrypt} from "views/functions.js";
import { BlankArea, ValidComp } from 'CustomComponents/CustomComponents.js';
import { setTab } from "CustomComponents/CricDreamTabs.js"
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import { useAlert } from 'react-alert'

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  error:  {
      // right: 0,
      fontSize: '12px',
      color: red[700],
      // position: 'absolute',
      alignItems: 'center',
      marginTop: '0px',
  },
}));

export default function ChangePassword() {
  const classes = useStyles();
	const gClasses = globalStyles();
	const alert = useAlert();
//  const history = useHistory();
  // const [userName, setUserName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [registerStatus, setRegisterStatus] = useState(199);

	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showRepeatPassword, setShowRepeatPassword] = useState(false);
	
  const handleSubmit = async() => {
    console.log("Submit command provided");
		if (currentPassword === newPassword) { 
			alert.show("Current and New password are identical.");
			return;
		}
		
		let tmp1 = encrypt(currentPassword);
		let tmp2 = encrypt(newPassword);
		let response = await fetch(`${process.env.REACT_APP_AXIOS_BASEPATH}/user/cricchangepassword/${sessionStorage.getItem("uid")}/${tmp1}/${tmp2}`);
		if (response.status === 200) {
			setTab(process.env.REACT_APP_HOME);
		} else {
			// error
			alert.error("Error updating new password");
			setRegisterStatus(response.status);
			console.log(`Status is ${response.status}`);
		}
    
  }


  function ShowResisterStatus() {
    // console.log(`Status is ${registerStatus}`);
    let myMsg;
    switch (registerStatus) {
      case 199:
        myMsg = ``;
        break;
      case 200:
        myMsg = `Updated Password successfully.`;
        break;
      case 602:
        myMsg = "Invalid Current password";
        break;
      case 611:
        myMsg = "New password cannot be same as Current Password";
        break;
      default:
        myMsg = "Unknown Error";
        break;
    }
    return(
      <Typography className={(registerStatus === 200) ? classes.root : classes.error}>{myMsg}</Typography>
    )
}

  
  return (
	<Container component="main" maxWidth="xs">
	<CssBaseline />
	<div className={classes.paper}>
	<Typography component="h1" variant="h5">
		Change Password
	</Typography>
	<ValidatorForm className={classes.form} onSubmit={handleSubmit}>
	{(!showCurrentPassword) &&
		<TextValidator variant="outlined" required fullWidth type="password" className={gClasses.vgSpacing}      
			label="Current Password"
			value={currentPassword}
			onChange={(event) => setCurrentPassword(event.target.value)}
			validators={['noSpecialCharacters']}
			errorMessages={['Special characters not permitted']}
			InputProps={{
				endAdornment: (
					<InputAdornment position="end">
						<VisibilityOffIcon onClick={() => { setShowCurrentPassword(true); }} />
					</InputAdornment>
				),
			}}
		/>
	}
	{(showCurrentPassword) &&
		<TextValidator variant="outlined" required fullWidth type="text" className={gClasses.vgSpacing}      
			label="Current Password"
			value={currentPassword}
			onChange={(event) => setCurrentPassword(event.target.value)}
			validators={['noSpecialCharacters']}
			errorMessages={['Special characters not permitted']}
			InputProps={{
				endAdornment: (
					<InputAdornment position="end">
						<VisibilityIcon onClick={() => { setShowCurrentPassword(false); }} />
					</InputAdornment>
				),
			}}
		/>
	}
	{(!showNewPassword) &&
		<TextValidator variant="outlined" required fullWidth type="password" className={gClasses.vgSpacing}           
			label="Password"
			value={newPassword}
			onChange={(event) => setNewPassword(event.target.value)}
			validators={['minLength', 'noSpecialCharacters']}
			errorMessages={['Minimum 6 characters required', 'Special characters not permitted']}
			InputProps={{
				endAdornment: (
					<InputAdornment position="end">
						<VisibilityOffIcon onClick={() => { setShowNewPassword(true); }} />
					</InputAdornment>
				),
			}}
		/>
	}
	{(showNewPassword) &&
		<TextValidator variant="outlined" required fullWidth type="text" className={gClasses.vgSpacing}           
			label="Password"
			value={newPassword}
			onChange={(event) => setNewPassword(event.target.value)}
			validators={['minLength', 'noSpecialCharacters']}
			errorMessages={['Minimum 6 characters required', 'Special characters not permitted']}
			InputProps={{
				endAdornment: (
					<InputAdornment position="end">
						<VisibilityIcon onClick={() => { setShowNewPassword(false); }} />
					</InputAdornment>
				),
			}}
		/>
	}
	{(!showRepeatPassword) &&
		<TextValidator variant="outlined" required fullWidth type="password" className={gClasses.vgSpacing}                
			label="Repeat password"
			value={repeatPassword}
			onChange={(event) => setRepeatPassword(event.target.value)}
			validators={['isPasswordMatch', 'required']}
			errorMessages={['password mismatch', 'this field is required']}
			InputProps={{
				endAdornment: (
					<InputAdornment position="end">
						<VisibilityOffIcon onClick={() => { setShowRepeatPassword(true); }} />
					</InputAdornment>
				),
			}}		/>
	}
	{(showRepeatPassword) &&
		<TextValidator variant="outlined" required fullWidth type="text" className={gClasses.vgSpacing}                
			label="Repeat password"
			value={repeatPassword}
			onChange={(event) => setRepeatPassword(event.target.value)}
			validators={['isPasswordMatch', 'required']}
			errorMessages={['password mismatch', 'this field is required']}
			InputProps={{
				endAdornment: (
					<InputAdornment position="end">
						<VisibilityIcon onClick={() => { setShowRepeatPassword(false); }} />
					</InputAdornment>
				),
			}}		/>
	}
	<Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
		Update
	</Button>
	</ValidatorForm>
	</div>
	<ValidComp p1={newPassword}/>    
	</Container>
	);
}
