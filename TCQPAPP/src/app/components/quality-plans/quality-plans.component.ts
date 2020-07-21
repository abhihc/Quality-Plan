import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FormArray, FormGroup, FormBuilder } from '@angular/forms';
import { QualityPlanService } from './../../common/quality-plan.service';
import { QualityPlan, QualityPlanAttribute } from './../../common/quality-plan.model';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-quality-plans',
  templateUrl: './quality-plans.component.html',
  styleUrls: ['./quality-plans.component.css','./../../components/style/style.component.css'],
  providers: [QualityPlanService]
})
export class QualityPlansComponent implements OnInit {

  data = new QualityPlan();

  isReadOnly = true;

  editForm: FormGroup;
  goalArray: FormArray;
  questionArray: FormArray;
  QualityCharacteristics: FormArray;
  measurementArray: FormArray;

  qpa = new QualityPlanAttribute();

  constructor(private qualityPlanService: QualityPlanService, public formbuilder: FormBuilder, private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.qualityPlanList();
    this.reset();

    this.editForm = this.formbuilder.group({
      _id: [''],
      testObject: [''],
      testItem: [''],
      testSuite: [''],
      testLevels: [''],
      testCaseType: [''],
      developmentPhase: [''],
      sourceTestingFramework: [''],
      targetTestingFramework: [''],
      qualityPlanName: [''],
      goalArray: this.formbuilder.array([this.createGoal()]),
      questionArray: this.formbuilder.array([this.createQuestion()]),
      QualityCharacteristics: this.formbuilder.array([this.createQC()]),
      measurementArray: this.formbuilder.array([this.createMeasurement()])
    })
  }

  createGoal(): FormGroup {
    return this.formbuilder.group({
      objectOfStudy: '',
      purpose: '',
      qualityFocus: '',
      viewpoint: '',
      context: ''
    })
  }

  createQuestion(): FormGroup {
    return this.formbuilder.group({
      question: ''
    })
  }

  createQC() {
    return this.formbuilder.group({
      qualityCharacteristic: '',
      qualitySubCharacteristics: this.formbuilder.array([this.createQSC()])
    })
  }

  createQSC() {
    return this.formbuilder.group({
      qualitySubCharacteristic: '',
      qualityAttributes: this.formbuilder.array([this.createQA()])
    })
  }

  createQA() {
    return this.formbuilder.group({
      qualityAttribute: '',
    })
  }

  createMeasurement(): FormGroup {
    return this.formbuilder.group({
      name: '',
      informalDefinition: '',
      measurementType: '',
      measurementMethod: '',
      scaleType: '',
      scaleRange: '',
      interpretation: '',
      thresholdValue: null
    })
  }

  reset(form?: NgForm) {
    if (form)
      form.reset();
    this.qualityPlanService.selectedQualityPlan = {
      _id: "",
      testObject: "",
      testItem: "",
      testSuite: "",
      testLevels: "",
      testCaseType: "",
      developmentPhase: "",
      sourceTestingFramework: "",
      targetTestingFramework: "",
      goalArray: [],
      questionArray: [],
      QualityCharacteristics: [],
      measurementArray: [],
      qualityPlanName: ""
        }
  }

  onSubmit(form: NgForm) {
    form.value._id = this.data._id;
    this.qualityPlanService.putQualityPlan(form.value).subscribe((res) => {
      this.reset(form);
      this.qualityPlanList();
      this.openSnackBar('Qulity plan updates successfully', null);
    })
  }

  qualityPlanList() {
    this.qualityPlanService.getQualityPlanList().subscribe((res) => {
      this.qualityPlanService.qualityPlans = res as QualityPlan[];
    });
  }

