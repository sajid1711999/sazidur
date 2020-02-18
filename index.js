const express = require('express');
const firebase=require('firebase');
const ejs=require('ejs');
const http=require('http');
const app = express();
const port =process.env.port || 3000;

const firebaseConfig = {
    apiKey: "AIzaSyAwjO4bvRU9dwsu8Eu5hMvIFFkuNvJZHPA",
    authDomain: "my-city-doctor.firebaseapp.com",
    databaseURL: "https://my-city-doctor.firebaseio.com",
    projectId: "my-city-doctor",
    storageBucket: "my-city-doctor.appspot.com",
    messagingSenderId: "353722567485",
    appId: "1:353722567485:web:de3a6d61faf5f4841b5354"
};

firebase.initializeApp(firebaseConfig);
const database=firebase.database();

app.use(express.static("public"));
app.set("view engine","ejs");



app.get("/",function(req,res){
  var city="new Delhi".toUpperCase();
  HomeDir(req,res,city);
});


app.get("/Home",function(req,res){
  var city="new Delhi".toUpperCase();
  HomeDir(req,res,city);
});

app.get("/AboutUs",function(req,res){
	res.render("AboutUs");
});
app.get("/Location",function(req,res){
	res.render("Location");
});
app.get("/ContactUs",function(req,res){
	res.render("ContactUs");
});

app.get("/setCity",function(req,res){
  var city=req.query.city.toUpperCase();
  HomeDir(req,res,city);
});



app.get("/Search",function(req,res){
  var name=req.query.query.toUpperCase();
  var doctors=[];
  var ids=[];
  database.ref('/Users/Doctors').orderByKey().on('value',snpashot =>{
    docs=(snpashot.val());
    for(id in docs){
      var doctor = snpashot.child(id).val();
      if(doctor.docName.toUpperCase()==name){
      doctors[doctors.length]=doctor;
      ids[ids.length]=id;
      }
    }
  res.render("DoctorList",{ doctors:doctors ,id:ids,cat:name});  
  });
});

app.get("/Categories",function(req,res){
	res.render("Categories");
});

app.get("/chat",function(req,res){
  res.render("chat");
});

app.get("/Categories/:catName/",function(req,res){
	var cat=req.params.catName.toUpperCase();
  var doctors=[];
  var ids=[];
  database.ref('/Users/Doctors').orderByKey().on('value',snpashot =>{
    docs=(snpashot.val());
    for(id in docs){
      var doctor = snpashot.child(id).val();
      if(doctor.docCategory==cat){
      doctors[doctors.length]=doctor;
      ids[ids.length]=id;
      }
    }
  res.render("DoctorList",{ doctors:doctors ,cat:cat,id:ids});  
  });
});

app.get("/Categories/:catName/:doc",function(req,res){
  var id=req.params.doc;
  database.ref('/Users/Doctors').orderByKey().on('value',snpashot =>{
    docs=(snpashot.child(id).val());
    res.render("Doctor",{doctor:docs});  
  });
});

app.get("/advertisement",function(req,res){
  var offerlist=[];
  database.ref('/Offers/National').orderByKey().on('value',snpashot =>{
    offers=(snpashot.val());
    for(id in offers){
      var link;
      var img = snpashot.child(id).child("link").val();
      var clickable = snpashot.child(id).child("clickable").val();
      if(clickable=="yes"){
        link = snpashot.child(id).child("browse").val();
      }
      offerlist[offerlist.length]={img,clickable,link};
    }
	  res.render("AdvertiseList",{offers:offerlist});  
  }); 
});

app.post("/comments",function(req,res){
	var query=req.params.query;
	var types=req.params.types;
  console.log(req);
	res.render("/AboutUs",{query:query,types:types});
});

function HomeDir(req,res,city){
  var offerlist=[];
  var flag=0;
  database.ref('/Offers/National').orderByKey().limitToFirst(6).on('value',snpashot =>{
    offers=(snpashot.val());
    for(id in offers){
      var link;
      var img = snpashot.child(id).child("link").val();
      var clickable = snpashot.child(id).child("clickable").val();
      if(clickable=="yes"){
        link = snpashot.child(id).child("browse").val();
      }
      offerlist[offerlist.length]={img,clickable,link};
      flag=1;
    }
  });
  var doctors=[];
  var ids=[];
  database.ref('/Users/Doctors').orderByKey().on('value',snpashot =>{
    docs=(snpashot.val());
    for(id in docs){
      var doctor = snpashot.child(id).val();
      if(doctor.docCity.toUpperCase()==city){
      doctors[doctors.length]=doctor;
      ids[ids.length]=id;
      }
    }
  if(flag==1){
    res.render("Home",{offers:offerlist,doctors:doctors ,id:ids,city:city});
  }  
  }); 
}

app.get('*', (req, res) => res.send('Error Ha Ha!'));


app.listen(port, () => console.log(`Example app listening on port ${port}!`));