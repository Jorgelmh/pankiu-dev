import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { StyledContainer } from './styles'
import Container from 'components/atoms/container'

import Botsignup from "components/organisms/signup2/2";
import SignupText from "components/organisms/signup2/3";
import { RadioGroup, RadioButtonChangeEvent } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons'
import Values from './types'



import { Form, Field, FormElement,FieldWrapper } from "@progress/kendo-react-form";
import { Mood } from '../../../interfaces/entities/Patient'

import { Error, Label,Hint } from "@progress/kendo-react-labels";
import { Input } from "@progress/kendo-react-inputs";

const dataCounselor = [
  { label: "Yes", value: true },
  { label: "No", value: false },
]

const mood = [
  { label: "Normal", value: Mood.Normal },
  { label: "Happy", value: Mood.Happy },
  { label: "Depressed", value: Mood.Depressed },
  { label: "Anxious", value: Mood.Anxious },
  { label: "Lonely", value: Mood.Lonely },
  { label: "Stressed", value: Mood.Stressed },
];

const radioGroupValidator = (value:any) =>
  !value ? "Type of Confirmation is required" : "";

const FormRadioGroup = (fieldRenderProps:any) => {
  const {
    validationMessage,
    touched,
    id,
    label,
    layout,
    valid,
    disabled,
    hint,
    ...others
  } = fieldRenderProps;

  const showValidationMessage = touched && validationMessage;
  const showHint = !showValidationMessage && hint;
  const hindId = showHint ? `${id}_hint` : "";
  const errorId = showValidationMessage ? `${id}_error` : "";
  const labelId = label ? `${id}_label` : "";

  return (
    <FieldWrapper>
      <Label
        id={labelId}
        editorId={id}
        editorValid={valid}
        editorDisabled={disabled}
      >
        {label}
      </Label>
      <RadioGroup
        id={id}
        ariaDescribedBy={`${hindId} ${errorId}`}
        ariaLabelledBy={labelId}
        valid={valid}
        disabled={disabled}
        layout={layout}
        {...others}
      />
      {showHint && <Hint id={hindId}>{hint}</Hint>}
      {showValidationMessage && <Error id={errorId}>{validationMessage}</Error>}
    </FieldWrapper>
  );
};

const emailRegex = new RegExp(/\S+@\S+\.\S+/);
const emailValidator = (value: any) =>
  emailRegex.test(value) ? "" : "Please enter a valid email.";
const EmailInput = (fieldRenderProps: any) => {
  const { validationMessage, visited, ...others } = fieldRenderProps;
  return (
    <div>
      <Input {...others} />
      {visited && validationMessage && <Error>{validationMessage}</Error>}
    </div>
  );
};
const SignUpForm = () => {
  const [redirect, setRedirect] = useState(false)
  const [form, setForm] = useState('')
  const [selectedValue, setSelectedValue] = React.useState('first');

  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
  });



  const handleSubmit = async (values:Values) => {

    console.log(values)
    // To Do Asign Loader or disable button

    const options: RequestInit = {
      method: "POST", 
      mode: "cors", 
      cache: "no-cache", 
      credentials: "same-origin", 
      headers: {
        "Content-Type": "application/json",
       
      },
      referrerPolicy: "no-referrer", 
      body: JSON.stringify(values),
    };

    const response = await fetch("/sessions/register", options);
    const data = await response.json();

    if (data.ok) {
      console.log(data.token);
      localStorage.setItem("token", data.token);
      setRedirect(true)
    } else {
      alert(data.message);
    }
  };

  if(redirect){
    return <Redirect to='/profile' />
  }

  return (

    
    
  <StyledContainer>
    <Container>

    <Button onClick={() => setForm('patient')}>
      Patient
    </Button>
    <Button onClick={() => setForm('counselor')}>
      Counselor
    </Button>
    </Container>

    {form === 'patient' &&
      <Form
      onSubmit={handleSubmit}
      render={(formRenderProps) => (
        <FormElement style={{display:'flex', justifyContent:'center', width:'100%',flexDirection:'column', margin:'6rem 0px 3rem 0px'}}>
          <fieldset className={"k-form-fieldset"}>
            <legend className={"k-form-legend"}>
            Sign Up
            </legend>
            <div className="mb-3">
              <Label editorId='username'>
                User name
              </Label>
              <Field
               
                id='username'
                name={"username"}
                component={Input}
          
                required={true}
                minLength={5}
              />

            </div>

            <div className="mb-3">
              <Label editorId='email'>
                Email
              </Label>
              <Field
               
                name={"email"}
                type={"email"}
                component={EmailInput}
                id='email'
                validator={emailValidator}
              />
            </div>

            <div className="mb-3">
              <Label editorId='password'>
                Password
              </Label>
              <Field
               
                name={"password"}
                component={Input}
                id='password'
                minLength={8}
                required={true}
              />
              <Field
              id={"mood"}
              name={"mood"}
              label={"How are you feeling?"}
              hint={"Hint: Choose a your mood"}
              component={FormRadioGroup}
              data={mood}
              layout={"horizontal"}
              validator={radioGroupValidator}
            />
            </div>
          </fieldset>
          <div className="k-form-buttons">
            <button
              type={"submit"}
              className="k-button"
              disabled={!formRenderProps.allowSubmit}
            >
              Submit
            </button>
          </div>
          
        </FormElement>
      )}
    />
    }
    {form === 'counselor' &&
      <Form
      onSubmit={handleSubmit}
      render={(formRenderProps) => (
        <FormElement >
          <fieldset className={"k-form-fieldset"}>
            <legend className={"k-form-legend"}>
            Sign Up
            </legend>
            <div className="mb-3">
              <Label editorId='username'>
                User name
              </Label>
              <Field
               
                id='username'
                name={"username"}
                component={Input}
          
                required={true}
                minLength={5}
              />
            </div>

            <div className="mb-3">
              <Label editorId='email'>
                Email
              </Label>
              <Field
               
                name={"email"}
                type={"email"}
                component={EmailInput}
                id='email'
                validator={emailValidator}
              />
            </div>

            <div className="mb-3">
              <Label editorId='password'>
                Password
              </Label>
              <Field
               
                name={"password"}
                component={Input}
                id='password'
                minLength={8}
                required={true}
              />
              <Label editorId='university'>
                University
              </Label>
              <Field
               
                name={"university"}
                component={Input}
                id='university'
                required={true}
              />
              <Field
              id={"graduated"}
              name={"graduated"}
              label={"Are you graduated?"}
              hint={"Hint: Choose a your answer"}
              component={FormRadioGroup}
              data={dataCounselor}
              layout={"horizontal"}
              validator={radioGroupValidator}
            />
            </div>
          </fieldset>
          <div className="k-form-buttons" style={{display:'flex',justifyContent:'center'}}>
            <button
              type={"submit"}
              className="k-button"
              disabled={!formRenderProps.allowSubmit}>
              Submit
            </button>
          </div>
          
        </FormElement>
      )}
    />
    }

    
  </StyledContainer>

  );
};

export default SignUpForm;
