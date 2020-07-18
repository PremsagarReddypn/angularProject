import { Component, OnInit, ViewChild,Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Feedback, ContactType } from '../shared/feedback';
import { flyInOut,expand } from '../animations/app.animation';
import { FeedbackService } from '../services/feedback.service';
import { error } from 'protractor';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  host: {
    '[@flyInOut]' : 'true',
    'style' : 'display:block;'
  },
  animations:[
    flyInOut(),
    expand()
  ]
})
export class ContactComponent implements OnInit {

  feedbackForm : FormGroup;
  feedback : Feedback;
  response : Feedback;
  contactType = ContactType;
  errMsg = String;
  showFeedbackForm = true;
  showResponse = false;
  showSpin = false;
  @ViewChild('fform') feedbackFormDirective;

  formErrors = {
    'firstname' : '',
    'lastname' : '',
    'telnum' : '',
    'email' : ''
  };

  validationMessages = {
    'firstname' : {
      'required': 'First Name is required',
      'minlength': 'First Name must be at least 2 characters long.',
      'maxlength' : 'FirstName cannot be more than 25 characters long.',
    },
    'lastname' : {
      'required' : 'Last Name is required',
      'minlength' : 'Last Name must be at least 2 characters long.',
      'maxlength': 'Last Name cannot be more than 25 characters long'
    },
    'telnum':{
      'required': 'Tel number is required.',
      'pattern' : 'Tel. number must contain only numbers'
    },
    'email' : {
      'required' : 'Email is required',
      'email ' : 'Email not in valid format.'
    },
  };

  constructor(
    private fb: FormBuilder,
    private feedbackService: FeedbackService,
    @Inject('BaseURL') private BaseURL) {
    this.createForm();
   }

  ngOnInit(): void {
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      firstname: ['',[Validators.required,Validators.minLength(2),Validators.maxLength(25)]],
      lastname: ['',[Validators.required,Validators.minLength(2),Validators.maxLength(25)]],
      telnum: ['',[Validators.required,Validators.pattern]],
      email:['',[Validators.required,Validators.email]],
      agree:false,
      contacttype: 'None',
      message:''
    });
    this.feedbackForm.valueChanges
       .subscribe(data => this.onValueChanged(data));
    this.onValueChanged();//(re)set validation messages now

  
  }

  onSubmit() {
  
    this.feedback = this.feedbackForm.value;
    this.showFeedbackForm = false;
    this.showSpin = true;
    setTimeout(() => {this.showSpin = false;}, 1000);
    this.showResponse = true;
    this.feedbackService.onsubmitFeedback(this.feedback).subscribe(feedback =>{
      this.response = feedback;
      setTimeout(() => {this.showFeedbackForm = true;this.showResponse = false;},5000);
    },
    errmess => {
      this.feedback = null;
      this.errMsg = <any>errmess;
      this.showFeedbackForm = true;
    });
    this.feedback = null;
    this.feedbackForm.reset({
      firstname:'',
      lastname:'',
      telnum:'',
      email:'',
      agree:'',
      contacttype:'None',
      message:''
    });
    this.feedbackFormDirective.resetForm();
  }

 
 onValueChanged(data? : any) {
   if (!this.feedbackForm) { return; }
   const form = this.feedbackForm;
   for (const field in this.formErrors) {
     if (this.formErrors.hasOwnProperty(field)){
       //clear previous error message(if any)
       this.formErrors[field] = '';
       const control = form.get(field);
       if (control && control.dirty && !control.valid) {
         const messages = this.validationMessages[field];
         for (const key in control.errors) {
           if(control.errors.hasOwnProperty(key)){
             this.formErrors[field] += messages[key] + ' ';
           }
         }

       }
     }
   }
 }


  
}
