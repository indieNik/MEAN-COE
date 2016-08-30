var Orphanages=require('../models/models');
var express = require('express');
var mongoose=require('mongoose');
var router = express.Router();
var Orphanages=mongoose.model('Orphanages');

//api for all orphanages

router.use('/orphanages', function(req, res, next){
        
    if(!req.isAuthenticated()){
        return res.redirect('/#login');
    }
    
    return next();
});

router.route('/orphanages')
    //get all doners
    .get(function(req, res){
       Orphanages.find({},function(err,result){
          if(err)
              return res.send(500, err);
           else{
               return res.send(result);
           }
       }); 
        
    })

    //create orphanage
    .post(function(req, res){

        orphange = new Orphanages();
        orphange.name=req.body.name;
        orphange.address=req.body.address;
        orphange.email=req.body.email;
        orphange.contact_no=req.body.contact_no;
        orphange.authenticated=req.body.authenticated;
        orphange.no_of_people=req.body.no_of_people;
        orphange.government_id=req.body.government_id;
        orphange.save(function(err,result){
           if(err){
               return res.send(500, err);
           } 
         
           return res.send(result);
            
        });
    });

//api for single orphanage
router.route('/orphanages/:id')
    //get doner
    .get(function(req, res){
         Orphanages.findById({'_id':req.params.id},function(err,result){
          if(err)
              return res.send(500, err);
           else{
             
               return res.send(result);
           }
       }); 
       
    })
    //update orphanage details
    .put(function(req, res){
     
        Orphanages.findById({'_id':req.params.id},function(err,result){
           if(err)
               return res.send("Cannot Find the record");
            else {
                result.name=req.body.name;
                result.address=req.body.address
                result.email=req.body.email;
                result.contact_no=req.body.contact_no;
                result.authenticated=req.body.authenticated;
                result.no_of_people=req.body.no_of_people;
                result.government_id=req.body.government_id;               
                result.save(function(err,result){
                   if(err)
                       return res.send(500, err);
                    else
                        return res.send(result);
                });
            }
        });
    })
    //delete orphanage
    .delete(function(req, res){
    
     Orphanages.findOneAndRemove({'_id':req.params.id},function(err,result){
       if(err)
           return res.send(result);
        else
            return res.send("Deleted");
        });
    });

module.exports = router;