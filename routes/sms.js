var smsRouter = express.Router();


 let headerIdList = [];
 let messageIdList = [];
 function getSMSIds() {
	if (headerIdList.length === 0) {
		let tmp = process.env.HEADERID;
		headerIdList = tmp.split(",");
	}

	if (messageIdList.length === 0) {
		let tmp = process.env.MESSAGEID;
		tmp = tmp.split(",");
		for(let i=0; i<tmp.length; ++i) {
			messageIdList[i] = Number(tmp[i]);
		}
	}
}




async function fast2SmsSend(senderid, messageid, myParams, destMobile) {
	if (process.env.SENDSMS !== "TRUE") return {status_code: SENDSMSDISABLED};
	//if (messageid === 0) return {status_code: SENDSMSDISABLED+1};

	var f2s = unirest("GET", "https://www.fast2sms.com/dev/bulkV2");

	let queryMsg = {
		"authorization": process.env.FAST2SMSKEY,
		"sender_id": senderid,
		"message": Number(messageid),
		"variables_values": myParams,
		"route": "dlt",
		"numbers": destMobile
	};
	//console.log(queryMsg);
	f2s.query(queryMsg);


	f2s.headers({
		"cache-control": "no-cache"
	});
	
	return new Promise((resolve, reject) => {
		f2s.end(function (response) {
			if (response.error) {
				console.log("Rejected");
				return reject(response.body)
			}
			//console.log("Send success");
			return resolve(response.body);
		});
	});
}

async function fast2SmsSendLogin(destMobile, docName, clinicName, apptDateStr, clinicMobile) {
	let myParams = `${docName}|${clinicName}|${apptDateStr}|${clinicMobile}`;
	getSMSIds();
	let status = await fast2SmsSend(headerIdList[0], messageIdList[0], myParams, destMobile);
	return status;
}

async function fast2SmsSendAppointment(destMobile, docName, clinicName, apptDateStr, clinicMobile) {
	let myParams = `${docName}|${clinicName}|${apptDateStr}|${clinicMobile}`;
	getSMSIds();
	let status = await fast2SmsSend(headerIdList[0], messageIdList[0], myParams, destMobile);
	return status;
}

async function fast2SmsSendExpiry(destMobile, docName, clinicName, clinicMobile) {
	let myParams = `${docName}|${clinicName}|${clinicMobile}`;
	getSMSIds();
	let status = await fast2SmsSend(headerIdList[1], messageIdList[1], myParams, destMobile);
	return status;
}

async function fast2SmsSendVisit(destMobile, docName, clinicName, visitDateStr, clinicMobile) {
	let myParams = `${docName}|${clinicName}|${visitDateStr}|${clinicMobile}`;
	getSMSIds();
	let status = await fast2SmsSend(headerIdList[2], messageIdList[2], myParams, destMobile);
	return status;
}

async function fast2SmsCancel(destMobile, docName, clinicName, cancelDateStr, clinicMobile) {
	let myParams = `${docName}|${clinicName}|${cancelDateStr}|${clinicMobile}`;
	console.log(myParams);
	getSMSIds();
	let status = await fast2SmsSend(headerIdList[3], messageIdList[3], myParams, destMobile);
	return status;
}

async function fast2SmsReminder(destMobile, docName, clinicName, apptDateStr, clinicMobile) {
	let myParams = `${docName}|${clinicName}|${apptDateStr}|${clinicMobile}`;
	getSMSIds();
	let status = await fast2SmsSend(headerIdList[4], messageIdList[4], myParams, destMobile);
	return status;
}


async function fast2SmsSendBirthday(destMobile, patientName, clinicName) {
	let myParams = `${patientName}|${clinicName}`;
	//console.log(myParams);
	getSMSIds();
	let status = await fast2SmsSend(headerIdList[5], messageIdList[5], myParams, destMobile);
	return status;
}

async function fast2SmsSendFestival(destMobile, messageId, clinicName) {
	let myParams = `${clinicName}`;
	getSMSIds();
	let status = await fast2SmsSend(headerIdList[6], messageId, myParams, destMobile);
	return status;
}

async function fast2SmsSendReschedule(destMobile, docName, apptDateStr, clinicMobile) {
	let myParams = `${docName}|${apptDateStr}|${clinicMobile}`;
	getSMSIds();
	//console.log(headerIdList[7], messageIdList[7], myParams, destMobile);
	let status = await fast2SmsSend(headerIdList[7], messageIdList[7], myParams, destMobile);
	return status;
}


async function sendAppointmentSms(mobile) {
	// find out how many sms sent by user this month
	let d = new Date();

	fast2SmsSendAppointment(
		mobile, 
		mobile,
		mobile,
		d.toString(),
		mobile
		).
		then((body) => {
			//++customerSmsLog.bulkSmsCount;
			//akshuUpdSmsLog(customerSmsLog);
		}).
		catch((error) => {
			console.log("Error sending message. ", error.status_code);
		});

		// if panel doctor then send message to panel doctor as well
		//destMobile, docName, clinicName, apptDateStr, clinicMobile)
	
	}

async function sendLoginSms(mobile) {
	// find out how many sms sent by user this month
	let d = new Date();

	fast2SmsSendLogin(
		mobile, 
		mobile,
		mobile,
		d.toString(),
		mobile
		).
		then((body) => {
			//++customerSmsLog.bulkSmsCount;
			//akshuUpdSmsLog(customerSmsLog);
		}).
		catch((error) => {
			console.log("Error sending message. ", error.status_code);
		});

		// if panel doctor then send message to panel doctor as well
		//destMobile, docName, clinicName, apptDateStr, clinicMobile)
	
	}



function sendok(res, usrmsg) { res.send(usrmsg); }
function senderr(res, errcode, errmsg) { res.status(errcode).send(errmsg); }
function setHeader(res) { 
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
} 




module.exports = {
	smsRouter,
	fast2SmsSendLogin,
	sendAppointmentSms,
	sendLoginSms,
}