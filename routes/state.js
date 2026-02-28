var router = express.Router();
const { 
	getLoginName, getDisplayName,
} = require('./functions'); 

async function updateStateInHod(oldState, newState) {
	let allHods = await M_Hod.find({active: true, state: oldState}); 
	for(let i=0; i<allHods.length; ++i) {
		allHods[i].state = newState;
		await allHods[i].save();
	}
}


router.use('/', function(req, res, next) {
  setHeader(res);
  if (!db_connection) { senderr(res, DBERROR,  ERR_NODB); return; }
 
  next('route');
});

router.get('/list', async function(req, res, next) {
  setHeader(res);

  var tmp = await M_State.find({}, {_id: 0, state: 1}).sort({state: 1});
	sendok(res, tmp);
});

router.get('/listfromhod', async function(req, res, next) {
  setHeader(res);

  var tmp = await M_Hod.find({active: true, state: {$ne: ''} }, {_id: 0, state: 1}).sort({state: 1}).sort({state: 1});
	tmp = _.uniqBy(tmp, 'state');
	sendok(res, tmp);
});

router.get('/add/:newState', async function(req, res, next) {
  setHeader(res);
  
  var {newState} = req.params;
	newState = getDisplayName(newState);	
	console.log(newState);
   console.log(newState);
   //return senderr(res, 601, "dwdwqdqw");
   
	var mRec = await M_State.findOne({state: newState});
	if (mRec) return senderr(res, 601, "State already in database");

	mRec = new M_State();
	mRec.id = newState;
	mRec.state = newState;
	mRec.enabled = true;
	await mRec.save();
	sendok(res, mRec);
	
});

router.get('/renametonew/:oldState/:newState', async function(req, res, next) {
  setHeader(res);
  
  var {oldState, newState} = req.params;
	oldState = getDisplayName(oldState);
	newState = getDisplayName(newState);
	
	console.log(oldState, newState);

	let tmp = await M_State.findOne({state: newState});
	if (tmp) return senderr(res, 601, "new found. Duplicate error");
	
	let rec1 = await M_State.findOne({state: oldState});
	if (!rec1)  return senderr(res, 602, "old not found");

	rec1.id = newState;
	rec1.state = newState;
	rec1.enabled = true;
	await rec1.save();

	await updateStateInHod(oldState, newState)


	sendok(res, rec1);

});


router.get('/renametoexisting/:oldState/:newState', async function(req, res, next) {
  setHeader(res);
  
  var {oldState, newState} = req.params;
	oldState = getDisplayName(oldState);
	newState = getDisplayName(newState);

	let tmp = await M_State.findOne({state: oldState})
	if (!tmp) return senderr(res, 602, "Old State not found in database");

	let mRec = await M_State.findOne({state: newState})
	if (!mRec) return senderr(res, 601, "New State not found in database");

	// now rename in HOD
	await updateStateInHod(oldState, newState);

	// just delete the old one
	await M_State.deleteOne({state: oldState});

	sendok(res, mRec);
});


router.get('/delete/:delState', async function(req, res, next) {
  setHeader(res);
  
  var { delState } = req.params;
	
	//console.log("In delete...........................");
	delState = getDisplayName(delState);
	console.log(delState);
	
	// confirm if HOD is not using this city
	let temp = await M_Hod.find({active: true, city: delState});
	if (temp.length > 0) return senderr(res, 601, "In use");

	console.log("this city is not in use");
	await M_State.deleteOne({city: delState});
	console.log("Deleted....");
	sendok(res, `City ${delState} deleted`);
});

router.get('/fromid', async function(req, res, next) {
  setHeader(res);
  
	var allRec = await M_State.find({});
	for (var i=0; i<allRec.length; ++i) {
      allRec[i].state = allRec[i].id;
		await allRec[i].save();
	}
	sendok(res, "Done");
});


router.get('/blank', async function(req, res, next) {
  setHeader(res);
  
	var allState = await M_State.find({});
   var allHod = await M_Hod.find({}).sort({hid: 1});
   
   errData=[];
	for (var i=0; i<allHod.length; ++i) {
      if (allHod[i].state == "") {
        errData.push(`Hid ${allHod[i].hid} state is blank`);  
      }
	}
	sendok(res, errData);
});

router.get('/diff', async function(req, res, next) {
  setHeader(res);
  
	var allState = await M_State.find({}).sort({state: 1});
   var allHod = await M_Hod.find({}).sort({hid: 1});
   
   errData=[];
	for (var i=0; i<allHod.length; ++i) {
      if (allHod[i].state !== "") {
        if (allState.filter(x => x.state === allHod[i].state).length == 0)
         errData.push(`Hid ${allHod[i].hid} state ${allHod[i].state} not in database`);  
      }
	}
	sendok(res, errData);
});

router.get('/correct/:olds/:news', async function(req, res, next) {
  setHeader(res);
  var { olds, news } = req.params;
  
	var allState = await M_State.find({}).sort({state: 1});
   var allHod = await M_Hod.find({state: olds}).sort({hid: 1});
   
   errData=[];
	for (var i=0; i<allHod.length; ++i) {
     errData.push(`${allHod[i].hid}  ${allHod[i].state}} updated`);
     allHod[i].state = news;
     await allHod[i].save();
	}
	sendok(res, errData);
});

router.get('/test/name', async function(req, res, next) {
  setHeader(res);
	var { name } = req.params;
	
	var tmpList = name.split(" ");
	for(var i=0; i<tmpList.length; ++i) {
		tmpList[i] = getDisplayName(tmpList[i].trim());
	}
	name = tmpList.join(" ");

	var tmpList = name.split(".");
	for(var i=0; i<tmpList.length; ++i) {
		tmpList[i] = getDisplayName(tmpList[i]);
	}
	name = tmpList.join(".");

	sendok(res, name);
	return;

   getDisplayName(newState);	
	var allRec = await M_Hod.find({active: true});
	var cityList = _.map(allRec, 'city');
	cityList = _.uniqBy(cityList);
	for (var i=0; i<cityList.length; ++i) {
		var tmp = new M_State({
			id: cityList[i],
			city: cityList[i],
			enabled: true
		});
		await tmp.save();
	}
	sendok(res, "Done");
});

router.get('/sethod/:oldState/:newState', async function(req, res, next) {
  setHeader(res);
	
	var { oldState, newState } = req.params;

	await updateStateInHod(getDisplayName(oldState), getDisplayName(newState))
	sendok(res, "Done");
});


function sendok(res, usrmsg) { res.send(usrmsg); }
function senderr(res, errcode, errmsg) { res.status(errcode).send(errmsg); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
} 

module.exports = router;