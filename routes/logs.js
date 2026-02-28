var router = express.Router();
const { 
	getLoginName, getDisplayName,
} = require('./functions'); 

async function updateGotraInHod(oldGotra, newGotra) {
	let allHods = await M_Hod.find({active: true, gotra: oldGotra}); 
	for(let i=0; i<allHods.length; ++i) {
		allHods[i].gotra = newGotra;
		await allHods[i].save();
	}
}


router.use('/', function(req, res, next) {
  setHeader(res);
  if (!db_connection) { senderr(res, DBERROR,  ERR_NODB); return; }
 
  next('route');
});

// send list of in chunks of blocks.
// Each Block will contain #medicines which is confgired in MEDBLOCK

router.get('/list/all', async function(req, res, next) {
  setHeader(res);

  var tmp = await M_PrwsLog.find({}).sort({date: -1});
	sendok(res, tmp);
});

const LOGINLOGOUT = ["Login", "Logout"];

router.get('/filterlist/:filterData', async function(req, res, next) {
  setHeader(res);
	var {filterData} = req.params;
	
	filterData = JSON.parse(filterData);
	//console.log(filterData);

	var cond = {};
	switch(filterData.filterBy) {
		case "NoLogInOut":
			//console.log("NoLogInOut");
			cond['action'] = {$nin: [PRWSACTION.login, PRWSACTION.logout] };
			break;
		case "OnlyLogInOut":
			//console.log("OnlyLogInOut");
			cond['action'] = {$in: [PRWSACTION.login, PRWSACTION.logout] };
			break;
	}
	
	/*
	$and: [
        { $or: [ { qty: { $lt : 10 } }, { qty : { $gt: 50 } } ] },
        { $or: [ { sale: true }, { price : { $lt : 5 } } ] }
    ]
	$and: [ { qty: { $lt : 10 } }, { qty : { $gt: 50 } } ] 
	'Sun Sep 29 2024 12:23:17 GMT+0530 (India Standard Time)'
*/	
	
	if (filterData.timeRange) {
		var startDate = new Date(filterData.startDate)
		startDate.setHours(0);
		startDate.setMinutes(0);
		startDate.setSeconds(0);
		startDate.setMilliseconds(0);
		var endDate = new Date(filterData.endDate)
		endDate.setHours(0);
		endDate.setMinutes(0);
		endDate.setSeconds(0);
		endDate.setMilliseconds(0);
		endDate.setDate(endDate.getDate()+1);
		//console.log(startDate, endDate);
		var tmp = [ { date: { $gte : startDate } }, { date : { $lt:  endDate} } ];
		//console.log(tmp);
		cond['$and'] = tmp;
	}
		
	var myData =  await M_PrwsLog.find(cond).sort({date: -1}).skip(filterData.currentPage*filterData.pageSize).limit(filterData.pageSize);
	var totalCount = await M_PrwsLog.countDocuments(cond);

	//console.log("Record count", myData.length)
	//console.log("Total count",totalCount);
	sendok(res, {totalCount: totalCount, data: myData});

});

router.get('/list/nologinlogout', async function(req, res, next) {
  setHeader(res);

  var tmp = await M_PrwsLog.find({action: {$nin: [PRWSACTION.login, PRWSACTION.logout] }}).sort({date: -1});
	sendok(res, tmp);
});

router.get('/list/onlyloginlogout', async function(req, res, next) {
  setHeader(res);

  var tmp = await M_PrwsLog.find({action: {$in: [PRWSACTION.login, PRWSACTION.logout] }}).sort({date: -1});
	sendok(res, tmp);
});



router.get('/add/:newGotra', async function(req, res, next) {
  setHeader(res);
  
  var {newGotra} = req.params;
	console.log(newGotra);
	newGotra = getDisplayName(newGotra);	
	var mRec = await M_Gotra.findOne({gotra: newGotra});
	if (mRec) return senderr(res, 601, "Gotra already in database");

	mRec = new M_Gotra();
	mRec.id = newGotra;
	mRec.gotra = newGotra;
	mRec.enabled = true;
	await mRec.save();
	sendok(res, mRec);
});

router.get('/renametonew/:oldGotra/:newGotra', async function(req, res, next) {
  setHeader(res);
  
  var {oldGotra, newGotra} = req.params;
	oldGotra = getDisplayName(oldGotra)
	newGotra = getDisplayName(newGotra)
	console.log(oldGotra, newGotra);

	let tmp = await M_Gotra.findOne({gotra: newGotra});
	if (tmp) return senderr(res, 601, "new found");
	
	let rec1 = await M_Gotra.findOne({gotra: oldGotra});
	if (!rec1)  return senderr(res, 602, "old not found");

	rec1.id = newGotra;
	rec1.gotra = newGotra;
	rec1.enabled = true;
	await rec1.save();
	
	await updateGotraInHod(oldGotra, newGotra)
	sendok(res, rec1);

});

router.get('/renametoexisting/:oldGotra/:newGotra', async function(req, res, next) {
  setHeader(res);
  
  var {oldGotra, newGotra} = req.params;
	oldGotra = getDisplayName(oldGotra)
	newGotra = getDisplayName(newGotra)

	let tmp = await M_Gotra.findOne({gotra: oldGotra})
	if (!tmp) return senderr(res, 602, "Old Gotra not found in database");

	let mRec = await M_Gotra.findOne({gotra: newGotra})
	if (!mRec) return senderr(res, 601, "New Gotra not found in database");

	// now rename in HOD
	await updateGotraInHod(oldGotra, newGotra);

	// just delete the old one
	await M_Gotra.deleteOne({gotra: oldGotra});
	sendok(res, mRec);
});

router.get('/delete/:delGotra', async function(req, res, next) {
  setHeader(res);
  
  var { delGotra } = req.params;
	delGotra = getDisplayName(delGotra);	
	
	//console.log("In delete...........................");
	console.log(delGotra);
	// confirm if HOD is not using this gotra
	let temp = await M_Hod.find({active: true, gotra: delGotra});
	if (temp.length > 0) return senderr(res, 601, "In use");

	console.log("this gotra is not in use");
	await M_Gotra.deleteOne({gotra: delGotra});
	console.log("Deleted....");
	sendok(res, "1 gotra deleted");
});


router.get('/test', async function(req, res, next) {
  setHeader(res);
	
	var allRec = await M_Gotra.find({});
	for (var i=0; i<allRec.length; ++i) {
		allRec[i].id = getDisplayName(allRec[i].id);
		allRec[i].gotra = getDisplayName(allRec[i].id);
		await allRec[i].save();
	}
	sendok(res, "Done");
});


function sendok(res, usrmsg) { res.send(usrmsg); }
function senderr(res, errcode, errmsg) { res.status(errcode).send(errmsg); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
} 

module.exports = router;