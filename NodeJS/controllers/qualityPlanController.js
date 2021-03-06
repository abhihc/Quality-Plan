const express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;

// Quality Plan model
var { QualityPlan } = require('../models/qualityPlan');

// => localhost:3000/qualityPlans/
// Get all Quality Plans
router.get('/', (req, res) => {
    QualityPlan.find((err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Error in Retriving Quality Plan :' + JSON.stringify(err, undefined, 2)); }
    });
});

// Get specific Quality Plan
router.get('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    QualityPlan.findById(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Retriving Quality Plan :' + JSON.stringify(err, undefined, 2)); }
    });
});

// Save Quality Plan
router.post('/', (req, res) => {
    var quality = new QualityPlan({
        testObject: req.body.testObject,
        testItem: req.body.testItem,
        testSuite: req.body.testSuite,
        testLevels: req.body.testLevels,
        testCaseType: req.body.testCaseType,
        developmentPhase: req.body.developmentPhase,
        sourceTestingFramework: req.body.sourceTestingFramework,
        targetTestingFramework: req.body.targetTestingFramework,
        goalArray: req.body.goalArray,
        questionArray: req.body.questionArray,
        QualityCharacteristics: req.body.QualityCharacteristics,
        measurementArray: req.body.measurementArray,
        qualityPlanName: req.body.qualityPlanName,
    });
    console.log(quality)
    quality.save((err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in quality Save :' + JSON.stringify(err, undefined, 2)); }
    });
});

// Update Quality Plan
router.put('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    var quality = {
        testObject: req.body.testObject,
        testItem: req.body.testItem,
        testSuite: req.body.testSuite,
        testLevels: req.body.testLevels,
        testCaseType: req.body.testCaseType,
        developmentPhase: req.body.developmentPhase,
        sourceTestingFramework: req.body.sourceTestingFramework,
        targetTestingFramework: req.body.targetTestingFramework,
        goalArray: req.body.goalArray,
        questionArray: req.body.questionArray,
        QualityCharacteristics: req.body.QualityCharacteristics,
        measurementArray: req.body.measurementArray,
        qualityPlanName: req.body.qualityPlanName,
    }
    QualityPlan.findByIdAndUpdate(req.params.id, { $set: quality }, { new: true }, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in quality plan Update :' + JSON.stringify(err, undefined, 2)); }
    });
});

// Delete Quality Plan
router.delete('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    QualityPlan.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in quality plan Delete :' + JSON.stringify(err, undefined, 2)); }
    });
});



module.exports = router;