  onView(qp: QualityPlan) {
    this.editForm.patchValue({
      _id: qp._id,
      testObject: qp.testObject,
      testItem: qp.testItem,
      testSuite: qp.testSuite,
      testLevels: qp.testLevels,
      testCaseType: qp.testCaseType,
      developmentPhase: qp.developmentPhase,
      sourceTestingFramework: qp.sourceTestingFramework,
      targetTestingFramework: qp.targetTestingFramework,
      qualityPlanName: qp.qualityPlanName
    })
    this.editForm.setControl('goalArray', this.setExistingGoals(qp.goalArray));
    this.editForm.setControl('questionArray', this.setExistingQuestions(qp.questionArray));
    this.editForm.setControl('QualityCharacteristics', this.setExistingQC(qp.QualityCharacteristics));
    this.editForm.setControl('measurementArray', this.setMeasurement(qp.measurementArray));
    this.isReadOnly = true;
    this.data = qp;
  }

  setExistingGoals(goalset: any): FormArray {
    const formArray = new FormArray([]);
    goalset.forEach(element => {
      formArray.push(this.formbuilder.group({
        objectOfStudy: element.objectOfStudy,
        purpose: element.purpose,
        qualityFocus: element.qualityFocus,
        viewpoint: element.viewpoint,
        context: element.context
      }));
    });

    return formArray;
  }

  setExistingQuestions(questionset: any): FormArray {
    const formArray = new FormArray([]);
    questionset.forEach(element => {
      formArray.push(this.formbuilder.group({
        question: element.question
      }));
    });
    return formArray;
  }

  setExistingQC(qcSet: any): FormArray {
    const formArray1 = new FormArray([]);
    qcSet.forEach(element => {
      formArray1.push(this.formbuilder.group({
        qualityCharacteristic: element.qualityCharacteristic,
        qualitySubCharacteristics: this.setQBC(element.qualitySubCharacteristics)
      }));
    });
    return formArray1;
  }

  setQBC(qscSet: any): FormArray {
    const formArray2 = new FormArray([]);
    qscSet.forEach(element => {
      formArray2.push(this.formbuilder.group({
        qualitySubCharacteristic: element.qualitySubCharacteristic,
        qualityAttributes: this.setQA(element.qualityAttributes)
      }));
    });
    return formArray2;
  }

  setQA(qaSet: any): FormArray {
    const formArray3 = new FormArray([]);
    qaSet.forEach(element => {
      formArray3.push(this.formbuilder.group({
        qualityAttribute: element.qualityAttribute
      }));
    });
    return formArray3;
  }

  setMeasurement(measurementSet: any): FormArray {
    const formArray = new FormArray([]);
    measurementSet.forEach(element => {
      formArray.push(this.formbuilder.group({
        name: element.name,
        informalDefinition: element.informalDefinition,
        measurementType: element.measurementType,
        measurementMethod: element.measurementMethod,
        scaleType: element.scaleType,
        scaleRange: element.scaleRange,
        interpretation: element.interpretation,
        thresholdValue: element.thresholdValue
      }));
    });
    return formArray;
  }

  onEdit(qp: QualityPlan) {
    this.editForm.patchValue({
      testObject: qp.testObject,
      testItem: qp.testItem,
      testSuite: qp.testSuite,
      testLevels: qp.testLevels,
      testCaseType: qp.testCaseType,
      developmentPhase: qp.developmentPhase,
      sourceTestingFramework: qp.sourceTestingFramework,
      targetTestingFramework: qp.targetTestingFramework,
      qualityPlanName: qp.qualityPlanName
    })
    this.editForm.setControl('goalArray', this.setExistingGoals(qp.goalArray));
    this.editForm.setControl('questionArray', this.setExistingQuestions(qp.questionArray));
    this.editForm.setControl('QualityCharacteristics', this.setExistingQC(qp.QualityCharacteristics));
    this.editForm.setControl('measurementArray', this.setMeasurement(qp.measurementArray));
    this.isReadOnly = false;
    this.data = qp;
  }

  onDelete(_id: string) {
    this.qualityPlanService.deleteQualityPlan(_id).subscribe();
    this.openSnackBar('Quality plan deleted successfully', null);
    this.qualityPlanList();
    this.reset();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }


}
