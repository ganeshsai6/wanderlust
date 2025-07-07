const { response } = require("express");
const Listing=require("../models/listings.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient=mbxGeocoding({accessToken: mapToken});

module.exports.index=async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};

module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id).populate({path:"review",populate: {path: "author"}}).populate("owner");
    if(!listing){
        req.flash("error","Listing is not available..");
        res.render("/listings");
    }
    res.render("listings/show.ejs",{listing});
};

module.exports.createNewListing=async (req,res)=>{
    let response=await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 2
    }).send()
    console.log(req.body.listing.location);
    console.log(response.body)
    let url=req.file.path;
    let filename=req.file.filename;
    const newlisting= new Listing(req.body.listing);
    newlisting.owner=req.user._id;
    newlisting.image={filename,url};
    newlisting.geometry= response.body.features[0].geometry;
    let savedlist=await newlisting.save();
    console.log(savedlist);
    req.flash("success","New Listing Created..");
    res.redirect("/listings");
};

module.exports.editListing=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing is not available");
        res.redirect("listings");
    }

    let originalImage=listing.image.url;
    let originalImageurl=originalImage.replace("/upload","/upload/h_300,w_250");
    req.flash("success"," Listing Updated..");
    res.render("listings/edit.ejs",{listing,originalImageurl});
};

module.exports.updateListing=async (req, res) => {
    let { id } = req.params;
    let listing= await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file !=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={filename,url};
        await listing.save();
    }
    res.redirect(`/listings/${id}`); // note: added slash for correct redirect
};

module.exports.destroyListing=async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted..");
    res.redirect("/listings");
};