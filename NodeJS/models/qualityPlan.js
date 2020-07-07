const mongoose =  require('mongoose');

var QualityPlan = mongoose.model('QualityPlan',{
    testObject: {type: String},
    testItem: {type: String},
    testSuite: {type: String},
    testLevels: {type: String },
    testCaseType: {type: String},
    developmentPhase: {type: String},
    sourceTestingFramework: {type: String},
    targetTestingFramework: {type: String},
    goalArray: {type: Array},
    questionArray: {type: Array},
    QualityCharacteristics: {type: Array},
    measurementArray: {type: Array},
    qualityPlanName: {type: String},
    thresholdValue: {type: Number}
});

module.exports = { QualityPlan };

