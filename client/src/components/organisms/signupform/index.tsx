import React, { useState } from "react";
import { StyledContainer } from './styles'
import Container from 'components/atoms/container'

import Botsignup from "components/organisms/signup2/2";
import SignupText from "components/organisms/signup2/3";
import { RadioGroup, RadioButtonChangeEvent } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons'




import { Form, Field, FormElement } from "@progress/kendo-react-form";

import { Error, Label } from "@progress/kendo-react-labels";
import { Input } from "@progress/kendo-react-inputs";

const dataCounselor = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
]

const mood = [
  { label: "Happy", value: "happy" },
  { label: "Sad", value: "sad" },
  { label: "Gay", value: "gay" },
];

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
  const [form, setForm] = useState('')
  const [selectedValue, setSelectedValue] = React.useState('first');

  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = React.useCallback(
    (e: RadioButtonChangeEvent) => {
        setSelectedValue(e.value);
    },
    [setSelectedValue]
);

  const handleSubmit = async (values:any) => {

    console.log(values)
    // To Do Asign Loader or disable button

    const options: RequestInit = {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(values), // body data type must match "Content-Type" header
    };

    const response = await fetch("/sessions/register", options);
    const data = await response.json();

    if (data.ok) {
      console.log(data.token);
      localStorage.setItem("token", data.token);
    } else {
      alert(data.message);
    }
  };
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
                name={"password"}
                component={Input}
                id='password'
                minLength={8}
                required={true}
              />
              <h1>How are you feeling?</h1>
              <RadioGroup data={mood} />
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
                name={"university"}
                component={Input}
                id='university'
                required={true}
              />
              <h1>are you graduated?</h1>
                <RadioGroup data={dataCounselor} />
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
